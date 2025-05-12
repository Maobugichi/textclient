import BlockCont from "./block-cont";
import Blocks from "../../ui/blocks";
import ForwardBlocks from "./forwardBlocks";
import { Link  } from "react-router-dom";
import {
    DollarSign,
    Users,   
    CreditCard,
    ArrowUpRight,
    Plus
  } from 'lucide-react';
import checkAuth from "../checkauth";
import SlideShow from "../../ui/slideshow";
import { useState, useEffect } from "react";
import axios from "axios";

interface DashProps {
    info: any
}

const DashInfo:React.FC<DashProps> = ({info}) => {
    /*function paystackPop() {
        axios.post('http://localhost:3001/initialize-transaction', {
            email: 'customer@email.com',
            amount: '20000',
          })
          .then((response) => {
            const access_code =response.data.data.access_code;
            const popup = new PaystackPop()
            popup.resumeTransaction(access_code)
        
        })
          .catch((error) => console.error(error));

    }*/
   const [ width , setWidth ] = useState<any>(window.innerWidth)
   const [ url , setUrl ] = useState<string>('')
      useEffect(() => {
         const handleWidth = () => {
            setWidth(window.innerWidth);
         }
   
         window.addEventListener('resize' , handleWidth);
         return () =>  window.removeEventListener('resize' , handleWidth);
      },[])

      useEffect(()=> {
        async function run() {
            const response = await axios.get('https://textflex-axd2.onrender.com/api/image')
            setUrl(response.data.data.url)
        }

        setInterval(run,3000)
        
      },[])
    const blockInfo = [
        {
            extra:'Balance',
            amount:'0.00',
            icon:<DollarSign size={17}/>,
            content:'Fund Wallet',
            btnIcon:<Plus size={17}/>,
            link:''
        } ,
        {
            extra:'Purchase Number',
            amount:info,
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
    const forwardInfo = [
        {
            text:'Referral Link',
            forward:'Click to copy your referral link'
        }, 
        {
            text:'Textplug',
            forward:'Join our telegram channel for more info and updates'
        }
    ]

   
    const blocks = blockInfo.slice(0, blockInfo.length - 2).map(info => (
        <Link className="w-[90%] md:w-[45%]"   to={checkAuth() ? info.link : '/signup/:1'}>
         <Blocks
          extra={info.extra}
          icon={info.icon}
          amount={info.amount}
          content={info.content}
          btnIcon={info.btnIcon}
          className="w-full h-[180px] md:h-[150px] lg:h-[210px] rounded-lg bg-[#0032a5] md:w-[270px] lg:w-[350px] grid object-cover overflow-hidden place-items-center border border-solid border-[#5252] text-white relative"
          isMerge={false}
        />
        </Link>
    ));

    const lastTwoBlocks =  blockInfo.slice(- 2).map(info => (
        <Link className="w-full"  to={checkAuth() ? info.link : '/signup/:1'}>
         <Blocks
          extra={info.extra}
          icon={info.icon}
          amount={info.amount}
          content={info.content}
          btnIcon={info.btnIcon}
          className=" h-fit  md:h-[80px] lg:h-[100px] min-h-[100px] overflow-hidden rounded-lg bg-[#0032a5] md:w-[250px] lg:w-[400px]  grid place-items-center border border-solid border-[#5252] text-white relative"
          isMerge={true}
        />
        </Link>
    ));


    const forward = forwardInfo.map(item => (
        <ForwardBlocks
         text={item.text}
         forward={item.forward}
        />
    ))
    return(
        <div className="h-fit  w-full flex flex-col gap-12">
            <div className="h-fit grid  gap-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <BlockCont>
                    {blocks}
                   
                    <div className=" flex flex-col h-fit min-h-[23vh] md:min-h-[15vh] justify-between gap-2 w-[90%] md:w-[48%] lg::w-[45%]">
                     {lastTwoBlocks}
                    </div>
                    {width <= 600 && <SlideShow/>}
                </BlockCont>
                {width > 600 && <SlideShow/>}
            </div>
           
            <div className="h-auto flex flex-col gap-4">
                <div className="flex flex-col md:flex-row  w-full justify-between gap-3 md:gap-0">
                    {forward}
                </div>

                <div className="h-fit flex flex-col gap-3">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <p>No transactions available</p>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashInfo