import { useState } from "react";
import SideNav from "../components/nav/sideNav"
import Header from "../ui/header";
import Modal from "../components/modal";
import ModalItem from "../components/modalItems";
import { modalOptions } from "../action";
import { Outlet } from "react-router-dom";


const Root = () => {
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
        <div className="h-fit min-h-[90vh]   w-full">
            <Header
             setIsShow={setIsShow}
             setShow={setShow}
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
             />
             <div className=" relative w-[95%] mx-auto  md:w-[76%] top-15  md:left-[10%]">
              <Outlet/>
             </div> 
            
            </div>
            
        </div>
    )
}

export default Root