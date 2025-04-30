import Table from "../components/table";
import Input from "../components/receiveSMS/input";

const ReceiveSms = () => {
   
    return(
        <div className="bg-red-200 w-full h-auto min-h-[80vh] flex justify-between">
            <Input/>
            <Table/>
        </div>
    )
}

export default ReceiveSms