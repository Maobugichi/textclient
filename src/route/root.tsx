import { useState , useContext } from "react";
import SideNav from "../components/nav/sideNav"
import Header from "../ui/header";
import Modal from "../components/modal";
import ModalItem from "../components/modalItems";
import { modalOptions } from "../action";
import { Outlet } from "react-router-dom";
import { ShowContext } from "../components/context-provider";
import TelIcon from "../ui/telicon";

const Root = () => {
    const myContext = useContext(ShowContext)
   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
   const { theme , setTheme , userData } = myContext;
   const [ isShow , setIsShow ] = useState<boolean>(false);
   const [ show , setShow] = useState<boolean>(false);

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
    return(
        <main className={`h-fit font-montserrat min-h-[100vh] relative top-14 pt-3  w-full dark:bg-[#242424] bg-white`}>
            <Header
             setIsShow={setIsShow}
             setShow={setShow}
             theme={theme}
             setTheme={setTheme}
             userData={userData}
            />
            <Modal
             setShow={setShow}
             isShow={show}
            >
                {modalDetails}
            </Modal>
            <div className="w-full h-auto min-h-[85vh] mt-5  flex gap-5">
             <SideNav
              show={isShow}
              setIsShow={setIsShow}
              theme={theme}
             />
             <div className={`relative w-[95%] mx-auto   md:w-[76%]  md:left-[10%]  dark:bg-[#242424] bg-white `}>
              <Outlet
              
              />
             </div> 
            
            </div>
            <TelIcon/>
        </main>
    )
}

export default Root