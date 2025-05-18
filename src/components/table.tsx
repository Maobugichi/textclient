import { useEffect, useState } from "react"

interface TableProps {
   tableValue?:any
   theme:boolean
}


const Table:React.FC<TableProps> = ({tableValue , theme}) => {
  const [ tableContent , setTableContent ] = useState<any>({
    ref:'',
    number:'',
    code:'',
    country:'',
    service:'',
    provider:'',
    staus:''
  });
  useEffect(() => {
    if (tableValue) {
      const safeTableValue = Array.isArray(tableValue) ? tableValue : [];
      const myTable = safeTableValue?.map((item:any) => (
        <p className="h-8 text-center grid place-content-center overflow-x-auto">
          {item.reference_code}
        </p>
       
      ))

      const number = safeTableValue?.map((item:any) => (
          <p className="h-8 text-center overflow-x-auto  grid place-content-center">{item.purchased_number}</p>
      ));
      const country = safeTableValue.map((item:any) => (
          <p className="h-8 p-4 w-full whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.country}</p>
      ))
      const code = safeTableValue.map((item:any) => (
        <p className="h-8  w-full whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.sms}</p>
      ))
      const status = safeTableValue.map((item:any) => (
        <p className="h-8  w-full whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.status}</p>
      ))  
      const service = safeTableValue.map((item:any) => (
        <p className="h-8   w-full p-4 whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.service}</p>
      ))   
      const provider = safeTableValue.map((item:any) => (
        <p className="h-8  w-full p-2 whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.provider}</p>
      ))      
       const amount = safeTableValue.map((item:any) => (
        <p className="h-8  w-full p-2 whitespace-nowrap overflow-x-auto hide-scrollbar flex items-center">{item.amount}</p>
      ))      
      setTableContent({
        ref:myTable,
        number:number,
        code:code,
        country:country,
        service:service,
        provider:provider,
        status:status,
        amount:amount
      })
    }
  },[tableValue])
    return (
       <>
        {tableValue ? (
          <div className={`w-full flex flex-row border border-solid rounded-sm ${theme ? 'border-blue-200' : 'border-[#5252]'}  h-fit max-h-[290px] overflow-auto hide-scrollbar`}>
            <div className="w-fit min-w-[85px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'}  flex items-center  text-[11px] md:text-sm font-light pl-3`}>Order ID</div>
              <div className={`text-[12px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.ref}</div>
            </div>
            <div className="w-fit min-w-[80px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Number</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.number}</div>
            </div>
            <div className="w-fit min-w-[80px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Code</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.code}</div>
            </div>
            <div className="w-fit min-w-[82px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} text-[11px] flex items-center md:text-sm font-light pl-3`}>Country</div>
              <div className={`text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.country}</div>
            </div>
            <div className="w-fit min-w-[90px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Service</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.service}</div>
            </div>
            <div className="w-fit min-w-[70px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Provider</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.provider}</div>
            </div>
            <div className="w-fit min-w-[80px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Amount</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.amount}</div>
            </div>
            <div className="w-fit min-w-[80px]">
              <div className={`h-9 border-b ${theme ? 'border-blue-200' : 'border-[#5252]'} flex items-center text-[11px] md:text-sm font-light pl-3`}>Status</div>
              <div className={`flex flex-col text-[11px] border-r ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>{tableContent.status}</div>
            </div>
           
          </div>
          ) : (
            <table className={`table-auto w-full border-collapse border border-solid h-fit min-h-[150px] rounded-lg  ${theme ? 'border-blue-200' : 'border-[#5252]'}`}>
              <thead className="h-9 text-[11px] md:text-sm">
                <tr className="h-9 ">
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Order ID</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Number</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Code</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Country</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Service</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Provider</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Amount</th>
                    <th className={ `border-b  border-solid ${theme ? 'border-blue-200' : 'border-[#5252]'} font-light pl-3 w-fit min-w-[80px]`}>Status</th>
                  </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm pl-3" colSpan={8}>No result.</td>
                </tr>
              </tbody>
            </table>
          )}

       </>
    ) 
}

export default Table