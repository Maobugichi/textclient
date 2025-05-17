import { Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import List from '../components/listItem';
import {  useState } from 'react';



interface ThemeProps {
    listItem: string[];
    setTheme:React.Dispatch<React.SetStateAction<boolean>>;
    theme:boolean
}   

const Theme:React.FC<ThemeProps> = ({ listItem , setTheme , theme }) => {
   const [ dropDown , setDropDown ] = useState<boolean>(false)
    const revealTheme = () => {
        setDropDown(true)
    }

    function changeTheme(e:React.MouseEvent<HTMLLIElement>) {
        const target = e.target as HTMLElement
        if (target.innerText == 'Dark') {
           
            setTheme(true)
        } else if (target.innerText == 'Light') {
            setTheme(false)
        }
        setTimeout(() => {
            setDropDown(false)
        }, 1000);
          
    }
    const list = listItem.map(item => (
        <List
         item={item}
         changeTheme={changeTheme}
        />
    ));
    return(
        <div 
         onClick={revealTheme}
         className='relative w-[10%] md:w-[5%] grid place-items-center h-6 '>
              <Sun size={20}/>
              <AnimatePresence>
                {
                    dropDown && (
                        <motion.ul
                        initial={{height:0}}
                        animate={{height:110}}
                        exit={{height:0 , transition: { delay: .3}}}
                        className={`absolute ${theme ? 'bg-transparent text-white [&>li:hover]:bg-[#333333]' : 'bg-white [&>li:hover]:bg-[#f1f5f9]' } z-20 top-15 left-[-70px] w-[300%]  [&>li]:transition-all [&>li]:duration-300 [&>li]:p-1 [&>li]:rounded-sm  [&>li]:ease-out text-sm cursor-pointer  rounded-sm shadow-md flex flex-col justify-between p-2`}>
                            {list}
                        </motion.ul>
                    )
                }
             </AnimatePresence> 
        </div>
       
    )
}

export default Theme