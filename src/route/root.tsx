import SideNav from "../components/nav/sideNav"
import Header from "../ui/header";

import { Outlet } from "react-router-dom";


const Root = () => {
   
    return(
        <div className="h-auto min-h-[100vh] overflow-hidden w-full">
            <Header/>
            <div className="w-full h-auto min-h-[85vh] mt-5  flex gap-5">
             <SideNav/>
             <div className=" relative w-[90%] mx-auto md:w-[76%] md:left-[10%]">
              <Outlet/>
             </div> 
            
            </div>
            
        </div>
    )
}

export default Root