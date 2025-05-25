import RentInput from "../components/rentNumber/rentInput"
import TableCont from "../components/table-cont"
import { useContext } from "react"
import { ShowContext } from "../components/context-provider"
const RentNumber = () => {
     const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { theme } = myContext;
    return(
        <div className={`flex flex-col gap-4 h-fit pb-10  w-full overflow-hidden ${theme ? 'text-white' : 'text-black'}`}>
            <h2 className="font-semibold text-2xl">Rent Number</h2>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5">
             <RentInput
              theme={theme}
             />
             <TableCont
              theme={theme}
              action="Action"
             />
            </div>
        </div>
    )
}

export default RentNumber