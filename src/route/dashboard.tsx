import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext } from "react"
import { ShowContext } from "../components/context-provider"
const DashBoard = () => {
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
    return(
        <DashInfo/>
    )
}

export default DashBoard