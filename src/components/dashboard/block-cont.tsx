import React from "react";

interface BlockContProps {
    children: React.ReactNode;
}

const BlockCont:React.FC<BlockContProps> = ({ children }) => {
    return (
        <div className="flex flex-wrap bg-[#f5f5f4]  rounded-lg justify-between p-3.5">
            {children}
        </div>
    )
}

export default BlockCont