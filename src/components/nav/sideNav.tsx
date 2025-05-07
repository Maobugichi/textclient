import textPlug from "../../assets/textplug.png";
import NavItems from "./navItems";
import { motion , AnimatePresence } from "motion/react";
import { X } from 'lucide-react';
import { useEffect, useState } from "react";

import SignOut from "./logout";

interface SideNavProps {
    show?:boolean;
    setIsShow: React.Dispatch<React.SetStateAction<any>>;
}

const SideNav:React.FC<SideNavProps> = ({show , setIsShow}) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

      useEffect(() => {
        console.log(isMobile)
      },[isMobile])

    function closeNav() {
        setIsShow(false)
    }
    
    return(
        <AnimatePresence>
         {
            
            ( isMobile ?  
            (show && <motion.nav
                initial={{x: -500 }}
                animate={show ? { x: [-500, -300, 0] } : {}}
                exit={{ x: -500}}
                className="fixed z-20 w-[60%] md:w-[20%] md:fixed h-[100vh] top-0 md:flex flex-col gap-5 bg-[#f9fbfd] border-r border-solid border-[#5252]">
                   <div className="h-16 flex items-center justify-around  border-b border-solid border-[#5252]">
                       <img className="h-[60%]" src={textPlug} alt="logo" />
                       <X onClick={closeNav} className="md:hidden"/>
                   </div>
                   
                   <div className=" h-[70%]">
                        <NavItems
                        closeNav={closeNav}
                        />

                        <SignOut/>
                    </div>
               </motion.nav>) :
                (<nav
                className="fixed z-20 md:w-[20%] h-[100vh] top-0 md:flex flex-col gap-5 bg-[#f9fbfd] border-r border-solid border-[#5252]">
                    <div className="h-fit min-h-[64px] flex items-center justify-around  border-b border-solid border-[#5252]">
                        <img className="h-[60%]" src={textPlug} alt="logo" />
                        <X onClick={closeNav} className="md:hidden"/>
                    </div>
                    <div className=" h-[95%]">
                        <NavItems
                        closeNav={closeNav}
                        />

                        <SignOut/>
                    </div>
                   
                </nav> )   
            )
           
         }
        </AnimatePresence>
    )
}

export default SideNav