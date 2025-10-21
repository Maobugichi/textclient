import Table from "./table"

interface TableContProps {
    tableValues?:any;
  
    action?:string;
}

const TableCont:React.FC<TableContProps> = ({tableValues , action}) => {
    return(
        <div className="md:col-span-2 w-full  flex flex-col gap-4 overflow-auto hide-scrollbar">
            <h4 className="font-semibold text-md">Recent SMS Orders</h4>
            <Table
             tableValue={tableValues}
             action={action}
            />
        </div>
    )
}

export default TableCont