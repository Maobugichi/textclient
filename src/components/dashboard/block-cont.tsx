import React from "react";

interface BlockContProps {
    children: React.ReactNode;
}

const BlockCont:React.FC<BlockContProps> = ({ children }) => {
    return (
        <div className="flex md:flex-row flex-col flex-wrap bg-[#f5f5f4]  rounded-lg justify-between p-3.5 md:gap-0 gap-4">
            {children}
        </div>
    )
}

export default BlockCont