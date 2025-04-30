import axios from "axios";
import Form from "../components/form";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [ credentials , setCredentials ] = useState({
        username:'',
        email:'',
        password:''
    })

    function submitCredentias(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        axios.post('https://textflex-axd2.onrender.com/api/register/', credentials , { withCredentials: true })
          .then(function (response) {
            console.log('Success:', response.data);
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
           <input onChange={input} type='username' name="username" placeholder="username" value={credentials.username}/>
           <input onChange={input} type='email' name="email" placeholder="Email" value={credentials.email}/>
           <input onChange={input} type="password" name="password" placeholder="password" value={credentials.password}/>
           <button  type="submit">Register</button>
        </Form> 
    )
}

export default Signup