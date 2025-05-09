interface FeatureProp {
    text:string;
    content:string
}


const FeatureBlock:React.FC<FeatureProp> = ({ text ,content} ) => {
    return(
        <div className="bg-white w-[90%] mx-auto md:w-[31%] h-fit min-h-[350px] border border-solid border-gray-300 rounded-md">
            <div className="w-[90%] mx-auto">
                <div>
                    <img src="" alt="" />
                </div>
                <div>
                    <h4 className="font-semibold text-xl">
                        {text}
                    </h4>
                    <p >{content}</p>
                </div>
            </div>  
        </div>
    )
}

export default FeatureBlock