import Table from "./table"

const TableCont = () => {
    return(
        <div className=" w-[65%]  flex flex-col gap-4">
            <h4 className="font-semibold text-md">Recent SMS Orders</h4>
            <Table/>
        </div>
    )
}

export default TableCont