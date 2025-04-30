import React from "react";

interface FieldsetProps {
    provider: string;
    children: React.ReactNode;
    className?:string;
    fclass?:string
}

const Fieldset:React.FC<FieldsetProps> = ({ provider , children , className="flex p-2 text-sm" , fclass }) => {
    return(
        <fieldset className={`${className}`}>
            <legend className={`${fclass}`}>{provider}</legend>
            {children}
        </fieldset>
    )
}

export default Fieldset 