import { useEffect, useState , useContext } from "react";
import { ShowContext } from "./context-provider";
import Form from "./form"
import axios from "axios";
import interwind from "../assets/Interwind.svg"
import { Filter } from 'lucide-react';
import Transactions from "./transactions";
import { openFilter, filter, getTime } from "../action";
import Filters from "./filter";
import NowPay from "./dashboard/nowpayment";
import { motion } from "motion/react";


const Payment = () => {
  const myContext = useContext(ShowContext)
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
  const { userData , theme } = myContext;
  const [data , setData ] = useState<any>({
    id:userData.userId,
    email:userData.userEmail,
    amount:'',
    currency:'NGN',
  } );
  const options = ['Pay in NGN', 'Pay in Crypto']
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
  const [ transactionHistory , setTransactionHistory ] = useState<any>([])
  const [ transs , setTrans ] = useState<any>([])
  const [ err ,setErr] = useState<boolean>(false)
  const [ open , setOpen ] = useState<boolean>(false)
  const [ isActive , setIsActive ] = useState<any>(0)
  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
     const { name , value } = e.target;
      setErr(false)
      setData((prev:any) => ({
      ...prev ,
      [name]: value == '' ? value : parseInt(value)
     }))
  }

  const [visibleCount, setVisibleCount] = useState(10);

  const filteredTrans = transs
    .filter((item: any) => item.status === "successful" || item.status === "refunded")
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const visibleTrans = filteredTrans.slice(0, visibleCount);

  useEffect(() => {
      setTrans(transactionHistory)
    },[transactionHistory])
  
  
  async function payment(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { id ,email , amount , currency } = data;
    if (id !== '' && email !== '' && amount !== '' && currency !== '') {
      if (amount < 1000) {
        setErr(true)
        return
      }
      
      setShowLoader(true)
      
      const response = await axios.post('https://api.textflex.net/api/initialize-transaction', data)
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

  useEffect(() => {
    if (err) {
      const myTimeOut = setTimeout(() => {
          setErr(false)
      }, 3000);
      return () => clearTimeout(myTimeOut)
    }
  },[err])


  useEffect(() => {
    async function getTransaction() {
      const response = await axios.get('https://api.textflex.net/api/get-transaction', {
        params:{
          user_id:userData.userId
        }
      });
      const newData = response.data.filter((item:any) => (
        item.user_id == userData.userId
      ))
     
      setTransactionHistory(newData)
    }
      getTransaction()
    
  },[])
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
                    {showLoader ?  <img className="h-10" src={interwind} alt="loader" /> : 'submit' }  
                  </button>
              </div>
          </Form> :  <NowPay/> 
          
          }
        </div>
        {
          visibleTrans.length >= 1 ? ( 
            <div className="grid gap-3 w-full ">
                <div className="flex md:w-[55%] w-[90%] mx-auto md:mx-0 justify-between">
                      <p className="font-bold text-lg">Recent Activities</p>
                      <div className="md:w-1/2 w-[20%] relative">
                        <button onClick={() => openFilter(setOpen)} className="border-gray-400 border border-solid md:w-[30%] w-full h-8 grid place-items-center rounded-md"><Filter/></button>
                        <Filters
                          handleClick={(e) => filter(e, setTrans, transactionHistory, setOpen)}
                          open={open}
                          right='left-0'
                        />
                      </div>
                </div>
                
                {visibleTrans.map((item: any) => {
                let colorClass = "";
                const newDate =  getTime(item)
                    switch(item.status) {
                    case "successful":
                        colorClass = "bg-green-200 text-green-600";
                        break;
                    case "refunded":
                        colorClass = "bg-orange-200 text-orange-800";
                        break;
                    case "pending":
                        colorClass = "bg-yellow-200 text-yellow-500";
                        break;
                    case "failed":
                        colorClass = "text-red-600";
                        break;
                    default:
                        colorClass = "text-gray-600";
                    }
                    return(
                        <Transactions
                        service={item.note}
                        amount={item.amount}
                        date={newDate}
                        status={item.status}
                        color={colorClass}
                        />
                    ) 
                })} 
                {visibleCount < filteredTrans.length && (
                  <button
                    className="mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setVisibleCount(prev => prev + 10)}
                  >
                    See More
                  </button>
                )}
            </div> ) : (
              <div className="grid h-fit gap-2">
                <h2 className="text-xl">Recent Transactions</h2>
                <p className="text-sm">No transactions available</p>
                
              </div>
            )
        }
       
      </div>
       
    )
}

export default Payment