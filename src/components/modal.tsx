import {  X } from "lucide-react";
import * as React from "react"
import { Dispatch, SetStateAction } from 'react';
import { motion , AnimatePresence } from "motion/react";

interface ModalProps {
   children:React.ReactNode;
   isShow:boolean;
   setShow:Dispatch<SetStateAction<boolean>>;
   [key: string]:any;
}



const Modal:React.FC<ModalProps> = ({children , isShow , setShow }) => {
    const handleOffScreen = () => {
        setShow(false)
    }
    return(
     <AnimatePresence>
        {
            isShow && ( 
            <motion.div
                initial={{  opacity:0 }}
                animate={{ opacity:isShow ? 1 : 0 }}
                exit={{opacity: 0 , transition: { delay:.5 }}}
                transition={{ type:"tween" ,  duration: .4}}
                className="w-full bg-black/80 fixed inset-0 h-[100vh] z-20">
                   <motion.div
                    initial={{ scale:0 , opacity:0 }}
                    animate={{ scale:isShow ? 1 : 0  , opacity:isShow ? 1 : 0  }}
                    exit={{scale: 0 , transition: { delay:.3 }}}
                    transition={{ type:"spring" , delay:.5 , duration:.3}}
                    className=" w-[35%] p-5 rounded-lg bg-white h-[95%] mx-auto grid gap-3">
                       <div className="flex h-12 items-center justify-between">
                           <p className="flex flex-col">
                               Discount Tiers
                               <span>Discount applies to all services</span>
                           </p>
                           <X onClick={handleOffScreen}/>
                       </div>
                       {children}
                   </motion.div>
               </motion.div>)
        }
       
     </AnimatePresence>
    )
}

export default Modal