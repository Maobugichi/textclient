import axios from "axios";
import { useContext } from "react";
import {  useNavigate } from "react-router-dom";
import { ShowContext } from "../context-provider";
import { LogOut } from "lucide-react";

const SignOut = () => {
    const navigate = useNavigate();
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    async function logout() {
        await axios.post(`https://textflex-axd2.onrender.com/api/logout/`, {}, { withCredentials: true });
        navigate('/dashboard/1');
        localStorage.removeItem('token');
    }
    return(
        <div className="flex  items-center justify-between pl-5 pr-5 pb-20 md:p-5">
            <p className="flex flex-col">
                {userData.username}
                <span className="text-[13px] text-gray-500">{userData.userEmail}</span>
            </p>  
            <button onClick={logout} className="bg-red-400 rounded-full h-8 grid place-items-center w-8"><LogOut size={15} color="white"/></button>    
        </div>
    )
}

export default SignOut