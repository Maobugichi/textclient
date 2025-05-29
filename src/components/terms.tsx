interface TermsProps {
    header:string;
}



const Terms:React.FC<TermsProps> = ({header}) => {
    return(
        <div className="relative h-[20vh] md:h-[60vh]">
           <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200" aria-hidden="true"><defs><pattern id="0787a7c5-978c-4f66-83c7-11c213f99cb7" width="120" height="120" x="50%" y="-1" patternUnits="userSpaceOnUse"><path d="M.5 200V.5H200" fill="none"></path></pattern></defs><rect width="100%" height="100%" stroke-width="0" fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"></rect></svg>
           <h2 className="text-4xl p-10 font-semibold">{header}</h2>
        </div>
    )
}

export default Terms