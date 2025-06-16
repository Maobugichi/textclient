
import { Link } from "react-router-dom";

interface ForwardBlocksProps {
    text:string;
    forward:string;
    theme:boolean;
    link?:string;
    onClick?:() => void;
    userId:string
}

const ForwardBlocks: React.FC<ForwardBlocksProps> = ({ text, forward, theme, link, onClick }) => {
    const content = (
        <div
            onClick={() => onClick && onClick()}
            className={`w-full p-3 border border-solid rounded-md ${theme ? 'bg-transparent text-white border-gray-500' : 'bg-white border-[#5252]'}`}
        >
            <p>{text}</p>
            <p className="hover:underline text-blue-500 cursor-pointer text-sm">{forward}</p>
        </div>
    );

    return link && !onClick
        ? <Link className="w-full md:w-[49.5%]" to={link}>{content}</Link>
        : <div className="w-full md:w-[49.5%]">{content}</div>;
};


export default ForwardBlocks