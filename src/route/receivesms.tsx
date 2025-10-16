import PopUp from "../components/popup/pop-up";
import Input from "../components/receiveSMS/input";
import TableCont from "../components/table-cont";
import { useEffect, useState , useContext } from "react";
import { ShowContext } from "../components/context-provider";
import checkAuth from "../components/checkauth";
import { Card } from "../components/ui/card";
import api from "../lib/axios-config";

const ReceiveSms = () => {
    const [ tableValues , setTableValues ] = useState<any>('');
    const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
        sms:''
    });
    const [ req_id , setReqId ] = useState<any>('')
    const [ isShow , setIsShow ] = useState<boolean>(false);
    const [ error , setIsError ] = useState<boolean>(false);
    const [ errorInfo , setErrorInfo ] = useState<any>('');
    const [ isCancel , setIsCancel ] = useState<boolean>(false)
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData , theme } = myContext;

    useEffect(() => {
        const getUserData = async () => {
            const response = await api.get('https://api.textflex.net/api/orders', { 
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
        <div className={`w-full overflow-hidden font-montserrat md:grid  flex flex-col gap-4 h-fit ${theme ? 'text-white' : 'text-black'}`}>
            <PopUp
             
             show={isShow}
             setIsShow={setIsShow}
             error={error}
             errorInfo={errorInfo}
             setIsError={setIsError}
             userId={userData.userId}
             email={userData.userEmail}
             setIsCancel={setIsCancel}
             cancel={isCancel}
            />
             <h2 className="font-semibold text-left text-2xl">Receive SMS</h2>
            <Card className="border-none shadow-none grid md:grid-cols-3 grid-cols-1  w-[90%] md:w-full mx-auto ">
                <Input
                 tableValues={tableValues}
                 numberInfo={numberInfo}
                 setNumberInfo={setNumberInfo}
                 setReqId={setReqId}
                 setIsShow={setIsShow}
                 req_id={req_id}
                 setErrorInfo={setErrorInfo}
                 setIsError={setIsError}
                 theme={theme}
                 cancel={isCancel}
                />
                <TableCont
                 tableValues={tableValues}
                 theme={theme}
                />
            </Card>
        </div>
       
    )
}

export default ReceiveSms