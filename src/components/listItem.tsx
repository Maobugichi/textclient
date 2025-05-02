import React from "react";
import { motion } from "motion/react";

interface ListProps {
    item?:string;
    children?: React.ReactNode;
    className?:string;
    onClick?:() => void;
}


const List:React.FC<ListProps> = ({item, children , className , onClick}) => {
    return(
        <motion.li
         initial={{fontSize:0}}
         animate={{fontSize:'13px'}}
         exit={{fontSize:0}}
         className={`${className}`}
         onClick={onClick}
        >
            {item}
            {children}
        </motion.li>
    )
}

export default List