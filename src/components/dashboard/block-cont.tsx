import React from "react";


interface BlockContProps {
    children: React.ReactNode;
    theme:boolean
}

const BlockCont:React.FC<BlockContProps> = ({ children ,theme }) => {
    return (
        <div className={` lg:w-full flex md:flex-row flex-col flex-wrap ${theme ? 'bg-[#262626] border border-solid border-blue-50' : 'bg-[#f5f5f4]'}  rounded-lg items-center justify-center md:justify-start h-fit  pt-4 pb-3 md:pl-5 md:min-h-[20vh] md:max-h-[42vh] md:p-3.5 md:gap-5 gap-4`}>
            {children}
        </div>
    )
}

export default BlockCont