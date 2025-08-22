import { useContext, useEffect, useState , useRef } from 'react';
import axios from 'axios';
import { ShowContext } from '../context-provider';
import interwind from "../../assets/Interwind.svg"
import spinner from "../../assets/dualring.svg"
import { Clipboard, ClipboardCheck  } from "lucide-react";
import { AnimatePresence , motion } from 'motion/react';

interface Currency {
  code: string;               
  name: string;               
  ticker: string;            
  userId:number
  available_for_payment: boolean;
}

interface InvoiceResponse {
  id: string;
  pay_address: string;
  userId:number;
  pay_currency: string;
  invoice_url: string;
  status: string;
  network:string;
  payment_id:any;
  payment_status:string;
  outcome_amount:string;
  pay_amount:string
}

const COUNTDOWN = 1000

function NowPay() {
    const myContext = useContext(ShowContext)
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData , setRate , rate } = myContext;
    const [currencies, setCurrencies] = useState<Currency[]>([]);
   
    const pollCount = useRef(0);
    const [ success , setSuccess ] = useState<boolean>(false)
    const [form, setForm] = useState({
    price_amount: '',
    order_id:userData.userId,
    email:userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
   });
   const timerRef = useRef<number | null>(null); 
   const cleanupRef = useRef<(() => void) | null>(null);
   const [ copied , setCopied ] = useState<any>({
        address:false,
        outcome_amount:false
    })
  const [ address , setAddress ] = useState<any>({
      pay_address:'',
      pay_amount:''
  }) 
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [ newArray , setNewArray ] = useState<any>([])
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
  const [ showPop , setShowPop ] = useState<any>({
    loading:false,
  });
  const [ timeLeft , setTimeLeft ] = useState<number>(0)
  const [ err, setErr ] = useState<boolean>(false)
  
  useEffect(() => {
    axios.get('https://api.textflex.net/api/now-currencies')
      .then(res => {
        setCurrencies(res.data.selectedCurrencies);
      })
      .catch(console.error);

       axios.get('https://api.textflex.net/api/get-rate')
      .then(res => {
         setRate(res.data[0].rate)
         localStorage.setItem("rate",res.data[0].rate)
      })
      .catch(console.error);
       const savedPaymentId = localStorage.getItem('pending_payment_id');
       const savedInvoice = localStorage.getItem('invoice');
      if (savedPaymentId) {
        
        if (savedInvoice) {
          setInvoice(JSON.parse(savedInvoice));
         
        } else {
        checkPaymentStatus(savedPaymentId).then((res) => {
          if (res?.payment_status === 'waiting') {
            setInvoice(res);
          } else {
          localStorage.removeItem('pending_payment_id');
          }
        }).catch(() => {
          localStorage.removeItem('pending_payment_id'); 
        }); }
      }

     
  }, []);


  useEffect(() => {
    const expire = localStorage.getItem('savedExpiration');
    if (expire) {
      timer();
    }
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);


 const priorityCodes = ['BTC', 'USDTTRC20', 'ETH', 'SOL'];

useEffect(() => {
  if (currencies.length > 0) {
    axios.get('https://api.textflex.net/api/now-merchant')
      .then(res => {
        const allCurrencies = res.data.currencies;
        const filteredCurrencies = currencies
          .map(code => allCurrencies.find((item: any) => item.code === code))
          .filter(Boolean); 
        const sortedCurrencies = filteredCurrencies.sort((a: any, b: any) => {
          const aIndex = priorityCodes.indexOf(a.code);
          const bIndex = priorityCodes.indexOf(b.code);

          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;

          return currencies.indexOf(a.code) - currencies.indexOf(b.code); // fallback sort
        });

        setNewArray(sortedCurrencies);
       
      })
      .catch(console.error);
  }
}, [currencies]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
};

const formatTime = (seconds:number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n:number) => n.toString().padStart(2,"0")
  return`${pad(hrs)}:${pad(mins)}:${pad(secs)}`
}

