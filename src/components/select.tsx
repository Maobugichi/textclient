import React from "react";

interface SelectProps {
    children: React.ReactNode,
    onChange?:(e:React.ChangeEvent<HTMLSelectElement>) => void,
    id?:string;
    className?:string;
    value?:any;
    isDisabled?:boolean
    theme:boolean
}

const Select:React.FC<SelectProps> = ({ children , onChange , id , className , value , isDisabled , theme}) => {
    
    return(
        <select disabled={isDisabled} value={value} onChange={(e) => onChange?.(e)} id={id} className={`p-2.5 h-12  border border-gray-300 rounded-sm border-solid focus:ring-2 focus:ring-blue-500 focus:outline-none  min-h-[48px] w-[95%] mx-auto ${className} ${theme ? 'bg-transparent border-blue-200' : 'bg-white'}`}>
            {children}
        </select>
    )
}

export default Select