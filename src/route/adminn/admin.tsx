import React, { useState , useContext } from "react"
import Form from "../../components/form"
import axios from "axios";
import { ShowContext } from "../../components/context-provider";

const Admin = () => {
    const context = useContext(ShowContext);

    if (!context) {
      throw new Error("ShowContext must be used within a provider");
    }
    const { userData } = context    
    const { userId } = userData;
    console.log(userId)
    const [ image_url , setImageUrl ] = useState<string>('');

    function chnageInput(e:React.ClipboardEvent<HTMLInputElement>){
        setImageUrl(e.clipboardData.getData("text"));
        console.log(e.clipboardData.getData("text"));
    }

    function changeInput(e:React.ChangeEvent<HTMLInputElement>){
        setImageUrl(e.target.value);
       
    }

    async function submitImage(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const response = await axios.post('https://textflex-axd2.onrender.com/api/admin', { image_url , userId })
        console.log(response.data)
    }
    return(
        <div>
            <Form
             onSubmit={submitImage}
            >
                <input onChange={changeInput} onPaste={chnageInput} placeholder="enter image url" type="text" value={image_url} />
                <button type="submit" className="bg-red-400">Submit</button>
            </Form>
            
        </div>
    )
}

export default Admin