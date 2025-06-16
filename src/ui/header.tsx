import { modalOptions , listItem } from "../action";
import ModalSelect from "./modalSelect";
import Provider from "./provider";
import { useEffect, useState } from "react";
import Theme from "./theme";
import { Menu } from "lucide-react";
import axios from "axios";

interface HeaderProps {
     setIsShow: React.Dispatch<React.SetStateAction<any>>;
     show?:boolean;
     setShow:React.Dispatch<React.SetStateAction<boolean>>;
     theme:boolean;
     setTheme:React.Dispatch<React.SetStateAction<boolean>>;
     userData:any
}

const Header:React.FC<HeaderProps> = ({ setIsShow ,  setShow , theme , setTheme, userData }) => {
    const isItem = modalOptions;
    const [ level , setLevel ] = useState<any>('');
    const [ showProviders, setProviders ] = useState(false);
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
      console.log(userLevel)
      const { icon , text } = userLevel || { icon: '', text: '' }
      setIcon({
        icon:icon,
        text:text
      })
      console.log(userLevel)
    },[])
    return(
        <header className={`fixed w-full top-0 h-16 grid place-items-center ${theme ? 'bg-[#191919] border-blue-100 text-white' : 'bg-white border-[#5252] text-black'} border-b border-solid  z-20`}>
            <div className="flex items-center h-[80%] w-[95%] justify-between pl-3 md:justify-end gap-5">
                <Menu className="md:hidden" onClick={openNav}/>
                <div className="flex items-center w-[70%] md:w-[50%] justify-between md:justify-end gap-5">
                    <ModalSelect
                     icon={icon.icon}
                     text={icon.text}
                     setShow={setShow}
                     theme={theme}
                    />
                    <Provider
                    showProviders={showProviders}
                    setProviders={setProviders}
                    theme={theme}
                    />
                    <Theme
                    listItem={listItem}
                    theme={theme}
                    setTheme={setTheme}
                    />
            </div>
            </div>
           
        </header>
    )
}

export default Header