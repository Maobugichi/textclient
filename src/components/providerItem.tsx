import { Check } from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

interface ProviderItemProps {
    short?:string;
    text?:string;
    availability?:string;
    id:string;
    onClick:(e:React.MouseEvent<HTMLDivElement>,id:string) => void;
    show?:boolean;

}


const ProviderItem:React.FC<ProviderItemProps> = ({ short, text , availability , id , onClick , show}) => { 

    return(
         <AnimatePresence >
            {
                show && (
                    <motion.div 
                    initial={{ opacity:0 }}
                    animate={{ opacity:1 , transition: { delay: .2 , type:'tween' }}}
                    exit={{ opacity: 0 , scale:0 }}
                    id={id} onClick={(e) => onClick(e,id)} className="flex h-[90%] border border-solid shadow-sm border-gray-400 p-1 w-[95%] mx-auto relative z-30 bg-white rounded-sm justify-between items-center">
                        <div className={`${show ? 'flex' : 'hidden'} pointer-events-none flex w-full  items-center gap-2 `}>
                            <div className=" pointer-events-none w-12 h-12 grid place-items-center rounded-full short bg-[#f1f5f9]">
                                {short}
                            </div>
                            <p className="flex pointer-events-none flex-col gap-1 font-medium text-[#020817] text-sm">
                                {text}
                                <span className="text-xs font-light text-[#647488] pointer-events-none">{availability}</span>
                            </p>
                        </div>
                    
                        <div className={`hidden pointer-events-none check transition-all duration-300`}>    
                        <Check size={17}/>
                        </div>
                    
                    </motion.div>
                )
            }
        </AnimatePresence>  
          
    )
}

export default ProviderItem