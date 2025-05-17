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


interface DashProps {
    info: any
}

const DashInfo:React.FC<DashProps> = ({info}) => {
      const [ width , setWidth ] = useState<any>(window.innerWidth)
      useEffect(() => {
        console.log(info)
         const handleWidth = () => {
            setWidth(window.innerWidth);
         }
         window.addEventListener('resize' , handleWidth);
         return () =>  window.removeEventListener('resize' , handleWidth);
      },[])

      
    const blockInfo = [
        {
            extra:'Balance',
            amount:info[0]?.balance,
            icon:<DollarSign size={17}/>,
            content:'Fund Wallet',
            btnIcon:<Plus size={17}/>,
            link:'/payment/1',
            
        } ,
        {
            extra:'Purchase Number',
            amount:info.length,
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
          amount={info.amount}
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
        />
    ))
    return(
        <div className="h-fit lg:ml-10  w-[85%] flex flex-col  gap-12">
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
           
            <div className="h-auto flex flex-col gap-4 w-full">
                <div className="flex flex-col md:flex-row  justify-between gap-3 md:gap-0">
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