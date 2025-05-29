import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShowContext } from '../context-provider';
import interwind from "../../assets/Interwind.svg"

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
}

function NowPay() {
    const myContext = useContext(ShowContext)
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
   const { userData  } = myContext;
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [form, setForm] = useState({
    price_amount: '',
    order_id:userData.userId,
    email:userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
  });
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
  useEffect(() => {
    axios.get('https://api.textflex.net/api/now-currencies')
      .then(res => {
        console.log(res.data.currencies)
        setCurrencies(res.data.currencies);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       setShowLoader(true)          
      const { data } = await axios.post<InvoiceResponse>('https://api.textflex.net/api/invoice', form);
      console.log(data)
      setShowLoader(false)
      setInvoice(data);
    } catch (err) {
      alert('Failed to create invoice');
    }
  };

   
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">NOWPayments Invoice</h1>
      <form onSubmit={createInvoice} className="space-y-4 max-w-md">
        <input
          name="price_amount"
          type="number"
          placeholder="Amount"
          value={form.price_amount}
          className='border w-full h-10 rounded-sm border-solid border-gray-500'
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
          {currencies
            ?.filter(c => c.available_for_payment)
            .map(c => (
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
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Invoice Created</h2>
          <p>Pay with: {invoice.pay_currency}</p>
          <p>Address: {invoice.pay_address}</p>
          <a
            href={invoice.invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View Invoice
          </a>
        </div>
      )}
    </div>
  );
}

export default NowPay;
