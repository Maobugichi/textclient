import Button from "../button";
import Form from "../form";
import { useContext , useEffect, useState } from "react"
import { ShowContext } from "../context-provider";
import axios from "axios";

const SettingsContent = () => {
        const [ password, setPassword ] = useState<any>({
            oldPassword:'',
            newPassword:''
        });
       
        const [ message , setMessage ] = useState<any>('');
        const [ error , setError ] = useState<any>('')
        const [ userInput , setUserInput ] = useState<any>(false)
        const myContext = useContext(ShowContext)
        if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
        const { userData , setUserData , theme } = myContext;
        const { userEmail , userId , userNumber , username } = userData;
        useEffect(() => {
            if (message !== '') {
                setUserInput(false)
            }
        },[message]);

       
        async function updateDetails(e:React.FormEvent<HTMLFormElement>) {
          e.preventDefault();
          if (userInput) {
            const response = await axios.patch(`https://textflex-axd2.onrender.com/api/update/${userId}`, { username , userNumber});
            setMessage(response.data);
          }
          
        } 

        async function updatePassword(e:React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            if ( password.oldPassword == '' || password.newPassword == '') {
                return
            }
            if ( password.oldPassword !== '' && password.newPassword !== '' ) {
                try {
                    const response = await axios.patch(`https://textflex-axd2.onrender.com/api/password/${userId}`,password);
                    const { data } = response.data;
                    setMessage(data)
                    if (data) {
                        setPassword({
                            oldPassword:'',
                            newPassword:''
                        })
                        setTimeout(() => {
                            setMessage('')
                        }, 2000);
                    }
                    
                } catch(err:any) {
                    setMessage(err.response.data.message)
                    setPassword({
                        oldPassword:'',
                        newPassword:''
                    })
                    setError(err.response.data.message)
                    setTimeout(() => {
                        setMessage('')
                        setError('')
                    }, 2000);
                }
                
            }
          
        }
        
        function changeDetails(e:React.ChangeEvent<HTMLInputElement>) {
            const name = e.target.name;
            setUserInput(true)
            if (name == 'username') {
               setUserData((prev:any) => ({
                   ...prev,
                   username: e.target.value
               }))
            } else if (name == 'phonenumber') {
                setUserData((prev:any) => ({
                    ...prev,
                    userNumber: e.target.value
                }))
            } else if (name == 'olpassword') {
                setPassword((prev:any) => ({
                    ...prev,
                    oldPassword:e.target.value
                }))
            } else if (name == 'nepassword') {
                setPassword((prev:any) => ({
                    ...prev,
                    newPassword:e.target.value
                }))
            }
        }

       
    return(
        <div className={`w-full md:w-[65%] h-full flex flex-col justify-between ${theme ? 'text-white' : 'text-black'}`}>
            <div className="h-1/2  flex flex-col justify-between">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <Form
                 className="flex flex-col h-[80%] justify-between"
                 onSubmit={updateDetails}
                >
                    <input onChange={changeDetails} type="text" name='username' value={username} className={`outline py-2 rounded-sm ${theme ? 'outline-blue-200' : 'outline-[#5252]'}  pl-4 `}/>
                    <input onChange={changeDetails} type="text" name='phonenumber' value={userNumber} className={`outline py-2 rounded-sm  pl-4 ${theme ? 'outline-blue-200' : 'outline-[#5252]'}`}/>
                    <input type="email" name='email' value={userEmail} disabled className={`outline py-2 rounded-sm  pl-4 cursor-not-allowed text-gray-400 ${theme ? 'outline-blue-200' : 'outline-[#5252]'}`}/>
                    <Button
                     className='w-[30%] md:w-[20%] h-[15%] bg-[#0032a5] md:h-[20%] text-white text-sm  rounded'
                     content='Update Profile'
                     checkUser={userInput}
                     password={false}
                     message={message}
                    />
                </Form>
            </div>

            <div className="h-[40%] flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Change Password</h2>
                <Form
                 className="flex flex-col h-[70%] justify-between"
                 onSubmit={updatePassword}
                >
                    <label>{error}</label>
                    <input onChange={changeDetails} type="password" name='olpassword' value={password.oldPassword} className={`outline py-2 rounded-sm ${theme ? 'outline-blue-200' : 'outline-[#5252]'} pl-4 placeholder:text-gray-400" placeholder="Enter old Password`}/>
                    <input onChange={changeDetails} type="password" name='nepassword' value={password.newPassword} className={`outline py-2 rounded-sm ${theme ? 'outline-blue-200' : 'outline-[#5252]'} pl-4 placeholder:text-gray-400" placeholder="Enter new Password`}/>
                    <Button
                     className='w-[20%] md:w-[10%] h-[20%] bg-[#0032a5] md:h-[25%] text-white text-sm  rounded'
                     content='Save'
                     checkUser={userInput}
                     message={message}
                     password={password.oldPassword == '' || password.newPassword == ''}
                    />
                </Form>
            </div>
        </div>
    )
}

export default SettingsContent