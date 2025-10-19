
import { Link } from "react-router-dom";

interface ForwardBlocksProps {
    text:string;
    forward:string;
    theme:boolean;
    link:string;
    onClick?:(e:any) => void;
   
}

const ForwardBlocks: React.FC<ForwardBlocksProps> = ({ text, forward, theme, link, onClick  }) => {
    const content = (
        <div
            onClick={(e) => onClick && onClick(e)}
            className={`w-full  p-3 border border-solid rounded-lg ${theme ? 'bg-transparent text-white border-gray-500' : 'bg-white border-[#5252]'}`}
        >
          
            <p>{text}</p>
            <p className="hover:underline text-blue-500 cursor-pointer text-sm">{forward}</p> 
           
        </div>
    );

    return <Link className="w-full " to={link}>{content}</Link>
        
};


export default ForwardBlocks