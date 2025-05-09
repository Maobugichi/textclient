interface ServiceProps {
    icon:any;
    text:string;
    className:string
}

const ServiceBlock:React.FC<ServiceProps> = ({ icon , text , className }) => {
    return(
        <div className={`${className} pl-5 border-solid border-gray-200 flex w-[336px] h-28 gap-3 items-center`}>
            <img className="h-10" src={icon} alt="brand icon" />
            <span className="font-bold text-lg">{text}</span>
        </div>
    )
}

export default ServiceBlock