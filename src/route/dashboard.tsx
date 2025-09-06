import DashInfo from "../components/dashboard/dashInfo"
import { useEffect , useContext, useState, useRef } from "react"
import { ShowContext } from "../components/context-provider";
import axios from "axios";
import checkAuth from "../components/checkauth";
import { useBalance } from "../balance";
const DashBoard = () => {

    const { refreshBalance } = useBalance();
    const [ userDetails , setUserDetails ] = useState<any>(0)
     const [ transactionHistory , setTransactionHistory ] = useState<any>([])
    const myContext = useContext(ShowContext)
    const [ redo ,setRedo ] = useState<any>(false)
    const [ref, setRef] = useState<any>(null);
    const count = useRef(0);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData , theme } = myContext;
    

   

    useEffect(() => {
        const myRef = localStorage.getItem('ref');
        if (myRef) {
            setRef(myRef)
        }
    },[])

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
            }
        }
    },[userData]);

    useEffect(() => {
        const getUserData = async () => {
            const response = await axios.get('https://api.textflex.net/api/orders', { 
                params: { userId: userData.userId  }
            });
            const purchaseArray = response.data.data.filter((item:any) => (
                item.purchased_number !== null
            ));

             const length = purchaseArray.length
             localStorage.setItem("arr-length", JSON.stringify(length))
             setUserDetails(purchaseArray);
             await refreshBalance()  
        }
        if (checkAuth()) {
            getUserData();
        } 
    },[redo])

   
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('reference');
      setRef(refParam);   
      axios.get('https://api.textflex.net/api/get-rate')
      .then(res => {
        console.log(res)
         localStorage.setItem("rate",JSON.stringify(res.data[0]))
      })

      axios.get("https://api.textflex.net/api/costs")
      .then(res => {
      
        localStorage.setItem("cost_diff",JSON.stringify(res.data[0]))
      })
      localStorage.setItem('ref', refParam || '');
      getTransaction()
    },[])

     async function getTransaction() {
        const response = await axios.get('https://api.textflex.net/api/get-transaction', {
            params:{
            user_id:userData.userId
            }
        });
        const newData = response.data.filter((item:any) => (
            item.user_id == userData.userId
        ))
        
        
         setTransactionHistory(newData)
         await refreshBalance()  
        }
   

    useEffect(() => {
        const mxTrials = 15;
        async function callback() {
            try {
                 const response = await axios.post('https://api.textflex.net/api/squad-callback',{transaction_ref: ref});
                  if (response.data?.data === 'success') {
                    await refreshBalance()
                    await getTransaction()
                    setRedo(true)
                    localStorage.removeItem('ref')
                    const newUrl = window.location.origin + window.location.pathname + window.location.hash;
                    window.history.replaceState({}, '', newUrl);
                    clearInterval(myInterval)
                  }
                 console.log(response.data)
            } catch(err) {
                 console.error('Callback error:', err);
            }
            count.current++;
        }
        let myInterval: ReturnType<typeof setInterval>;
        if (ref) {
          myInterval =  setInterval(() => {
            if (count.current == mxTrials) {
                clearInterval(myInterval)
            } else {
                 callback()
            }
           }, 3000);
           return () => clearInterval(myInterval)
        }
    },[ref]);

    
  
    return(
        <DashInfo
         info={userDetails}
         theme={theme}
         transaction={transactionHistory}
         setTransaction={setTransactionHistory}
        
         userData={userData}
        />
    )
}

export default DashBoard