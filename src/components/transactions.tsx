import { MessageSquare } from 'lucide-react';

interface TransactionProps {
    service:string;
    date:string;
    amount:string;
    status:string;
    color:string
}

const Transactions:React.FC<TransactionProps> = ({ service , date , amount , status , color}) => {
    return(
        <div className='flex gap-5'>
            <div className='bg-[#EEF4FD] rounded-full h-10 grid place-items-center w-10'>
               <MessageSquare/>
            </div>
            <div className='flex flex-col gap-1  w-[200px]'>
                <p className='font-semibold'>{service}</p>
                <span className='font-light text-[12px]'>{date}</span>
            </div>
            <div className='w-[100px]'>
                <p className='font-semibold'>₦{amount}</p>

                <p  className='text-[12px] flex items-center gap-1'><span className={`${color} h-2 w-2 rounded-full`}></span>{status}</p>
            </div>
        </div>
    )
}

export default Transactions