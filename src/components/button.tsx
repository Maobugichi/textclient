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
    password?:any;
    icon?:React.ReactNode;
}


const Button:React.FC<ButtonProps> = ({content , width , className , onClick , checkUser, message , icon}) => {
    const [ showLoader , setShowLoader ] = useState<any>(false);
        useEffect(() => {
            if (message !== '') {
                setShowLoader(false)
            } 
        },[message]);
 
        function load() {
            console.log(checkUser)
            if (checkUser) {
              setShowLoader(true)
            }  
        }
      
        return(
            <button  onClick={onClick ? onClick : load} className={` ${width} ${className} ${icon ? 'flex justify-center gap-3' : 'grid'}  place-items-center`}>
              {showLoader ?  <img className="h-10" src={interwind} alt="loader" /> : content }  
              {icon && icon}
            </button>
        )
}
export default Button