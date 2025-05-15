import Button from "../components/button"
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
const Hero = () => {
    return(
        <div className="w-full bg-[linear-gradient(to_right,_#f9fbfd,_#eef4fd)]  h-fit relative z-10 top-24">
            <div className=" h-fit min-h-[100vh] w-[90%] md:w-[80%] mx-auto flex items-center">
                <div className=" h-fit min-h-[60vh]  w-full md:w-[60%]  grid gap-4 place-items-center">
                    <div className="w-[95%] ">
                        <button className="w-[25%] md:w-[17%] rounded-full h-8 text-sm bg-yellow-50 ">
                            Top notch
                        </button>
                    </div>
                    
                    <h1 className="text-4xl w-full md:text-6xl md:w-[95%] font-bold">Premium Virtual SMS Authentication Solution</h1>
                    <p className="text-gray-400 w-[95%] leading-8 text-lg">Get SMS messages online with trusted virtual phone numbers from around the globe. Our platform offers fast, secure, and dependable SMS verification for any purpose.</p>
                    <div className="w-[95%]  flex">
                       <Link  className="bg-[#0032a5] w-[40%] md:w-[23%] h-11 rounded-sm grid place-content-center text-white text-sm" to="signup/:1">
                        <Button
                         content="Sign up"
                        
                        />
                        </Link> 
                        <Link className="md:w-[23%] w-[40%] h-11 text-sm grid place-content-center" to="login/:1">
                            <Button
                             content={<span className="flex w-full items-center gap-2 justify-center">Login <ArrowRight size={13}/></span>}
                            />
                        </Link>
                        
                    </div>
                </div>
                <div>
                    <img src="
                    " alt="" />
                </div>
        </div>
        </div>
        
    )
}

export default Hero