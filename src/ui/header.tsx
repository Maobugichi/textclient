import { modalOptions , listItem } from "../action";
import Modal from "../components/modal";
import ModalItem from "../components/modalItems";
import ModalSelect from "./modalSelect";
import Provider from "./provider";
import { useState } from "react";
import Theme from "./theme";

const Header = () => {
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
    return(
        <header className="h-16 grid place-items-center bg-white border-b border-solid border-[#5252]">
            <Modal
             setShow={setShow}
             isShow={isShow}
            >
                {modalDetails}
            </Modal>
            <div className="flex items-center h-[80%] w-[95%]  justify-end gap-5">
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
           
        </header>
    )
}

export default Header