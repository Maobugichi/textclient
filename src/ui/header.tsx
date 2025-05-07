import { modalOptions , listItem } from "../action";
import ModalSelect from "./modalSelect";
import Provider from "./provider";
import { useState } from "react";
import Theme from "./theme";
import { Menu } from "lucide-react";


interface HeaderProps {
     setIsShow: React.Dispatch<React.SetStateAction<any>>;
     show?:boolean;
     setShow:React.Dispatch<React.SetStateAction<boolean>>;
}

const Header:React.FC<HeaderProps> = ({ setIsShow ,  setShow }) => {
    const isItem = modalOptions;
    //const [ isShow , setShow] = useState(false);
   
    const [ showProviders, setProviders ] = useState(false);
    function openNav() {
        setIsShow(true)
    }
    return(
        <header className="fixed w-full top-0 h-16 grid place-items-center bg-white border-b border-solid border-[#5252] z-20">
            
            <div className="flex items-center h-[80%] w-[95%] justify-between pl-3 md:justify-end gap-5">
                <Menu className="md:hidden" onClick={openNav}/>
                <div className="flex items-center w-[70%] md:w-[50%] justify-between md:justify-end gap-5">
                    <ModalSelect
                    icon={isItem[0].icon}
                    text={isItem[0].text}
                    setShow={setShow}
                    />
                    <Provider
                    showProviders={showProviders}
                    setProviders={setProviders}
                    />
                    <Theme
                    listItem={listItem}
                    />
            </div>
            </div>
           
        </header>
    )
}

export default Header