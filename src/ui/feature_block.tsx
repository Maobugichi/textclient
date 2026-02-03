interface FeatureProp {
    text:string;
    content:string;
    src:string
}
import Skeleton from "react-loading-skeleton";


const FeatureBlock:React.FC<FeatureProp> = ({ text ,content , src} ) => {
    return(
        <div className="bg-white w-[90%] mx-auto md:w-[31%] h-fit py-4  border border-solid border-gray-300 rounded-xl">
            <div className="w-[90%] mx-auto flex flex-col items-center justify-center h-[350px] gap-3">
                <div className="relative rounded-lg border border-solid border-gray-300 overflow-hidden">
                     {src ? <img src={src} alt="features image" /> :  <Skeleton height="200px" baseColor="#e0e0e0" highlightColor="#f5f5f5" /> }
                     <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-gray-200 to-transparent pointer-events-none" />
                </div>
                <div className="grid space-y-4">
                    <h4 className="font-semibold text-xl">
                        {text}
                    </h4>
                    <p className="text-md tracking-wide leading-6 text-gray-500">{content}</p>
                </div>
            </div>  
        </div>
    )
}

export default FeatureBlock