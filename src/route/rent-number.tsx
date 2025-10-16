import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"
import { useContext , useState , useEffect } from "react"
import { ShowContext } from "../components/context-provider"
import PopUp from "../components/pop-up"
import axios from "axios"
import checkAuth from "../components/checkauth"
const RentNumber = () => {
     const myContext = useContext(ShowContext)
      if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
     const { userData } = myContext;
     const [ isShow , setIsShow ] = useState<boolean>(false);
     const [ tableValues , setTableValues ] = useState<any>('');
     const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
    });
    console.log(numberInfo)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { theme } = myContext;

     useEffect(() => {
        const getUserData = async () => {
            const response = await axios.get('https://api.textflex.net/api/orders', { 
                params: { userId: userData.userId  }
            });
            const purchaseArray = response.data.data.filter((item:any) => (
                item.purchased_number !== null
            ))
            setTableValues(purchaseArray);
        }
        if (checkAuth()) {
            setInterval(() => {
                getUserData();
            }, 5000);    
        }
    },[])
    return(
        <div className={`flex flex-col gap-4 h-fit pb-10  w-full overflow-hidden ${theme ? 'text-white' : 'text-black'}`}>
            <PopUp
             setIsShow={setIsShow}
             show={isShow}
           
            />
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5">
             <RentInput
              theme={theme}
              balance=""
              setNumberInfo={setNumberInfo}
              setIsShow={setIsShow}
              tableValue={tableValues}
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