import { ShieldCheck } from "lucide-react";

interface LisProps {
    content:string;
    
}
const Lis:React.FC<LisProps> = ({ content }) => {
    return(
        <div className="flex h-24 items-center gap-3 w-full mx-auto">
            <div className="bg-[#eef4fd] w-[8%] grid place-items-center h-10 rounded-sm">
              <ShieldCheck color='#0032a5' size={25}/>
            </div>
            <p className=" text-lg font-semibold "> {content}</p>
        </div>
        
    )
}

export default Lis