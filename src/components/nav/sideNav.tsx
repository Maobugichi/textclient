import NavItems from "./navItems";
import { motion, AnimatePresence } from "motion/react";
import { X } from 'lucide-react';
import { useEffect, useState } from "react";
import textlogo from "../../assets/textflexLogo.png";
import SignOut from "./logout";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { cn } from "../../lib/utils";

interface SideNavProps {
    show?: boolean;
    setIsShow: React.Dispatch<React.SetStateAction<any>>;
    theme: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ show, setIsShow, theme }) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 500);
  
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function closeNav() {
        setIsShow(false);
    }

    const NavContent = () => (
        <>
            <div className={cn(
                "h-fit min-h-[64px] flex items-center justify-around border-b border-solid",
                theme ? 'border-blue-100' : 'border-[#5252]'
            )}>
                <Link to="/homepage/1" className="w-full flex py-2">
                    {textlogo ? (
                        <img 
                            className="h-[58px] w-[180px] object-contain" 
                            src={textlogo} 
                            alt="logo" 
                        />
                    ) : (
                        <Skeleton 
                            className="w-[80%] h-32 md:h-32 rounded-md" 
                            baseColor="#333333" 
                            highlightColor="#f5f5f5" 
                        />
                    )}
                </Link>
                {isMobile && (
                    <button 
                        onClick={closeNav} 
                        className="md:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className={cn(
                "flex-1 overflow-y-auto px-3 py-4",
                theme ? 'text-gray-200' : 'text-black'
            )}>
               <NavItems
                    closeNav={closeNav}
                />
            </div>

            <div className="p-3 border-t border-solid border-gray-200 dark:border-gray-700">
                <SignOut />
            </div>
        </>
    );

    return (
        <AnimatePresence>
            {(isMobile ? (
                show && (
                    <motion.nav
                        initial={{ x: -500 }}
                        animate={{ x: 0 }}
                        exit={{ x: -500 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed z-20 font-montserrat w-[70%] sm:w-[60%] h-[100vh] top-0 flex flex-col border-r border-solid",
                            theme ? 'bg-[#242424] border-blue-100' : 'bg-[#f9fbfd] border-[#5252]'
                        )}
                    >
                        <NavContent />
                    </motion.nav>
                )
            ) : (
                <nav
                    className={cn(
                        "fixed font-montserrat z-20 w-[20%] h-[100vh] top-0 flex flex-col border-r border-solid",
                        theme ? 'bg-[#242424] border-blue-100' : 'bg-[#f9fbfd] border-[#5252]'
                    )}
                >
                    <NavContent />
                </nav>
            ))}
        </AnimatePresence>
    );
};

export default SideNav;