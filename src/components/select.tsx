import React from "react";

interface SelectProps {
    children: React.ReactNode,
    onChange?:(e:React.ChangeEvent<HTMLSelectElement>) => void,
    id?:string;
    className?:string;
}

const Select:React.FC<SelectProps> = ({ children , onChange , id , className}) => {
    return(
        <select onChange={(e) => onChange?.(e)} id={id} className={`p-2.5  rounded-sm outline-1 bg-white outline-[#5252] w-[95%] mx-auto ${className}`}>
            {children}
        </select>
    )
}

export default Select