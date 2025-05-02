import React from "react";
import Button from "../components/button";

interface BlocksProps {
    extra?: string;
    amount?:string;
    icon?:React.ReactNode;
    content?:string;
}

const Blocks:React.FC<BlocksProps> = ({extra , amount , icon , content }) => {
    return(
        <div className="h-[130px] rounded-lg bg-white w-full md:w-[306px] grid place-items-center border border-solid border-[#5252]">
            <div className="flex w-[90%]">
                <p className="flex flex-col text-lg font-semibold">
                    <span className="text-sm">
                        {extra}
                    </span>
                    {amount}
                </p>
                <span>{icon}</span>
            </div>
            <Button
             width="w-[90%] h-9.5 rounded-sm text-white text-sm hover:bg-[#0032a5]/60 transition-colors duration-300"
             content={content}
            />
        </div>
    )
}

export default Blocks