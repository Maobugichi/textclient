import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShowContext } from '../context-provider';
import interwind from "../../assets/Interwind.svg"
import { Clipboard, ClipboardCheck  } from "lucide-react";

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
}

function NowPay() {
    const myContext = useContext(ShowContext)
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData  } = myContext;
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [ rate ,setRate ] = useState<any>(null)
    const [pollCount, setPollCount] = useState(0);
    const [form, setForm] = useState({
    price_amount: '',
    order_id:userData.userId,
    email:userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
   });
   const [ copied , setCopied ] = useState<any>({
        address:false,
    })
  const [ address , setAddress ] = useState<string>('') 
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [ newArray , setNewArray ] = useState<any>([])
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
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

  useEffect(() => {
    if (currencies.length >= 1) {
       axios.get('https://api.textflex.net/api/now-merchant')
      .then(res => {
       
       const filteredCurrencies: any[] = [];
        currencies.forEach((cur: any) => {
          const matches = res.data.currencies.filter((item: any) => item.code === cur);
          filteredCurrencies.push(...matches); // spread to flatten the arrays
        });
        setNewArray(filteredCurrencies)
      })
      .catch(console.error);
    }
  },[currencies])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
  const savedPaymentId = localStorage.getItem('pending_payment_id');
  if (savedPaymentId && !invoice) {
    // Trigger status check if there's a pending payment saved
    checkPaymentStatus(savedPaymentId).then((res) => {
      if (res?.data?.payment_status === 'waiting') {
        setInvoice(res.data);
      } else {
        localStorage.removeItem('pending_payment_id'); // Clear if no longer pending
      }
    }).catch(() => {
      localStorage.removeItem('pending_payment_id'); // Clear on error too
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
  if (!invoice || invoice.payment_status !== 'waiting') return;

  const interval = setInterval(() => {
    setPollCount((prev) => {
      if (prev >= 20) {
        clearInterval(interval);
        console.log('Polling stopped after 25 tries');
         localStorage.removeItem('pending_payment_id');
         console.log(pollCount)
        return prev;
      }

      checkPaymentStatus(invoice.payment_id).then((res) => {
        if (res?.data?.payment_status !== 'waiting') {
          clearInterval(interval);
          localStorage.removeItem('pending_payment_id');
          setInvoice(res.data);
        }
      });

      return prev + 1;
    });
  }, 8000);

  return () => clearInterval(interval);
}, [invoice]);
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       setShowLoader(true)          
       setPollCount(0);
      const { data } = await axios.post<InvoiceResponse>('https://api.textflex.net/api/invoice', form);
     
      setAddress(data.pay_address)
      setShowLoader(false)
      setInvoice(data);
      localStorage.setItem('pending_payment_id', data.payment_id);
    } catch (err) {
      alert('Failed to create invoice');
    }
  };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address).then(() => {
            setCopied((prev:any) => ({
                ...prev,
                number:true
            }
            ));
            setTimeout(() => {
                setCopied({
                  address:false,
                 
                })
            }, 1000);
        })
    }
   
  return (
    <div className="w-[95%] mx-auto">
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
              <option key={c.ticker} value={c.ticker}>
                {c.code} - {c.name}
              </option>
            ))}
        </select>
       
        <button
          type="submit"
          className="bg-blue-600 w-full text-white px-4 py-2 rounded"
        >
            {showLoader ?  <img className="h-10" src={interwind} alt="loader" /> : 'Create Invoice' }  
        </button>
      </form>

      {invoice && (
        <div className="mt-6 p-4 border border-gray-400 border-solid rounded bg-gray-50 ">
          <h2 className="text-xl font-semibold mb-2">Invoice Created</h2>
          <div className='grid gap-2'>
          <p className='h-8'>Pay with: {invoice.pay_currency}</p>
          <p className='h-8'>Network: {invoice.network}</p>
          <p className="h-15 w-[90%] break-words whitespace-normal overflow-hidden text-ellipsis" onClick={handleCopyAddress}>
            Address: 
            <span className="font-semibold text-sm flex gap-3 break-all">
              {invoice.pay_address}
              {copied.number ? <ClipboardCheck size="25" /> : <Clipboard size="20" />}
            </span>
          </p>

          <a
            href={invoice.invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 h-8"
          >
            View Invoice
          </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default NowPay;
