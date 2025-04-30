
import Button from "../button";
import Form from "../form";


const SettingsContent = () => {
    //const [ data, setData ] = useState<any>('')
    /*function updateDetails() {
        const response = axios.put('https://textflex-axd2.onrender.com/api/update/${userId}', data)
    }*/
    return(
        <div className=" w-[65%] h-full flex flex-col justify-between">
            <div className="h-1/2  flex flex-col justify-between">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <Form
                 className="flex flex-col h-[80%] justify-between"
                >
                    <input type="text" name='username' value='username' className="outline py-2 rounded-sm outline-[#5252] pl-4"/>
                    <input type="text" name='phonenumber' value='username' className="outline py-2 rounded-sm outline-[#5252] pl-4"/>
                    <input type="email" name='email' value='email' disabled className="outline py-2 rounded-sm outline-[#5252] pl-4"/>
                    <Button
                     className='w-[20%] h-[20%] text-white text-sm  rounded'
                     content='Update Profile'
                    />
                </Form>
            </div>

            <div className="h-[40%] flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Change Password</h2>
                <Form
                 className="flex flex-col h-[70%] justify-between"
                >
                    <input type="password" name='olpassword' value='olpassword' className="outline py-2 rounded-sm outline-[#5252] pl-4"/>
                    <input type="password" name='nepassword' value='nepassword' className="outline py-2 rounded-sm outline-[#5252] pl-4"/>
                    <Button
                     className='w-[10%] h-[25%] text-white text-sm  rounded'
                     content='Save'
                    />
                </Form>
            </div>
        </div>
    )
}

export default SettingsContent