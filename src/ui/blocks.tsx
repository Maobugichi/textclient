import React from "react";
import Button from "../components/button";
import WavePattern from "../components/dashboard/wave";
import Overlay from "../components/overlay";

interface BlocksProps {
    extra?: string;
    amount?:string;
    icon?:React.ReactNode;
    content?:string;
    btnIcon?:React.ReactNode;
}

const Blocks:React.FC<BlocksProps> = ({extra , amount , icon , content , btnIcon }) => {
    return(
        <div className="h-[150px] rounded-lg bg-[#0032a5] w-full md:w-[306px] grid place-items-center border border-solid border-[#5252] text-white relative">
            <div className="flex w-[90%]  justify-between relative z-10">
                <p className="flex flex-col text-lg font-semibold">
                    <span className="text-sm">
                        {extra}
                    </span>
                    {extra == 'Balance' ? `₦ ${amount}`: amount}
                </p>
                <span>{icon}</span>
               
            </div>
            <WavePattern/>
            <Overlay/>
            <Button
             width="w-[80%] h-10 rounded-full text-white text-sm bg-[rgba(255,255,255,0.5)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.4)] font-bold  transition-colors duration-300 relative z-10"
             content={content}
             icon={btnIcon}
            />
        </div>
    )
}

export default Blocks