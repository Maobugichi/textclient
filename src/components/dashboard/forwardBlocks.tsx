interface ForwardBlocksProps {
    text:string;
    forward:string;
}

const ForwardBlocks:React.FC<ForwardBlocksProps> = ({ text , forward}) => {
    return(
        <div className="w-full md:w-[49.5%] p-3 border border-solid border-[#5252] rounded-md bg-white">
            <p>
                {text}
            </p>
            <p className="hover:underline text-blue-500 cursor-pointer">{forward}</p>
        </div>
    )
}

export default ForwardBlocks