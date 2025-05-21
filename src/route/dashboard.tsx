import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext, useState } from "react"
import { ShowContext } from "../components/context-provider";
import axios from "axios";
import checkAuth from "../components/checkauth";
const DashBoard = () => {
    const [ userDetails , setUserDetails ] = useState<any>(0)
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData , theme } = myContext;
    useEffect(() => {
        if (userData.token) {
            const expiry = Date.now() + 60 * 60 * 1000;
            localStorage.setItem("token", userData.token);
            localStorage.setItem("token_expiry", expiry.toString());
        } else {
            const token = localStorage.getItem("token");
            const expiry = localStorage.getItem("token_expiry");
            if (token && expiry && Date.now() > parseInt(expiry, 10)) {
                localStorage.removeItem("token");
                localStorage.removeItem("token_expiry");
                // Optionally: redirect to login
            }
        }
       
    },[userData]);



    useEffect(() => {
        const getUserData = async () => {
            const response = await axios.get('https://textflex-axd2.onrender.com/api/orders', { 
                params: { userId: userData.userId  }
            });
            const purchaseArray = response.data.filter((item:any) => (
                item.purchased_number !== null
            ))
            console.log(response.data)
            setUserDetails(purchaseArray);
        }
        if (checkAuth()) {
            getUserData();
        } 
    },[])
    return(
        <DashInfo
         info={userDetails}
         theme={theme}
        />
    )
}

export default DashBoard