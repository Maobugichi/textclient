import React from "react"

interface FormProps {
    children?: React.ReactNode,
    className?:string,
    onSubmit?:(e:React.FormEvent<HTMLFormElement>) => void
}

const Form:React.FC<FormProps> = ({ children , className , onSubmit }) => {
    return(
        <form onSubmit={onSubmit} className={`${className}`}>
            {children}
        </form>
    )
}

export default Form