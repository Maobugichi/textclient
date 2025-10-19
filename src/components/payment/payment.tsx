import { useEffect, useState , useContext } from "react";
import { ShowContext } from "../context-provider";
import Form from "../form"
import NowPay from "./nowpayment";
import { motion } from "motion/react";
import TransactionsList from "./transactionTable";
import ClipLoader from "react-spinners/ClipLoader";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios-config";
import { useAuth } from "../../context/authContext";


const Payment = () => {
  const { user:userData } = useAuth();
 
  const myContext = useContext(ShowContext)
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
  const {  theme } = myContext;
  
  const [data , setData ] = useState<any>({
    id:userData?.userId,
    email:userData?.userEmail,
    amount:'',
    currency:'NGN',
  } );
  const options = ['Pay in NGN', 'Pay in Crypto']
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
  const [ err ,setErr] = useState<boolean>(false)
  const [ isActive , setIsActive ] = useState<any>(0)
  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
     const { name , value } = e.target;
      
      setErr(false)
      setData((prev:any) => ({
      ...prev ,
      [name]: value == '' ? value : parseInt(value)
     }))
  }

 
  
  async function payment(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { id ,email , amount , currency } = data;
    if (id !== '' && email !== '' && amount !== '' && currency !== '') {
      if (amount < 1000) {
        setErr(true)
        return
      }
      
      setShowLoader(true)
      
      const response = await api.post('/api/initialize-transaction', data)
      const url = response.data.data.data.checkout_url
      const ref = response.data.data.data.transaction_ref
    
      if (response.data) {
         setShowLoader(false)
      }
      if (url && ref) {
         localStorage.setItem('transactionRef', ref);
         window.location.href = url;
      }
    }
  }

  function active(index:number) {
    setIsActive(index)
  }
   const queryClient = useQueryClient();
  useEffect(() => {
    if (err) {
      const myTimeOut = setTimeout(() => {
          setErr(false)
      }, 3000);
      return () => clearTimeout(myTimeOut)
    }
  },[err])


 

  useEffect(() => {
    // Set rate data when component mounts
    queryClient.setQueryData(['rate'], { cryptomin: 5, rate: 1600 });
  }, []);
   const rate:any = localStorage.getItem("rate");
   const rateObj = JSON.parse(rate)
    return(
      <div className={`h-[50vh] md:h-[80vh] w-full flex flex-col  gap-10 ${theme ? 'text-white' : 'text-black'}`}>
        <div className="md:w-[40%]  flex flex-col gap-4">
            <h3 className="font-semibold text-2xl">Fund Wallet</h3>
           <span>Choose a payment method to fund wallet</span>
          <div className="flex gap-2 cursor-pointer">
           {
            options.map((value:string,i:number) => {
              return(
                <motion.div
                 key={i}
                 className={`relative rounded-full w-32 h-8 grid transition-all duration-300 ease-out place-items-center border border-solid border-gray-300 ${isActive === i ? 'bg-[#0032a5] text-white ' : 'bg-white'}`}
                 onClick={() => active(i)}
                >
                  {value}
                </motion.div>
              )
            })
           }
          </div>
           { isActive === 0  ?   
           <Form onSubmit={payment}>
              <div className="w-full flex flex-col gap-3">
                  <div className="text-[12px] flex justify-between w-full ">
                    <label htmlFor="amount" className="font-semibold">Enter Amount</label>
                    <span className="text-gray-400">Min is {rateObj.squadmin}</span>
                  </div>
                  <label className={`${err ? 'block' : 'hidden'} text-red-500`}>min amount is ₦1000</label>
                  <input onChange={handleChange} type="number" placeholder="enter amount" name='amount' value={data.amount} className="border border-gray-300 rounded-md focus:ring-2 border-solid focus:ring-blue-500 focus:outline-none h-10 pl-3"/>
                  <button className="h-10 bg-[#0032a5] rounded-md grid place-items-center text-white" type="submit">
                    {showLoader ?  <ClipLoader size={20}/> : 'submit' }  
                  </button>
              </div>
          </Form> :  <NowPay/> 
          
          }
        </div>
       
       <div className="mt-4">
      <TransactionsList userId={userData?.userId}/>
    </div>
       
      </div>
       
    )
}

export default Payment