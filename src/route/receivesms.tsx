import Input from "../components/receiveSMS/input";
import TableCont from "../components/table-cont";
import { useState } from "react";
const ReceiveSms = () => {
    const [ tableValues , setTableValues ] = useState<any>('')
    return(
        <div className="w-full md:grid flex flex-col gap-4">
             <h2 className="font-semibold text-2xl">Receive SMS</h2>
            <div className=" w-full h-fit  min-h-[65vh]  md:min-h-[80vh] flex flex-col md:flex-row justify-between">
                <Input
                 tableValues={tableValues}
                 setTableValues={setTableValues}
                />
                <TableCont
                 tableValues={tableValues}
                />
            </div>
        </div>
       
    )
}

export default ReceiveSms