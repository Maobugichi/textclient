import axios from "axios";
import Form from "../components/form";
import {  useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShowContext } from "../components/context-provider";


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
    })
   
    function submitCredentias(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        axios.post('https://textflex-axd2.onrender.com/api/register/', credentials , { withCredentials: true })
          .then(function (response) {
            console.log('Success:', response.data);
            setUserData(response.data)
            navigate('/dashboard/1')
          })
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
       <Form 
       onSubmit={submitCredentias}
       >
           <input onChange={input} type='text' name="username" placeholder="username" value={credentials.username}/>
           <input onChange={input} type='text' name="number" placeholder="number" value={credentials.number}/>
           <input onChange={input} type='email' name="email" placeholder="Email" value={credentials.email}/>
           <input onChange={input} type="password" name="password" placeholder="password" value={credentials.password}/>
           <button  type="submit">Register</button>
        </Form> 
    )
}

export default Signup