import Table from "../components/table"
import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"

const RentNumber = () => {
    return(
        <div className="grid  gap-5">
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="flex justify-between w-full gap-5">
             <RentInput/>
             <TableCont/>
            </div>
        </div>
    )
}

export default RentNumber