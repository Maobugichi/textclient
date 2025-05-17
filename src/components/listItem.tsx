import React from "react";
import { motion } from "motion/react";

interface ListProps {
    item?:string;
    children?: React.ReactNode;
    className?:string;
    onClick?:() => void;
    changeTheme?:(e:React.MouseEvent<HTMLLIElement>) => void
}


const List:React.FC<ListProps> = ({item, children , className , onClick , changeTheme}) => {
    return(
        <motion.li
         initial={{fontSize:0}}
         animate={{fontSize:'13px'}}
         exit={{fontSize:0}}
         className={`${className}`}
         onClick={onClick || changeTheme}
        >
            {item}
            {children}
        </motion.li>
    )
}

export default List