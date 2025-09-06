import BlockCont from "./block-cont";
import Blocks from "../../ui/blocks";
import ForwardBlocks from "./forwardBlocks";
import { Link  } from "react-router-dom";
import {
    DollarSign,
    Users,   
    CreditCard,
    ArrowUpRight,
    Plus,
    Filter,
   
  } from 'lucide-react';
import checkAuth from "../checkauth";
import SlideShow from "../../ui/slideshow";
import { useState, useEffect } from "react";
import Transactions from "../transactions";
import {Dispatch , SetStateAction } from 'react';
import Filters from "../filter";
import { openFilter, filter , getTime } from "../../action";
import axios from "axios";
import { useBalance } from "../../balance";


interface DashProps {
    info: any;
    theme:boolean;
    transaction:any;
    setTransaction:Dispatch<SetStateAction<any>>;
    userData:any
}

const DashInfo:React.FC<DashProps> = ({info , theme , transaction , userData}) => {
      const [ width , setWidth ] = useState<any>(window.innerWidth)
      const [ transs , setTrans ] = useState<any>([])
      const [ open , setOpen ] = useState<boolean>(false)
      const [links, setLinks] = useState<string>('');
      const [referralCode, setReferralCode] = useState("");
      const [visibleCount, setVisibleCount] = useState(10);
      useEffect(() => {
         fetchLinks();
      }, []);

      
      useEffect(() => {
         const handleWidth = () => {
            setWidth(window.innerWidth);
         }
         window.addEventListener('resize' , handleWidth);
         return () =>  window.removeEventListener('resize' , handleWidth);
      },[])
      const fetchLinks = async () => {
            try {
            const res = await axios.get("https://api.textflex.net/api/links");
            setLinks(res.data[1].link);
            } catch (err) {
                console.log(err)
                alert("Failed to fetch links");
            }
      };
       let lengthArr = 0
       const dashed =  localStorage.getItem("arr-length")

       if (dashed) {
        try {
                const data = JSON.parse(dashed);
                lengthArr = data.balance
                console.log("Parsed data:", data);
            } catch (err) {
                console.error("Invalid JSON in storage:", err);
            }
        }
      const { balance } = useBalance(); 

      const blockInfo = [
        {
            extra:'Balance',
            amount: balance ,
            icon:<DollarSign size={17}/>,
            content:'Fund Wallet',
            btnIcon:<Plus size={17}/>,
            link:'/payment/1',
            
        } ,
        {
            extra:'Purchase Number',
            amount:info.length ?  info.length : lengthArr, 
            icon:<Users size={17}/>,
            content:'Receive SMS',
            btnIcon:<ArrowUpRight size={17} />,
            link:'/sms/1'
        },
        {
            extra:'Rented Numbers',
            amount:'0',
            icon:<CreditCard size={17}/>,
            content:'Rent Number',
            btnIcon:<ArrowUpRight  size={17}/>,
            link:'/number/1'
        }
      ]

    useEffect(() => {
      const fetchReferral = async () => {
        try {
            const response = await axios.get(`https://api.textflex.net/api/ref?userId=${userData.userId}`);
            setReferralCode(response.data);
            return response.data
        } catch (err) {
            console.error("Error fetching referral", err);
        }
     };

     fetchReferral()
   },[])
   
   const generateReferralCode = async  (e:any) => {
    const target = e.target as HTMLElement
    if (target.innerText == 'Textflex' || target.innerText == 'Join our telegram channel for more info and updates') {
        return
    }
    try {
       await navigator.clipboard.writeText(referralCode);
       await axios.post(`https://api.textflex.net/api/notify`, {
            userId: userData.userId,
            message: "referral code copied",
            type: "info"
        });
       
    } catch (err) {
        console.error("Clipboard copy failed", err);
        alert("Failed to copy code");
    }
   };


    const forwardInfo = [
        {
            link:'',
            onClick:generateReferralCode,
            text:'Referral Link',
            forward:'Click to copy your referral link'
        }, 
        {
            link:links,
            onClick:null,
            text:'Textflex',
            forward:'Join our telegram channel for more info and updates'
        }
    ]

    const filteredTrans = transs
        .filter((item: any) => item.status === "successful" || item.status === "refunded")
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const visibleTrans = filteredTrans.slice(0, visibleCount);

    useEffect(() => {
         setTrans(transaction)
    },[transaction])

   
    console.log("balance", balance)
  
    const blocks = blockInfo.slice(0, blockInfo.length - 2).map(info => (
        <Link className="w-[90%] md:w-[45%]"   to={checkAuth() ? info.link : '/signup/:1'}>
         <Blocks
          extra={info.extra}
          icon={info.icon}
          amount={`₦${balance}`}
          content={info.content}
          btnIcon={info.btnIcon}
          className="w-full h-[180px] md:h-[150px] lg:h-[210px] rounded-sm bg-[#0032a5] md:w-[270px] lg:w-[350px] grid object-cover overflow-hidden place-items-center border border-solid border-[#5252] text-white relative"
          isMerge={false}
        />
        </Link>
    ));

    const lastTwoBlocks =  blockInfo.slice(- 2).map(info => (
        <Link className="w-full"  to={checkAuth() ? info.link : '/signup/:1'}>
         <Blocks
          extra={info.extra}
          icon={info.icon}
          amount={info.amount ? info.amount : 0}
          content={info.content}
          btnIcon={info.btnIcon}
          className=" h-fit  md:h-[80px] lg:h-[100px] min-h-[100px] overflow-hidden rounded-sm bg-[#0032a5] md:w-[250px] lg:w-[400px]  grid place-items-center border border-solid border-[#5252] text-white relative"
          isMerge={true}
        />
        </Link>
    ));


    const forward = forwardInfo.map(item => (
        <ForwardBlocks
         text={item.text}
         forward={item.forward}
         theme={theme}
         link={item.link}
         onClick={generateReferralCode}
         userId={userData.userId}
        />
    ))

   
    return(
        <div className={`h-fit lg:ml-10 w-[95%] mx-auto  lg:w-[85%] flex flex-col  gap-12 ${theme ? 'text-white' : 'text-black'}`}>
            <div className="h-fit grid  gap-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                 <BlockCont
                  theme={theme}
                 >
                    {blocks}
                   
                    <div className=" flex flex-col h-fit min-h-[23vh] md:min-h-[15vh] justify-between gap-2 w-[90%] md:w-[48%] lg::w-[45%]">
                     {lastTwoBlocks}
                    </div>
                    {width <= 600 && <SlideShow/>}
                </BlockCont>
                {width > 600 && <SlideShow/>}
            </div>
           
            <div className="h-auto flex flex-col gap-4 w-full">
                <div className="flex flex-col md:flex-row  justify-between gap-3 md:gap-0">
                    {forward}
                </div>

                    
                     {visibleTrans?.length > 0 ? 
                      <div className="grid gap-3 w-full overflow-hidden">
                        <div className="flex md:w-[45%]  w-[90%]  justify-between">
                             <p className="font-bold text-lg w-[70%]">Recent Activities</p>
                             <div className=" w-[20%]   relative">
                                <button onClick={() => openFilter(setOpen)} className="border-gray-400 border border-solid  w-full h-8 grid place-items-center rounded-md"><Filter/></button>
                                <Filters
                                 handleClick={(e) => filter(e, setTrans, transaction, setOpen)}
                                 open={open}
                                 right='left-0'
                                />
                             </div>
                        </div>
                       
                        {visibleTrans?.map((item: any) => {
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
                      </div> 
                         :
                      <div className="h-fit flex flex-col gap-3">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                        <p>No transactions available</p>
                        <div>   

                        </div>
                      </div> }
           
              
            </div>
        </div>
    )
}

export default DashInfo