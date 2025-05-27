import { ShieldCheck } from "lucide-react";

interface LisProps {
    content:string;
    more:string
}
const Lis:React.FC<LisProps> = ({ content , more }) => {
    return(
        <div className="flex h-[200px] md:h-24 items-center gap-3 w-full mx-auto">
            
            <div className=" flex md:flex-row flex-col  w-full justify-between items-center">
                <div className="flex  w-full md:w-[38%] items-center gap-2">
                    <div className="bg-[#eef4fd]  w-[15%]  grid place-items-center h-10 rounded-sm">
                    <ShieldCheck color='#0032a5' size={25}/>
                    </div>
                     <p className=" w-full text-lg font-semibold "> {content}  </p>
                </div>
                
               
                <p className="text-gray-400  md:w-[60%] text-sm leading-8 md:text-lg font-light "> {more}  </p>
            </div>
           
        </div>
        
    )
}

export default Lis