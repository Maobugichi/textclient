import React, { useEffect } from "react";
import interwind from "../assets/Interwind.svg"
import { useState } from "react";

interface ButtonProps {
    content: React.ReactNode;
    width?:String;
    className?:string;
    onClick?:() => {};
    checkUser?:boolean;
    message?:any;
    password?:any
}


const Button:React.FC<ButtonProps> = ({content , width , className , onClick , checkUser, message , password}) => {
    const [ showLoader , setShowLoader ] = useState<any>(false);
        useEffect(() => {
            if (message !== '') {
                setShowLoader(false)
                console.log('hello')
            } 
        },[message]);
 
        function load() {
            if (password)  {
                setShowLoader(false)
                return
            }
            if (checkUser) {
              setShowLoader(true)
            }  
        }
      
        return(
            <button  onClick={onClick ? onClick : load} className={`bg-[#0032a5] ${width} ${className} grid place-items-center`}>
              {showLoader ?  <img className="h-10" src={interwind} alt="loader" /> : content }  
            </button>
        )
}

export default Button