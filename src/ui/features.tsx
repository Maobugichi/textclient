import { Link } from "react-router-dom";
import Button from "../components/button";
import FeatureBlock from "../ui/feature_block";
import price from "../assets/feature-price.png"
import zaza from "../assets/feature-img.png"
import last from "../assets/edu.png"

const Features = () => {
    const features = [
        {
            text:'On-Demand Secondary Number',
            content: 'Set up a second number in just a few clicks and receive verification codes instantly across all major platforms.',
            src:price
        },
        {
            text:'Fully Virtual and User-Friendly',
            content: 'Access a second number from an extensive list of countries—including the USA, UK, Russia, and more—to suit your global verification needs',
            src:zaza
        },
        {
            text:'Secure Account Verification',
            content: 'Streamline account verification by receiving confirmation codes on leading apps and platforms',
            src: last
        },
    ]

    const featureItems = features.map((feature:any) => (
        <FeatureBlock
         text={feature.text}
         content={feature.content}
         src={feature.src}
        />
    ))
    return(
        <div className="h-fit min-h-[95vh] w-[90%] md:w-[80%] mx-auto relative top-32 flex flex-col gap-5">
            <h2 className="text-4xl font-semibold">Features</h2>
            <p className="text-lg md:w-[55%] text-gray-400 leading-8">Textflex delivers trusted virtual phone numbers from a wide range of countries, enabling seamless SMS reception at competitive rates designed for global accessibility</p>
            <div className="flex flex-wrap justify-between gap-5 w-full">
                {featureItems}
            </div>
            <Link to="signup/:1">
                <Button
                content="Get Started"
                className="bg-[#0032a5] w-[40%] ml-4 md:ml-0 md:w-[15%] h-11 rounded-sm text-white text-sm"
                />
             </Link>   
        </div>
    )
}

export default Features