import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShowContext } from '../context-provider';
import { Clipboard, ClipboardCheck, Clock } from "lucide-react";
import { AnimatePresence, motion } from 'motion/react';
import api from '../../lib/axios-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useExchangeRate } from '../dashboard/hooks/useUerData';

interface Currency {
  code: string;
  name: string;
  ticker: string;
  userId: number;
  available_for_payment: boolean;
}

interface InvoiceResponse {
  id: string;
  pay_address: string;
  userId: number;
  pay_currency: string;
  invoice_url: string;
  status: string;
  network: string;
  payment_id: any;
  payment_status: string;
  outcome_amount: string;
  pay_amount: string;
}

interface PaymentStatusResponse {
  payment_status: string;
  credited?: boolean;
}

const COUNTDOWN = 1000;
const PRIORITY_CODES = ['BTC', 'USDTTRC20', 'ETH', 'SOL'];

function NowPay() {
  const myContext = useContext(ShowContext);
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
  
  const { userData } = myContext;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    price_amount: '',
    order_id: userData.userId,
    email: userData.userEmail,
    pay_currency: '',
    order_description: 'deposit',
  });

  const [copied, setCopied] = useState({ address: false, outcome_amount: false });
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Fetch currencies
  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await api.get('/api/now-currencies');
      return res.data.selectedCurrencies;
    },
  });

  const { data:rate  } = useExchangeRate()
  
  console.log(rate)
  const { data: sortedCurrencies = [] } = useQuery({
    queryKey: ['sortedCurrencies', currencies],
    queryFn: async () => {
      if (currencies.length === 0) return [];
      
      const res = await api.get('/api/now-merchant');
      const allCurrencies = res.data.currencies;
      
      const filteredCurrencies = currencies
        .map(code => allCurrencies.find((item: any) => item.code === code))
        .filter(Boolean);
      
      return filteredCurrencies.sort((a: any, b: any) => {
        const aIndex = PRIORITY_CODES.indexOf(a.code);
        const bIndex = PRIORITY_CODES.indexOf(b.code);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return currencies.indexOf(a.code) - currencies.indexOf(b.code);
      });
    },
    enabled: currencies.length > 0,
  });

 
  const activeInvoice = queryClient.getQueryData<InvoiceResponse>(['activeInvoice']);

  
  const { data: paymentStatus } = useQuery<PaymentStatusResponse>({
    queryKey: ['paymentStatus', activeInvoice?.payment_id],
    queryFn: async () => {
      const res = await api.get('/api/now-status', {
        params: { payment_id: activeInvoice?.payment_id },
      });
      return res.data;
    },
    enabled: !!activeInvoice?.payment_id,
    refetchInterval: 8000,
  });

 
  const createInvoiceMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const { data } = await api.post<InvoiceResponse>(
        '/api/invoice',
        formData
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['activeInvoice'], data);
      queryClient.setQueryData(['invoiceExpiration'], Date.now() + COUNTDOWN * 1000);
      startTimer();
    },
  });

  
  useEffect(() => {
    if (!paymentStatus || !activeInvoice) return;

    if (paymentStatus.payment_status === 'sending') {
      // Payment is being processed
    } else if (paymentStatus.credited) {
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        queryClient.removeQueries({ queryKey: ['activeInvoice'] });
        queryClient.removeQueries({ queryKey: ['invoiceExpiration'] });
        queryClient.removeQueries({ queryKey: ['paymentStatus'] });
        
        setForm({
          price_amount: '',
          order_id: userData.userId,
          email: userData.userEmail,
          pay_currency: '',
          order_description: 'deposit',
        });
      }, 5000);
    }
  }, [paymentStatus, activeInvoice, queryClient, userData]);

  const startTimer = () => {
    const expirationTime = queryClient.getQueryData<number>(['invoiceExpiration']);
    if (!expirationTime) return;

    const updateTimer = () => {
      const remaining = Math.floor((expirationTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        queryClient.removeQueries({ queryKey: ['activeInvoice'] });
        queryClient.removeQueries({ queryKey: ['invoiceExpiration'] });
        setForm({
          price_amount: '',
          order_id: userData.userId,
          email: userData.userEmail,
          pay_currency: '',
          order_description: 'deposit',
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (activeInvoice) {
      const cleanup = startTimer();
      return cleanup;
    }
  }, [activeInvoice]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, pay_currency: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(form.price_amount) < 5) {
      setErr(true);
      setTimeout(() => setErr(false), 3000);
      return;
    }
    
    createInvoiceMutation.mutate(form);
  };

  const cancelInvoice = () => {
    queryClient.removeQueries({ queryKey: ['activeInvoice'] });
    queryClient.removeQueries({ queryKey: ['invoiceExpiration'] });
    queryClient.removeQueries({ queryKey: ['paymentStatus'] });
    
    setForm({
      price_amount: '',
      order_id: userData.userId,
      email: userData.userEmail,
      pay_currency: '',
      order_description: 'deposit',
    });
    setTimeLeft(0);
  };

 

  const handleCopy = (text: string, field: 'address' | 'outcome_amount') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopied({ address: false, outcome_amount: false });
      }, 1000);
    });
  };

  const myrate = (queryClient.getQueryData(['rate']) as { cryptomin: number; rate: number } | undefined) || rate

  return (
    <div className="w-[95%] mx-auto ">
      <AnimatePresence>
        {(paymentStatus?.payment_status === 'sending' || success) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className='h-screen w-full fixed top-0 left-0 bg-black/20 z-50'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { type: 'spring', delay: 0.2 } }}
              className='rounded-md text-sm shadow-md h-24 bg-white p-2 relative md:left-[600px] left-18 top-[200px] w-[250px]'
            >
              <h4 className='font-semibold'>
                {success ? 'Balance Updated' : 'Transaction being processed...'}
              </h4>
              {success ? (
                <div className='w-full grid place-items-center h-10'>
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48">
                    <g fill="none" strokeLinejoin="round" strokeWidth={4}>
                      <path fill="#0032a5" stroke="#000" d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"></path>
                      <path stroke="#fff" strokeLinecap="round" d="M16 24L22 30L34 18"></path>
                    </g>
                  </svg>
                </div>
              ) : (
                <div className='w-full grid place-items-center h-10'>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0032a5]"></div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className='w-full flex justify-between'>
          <span className="text-gray-400 text-sm">Min is ${myrate.cryptomin}</span>
          <span className="text-gray-400 text-sm">rate: ₦{myrate.rate}</span>
        </div>

        {err && (
          <Alert variant="destructive">
            <AlertDescription>Minimum amount is ${myrate.cryptomin}</AlertDescription>
          </Alert>
        )}

        <Input
          name="price_amount"
          type="number"
          placeholder="Amount"
          value={form.price_amount}
          onChange={handleChange}
          className={err ? "border-red-400" : ""}
          required
        />

        <Select value={form.pay_currency} onValueChange={handleSelectChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select Payment Currency" />
          </SelectTrigger>
          <SelectContent>
            {sortedCurrencies
              ?.filter((c: any) => c.available_for_payment)
              .map((c: any) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {!activeInvoice && (
          <Button
            type='submit'
            className="bg-[#0032a5] w-full dark:text-white"
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Create Invoice'
            )}
          </Button>
        )}
      </form>

      {activeInvoice && (
        <Button
          type="button"
          onClick={cancelInvoice}
          className="bg-[#0032a5] w-full mt-5"
        >
          Cancel Invoice
        </Button>
      )}

      {activeInvoice && (
        <Card className="mt-6 shadow-lg border-slate-200">
          <CardHeader className="space-y-3">
            <div className='flex items-center justify-between'>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-slate-900">Invoice Created</CardTitle>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
                  <Clock size={14} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className='space-y-4'>
            {/* Amount Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Amount to Pay</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-900">
                    {parseFloat(activeInvoice.pay_amount).toLocaleString(undefined, { maximumFractionDigits: 8 })}
                  </p>
                  <button
                    onClick={() => handleCopy(activeInvoice.pay_amount, 'outcome_amount')}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                  >
                    {copied.outcome_amount ? (
                      <ClipboardCheck size={16} className="text-green-600" />
                    ) : (
                      <Clipboard size={16} className="text-slate-500" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 uppercase font-semibold">{activeInvoice.pay_currency}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Network</p>
                <p className="text-sm font-semibold text-slate-900 uppercase">{activeInvoice.network}</p>
              </div>
            </div>

            {/* Payment Address */}
            <div className="space-y-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Payment Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white px-2.5 py-2 rounded border border-slate-200 text-slate-800 font-mono break-all">
                  {activeInvoice.pay_address}
                </code>
                <button
                  onClick={() => handleCopy(activeInvoice.pay_address, 'address')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-xs font-medium whitespace-nowrap"
                >
                  {copied.address ? (
                    <>
                      <ClipboardCheck size={14} />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={14} />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <Alert className="bg-amber-50 border-amber-200">
              <Clock size={16} className="text-amber-600" />
              <AlertDescription className="text-xs text-amber-800">
                Send exactly the required amount to the address above. Payment will be confirmed automatically.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NowPay;