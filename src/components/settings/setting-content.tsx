
import Button from "../button";
import Form from "../form";


const SettingsContent = () => {
    //const [ data, setData ] = useState<any>('')
    /*function updateDetails() {
        const response = axios.put('https://textflex-axd2.onrender.com/api/update/${userId}', data)
    }*/
    return(
        <div>
            <div>
                <h2>Settings</h2>
                <Form>
                    <input type="text" name='username' value='username'/>
                    <input type="text" name='phonenumber' value='username'/>
                    <input type="email" name='email' value='email' disabled/>
                    <Button
                     content='Update Profile'
                    />
                       
                </Form>
            </div>
        </div>
    )
}

export default SettingsContent