import { AnimatePresence, motion } from "motion/react"


interface FilterProp {
    handleClick: (e:React.MouseEvent<HTMLLIElement>) => void;
    open:boolean;
    right:string
}
const Filters:React.FC<FilterProp> = ({handleClick , open ,right }) => {
    return(
      <AnimatePresence>
        { open && 
        
           <motion.ul
           initial={{scale:0}}
           animate={{scale: 1}}
           exit={{scale:0}}
           className={ `absolute bg-white border border-solid border-gray-500 md:${right} right-1 w-22 text-sm h-fit max-h-32 p-2 grid place-items-center cursor-pointer rounded-sm top-10`}>
            {["successful", "refunded", "pending" , "clear"].map((status) => (
                <li
                key={status}
                onClick={(e) => handleClick(e)}
                className="hover:bg-gray-100 w-full text-center py-1"
                >
                {status}
                </li>
            ))}
        </motion.ul>}
      </AnimatePresence>
    )
}

export default Filters