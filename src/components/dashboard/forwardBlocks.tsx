import { Link } from "react-router-dom";

interface ForwardBlocksProps {
    text:string;
    forward:string;
    theme:boolean;
    link:string
}

const ForwardBlocks:React.FC<ForwardBlocksProps> = ({ text , forward , theme , link}) => {
    return(
       <Link className="w-full md:w-[49.5%]" to={link}>
        <div className={`w-full  p-3  border border-solid  rounded-md ${theme ? 'bg-transparent text-white border-gray-500' :'bg-white border-[#5252]'}`}>
            <p>
                {text}
            </p>
            <p className="hover:underline text-blue-500 cursor-pointer text-sm">{forward}</p>
        </div>
       </Link>  
    )
}

export default ForwardBlocks