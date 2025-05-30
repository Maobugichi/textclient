import { AnimatePresence, motion } from "motion/react";

interface ToastProps {
    errorMssg:string;
    show:boolean
}


const Toast:React.FC<ToastProps> = ({ errorMssg , show }) => {

    return(
        <AnimatePresence>
            {
                show && (

                    <motion.div
                     initial={{ y: -200 }}
                     animate={{ y: 0 }}
                     exit={{ y: -200}}
                     className=" absolute w-[80%] md:w-full   text-center h-20 rounded-md border bg-red-200 text-white  grid place-items-center border-red-700">
                       <p className="w-[90%] mx-auto">{errorMssg}</p>
                    </motion.div>
                )
            }
            
        </AnimatePresence>
        
    )
}

export default Toast