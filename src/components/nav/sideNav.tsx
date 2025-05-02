import textPlug from "../../assets/textplug.png";
import NavItems from "./navItems";
import { motion , AnimatePresence } from "motion/react";
import { X } from 'lucide-react';

interface SideNavProps {
    show?:boolean;
    setIsShow: React.Dispatch<React.SetStateAction<any>>;
}

const SideNav:React.FC<SideNavProps> = ({show , setIsShow}) => {
    function closeNav() {
        setIsShow(false)
    }
    return(
        <AnimatePresence>
            <motion.nav
            initial={{x: -500 }}
            animate={show ? { x: [-500, -300, 0] } : {}}
            exit={{ x: -500}}
            className="absolute z-50 w-[60%] md:w-[20%] md:fixed h-[100vh] top-0 md:flex flex-col gap-5 bg-[#f9fbfd] border-r border-solid border-[#5252]">
                <div className="h-16 flex items-center justify-around  border-b border-solid border-[#5252]">
                    <img className="h-[60%]" src={textPlug} alt="logo" />
                    <X onClick={closeNav} className="md:hidden"/>
                </div>
                
                <NavItems
                 closeNav={closeNav}
                />
            </motion.nav>
        </AnimatePresence>
    )
}

export default SideNav