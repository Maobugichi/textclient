import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext } from "react"
import { ShowContext } from "../components/context-provider"
const DashBoard = () => {
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    useEffect(() => {
        //console.log(userData)
        localStorage.setItem("token", userData.token);
    },[userData]);
    return(
        <DashInfo/>
    )
}

export default DashBoard