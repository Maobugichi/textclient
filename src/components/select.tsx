import React from "react";

interface SelectProps {
    children: React.ReactNode,
    onChange?:(e:React.ChangeEvent<HTMLSelectElement>) => void,
    id?:string;
    className?:string;
    value?:any;
    isDisabled?:boolean
}

const Select:React.FC<SelectProps> = ({ children , onChange , id , className , value , isDisabled}) => {
    
    return(
        <select disabled={isDisabled} value={value} onChange={(e) => onChange?.(e)} id={id} className={`p-2.5 h-12  rounded-sm  outline-1  outline-[#5252] w-[95%] mx-auto ${className} ${isDisabled ? 'bg-gray-100' : 'bg-white'}`}>
            {children}
        </select>
    )
}

export default Select