import Table from "../components/table"
import RentInput from "../components/rentNumber/rentInput"

const RentNumber = () => {
    return(
        <div className="flex bg-green-200 justify-between">
           <RentInput/>
           <Table/>
        </div>
    )
}

export default RentNumber