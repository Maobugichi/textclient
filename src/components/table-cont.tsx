import Table from "./table"

interface TableContProps {
    tableValues?:any;
}

const TableCont:React.FC<TableContProps> = ({tableValues}) => {
    return(
        <div className="  overflow-x-scroll md:w-[65%]  flex flex-col gap-4">
            <h4 className="font-semibold text-md">Recent SMS Orders</h4>
            <Table
             tableValue={tableValues}
            />
        </div>
    )
}

export default TableCont