import PopUp from "../components/popup/pop-up";
import Input from "../components/receiveSMS/input";
import TableCont from "../components/table-cont";
import {  useState } from "react";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/authContext";
import { useUserOrdersPolling } from "../components/receiveSMS/hook/useOrders";

const ReceiveSms = () => {
    const [ numberInfo , setNumberInfo ] = useState<any>({
        number:'',
        sms:''
    });
    const [ req_id , setReqId ] = useState<any>('')
    const [ isShow , setIsShow ] = useState<boolean>(false);
    const [ error , setIsError ] = useState<boolean>(false);
    const [ errorInfo , setErrorInfo ] = useState<any>('');
    const [ isCancel , setIsCancel ] = useState<boolean>(false)
   
    const { user:userData } = useAuth();
    const { data: orders = [], isLoading } = useUserOrdersPolling(userData?.userId);
    if (isLoading) return <p>Loading...</p>;
      
    return(
        <div className={`w-full overflow-hidden font-montserrat md:grid  flex flex-col gap-4 h-fit  dark:text-white  text-black`}>
            <PopUp
             
             show={isShow}
             setIsShow={setIsShow}
             error={error}
             errorInfo={errorInfo}
             setIsError={setIsError}
             userId={userData?.userId}
             email={userData?.userEmail}
             setIsCancel={setIsCancel}
             cancel={isCancel}
            />
             <h2 className="font-semibold text-left text-3xl">Receive SMS</h2>
            <Card className="border-none shadow-none dark:bg-[#242424] grid md:grid-cols-3 grid-cols-1  w-[90%] md:w-full mx-auto ">
                <Input
                 tableValues={orders}
                 numberInfo={numberInfo}
                 setNumberInfo={setNumberInfo}
                 setReqId={setReqId}
                 setIsShow={setIsShow}
                 req_id={req_id}
                 setErrorInfo={setErrorInfo}
                 setIsError={setIsError}
                
                 cancel={isCancel}
                />
                <TableCont
                 tableValues={orders}
                
                />
            </Card>
        </div>
       
    )
}

export default ReceiveSms