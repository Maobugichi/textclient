import PopUp from "../components/pop-up";
import Input from "../components/receiveSMS/input";
import TableCont from "../components/table-cont";
import { useEffect, useState , useContext } from "react";
import { ShowContext } from "../components/context-provider";
import axios from "axios";
const ReceiveSms = () => {
    const [ tableValues , setTableValues ] = useState<any>('');
    const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
        sms:''
    });
    const [ isShow , setIsShow ] = useState<boolean>(false);
    const [ error , setIsError ] = useState<boolean>(false);
    const [ errorInfo , setErrorInfo ] = useState<any>('')
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;

    useEffect(() => {
        const getUserData = async () => {
            const response = await axios.get('https://textflex-axd2.onrender.com/api/orders', { 
                params: { userId: userData.userId  }
            });
            const purchaseArray = response.data.filter((item:any) => (
                item.purchased_number !== null
            ))
            //console.log(purchaseArray)
            setTableValues(purchaseArray);
        }

        setInterval(() => {
            getUserData();
        }, 5000);
        
    },[])
    return(
        <div className="w-full md:grid flex flex-col gap-4 h-fit">
            <PopUp
             numberInfo={numberInfo}
             show={isShow}
             setIsShow={setIsShow}
             error={error}
             errorInfo={errorInfo}
             setIsError={setIsError}
            />
             <h2 className="font-semibold text-2xl">Receive SMS</h2>
            <div className=" w-full h-fit  min-h-[65vh]  md:min-h-[80vh] flex flex-col md:flex-row gap-4">
                <Input
                 tableValues={tableValues}
                 setTableValues={setTableValues}
                 setNumberInfo={setNumberInfo}
                 setIsShow={setIsShow}
                 setErrorInfo={setErrorInfo}
                 setIsError={setIsError}
                />
                <TableCont
                 tableValues={tableValues}
                />
            </div>
        </div>
       
    )
}

export default ReceiveSms