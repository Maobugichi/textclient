import React from "react";

interface OptionProps {
    children?:React.ReactNode,
    value:string | number
}

const Option:React.FC<OptionProps> = ({children , value}) => {
    return(
        <option value={value}>
            {children}
        </option>
    )
}

export default Option