import { useContext } from "react";
import {  useNavigate } from "react-router-dom";
import { ShowContext } from "../context-provider";
import { LogOut } from "lucide-react";
import api from "../../lib/axios-config";
import { useAuth } from "../../context/authContext";

const SignOut = () => {
    const navigate = useNavigate();
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { user:userData, logout } = useAuth();
   
    async function signout() {
        await api.post(`/api/logout/`);
        logout()
        navigate('/homepage/1');
    }
    return(
        <div className="flex  items-center justify-between pl-5 pr-5  md:p-5">
            <p className="flex flex-col w-[60%]">
                {userData?.username}
                <span className="text-[13px] text-gray-500 break-all">{userData?.userEmail}</span>
            </p>  
            <button onClick={signout} className="bg-red-400 rounded-full h-8 grid place-items-center w-8"><LogOut size={15} color="white"/></button>    
        </div>
    )
}

export default SignOut