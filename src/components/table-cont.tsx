import Table from "./table"

interface TableContProps {
    tableValues?:any;
    theme:boolean;
    action?:string;
}

const TableCont:React.FC<TableContProps> = ({tableValues , theme , action}) => {
    return(
        <div className="md:col-span-2 w-full  flex flex-col gap-4 overflow-auto hide-scrollbar">
            <h4 className="font-semibold text-md">Recent SMS Orders</h4>
            <Table
             tableValue={tableValues}
             theme={theme}
             action={action}
            />
        </div>
    )
}

export default TableCont