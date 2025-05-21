import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext, useState, useRef } from "react"
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
            setUserDetails(purchaseArray);
        }
        if (checkAuth()) {
            getUserData();
        } 
    },[])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refParam = params.get('reference');
        setRef(refParam);
        console.log('helllllll')
        console.log(params)
    },[])

    useEffect(() => {
        console.log(ref)
        const mxTrials = 15;
        const count = useRef(0);
        async function callback() {
            try {
                 const response = await axios.post('https://textflex-axd2.onrender.com/api/squad-callback',{transaction_ref: ref});
                 console.log(response.data)
            } catch(err) {
                 console.error('Callback error:', err);
            }
            count.current++;
        }
        if (ref) {
          const myInterval =  setInterval(() => {
            if (count.current == mxTrials) {
                clearInterval(myInterval)
            } else {
                 callback()
            }
           
           }, 10000);
           return () => clearInterval(myInterval)
        }
    },[ref])
    return(
        <DashInfo
         info={userDetails}
         theme={theme}
        />
    )
}

export default DashBoard