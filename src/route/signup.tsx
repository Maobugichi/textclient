import axios from "axios";
import Form from "../components/form";
import {  useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShowContext } from "../components/context-provider";
import interwind from "../assets/Interwind.svg"

const Signup = () => {
    const navigate = useNavigate();
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { setUserData } = myContext;
    const [ credentials , setCredentials ] = useState({
        username:'',
        number:'',
        email:'',
        password:''
    });
     const [ showLoader , setShowLoader ] = useState<any>(false);
   
    async function submitCredentias(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setShowLoader(true)
        const { username , number , email , password } = credentials
        if ( username == '' || number == '' || email == '' || password == '') {
            setShowLoader(false)
            return
        }
        await axios.post('https://textflex-axd2.onrender.com/api/register/', credentials , { withCredentials: true })
          .then(function (response) {
            console.log('Success:', response.data);
            setShowLoader(false)
            setUserData(response.data)
            navigate('/dashboard/1')
          })
          .catch((err) => {
            console.log(err)
            setShowLoader(false);
          });
    }
    function input(e:React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        if (name == 'email') {
            setCredentials((prev:any) => ({
                ...prev,
                email:e.target.value
            }));
        } else if (name == 'username') {
            setCredentials((prev:any) => ({
                ...prev,
                username:e.target.value
            }))
        } else if (name == 'number') {
            setCredentials((prev:any) => ({
                ...prev,
                number:e.target.value
            }))
        } else  {
            setCredentials((prev:any) => ({
                ...prev,
                password:e.target.value
            }))
        }
    
        
    }
    return(
     <div className="w-full md:w-[50%] h-fit  min-h-[45vh] grid md:min-h-[80vh]">
        <div className="text-center h-15 grid">
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p>Enter your details below to create your account</p>
        </div>
       <Form 
        onSubmit={submitCredentias}
        className="flex flex-col justify-between  h-[300px]"
       >
           <input onChange={input} type='text' name="username" placeholder="username" value={credentials.username} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type='text' name="number" placeholder="Enter your email" value={credentials.number} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type='email' name="email" placeholder="Phone Number" value={credentials.email} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <input onChange={input} type="password" name="password" placeholder="Enter your password" value={credentials.password} className="outline p-3 rounded-md outline-[#5252] outline-solid"/>
           <button  type="submit" className="w-full grid place-items-center bg-[#0032a5] text-white p-2 rounded-sm">{ showLoader ? <img className="h-10" src={interwind} alt="" /> : 'Sign up' }</button>
        </Form> 
      </div>  
    )
}

export default Signup