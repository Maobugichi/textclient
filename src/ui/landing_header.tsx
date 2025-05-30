import { Link } from "react-router-dom";
import Button from "../components/button";
import checkAuth from "../components/checkauth";
import { ArrowRight } from 'lucide-react';
import textlogo from "../assets/textflexLogo.png";

const LandingHeader = () => {
    return(
        <header className="h-24 fixed top-0 w-full  z-20 backdrop-blur-2xl grid place-items-center">
            <div className="flex  w-[90%] h-[50%] mx-auto justify-between">
                <Link to="/homepage/1">
                     <img className="h-[58px] w-[100px] md:w-[180px] mx-auto" src={textlogo} alt="logo" />
                </Link>
                
                <div className="flex w-1/2 justify-end text-sm tracking-wide">
                 <Link  className="h-14 hidden md:grid  w-[25%] place-content-center" to={checkAuth() ? `/dashboard/:1` : '/login/:1'}>
                    <Button
                     content={checkAuth() ? 'Contact Us' : <span className="underline">Login</span>}
                    
                    />
                 </Link>  
                 <Link className="bg-[#0032a5] rounded-sm h-12 md:h-13 grid place-items-center text-white w-[90%] md:w-[25%]" to={checkAuth() ? `/dashboard/:1` : '/signup/:1'}>
                    <Button
                     content={checkAuth() ? `Dashboard` : <span className="flex items-center gap-3">Register <ArrowRight size={13}/></span>}
                     
                    />
                  </Link>  
                </div>
                
            </div>
        </header>
    )
}

export default LandingHeader