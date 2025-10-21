import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"

import PopUp from "../components/popup/pop-up"
import { useAuth } from "../context/authContext"
import { useUserOrdersPolling } from "../components/receiveSMS/hook/useOrders"


const RentNumber = () => {
    
     const [ isShow , setIsShow ] = useState<boolean>(false);
     const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
    });
    console.log(numberInfo)
   
    const { user:userData } = useAuth();
    const { data: orders = [], isLoading } = useUserOrdersPolling(userData?.userId);
    if (isLoading) return <p>Loading...</p>;
    return(
        <div className={`flex flex-col gap-4 h-fit pb-10  w-full overflow-hidden dark:text-white  text-black`}>
            <PopUp
             setIsShow={setIsShow}
             show={isShow}
           
            />
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
             <RentInput
              balance=""
              setNumberInfo={setNumberInfo}
              setIsShow={setIsShow}
              tableValue={orders}
             />
             <TableCont
              
              action="Action"

             />
            </div>
        </div>
    )
}

export default RentNumber