import React from "react";

interface SelectProps {
    children: React.ReactNode,
    onChange?:(e:React.ChangeEvent<HTMLSelectElement>) => void,
    id?:string;
    className?:string;
    value?:any;
}

const Select:React.FC<SelectProps> = ({ children , onChange , id , className , value}) => {
    return(
        <select value={value} onChange={(e) => onChange?.(e)} id={id} className={`p-2.5 h-12  rounded-sm outline-1 bg-white outline-[#5252] w-[95%] mx-auto ${className}`}>
            {children}
        </select>
    )
}

export default Select