const checkPaymentStatus = async (paymentId: string) => {
  try {
    const res = await axios.get(`https://api.textflex.net/api/now-status`, {
      params: { payment_id: paymentId },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};


useEffect(() => {
  if (!invoice) return;
    const interval = setInterval(() => {
      pollCount.current = pollCount.current + 1
      checkPaymentStatus(invoice.payment_id).then((res) => {
          if (res?.payment_status !== 'waiting') {
            if (res?.payment_status == 'sending') {
              setShowPop((prev:any) => (
                {
                  ...prev,
                  loading:true
                }
              ))
            } else if (res?.credited) {
                setSuccess(true)
                clearInterval(interval)
                const myTimeOut = setTimeout(() => {
                  setShowPop({
                  loading:false,
                })
                
                  setForm({
                  price_amount: '',
                  order_id:userData.userId,
                  email:userData.userEmail,
                  pay_currency: '',
                  order_description: 'deposit',
                });
                setAddress({
                  pay_address:'',
                  pay_amount:''})
                  
                  setInvoice(null)
                  setSuccess(false)
                }, 5000);
                localStorage.removeItem('invoice');
                localStorage.removeItem('savedExpiration');
                localStorage.removeItem('pending_payment_id');
                return () => clearTimeout(myTimeOut)
            }
          } 
        });
    }, 8000);
  return () => clearInterval(interval);
}, [invoice]);


  const timer = () => {
     const savedExpiration = localStorage.getItem('savedExpiration');
     let expirationTime: number;

    if (savedExpiration) {
      expirationTime = parseInt(savedExpiration, 10);
    } else {
      expirationTime = Math.floor(Date.now() / 1000) + COUNTDOWN;
      localStorage.setItem('savedExpiration', expirationTime.toString());
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expirationTime - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
      if (remaining <= 0) {
        localStorage.removeItem('savedExpiration');
        localStorage.removeItem('pending_payment_id');
        localStorage.removeItem('invoice');
        setInvoice(null);
        setForm({
          price_amount: '',
          order_id: userData.userId,
          email: userData.userEmail,
          pay_currency: '',
          order_description: 'deposit',
        });

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    timerRef.current = interval;

    const cleanup = () => {
      clearInterval(interval);
      timerRef.current = null;
    };

    cleanupRef.current = cleanup;
    return cleanup;
  };


  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const pay_id = localStorage.getItem('pending_payment_id')
    if (pay_id) {
      return
    }
     if (parseInt(form.price_amount) < 5) {
          setErr(true)
          setTimeout(() => {
            setErr(false)
          }, 3000);
          return
        } 
    try {
       setShowLoader(true)  
       pollCount.current = 0        
       const { data } = await axios.post<InvoiceResponse>('https://api.textflex.net/api/invoice', form);
      
        setAddress({
        pay_address:data.pay_address,
        pay_amount:data.pay_amount
      })
      setShowLoader(false)
      setInvoice(data);
      localStorage.setItem('pending_payment_id', data.payment_id);
      localStorage.setItem('invoice', JSON.stringify(data));
      timer()
    } catch (err) {
      console.log(err)
      setShowLoader(false)
    }
  };

  const cancelInvoice = () => {
  if (cleanupRef.current) cleanupRef.current(); 
  localStorage.removeItem('invoice');
  localStorage.removeItem('savedExpiration');
  localStorage.removeItem('pending_payment_id');

  setInvoice(null);
  setForm({
    price_amount: '',
    order_id: userData.userId,
    email: userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
  });
  setTimeLeft(0);
  };

  const handleCopyAddress = () => {
      navigator.clipboard.writeText(address.pay_address).then(() => {
          setCopied((prev:any) => ({
              ...prev,
              address:true
          }
          ));
          setTimeout(() => {
              setCopied({
                address:false,
                outcome_amount:false
              })
          }, 1000);
      })
  }

  const handleCopySms = () => {
      navigator.clipboard.writeText(address.pay_amount).then(() => {
          setCopied((prev:any) => ({
              ...prev,
              outcome_amount:true
          }
          ));
          setTimeout(() => {
              setCopied({
                address:false,
                outcome_amount:false
              })
          }, 1000);
      })
  }
   
  return (
    <div className="w-[95%] mx-auto">
      {
        showPop.loading  && (
      <AnimatePresence>
        <motion.div 
        initial={{ scale: 0}}
        animate={{scale:1}}
        exit={{scale:0}}
        className='h-screen w-full fixed top-0 left-0 bg-black/20'>
            <motion.div 
              initial={{ scale: 0}}
              animate={{scale:1}}
              exit={{scale:0 , transition:{ type:'spring' , delay:0.2}}}
              className=' rounded-md text-sm shadow-md h-24 bg-white p-2 relative md:left-[600px] left-18 top-[200px]  w-[250px]'>
              <h4 className='font-semibold'>{ success ? 'Balance Updated' : 'Transaction being processed...'}</h4>
               {success ? <div className='w-full grid place-items-center h-10'><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48"><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#0032a5" stroke="#000" d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"></path><path stroke="#fff" strokeLinecap="round" d="M16 24L22 30L34 18"></path></g></svg></div> : <img className="w-8 absolute left-[43%] top-[50%] " src={spinner} alt="Loading" width="20" />  }
            </motion.div>
        </motion.div>
      </AnimatePresence>
      )
      }

      <form onSubmit={createInvoice} className="space-y-4  max-w-md">
        <div className='w-full  flex justify-between'>
            <span className="text-gray-400 text-sm">Min is $5</span>
            <span className="text-gray-400 text-sm">rate: ₦{rate}</span>
        </div>
        <input
          name="price_amount"
          type="number"
          placeholder="Amount"
          value={form.price_amount}
          className={`border pl-5 w-full h-10 rounded-sm border-solid ${err ? "border-red-400" : "border-gray-500"}`}
          onChange={handleChange}
          required
        />
       
        <select
          name="pay_currency"
          value={form.pay_currency}
          onChange={handleChange}
          className='border pl-4 w-full h-10 rounded-sm border-solid border-gray-500'
           required
        >
          <option value="">Select Payment Currency</option>
          {newArray
            ?.filter((c:any) => c.available_for_payment)
            .map((c:any) => (
              <option key={c.code} value={`${c.code}`}>
                {c.code} - {c.name}
              </option>
            ))}
        </select>
        {
          !invoice &&
                  ( <button
                    type='submit'
                    className="bg-[#0032a5] w-full grid place-items-center text-white px-4 py-2 rounded"
                  >
                      {showLoader ?  <img className="h-8" src={interwind} alt="loader" /> : 'Create Invoice' }  
                  </button>)
        }
      </form>
      {
        invoice && (<button
                    type="button"
                    onClick={cancelInvoice}
                    className="bg-[#0032a5] w-full mt-5 grid place-items-center text-white px-4 py-2 rounded"
                  >
                      {showLoader ?  <img className="h-8" src={interwind} alt="loader" /> : 'Cancel Invoice' }  
                  </button>) 
      }
      {invoice && (
        <div className="mt-6 p-4 border border-gray-400 border-solid rounded bg-gray-50 ">
          <div className='flex justify-between'>
             <h2 className="text-xl font-semibold mb-2">Invoice Created</h2>
             <p className='text-[11px]'>Expires in: {formatTime(timeLeft)}</p>
          </div>
          
          <div className='grid gap-2 '>
            <div className='flex'>
                <p className='h-8 text-md'>Pay with: <span className='font-semibold text-md'>{invoice.pay_currency}</span></p>
               <p className="h-15 w-full break-words whitespace-normal overflow-hidden text-ellipsis flex justify-end items-center " onClick={handleCopySms}>
              <span className="font-semibold text-sm flex gap-3 break-all ">
                {invoice.pay_amount}
                {copied.outcome_amount ? <ClipboardCheck size="25" /> : <Clipboard size="20" />}
              </span>
          </p>
            </div>
         
          <p className='h-8'>Network: {invoice.network}</p>
          <p className="h-15 w-[90%] break-words whitespace-normal overflow-hidden text-ellipsis" onClick={handleCopyAddress}>
            Address: 
            <span className="font-semibold text-sm flex gap-3 break-all">
              {invoice.pay_address}
              {copied.address ? <ClipboardCheck size="25" /> : <Clipboard size="20" />}
            </span>
          </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NowPay;
