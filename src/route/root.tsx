import SideNav from "../components/nav/sideNav"
import Header from "../ui/header";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Root = () => {
    useEffect(() => {
        /*axios.get('/api/data')
        .then(function(response) {
         console.log(response.data[0].phoneNumber)
        })
        .catch(function (error) {
         console.log(error)
        })
        .finally(function () {
 
        })*/

        
    },[])
   
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