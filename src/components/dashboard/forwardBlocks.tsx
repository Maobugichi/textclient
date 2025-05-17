interface ForwardBlocksProps {
    text:string;
    forward:string;
    theme:boolean
}

const ForwardBlocks:React.FC<ForwardBlocksProps> = ({ text , forward , theme}) => {
    return(
        <div className={`w-full md:w-[49.5%] p-3  border border-solid  rounded-md ${theme ? 'bg-transparent text-white border-gray-500' :'bg-white border-[#5252]'}`}>
            <p>
                {text}
            </p>
            <p className="hover:underline text-blue-500 cursor-pointer text-sm">{forward}</p>
        </div>
    )
}

export default ForwardBlocks