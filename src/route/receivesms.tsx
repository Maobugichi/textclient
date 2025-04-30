import Input from "../components/receiveSMS/input";

import TableCont from "../components/table-cont";

const ReceiveSms = () => {
   
    return(
        <div className="w-full">
             <h2 className="font-semibold text-2xl">Receive SMS</h2>
            <div className=" w-full h-auto min-h-[80vh] flex justify-between">
                <Input/>
                <TableCont/>
            </div>
        </div>
       
    )
}

export default ReceiveSms