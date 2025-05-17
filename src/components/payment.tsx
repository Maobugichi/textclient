import { useEffect, useState , useContext } from "react";
import { ShowContext } from "./context-provider";
import Form from "./form"
import axios from "axios";


const Payment = () => {
 const [data , setData ] = useState<any>({
   email:'',
   amount:'',
   currency:'',
   
 });
  const myContext = useContext(ShowContext)
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
  const { userData } = myContext;
  const [ checkoutUrl , setCheckoutUrl ] = useState<any>('')
  const [ transactionRef , setTransactionRef ] = useState<any>('');
  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
     const { name , value } = e.target;
     setData((prev:any) => ({
      ...prev ,
      [name]:name == 'amount' ? parseInt(value)  : value
     }))
  }

  useEffect(() => {
    if (checkoutUrl !== '') {
       window.open(checkoutUrl, '_blank');
    }

    if (transactionRef !== '') {
      async function webHook() {
        console.log(transactionRef)
        const response = await axios.get('https://textflex-axd2.onrender.com/api/squad-callback', {
           params: { transactionRef , userData }
        })
        console.log(response.data)
      }

      setInterval(() => {
        webHook()
      }, 10000);
     
    }

  },[checkoutUrl, transactionRef])


  async function payment(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email , amount , currency } = data;
    if (email !== '' && amount !== '' && currency !== '') {
      const response = await axios.post('https://textflex-axd2.onrender.com/api/initialize-transaction', data)
      console.log(response.data.data.data)
      setCheckoutUrl(response.data.data.data.checkout_url)
      setTransactionRef(response.data.data.data.transaction_ref)
      
    }
  }
    return(
        <Form onSubmit={payment}>
            <input onChange={handleChange} type="email" placeholder="enter your email" name='email' value={data.email}/>
            <input onChange={handleChange} type="text" placeholder="enter amount" name='amount' value={data.amount}/>
            <input onChange={handleChange}  type="text" placeholder="enter currency" name='currency' value={data.currency}/>
            <button type="submit">
                Pay
            </button>
        </Form>
    )
}

export default Payment