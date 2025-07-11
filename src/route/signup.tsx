import axios from "axios";
import Form from "../components/form";
import {  useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShowContext } from "../components/context-provider";
import interwind from "../assets/Interwind.svg"
import Toast from "../components/toast";

const Signup = () => {
    const navigate = useNavigate();
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { setUserData } = myContext;
    const [ credentials , setCredentials ] = useState({
        username:'',
        number:'',
        email:'',
        password:'',
        referralCode:''
    });
     const [ showLoader , setShowLoader ] = useState<any>(false);
     const [ errorMssg , setErrorMessage ] = useState<string>('')
     const [ show , setShow ] = useState<boolean>(false);
    async function submitCredentias(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setShowLoader(true)
        const { username , number , email , password } = credentials
        if ( username == '' || number == '' || email == '' || password == '') {
            setShowLoader(false)
            return
        }
        await axios.post('https://api.textflex.net/api/register/', credentials , { withCredentials: true })
        .then(function (response) {
            console.log('Success:', response.data);
            setShowLoader(false)
            setUserData(response.data)
            navigate('/dashboard/1')
        })
        .catch((err) => {
            setErrorMessage(err.response.data.message || err.response.data)
            setShow(true);
            setShowLoader(false);
        });
        setCredentials({
            username:'',
            number:'',
            email:'',
            password:'',
            referralCode:''
        })
    }
    function input(e:React.ChangeEvent<HTMLInputElement>) {
        const { name , value } = e.target
        setCredentials((prev:any) => ({
            ...prev,
            [name]:value
        }))
       
    }
    
    useEffect(() => {
       if (show) {
        setTimeout(() => {
            setShow(false)
        }, 3000);
       
       }
    },[show])
    return(
     <div className="w-[90%] mx-auto md:w-[40%] h-fit mt-15  min-h-[45vh] relative grid md:min-h-[80vh]">
        <Toast
          show={show}
          errorMssg={errorMssg}
        />
        <div className="text-center h-25 grid">
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p>Enter your details below to create your account</p>
        </div>
        <Form 
        onSubmit={submitCredentias}
        className="flex flex-col justify-between  h-[320px]"
       >
           <input onChange={input} type='text' name="username" placeholder="username" value={credentials.username} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type='email' name="email" placeholder="Enter your email" value={credentials.email} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type='number' name="number" placeholder="Phone Number" value={credentials.number} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type="password" name="password" placeholder="Enter your password" value={credentials.password} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type="text" name="referralCode" placeholder="input referral(Optional)" value={credentials.referralCode} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <button  type="submit" className="w-full grid place-items-center bg-[#0032a5] text-white p-3 rounded-sm h-12">{ showLoader ? <img className="h-8" src={interwind} alt="" /> : 'Sign up' }</button>
        </Form> 
        <span className="text-center">have an account?   <Link className="text-blue-400 underline" to="/login/:1">sign in</Link></span>
        <p className="text-sm mt-2">By clicking sign up, you agree to our <Link to="/terms/1"><span className="underline">Terms of Service</span></Link> and <Link to="/privacy/1"><span className="underline">Privacy Policy</span></Link>.</p>
      </div>  
    )
}

export default Signup