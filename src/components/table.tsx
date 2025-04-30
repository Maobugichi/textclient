const Table = () => {
    return (
      <div className="overflow-x-auto w-[65%] min-h-[130px] h-fit rounded-sm bg-amber-200 border border-red-500">
        <table className=" table-auto w-full border-collapse ">
          <thead className="">
            <tr>
              <th className=" border-b font-light">Order ID</th>
              <th className=" border-b font-light">Phone Number</th>
              <th className=" border-b font-light">Country</th>
              <th className=" border-b font-light">Expiration</th>
              <th className=" border-b font-light">Amount</th>
              <th className=" border-b font-light">Status</th>
              <th className=" border-b font-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" border-b">Data 1</td>
              <td className="border-b">Data 2</td>
              <td className=" border-b">Data 3</td>
              <td className=" border-b">Data 4</td>
              <td className=" border-b">Data 5</td>
              <td className=" border-b">Data 4</td>
              <td className=" border-b">Data 5</td>
            </tr>
           
          </tbody>
        </table>
      </div>
    )
}

export default Table