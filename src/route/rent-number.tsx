import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"
import { useContext , useState , useEffect } from "react"
import { ShowContext } from "../components/context-provider"
import PopUp from "../components/popup/pop-up"
import axios from "axios"
import { useAuth } from "../context/authContext"
import { useUserOrdersPolling } from "../components/receiveSMS/hook/useOrders"


const RentNumber = () => {
     const myContext = useContext(ShowContext)
     if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
     const { theme } = myContext;
     const [ isShow , setIsShow ] = useState<boolean>(false);
     const [ tableValues , setTableValues ] = useState<any>('');
     const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
    });
    console.log(numberInfo)
   
    const { user:userData } = useAuth();
    const { data: orders = [], isLoading } = useUserOrdersPolling(userData?.userId);
    if (isLoading) return <p>Loading...</p>;
    return(
        <div className={`flex flex-col gap-4 h-fit pb-10  w-full overflow-hidden ${theme ? 'text-white' : 'text-black'}`}>
            <PopUp
             setIsShow={setIsShow}
             show={isShow}
           
            />
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
             <RentInput
              theme={theme}
              balance=""
              setNumberInfo={setNumberInfo}
              setIsShow={setIsShow}
              tableValue={orders}
             />
             <TableCont
              theme={theme}
              action="Action"

             />
            </div>
        </div>
    )
}

export default RentNumber