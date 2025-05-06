import { motion , AnimatePresence } from "motion/react"
import { Clipboard, ClipboardCheck ,X } from "lucide-react";
import { useState } from "react";
import {Dispatch , SetStateAction } from 'react';

interface PopProps {
    numberInfo:any;
    show:boolean;
     setIsShow:Dispatch<SetStateAction<boolean>>;
}
const PopUp:React.FC<PopProps> = ({numberInfo , show , setIsShow}) => {
    const [ copied , setCopied ] = useState<any>({
        number:false,
        sms:false
    })

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
                    <div className="flex items-center justify-between w-full h-[40%]" onClick={handleCopySms}>
                        <p className="font-light">Verification SMS <span className="font-semibold">{numberInfo.sms}</span></p>
                        { copied.sms ? <ClipboardCheck size='15'/> : <Clipboard size='15'/>}
                    </div>
                    
                </motion.div>
            </motion.div> 
            )
        }
     </AnimatePresence>
        
    )
} 

export default PopUp