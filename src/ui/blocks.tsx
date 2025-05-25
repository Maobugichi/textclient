import React from "react";
import Button from "../components/button";
import WavePattern from "../components/dashboard/wave";
import Overlay from "../components/overlay";
import WaveSet from "../components/dashboard/waveSet";
import Skeleton from "react-loading-skeleton";

interface BlocksProps {
    extra?: string;
    amount?:string;
    icon?:React.ReactNode;
    content?:string;
    btnIcon?:React.ReactNode;
    className?:string;
    isMerge?:boolean
}

const Blocks:React.FC<BlocksProps> = ({extra , amount , icon , content , btnIcon , className , isMerge }) => {
    return(
        <div className={`${className}`}>
            <div className="flex w-[90%]   justify-between  relative z-10">
            <p className="flex  flex-col text-lg font-semibold">
                <span className="text-sm">
                    {extra ? extra : <Skeleton count={1}/>}
                </span>
                {
                    !amount  || amount == '₦0'  ? (
                        <Skeleton count={1} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                    ) : (
                       extra == 'Balance' ? `₦${Number(String(amount).replace(/[^0-9.-]+/g, '')).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}` : amount
                    )
                }
            </p>
            <span>{icon ? icon : <Skeleton count={1}/>}</span>
        
            </div>
            { isMerge ? <WaveSet/> :   <WavePattern/>}
            <Overlay/>
            <Button
             width={isMerge ? "h-7 md:h-8 rounded-full text-white text-sm bg-[rgba(255,255,255,0.5)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.4)] font-bold  transition-colors duration-300 relative z-10 w-[80%]" :"w-[80%] h-10 rounded-full text-white text-sm bg-[rgba(255,255,255,0.5)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.4)] font-bold  transition-colors duration-300 relative z-10"}
             content={content}
             icon={btnIcon}
            />
        </div>
    )
}

export default Blocks