import { useEffect, useState , useContext , useRef } from "react";
import { ShowContext } from "./context-provider";
import Form from "./form"
import axios from "axios";
import interwind from "../assets/Interwind.svg"
import { CheckCircle ,Filter } from 'lucide-react';
import Transactions from "./transactions";
import { openFilter, filter, getTime } from "../action";
import Filters from "./filter";
import NowPay from "./dashboard/nowpayment";


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

  const previousActiveRef = useRef<HTMLElement | null>(null);
  const [ showLoader, setShowLoader ] = useState<boolean>(false)
  const [ transactionHistory , setTransactionHistory ] = useState<any>([])
  const [ transs , setTrans ] = useState<any>([])
  const [ err ,setErr] = useState<boolean>(false)
  const [ open , setOpen ] = useState<boolean>(false)
  const [ isActive , setIsActive ] = useState<any>(true)
  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
     const { name , value } = e.target;
      setErr(false)
     setData((prev:any) => ({
      ...prev ,
      [name]: value == '' ? value : parseInt(value)
     }))
  }


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

  function active(e: React.MouseEvent<HTMLDivElement>) {
      const target = e.currentTarget as HTMLElement;
      if (previousActiveRef.current && previousActiveRef.current !== target) {
        previousActiveRef.current.classList.remove('border-green-400');
        previousActiveRef.current.classList.add('border-gray-300');
        (previousActiveRef.current.childNodes[0] as HTMLElement).classList.remove('block');
        (previousActiveRef.current.childNodes[0] as HTMLElement).classList.add('hidden');
      }
      (target.childNodes[0] as HTMLElement).classList.remove('hidden');
      (target.childNodes[0] as HTMLElement).classList.add('block');
      target.classList.remove('border-gray-300')
      target.classList.add('border-green-400')
      previousActiveRef.current = target;
      if (target.id.trim() == 'squad') {
         setIsActive(true);
      } else {
        setIsActive(false)
      }
      
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
    return(
      <div className={`h-[50vh] md:h-[80vh] w-full flex flex-col  gap-10 ${theme ? 'text-white' : 'text-black'}`}>
        <div className="md:w-[40%]  flex flex-col gap-4">
            <h3 className="font-semibold text-2xl">Fund Wallet</h3>
           <span>Choose a payment method to fund wallet</span>
          <div className="flex gap-2">
            <div id='squad' onClick={active} className="relative rounded-full w-20 h-8 grid transition-all duration-300 ease-out place-items-center border border-solid border-gray-300">
              <CheckCircle className={`absolute top-[-5px] right-[-5px] hidden`} color="green" size={20}/>
              <svg className="w-12 " viewBox="0 0 441 119" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><title>Group</title><defs><linearGradient x1="0%" y1="50.0011935%" x2="100%" y2="50.0011935%" id="linearGradient-1"><stop stop-color="#FF4C1D" offset="0%"></stop><stop stop-color="#9B0063" offset="100%"></stop></linearGradient><linearGradient x1="0%" y1="59.589458%" x2="497.327125%" y2="59.589458%" id="linearGradient-2"><stop stop-color="#FF4C1D" offset="0%"></stop><stop stop-color="#9B0063" offset="100%"></stop></linearGradient></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Artboard-Copy-2" transform="translate(-2487.000000, -1428.000000)"><g id="Group" transform="translate(2487.000000, 1428.000000)"><path d="M124.714526,98.174858 C105.649846,98.174858 94.5133347,90.1958872 94,75.2662076 L115.118019,75.2662076 C115.888021,80.1575524 118.055435,82.8602903 124.586193,82.8602903 C130.218615,82.8602903 132.785289,80.6716833 132.785289,77.3255717 C132.785289,74.1087029 129.576947,72.5634697 120.365441,71.2767222 C102.441504,68.9602926 94.8983357,63.6840598 94.8983357,49.6548193 C94.8983357,34.7265599 108.073926,27.5187855 123.573783,27.5187855 C140.086049,27.5187855 151.607561,33.1813267 153.133306,49.268511 L132.400288,49.268511 C131.501952,44.7648947 129.077871,42.5762878 123.816191,42.5762878 C118.825437,42.5762878 116.273022,44.7648947 116.273022,47.8539409 C116.273022,51.0708097 119.338771,52.3575572 127.537867,53.3872392 C146.103472,55.7036688 155.058311,60.5950136 155.058311,75.0091421 C155.058311,90.9670836 143.280131,98.174858 124.714526,98.174858 Z M203.539922,119 L203.539922,86.1084045 C200.188987,92.5322003 192.745634,98.0569771 182.593014,98.0569771 C167.036121,98.0569771 154.316828,86.8781806 154.316828,63.622989 L154.316828,62.5947272 C154.316828,39.7244235 166.907787,27.5187855 182.849682,27.5187855 C193.387302,27.5187855 199.675652,32.0153005 203.539922,38.8254046 L203.539922,29.3168234 L226.540168,29.3168234 L226.540168,119 L203.539922,119 Z M190.17896,80.325142 C198.392316,80.325142 203.454366,74.5248365 203.454366,63.0548885 L203.454366,62.0237862 C203.454366,50.6830811 198.777317,44.6242899 190.421368,44.6242899 C181.951346,44.6242899 177.40263,50.4245954 177.40263,62.1530291 L177.40263,63.1841314 C177.40263,74.5248365 182.336347,80.325142 190.17896,80.325142 Z M254.388576,97.4306464 C241.398356,97.4306464 231.759071,89.5013844 231.759071,72.6188595 L231.759071,29.0057884 L254.787836,29.0057884 L254.787836,68.9105839 C254.787836,76.456378 257.739511,80.1646536 264.298788,80.1646536 C271.243066,80.1646536 275.749003,76.0729102 275.749003,67.503115 L275.749003,29.0057884 L298.777769,29.0057884 L298.777769,95.8967752 L275.749003,95.8967752 L275.749003,85.5374636 C272.141401,92.4427245 265.582125,97.4306464 254.388576,97.4306464 Z M323.674502,98.174858 C311.639655,98.174858 301.002219,92.2552513 301.002219,77.9689454 C301.002219,62.1388266 314.320403,55.9607342 336.593425,55.9607342 L342.99585,55.9607342 L342.99585,54.4169213 C342.99585,47.9817635 341.470105,43.7352127 334.169345,43.7352127 C327.895254,43.7352127 325.585248,47.4676326 325.071913,51.7141834 L303.568893,51.7141834 C304.595562,35.4977562 317.272077,27.5187855 335.581015,27.5187855 C354.018286,27.5187855 365.796466,35.1114479 365.796466,53.0009309 L365.796466,96.631045 L343.509184,96.631045 L343.509184,88.7798969 C340.315102,93.6698215 334.426012,98.174858 323.674502,98.174858 Z M332.044709,81.8121449 C338.575467,81.8121449 343.452147,78.1493173 343.452147,72.4668926 L343.452147,68.424858 L337.420464,68.424858 C328.194699,68.424858 324.088021,70.1930706 324.088021,75.6241109 C324.088021,79.4133408 326.654695,81.8121449 332.044709,81.8121449 Z M397.038586,98.174858 C381.495952,98.174858 368.776659,87.010264 368.776659,63.7820571 L368.776659,62.7552155 C368.776659,39.9118967 381.367619,27.7204612 397.295254,27.7204612 C407.847134,27.7204612 414.135484,32.2112952 417.999753,39.0128777 L417.999753,0 L441,0 L441,96.6353058 L417.999753,96.6353058 L417.999753,85.726357 C414.648819,92.6571824 407.205465,98.174858 397.038586,98.174858 Z M404.638792,80.325142 C412.852147,80.325142 417.914198,74.5248365 417.914198,63.0548885 L417.914198,62.0237862 C417.914198,50.6830811 413.237148,44.6242899 404.8812,44.6242899 C396.411177,44.6242899 391.848202,50.4245954 391.848202,62.1530291 L391.848202,63.1841314 C391.848202,74.5248365 396.781919,80.325142 404.638792,80.325142 Z" id="Shape" fill="url(#linearGradient-1)" fill-rule="nonzero"></path><path d="M52.456458,9 C46.2017589,12.0280593 36.2543542,17.466265 29.7563373,22.4224413 C13.8691154,34.5218053 0,47.6395812 0,64.0857908 C0,81.4931982 13.6114847,95.733802 34.6370064,98.3399069 C38.8020348,98.8548343 35.2810829,102.834079 35.2810829,102.834079 C35.2810829,102.834079 38.029143,101.945829 39.9184342,101.306461 C40.4623211,101.120515 41.3640283,103 41.3640283,103 C41.3640283,103 43.0529402,101.051858 43.2390067,101.184881 C45.2714261,102.726802 47.9908605,103 47.9908605,103 C47.9908605,103 44.3983445,98.8691378 48.8782549,98.2726802 C69.6032074,95.499224 83,81.3515932 83,64.0857908 C83,46.7584832 72.5802725,34.6605496 52.3992068,21.6514806 C49.7942749,19.972245 49.4937058,15.2291914 52.456458,9 Z M44.5414727,26.4388752 C55.2617693,36.1309535 60.6147612,48.2403299 60.6147612,60.3497063 C60.6147612,72.456222 55.2617693,84.5655985 44.5414727,94.2576767 C59.6844283,75.7775039 62.8618727,46.9015186 44.5414727,26.4388752 Z M38.3726505,26.4360145 C27.6523539,36.1266624 22.299362,48.2360388 22.299362,60.3454153 C22.299362,72.4547917 27.6523539,84.5627378 38.3726505,94.2533857 C23.2296948,75.7732128 20.0522504,46.8972275 38.3726505,26.4360145 Z M41.464218,93.0990901 C42.2657355,81.9623543 42.680807,70.8241882 42.680807,59.6845917 C42.680807,48.547856 42.2657355,37.4096899 41.464218,26.2729541 C39.0882911,48.547856 39.0882911,70.8241882 41.464218,93.0990901 Z M54.8180721,30.0691135 C66.7263321,39.9871877 73.5964822,51.4142853 74.1546818,62.4451748 C74.6985687,73.4760644 68.9448181,84.1107459 55.5766511,92.4439879 C79.1355406,71.9813445 73.8970512,49.3760309 54.8180721,30.0691135 Z M28.096051,30.0676831 C16.187791,39.984327 9.31764097,51.4114246 8.75944128,62.4423141 C8.20124159,73.4717733 13.9693051,84.1064549 27.337472,92.4396969 C3.77858251,71.9784838 9.01707191,49.3731702 28.096051,30.0676831 Z" id="Shape" fill="url(#linearGradient-2)"></path></g></g></g></svg>
            </div>
             <div id='now' onClick={active} className="relative rounded-full w-20 h-8 grid transition-all duration-300 ease-out place-items-center border border-solid border-gray-300 cursor-pointer">
              <CheckCircle className={`absolute top-[-5px] right-[-5px] hidden`} color="green" size={20}/>
              <div className="w-full p-1 gap-1 flex items-center justify-center ">
                   <img className="h-3" src='https://nowpayments.io/images/favicon.ico' alt="now payment" />
                   <p className="text-[9px] font-semibold">Now</p>
              </div>
             
            </div>
          </div>
           { isActive  ?   
           <Form onSubmit={payment}>
              <div className="w-full flex flex-col gap-3">
                  <div className="text-[12px] flex justify-between w-full ">
                    <label htmlFor="amount" className="font-semibold">Enter Amount</label>
                    <span className="text-gray-400">Min is ₦1000</span>
                  </div>
                  <label className={`${err ? 'block' : 'hidden'} text-red-500`}>min amount is ₦1000</label>
                  <input onChange={handleChange} type="text" placeholder="enter amount" name='amount' value={data.amount} className="border border-gray-300 rounded-md focus:ring-2 border-solid focus:ring-blue-500 focus:outline-none h-10 pl-3"/>
                  <button className="h-10 bg-[#0032a5] rounded-md grid place-items-center text-white" type="submit">
                    {showLoader ?  <img className="h-10" src={interwind} alt="loader" /> : 'submit' }  
                  </button>
              </div>
          </Form> :  <NowPay/> 
          
          }
        </div>
        {
          transs.length >= 1 ? ( 
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
                
                {transs?.slice().sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((item: any) => {
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