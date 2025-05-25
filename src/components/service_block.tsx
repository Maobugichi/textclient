import Skeleton from "react-loading-skeleton";

interface ServiceProps {
    icon:any;
    text:string;
    className:string
}

const ServiceBlock:React.FC<ServiceProps> = ({ icon , text , className }) => {
    return(
        <div className={`${className} pl-5 border-solid border-gray-200 flex w-[336px] h-28 gap-3 items-center`}>
            {icon ? <img className="h-10" src={icon} alt="brand icon" /> : <Skeleton className="w-[80%] h-32  md:h-32 rounded-md" baseColor="#333333" highlightColor="#f5f5f5" /> }
                    
            <span className="font-bold text-lg">{text}</span>
        </div>
    )
}

export default ServiceBlock