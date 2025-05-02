const Table = () => {
    return (
      <div className="overflow-x-auto  md:w-full min-h-[130px] h-fit rounded-sm bg-white border border-solid border-[#5252]">
        <table className=" table-auto w-[500px] md:w-full border-collapse ">
          <thead className="h-9 md:text-sm text-[11px]">
            <tr>
              <th className=" border-b  border-solid border-[#5252] font-light">Order ID</th>
              <th className=" border-b  border-solid border-[#5252] font-light">Phone Number</th>
              <th className=" border-b  border-solid border-[#5252] font-light">Country</th>
              <th className=" border-b  border-solid border-[#5252] font-light">Expiration</th>
              <th className=" border-b  border-solid border-[#5252] font-light">Amount</th>
              <th className="border-b  border-solid border-[#5252] font-light">Status</th>
              <th className=" border-b  border-solid border-[#5252] font-light">Actions</th>
            </tr>
          </thead>
          <tbody>
             No Results
           
          </tbody>
        </table>
      </div>
    )
}

export default Table