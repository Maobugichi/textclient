import { motion , AnimatePresence } from "motion/react"
import { Clipboard, ClipboardCheck ,X } from "lucide-react";
import { useEffect, useState } from "react";
import {Dispatch , SetStateAction } from 'react';
import axios from "axios";
import interwind from "../assets/Interwind.svg"
import spinner from "../assets/dualring.svg"

interface PopProps {
    numberInfo:any;
    errorInfo:any;
    show:boolean;
    setIsShow:Dispatch<SetStateAction<boolean>>;
    error:boolean;
    setIsError:Dispatch<SetStateAction<boolean>>;
    userId:any;
    req_id:any;
    setIsCancel:Dispatch<SetStateAction<boolean>>;
    cancel:boolean
}
const PopUp:React.FC<PopProps> = ({numberInfo , show , setIsShow , error , setIsError , errorInfo , req_id , userId , setIsCancel , cancel}) => {
    const [ copied , setCopied ] = useState<any>({
        number:false,
        sms:false
    })
    const [ showLoader , setShowLoader ] = useState<boolean>(false)

     async  function cancelRequest() {
        setIsCancel(true)
         setShowLoader(true)
          const res =await axios.post('https://textflex-axd2.onrender.com/api/sms/cancel', {
          request_id: req_id,
          user_id: userId
          });
          setShowLoader(false)
          
          setIsShow(false)
         alert('sms polling cancelled, your funds would be refunded')
         console.log(res)
        }

    useEffect(() => {
        let myTimeOut:any
        if (cancel) {
           myTimeOut = setTimeout(() => {
                setIsCancel(false)
            }, 2000);
            
            return () => clearTimeout(myTimeOut)
        }
    },[cancel])
    const handleCopyNumber = () => {
        navigator.clipboard.writeText(numberInfo.number).then(() => {
            setCopied((prev:any) => ({
                ...prev,
                number:true
            }
            ));
            setTimeout(() => {
                setCopied({
                  number:false,
                  sms:false
                })
            }, 1000);
        })
    }

    const handleCopySms = () => {
        navigator.clipboard.writeText(numberInfo.sms).then(() => {
            setCopied((prev:any) => ({
                ...prev,
                sms:true
            }
            ));
            setTimeout(() => {
                setCopied({
                  number:false,
                  sms:false
                })
            }, 1000);
        })
    }

    const hidePopUp = () => {
        setIsShow(false)
        setIsError(false)
    }


    return(
     <AnimatePresence>
        {
            show && (
            <motion.div 
             initial={{ scale: 0}}
             animate={{ scale: 1}}
             exit={{scale: 0}}
             className="bg-gray-500/20 h-full w-full fixed grid place-items-center z-50 top-0 left-0">
                <X onClick={hidePopUp} size={24} className="absolute top-10 right-10"/>
                <motion.div className="bg-white h-[40%] rounded-md grid  place-items-center w-[80%] md:w-[25%]  mx-auto p-5">
                    <div className="flex items-center justify-between w-full  h-[40%]" onClick={handleCopyNumber}>
                     <p className="font-light">Purchased Number:  <span className="font-semibold">{numberInfo.number}</span></p>
                     { copied.number ? <ClipboardCheck size='15'/> : <Clipboard size='15'/>}
                    </div>
                    <div className="flex items-center relative justify-between w-full h-[40%]" onClick={handleCopySms}>
                        <p className="font-light">Verification SMS <span className="font-semibold">{numberInfo.sms}</span></p>
                         {numberInfo.sms == '' && <img className="w-8 absolute left-[63%] top-[20%]" src={spinner} alt="Loading" width="20" />}
                        { copied.sms ? <ClipboardCheck size='15'/> : <Clipboard size='15'/>}
                    </div>
                    
                    <button className="w-[90%]  h-[40%] bg-[#0032a5] md:h-[60%] text-white text-sm grid place-items-center  rounded"  onClick={cancelRequest}>{showLoader ? <img className="h-10" src={interwind}/> :'cancel'}</button>
                </motion.div>
            </motion.div> 
            )
        }
        {
            error && (
                <motion.div 
                initial={{ scale: 0}}
                animate={{ scale: 1}}
                exit={{scale: 0}}
                className="bg-gray-500/20 h-full w-full fixed grid place-items-center z-50 top-0 left-0">
                   <X onClick={hidePopUp} size={24} className="absolute top-10 right-10"/>
                   <motion.div className="bg-white h-[40%] rounded-md grid  place-items-center w-[80%] md:w-[25%]  mx-auto p-5">
                       <div className="flex items-center justify-between w-full  h-[40%]">
                            {errorInfo}
                       </div>
                       
                   </motion.div>
               </motion.div> 
            )
        }
     </AnimatePresence>
        
    )
} 

export default PopUp