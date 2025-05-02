import { Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import List from '../components/listItem';
import { useState } from 'react';


interface ThemeProps {
    listItem: string[]
}   

const Theme:React.FC<ThemeProps> = ({ listItem }) => {
    const [ showTheme , setTheme ] = useState(false);
    const revealTheme = () => {
        setTheme(prev => !prev)
    }

    const list = listItem.map(item => (
        <List
         item={item}
        />
    ));
    return(
        <div 
         onClick={revealTheme}
         className='relative bg-amber-50 w-[10%] md:w-[5%] grid place-items-center h-6 '>
              <Sun size={20}/>
              <AnimatePresence>
                {
                    showTheme && (
                        <motion.ul
                        initial={{height:0}}
                        animate={{height:110}}
                        exit={{height:0 , transition: { delay: .3}}}
                        className='absolute bg-white z-20 top-15 left-[-70px] w-[300%] [&>li:hover]:bg-[#f1f5f9] [&>li]:transition-all [&>li]:duration-300 [&>li]:p-1 [&>li]:rounded-sm  [&>li]:ease-out text-sm cursor-pointer  rounded-sm shadow-md flex flex-col justify-between p-2'>
                            {list}
                        </motion.ul>
                    )
                }
             </AnimatePresence> 
        </div>
       
    )
}

export default Theme