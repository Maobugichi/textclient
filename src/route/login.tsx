import Form from "../components/form"
import { useState , useContext } from "react";
import interwind from "../assets/Interwind.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShowContext } from "../components/context-provider";

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
        await axios.post('https://textflex-axd2.onrender.com/api/login', credentials , { withCredentials: true })
          .then(function (response) {
            if (response.data) {
                console.log(response.data)
                setCredentials({
                    email:'',
                    password:''
                  })
            }
            setShowLoader(false)
            setUserData(response.data)
            navigate('/dashboard/1')
          })
          .catch((err) => {
            console.log(err)
            setCredentials({
                email:'',
                password:''
              })
            setShowLoader(false);
          });
    }
  return(
      <div className="w-[90%] mx-auto md:w-[40%]  h-fit  mt-20 min-h-[30vh]  grid md:min-h-[50vh]">
        <div className="text-center h-25 grid">
            <h2 className="text-2xl font-semibold">Log In</h2>
            <p>Enter your details below to log into your account</p>
        </div>
        <Form 
            className="flex flex-col gap-10  h-[300px]"
            onSubmit={submitCredentias}
        >
            <input onChange={input} type='email' name="email" placeholder="Enter your email" value={credentials.email} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
            <input onChange={input} type="password" name="password" placeholder="Enter your password" value={credentials.password} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
            <button  type="submit" className="w-full grid place-items-center bg-[#0032a5] text-white p-3 rounded-sm">{ showLoader ? <img className="h-10" src={interwind} alt="" /> : 'Sign up' }</button>
            </Form> 
      </div>  
    )
}

export default Login