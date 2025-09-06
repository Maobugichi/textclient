import Form from "../components/form"
import { useState , useContext, useEffect } from "react";
import interwind from "../assets/Interwind.svg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ShowContext } from "../components/context-provider";
import Toast from "../components/toast";
import logo from "../assets/textflexLogo.png"
import { io } from "socket.io-client";

const Login = () => {
    const [ credentials , setCredentials ] = useState({
        email:'',
        password:''
    });
    const navigate = useNavigate();
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { setUserData } = myContext;
    const [ showLoader , setShowLoader ] = useState<any>(false);
    const [ errorMssg , setErrorMessage ] = useState<string>('')
    const [ show , setShow ] = useState<boolean>(false);
    function input(e:React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        if (name == 'email') {
            setCredentials((prev:any) => ({
                ...prev,
                email:e.target.value
            }));
        }  else  {
            setCredentials((prev:any) => ({
                ...prev,
                password:e.target.value
            }))
        } 
    }

    async function submitCredentias(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setShowLoader(true)
        const { email , password } = credentials
        if (  email == '' || password == '') {
            setShowLoader(false)
            return
        }
        await axios.post('https://api.textflex.net/api/login', credentials , { withCredentials: true })
          .then(function (response) {
            if (response.data) {
                setCredentials({
                    email:'',
                    password:''
                  })
            }
            setShowLoader(false)
           
            const socket = io('https://api.textflex.net', {
            query: { 
                userId: response.data.userId,
                eventType: response.data.eventTag  
            }
            });
            socket.emit("client-ready");
            socket.on("notification", (data) => {
            console.log("Notification received:", data);
            setErrorMessage(data.message);
            setShow(true);
            });
            setUserData(response.data)
            navigate('/dashboard/1')
          })
          .catch((err) => {
            setErrorMessage(err.response.data.error)
            console.log(err)
            setShow(true)
            setCredentials({
                email:'',
                password:''
              })
            setShowLoader(false);
          });
    }

    useEffect(() => {
        setTimeout(() => {
            if (show) {
                setShow(false)
            } 
        }, 8000);
        
    },[show])
  return(
      <div className="relative w-[90%] mx-auto md:w-[40%]  h-fit  mt-20 min-h-[30vh] place-items-center grid  md:min-h-[50vh]">
        <Toast
         show={show}
         errorMssg={errorMssg}
         />
        <div className="text-center h-fit pb-5  grid gap-4 place-items-center">
             <img src={logo} alt="textflex logo" className="w-32"/>
            <p className="text-lg font-semibold">Enter your details below to log into your account</p>
        </div>
        <Form 
            className="flex flex-col gap-5 h-fit w-[95%]"
            onSubmit={submitCredentias}
        >
            <input onChange={input} type='email' name="email" placeholder="Enter your email" value={credentials.email} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
            <input onChange={input} type="password" name="password" placeholder="Enter your password" value={credentials.password} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
            <button  type="submit" className="w-full grid place-items-center bg-[#0032a5] h-12 text-white p-3 rounded-sm">{ showLoader ? <img className="h-8" src={interwind} alt="" /> : 'Login' }</button>
        </Form> 
        <Link className="text-blue-400 underline mt-5" to="/forgot-password/:1">
          forgot password?
        </Link>
      </div>  
    )
}

export default Login