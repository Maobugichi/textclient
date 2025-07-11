import { useContext, useEffect, useState } from 'react';
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

function NowPay() {
    const myContext = useContext(ShowContext)
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData  } = myContext;
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [ rate ,setRate ] = useState<any>(null)
    const [pollCount, setPollCount] = useState(0);
    const [ success , setSuccess ] = useState<boolean>(false)
    const [form, setForm] = useState({
    price_amount: '',
    order_id:userData.userId,
    email:userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
   });
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
  })
  
  useEffect(() => {
    axios.get('https://api.textflex.net/api/now-currencies')
      .then(res => {
        setCurrencies(res.data.selectedCurrencies);
      })
      .catch(console.error);

       axios.get('https://api.textflex.net/api/get-rate')
      .then(res => {
         console.log(res.data[0].rate)
         setRate(res.data[0].rate)
      })
      .catch(console.error);
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


  useEffect(() => {
   //localStorage.removeItem('pending_payment_id');
  const savedPaymentId = localStorage.getItem('pending_payment_id');
  console.log(savedPaymentId)
  if (savedPaymentId && !invoice) {
      
    checkPaymentStatus(savedPaymentId).then((res) => {
       console.log(res)
      if (res?.payment_status === 'waiting') {
        setInvoice(res);
      } else {
       localStorage.removeItem('pending_payment_id');
      }
    }).catch(() => {
      localStorage.removeItem('pending_payment_id'); 
    });
  }
}, []);

 


const checkPaymentStatus = async (paymentId: string) => {
  try {
    const res = await axios.get(`https://api.textflex.net/api/now-status`, {
      params: { payment_id: paymentId },
    });
    console.log('Payment status:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};



useEffect(() => {
  console.log(invoice)
  if (!invoice) return;
    const interval = setInterval(() => {
      setPollCount((prev) => {
        console.log(pollCount)
        checkPaymentStatus(invoice.payment_id).then((res) => {
          if (res?.payment_status !== 'waiting') {
            if (res?.payment_status == 'confirming') {
              setShowPop((prev:any) => (
                {
                  ...prev,
                  loading:true
                }
              ))
            } else if (res?.credited) {
                setSuccess(true)
                clearInterval(interval)
                setTimeout(() => {
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
                localStorage.removeItem('pending_payment_id');
            
            }
          } 
          
        });

        return prev + 1;
      });
    }, 8000);
  return () => clearInterval(interval);
}, [invoice]);


  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const pay_id = localStorage.getItem('pending_payment_id')

    if (pay_id) {
      return
    }
    try {
       setShowLoader(true)          
       setPollCount(0);
       const pay_id = localStorage.getItem('pending_payment_id')
       if (pay_id) {
        localStorage.removeItem('pending_payment_id');
       }
       console.log(form)
       const { data } = await axios.post<InvoiceResponse>('https://api.textflex.net/api/invoice', form);
       console.log(data)
        setAddress({
        pay_address:data.pay_address,
        pay_amount:data.pay_amount
      })
      setShowLoader(false)
      setInvoice(data);
      localStorage.setItem('pending_payment_id', data.payment_id);
    } catch (err) {
      console.log(err)
      setShowLoader(false)
    }
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
            <span className="text-gray-400 text-sm">Min is $10</span>
            <span className="text-gray-400 text-sm">rate: ₦{rate}</span>
        </div>
        
        <input
          name="price_amount"
          type="number"
          placeholder="Amount"
          value={form.price_amount}
          className='border pl-5 w-full h-10 rounded-sm border-solid border-gray-500'
          onChange={handleChange}
          required
        />
       
        <select
          name="pay_currency"
          value={form.pay_currency}
          onChange={handleChange}
           className='border w-full h-10 rounded-sm border-solid border-gray-500'
           required
        >
          <option value="">Select Payment Currency</option>
          {newArray
            ?.filter((c:any) => c.available_for_payment)
            .map((c:any) => (
              <option key={c.ticker} value={`${c.code}`}>
                {c.code} - {c.name}
              </option>
            ))}
        </select>
       
        <button
          type="submit"
          className="bg-blue-600 w-full grid place-items-center text-white px-4 py-2 rounded"
        >
            {showLoader ?  <img className="h-8" src={interwind} alt="loader" /> : 'Create Invoice' }  
        </button>
      </form>
      {invoice && (
        <div className="mt-6 p-4 border border-gray-400 border-solid rounded bg-gray-50 ">
         
          <h2 className="text-xl font-semibold mb-2">Invoice Created</h2>
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
