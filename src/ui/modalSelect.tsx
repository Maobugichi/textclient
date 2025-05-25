import { Dispatch, SetStateAction } from 'react';

interface ModalSelectProps {
    icon:string;
    text:string;
    setShow:Dispatch<SetStateAction<boolean>>;
    theme:boolean
}



const ModalSelect:React.FC<ModalSelectProps> = ({ icon , text , setShow , theme}) => {
    const handleShow = () => {
        console.log('hello')
        setShow(true)
       
    }
    return(
        <div onClick={handleShow} className={`${theme ? 'bg-[#27272a]' : 'bg-zinc-100'} h-5 cursor-pointer w-20 rounded-full flex  items-center justify-center gap-2`}>
           <span className='text-[11px] md:text-sm'>{icon}</span>
           <p className='text-[10px] md:text-xs'>{text}</p>
        </div>
    )
}

export default ModalSelect