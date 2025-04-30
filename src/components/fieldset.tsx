import React from "react";

interface FieldsetProps {
    provider: string;
    children: React.ReactNode;
    className?:string;
}

const Fieldset:React.FC<FieldsetProps> = ({ provider , children , className="flex p-2 text-sm" }) => {
    return(
        <fieldset className={`${className}`}>
            <legend>{provider}</legend>
            {children}
        </fieldset>
    )
}

export default Fieldset 