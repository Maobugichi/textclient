import React from "react";


interface BlockContProps {
    children: React.ReactNode;
}

const BlockCont:React.FC<BlockContProps> = ({ children }) => {
    return (
        <div className=" md:w-[84%] flex md:flex-row flex-col flex-wrap bg-[#f5f5f4]  rounded-lg items-center h-fit min-h-[61vh] md:min-h-[20vh] md:max-h-[42vh] md:p-3.5 md:gap-5 gap-4">
            {children}
        </div>
    )
}

export default BlockCont