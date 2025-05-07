import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext, useState } from "react"
import { ShowContext } from "../components/context-provider";
import axios from "axios";
const DashBoard = () => {
    const [ purchasedNumber , setPurchasedNumber ] = useState<any>(0)
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
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
            
            setPurchasedNumber(purchaseArray.length);
        }
        getUserData();
    },[])
    return(
        <DashInfo
         info={purchasedNumber}
        />
    )
}

export default DashBoard