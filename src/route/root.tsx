import { useState } from "react";
import SideNav from "../components/nav/sideNav"
import Header from "../ui/header";

import { Outlet } from "react-router-dom";


const Root = () => {
   const [ isShow , setIsShow ] = useState<boolean>(false)
    return(
        <div className="h-auto min-h-[100vh] overflow-hidden w-full">
            <Header
             setIsShow={setIsShow}
            />
            <div className="w-full h-auto min-h-[85vh] mt-5  flex gap-5">
             <SideNav
              show={isShow}
              setIsShow={setIsShow}
             />
             <div className=" relative w-[90%] mx-auto md:w-[76%] md:left-[10%]">
              <Outlet/>
             </div> 
            
            </div>
            
        </div>
    )
}

export default Root