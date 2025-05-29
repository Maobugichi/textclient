import { ArrowRight } from "lucide-react"


interface TermsNavProps {
    text:string;
}

const TermsNav:React.FC<TermsNavProps> = ({ text }) => {
    
   const sectionId = text.toLowerCase().replace(/\s+/g, "-");
   console.log(sectionId)
    return(
       <a className="md:w-[50%] w-full" href={`#${sectionId}`}>
        <li className=" w-full list-disc flex h-20 text-lg items-center gap-1 relative text-blue-500 underline"><span className="h-1.5 w-1.5 bg-gray-400 absolute left-[-20px] top-9.5 rounded-full"></span><ArrowRight size={14}/>  {text}</li>
      </a> 
    )
}

export default TermsNav