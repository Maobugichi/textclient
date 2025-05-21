import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext, useState } from "react"
import { ShowContext } from "../components/context-provider";
import axios from "axios";
import checkAuth from "../components/checkauth";
const DashBoard = () => {
    const [ userDetails , setUserDetails ] = useState<any>(0)
    const myContext = useContext(ShowContext)
     const [ref, setRef] = useState<any>(null);
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

    useEffect(() => {
        const hash = window.location.hash; 
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        setRef(params.get('ref'));
    },[])

    useEffect(() => {
        const mxTrials = 15;
        let count = 0;
        async function callback() {
            const response = await axios.post('https://textflex-axd2.onrender.com/api/squad-callback',ref);
            count++
            console.log(response.data)
        }
        if (ref) {
          const myInterval =  setInterval(() => {
            if (count == mxTrials) {
                clearInterval(myInterval)
            }
            callback()
           }, 10000);


           return () => clearInterval(myInterval)
        }
    })
    return(
        <DashInfo
         info={userDetails}
         theme={theme}
        />
    )
}

export default DashBoard