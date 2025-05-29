import { Link } from "react-router-dom"

const Footer = () => {
    return (<footer className="relative mt-10 h-20 w-[90%]  mx-auto text-gray-500 flex text-[13px] md:text-sm flex-col md:flex-row justify-center md:justify-between items-center gap-3">
        <div>
            <p><span>&copy;</span> 2025 TEXTFLEX ENTERPRISES. All Rights Reserved</p>
        </div>
        <div className="flex gap-20 md:gap-3 ">
            <Link to="/privacy/1">
                 <span>Privacy Policy</span>
            </Link>
           <Link to="/terms/1">
            <span>Terms of Service</span>
           </Link> 
        </div>
        
    </footer>)
}

export default Footer