import React from "react";


interface BlockContProps {
    children: React.ReactNode;
    theme:boolean
}

const BlockCont:React.FC<BlockContProps> = ({ children }) => {
    return (
        <div className={` lg:w-full flex md:flex-row flex-col flex-wrap dark:bg-[#171717] dark:border dark:border-solid dark:border-gray-500 bg-[#f5f5f4]  rounded-3xl items-center justify-center  h-fit  py-5 md:min-h-[30vh] md:max-h-[60vh] md:gap-5 gap-4`}>
            {children}
        </div>
    )
}

export default BlockCont