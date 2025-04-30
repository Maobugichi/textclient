import React from "react"

interface ButtonProps {
    content: React.ReactNode;
    width?:String;
}


const Button:React.FC<ButtonProps> = ({content , width}) => {
    return(
        <button className={`bg-[#0032a5] ${width}`}>
            {content}
        </button>
    )
}

export default Button