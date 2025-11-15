
import { Link } from "react-router-dom";

interface ForwardBlocksProps {
    text:string;
    forward:string;
    theme:boolean;
    link:string;
    onClick?:(e:any) => void;
   
}

const ForwardBlocks: React.FC<ForwardBlocksProps> = ({ text, forward, link, onClick  }) => {
    const content = (
        <div
            onClick={(e) => onClick && onClick(e)}
            className={`w-full  p-3 border border-solid rounded-3xl dark:bg-[#171717] dark:text-white dark:border-gray-500 bg-white border-[#5252]`}
        >
          
            <p className="tracking-wider">{text}</p>
            <p className="hover:underline transition-all duration-300 text-blue-500 cursor-pointer text-sm">{forward}</p> 
           
        </div>
    );

    return <Link className="w-full " to={link}>{content}</Link>
        
};


export default ForwardBlocks