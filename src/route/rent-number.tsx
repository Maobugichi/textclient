import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"

const RentNumber = () => {
    return(
        <div className="md:grid flex flex-col gap-4 w-full ">
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5">
             <RentInput/>
             <TableCont/>
            </div>
        </div>
    )
}

export default RentNumber