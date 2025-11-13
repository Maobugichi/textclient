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
   
    const [ isCancel , setIsCancel ] = useState<boolean>(false)
   
    console.log(setIsCancel)
    const { user:userData } = useAuth();
    const { data: orders = [], isLoading } = useUserOrdersPolling(userData?.userId);
    if (isLoading) return <p>Loading...</p>;
      
    return(
        <div className={`w-full overflow-hidden font-montserrat md:grid  flex flex-col gap-4 h-fit  dark:text-white  text-black`}>
           
             <h2 className="font-semibold text-left text-3xl">Receive SMS</h2>
            <Card className="border-none shadow-none dark:bg-[#242424] grid md:grid-cols-3 grid-cols-1  w-[90%] md:w-full mx-auto ">
                <Input
                 tableValues={orders}
                 numberInfo={numberInfo}
                 setNumberInfo={setNumberInfo}
                 setReqId={setReqId}
                 req_id={req_id}
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