import { modalOptions  } from "../action";
import ModalSelect from "./modalSelect";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import { ThemeSwitch } from "../components/nav/toggle";

interface HeaderProps {
     setIsShow: React.Dispatch<React.SetStateAction<any>>;
     show?:boolean;
     setShow:React.Dispatch<React.SetStateAction<boolean>>;
     theme:boolean;
     setTheme:React.Dispatch<React.SetStateAction<boolean>>;
     userData:any
}

const Header:React.FC<HeaderProps> = ({ setIsShow ,  setShow ,  userData }) => {
    const isItem = modalOptions;
    const [ level , setLevel ] = useState<any>('');
    
    const [ icon , setIcon ] = useState<any>({
        icon:'',
        text:''
    })
    function openNav() {
        setIsShow(true)
    }

    async function getLevel() {
        const userId = userData.userId
        const result = await axios.get('https://api.textflex.net/api/level',{
            params: { user_id: userId }
            });
        setLevel(result.data[0].total_deposited)
    }

    const getUserLevel = (totalDeposited:any) => {
       const sortedLevels = [...isItem].sort((a, b) => b.threshold - a.threshold);
       return sortedLevels.find(level => totalDeposited >= level.threshold);
    };

    useEffect(() => {
      getLevel()
      const userLevel = getUserLevel(level);
      const { icon , text } = userLevel || { icon: '', text: '' }
      setIcon({
        icon:icon,
        text:text
      })
    },[])
    return(
        <header className={`fixed w-full top-0 py-5 grid place-items-center dark:bg-[#242424] dark:border-blue-100 dark:text-white bg-white border-[#5252] text-black border-b border-solid  z-20`}>
            <div className="flex items-center h-[80%] w-[95%] justify-between pl-3 md:justify-end gap-5">
                <Menu className="md:hidden" onClick={openNav}/>
                <div className="flex items-center w-[70%] md:w-[50%]  justify-end gap-5">
                    <ModalSelect
                        icon={icon.icon}
                        text={icon.text}
                        setShow={setShow}
                    />
                    
                    <ThemeSwitch/>
            </div>
            </div>
           
        </header>
    )
}

export default Header