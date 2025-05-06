import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"

const RentNumber = () => {
    return(
        <div className="flex flex-col gap-4 h-fit pb-10  w-full overflow-hidden">
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5">
             <RentInput/>
             <TableCont/>
            </div>
        </div>
    )
}

export default RentNumber