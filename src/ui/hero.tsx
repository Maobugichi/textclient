import Button from "../components/button"
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import HeroImg from "./hero-img";
const Hero = () => {
    return(
        <div className="w-full bg-[linear-gradient(to_right,_#f9fbfd,_#eef4fd)]  h-fit  min-h-screen grid place-items-center relative z-10 mt-24">
            <div className=" h-[110vh] w-[90%] md:w-full mx-auto flex md:flex-row flex-col items-center md:gap-0 gap-5">
                <div className=" h-[55%]  relative md:left-20  w-full md:w-[50%]  grid gap-4 place-items-center">
                    <div className="w-[95%] ">
                        <button className=" mt-10 md:mt-0 border-2 border-[#a3bcd1] border-solid w-[25%] md:w-[17%] rounded-full h-8 text-[12px] md:text-sm bg-gradient-to-r from-[#eef4fd] to-[#dceafb] ">
                            Top notch
                        </button>
                    </div>
                    
                    <h1 className="text-4xl w-full md:text-6xl md:w-[95%] font-bold">Premium Virtual SMS Authentication Solution</h1>
                    <p className="text-gray-400 w-[95%] leading-8 text-lg">Get SMS messages online with trusted virtual phone numbers from around the globe. Our platform offers fast, secure, and dependable SMS verification for any purpose.</p>
                    <div className="w-[95%]  flex">
                       <Link  className="bg-[#0032a5] w-[40%] md:w-[23%] h-11 rounded-sm grid place-content-center text-white text-sm" to="/signup/:1">
                        <Button
                         content="Sign up"
                        
                        />
                        </Link> 
                        <Link className="md:w-[23%] w-[40%] h-11 text-sm grid place-content-center" to="/login/:1">
                            <Button
                             content={<span className="flex w-full items-center gap-2 justify-center">Login <ArrowRight size={13}/></span>}
                            />
                        </Link>
                        
                    </div>
                </div>
                <HeroImg/>
            </div>
        </div>
        
    )
}

export default Hero