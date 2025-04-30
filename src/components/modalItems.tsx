import { AnimatePresence, motion } from "motion/react";



interface ModalItemProps {
    icon?:string;
    text?:string;
    indicator?:string;
    percentage?:string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    [key: string]:any;
    delay:number;
}


const ModalItem:React.FC<ModalItemProps> = ({icon , text , indicator , percentage , delay}) => {
  
    return(
        <AnimatePresence>
        <motion.div 
         initial={{ scale: 0, opacity: 0 }}
         animate={ {scale: 1,opacity: 1,}}
         transition={{type:'spring' , damping:20 , delay:delay}}
         exit={{ scale: 0, opacity: 0 ,transition: { delay:delay }}}
         className="flex justify-between items-center p-3 bg-yellow-50 h-16 rounded-md">
            <div className="flex ">
                <span>
                    {icon}
                </span>
                <p>
                    {text}
                    <span>{indicator}</span>
                </p>
            </div>
            <span>{percentage}</span>
        </motion.div>
        </AnimatePresence>
    )
}

export default ModalItem