import React from "react"

interface ButtonProps {
    content: React.ReactNode;
    width?:String;
    className?:string;
}


const Button:React.FC<ButtonProps> = ({content , width , className}) => {
    return(
        <button className={`bg-[#0032a5] ${width} ${className}`}>
            {content}
        </button>
    )
}

export default Button