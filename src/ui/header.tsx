import { modalOptions , listItem } from "../action";
import Modal from "../components/modal";
import ModalItem from "../components/modalItems";
import ModalSelect from "./modalSelect";
import Provider from "./provider";
import { useState } from "react";
import Theme from "./theme";
import { Menu } from "lucide-react";


interface HeaderProps {
     setIsShow: React.Dispatch<React.SetStateAction<any>>;
}

const Header:React.FC<HeaderProps> = ({ setIsShow }) => {
    const isItem = modalOptions;
    const [ isShow , setShow] = useState(false);
    const modalDetails = modalOptions.map((option, i) => (
            <ModalItem
             icon={option.icon}
             text={option.text}
             indicator={option.indicator}
             percentage={option.percentage}
             custom={i}
             delay={ i * .2 + .2}

            />
    ));
    const [ showProviders, setProviders ] = useState(false);
    function openNav() {
        setIsShow(true)
    }
    return(
        <header className="h-16 grid place-items-center bg-white border-b border-solid border-[#5252]">
            <Modal
             setShow={setShow}
             isShow={isShow}
            >
                {modalDetails}
            </Modal>
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