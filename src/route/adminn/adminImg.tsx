import { useEffect, useState } from "react"
import Form from "../../components/form"
import axios from "axios"
const AdminImg = () => {
    const [ info , setInfo ] = useState<any>({
        url:'',
        id:''
    })
   
    useEffect(() => {
      console.log(info)
    },[info])
    function changeInput(e:React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
      
            setInfo((prev:any) => ({
                ...prev,
                [name]:value
            }))
    }

    function pasteInput(e:React.ClipboardEvent<HTMLInputElement>) {
        setInfo((prev:any) => ({
            ...prev,
            url:e.clipboardData.getData("text")
        }));
    }

    async function submit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (info.url !== '' && info.id !== '') {
            const response = await axios.patch(`https://textflex-axd2.onrender.com/api/upp`, info);
            console.log(response)
        }
        
    }
    return(
        <div>
            <Form onSubmit={submit}>
                <input name="url" onPaste={pasteInput} onChange={changeInput} type="text" placeholder="enter image url" value={info.url}/>
                <input name="id" onChange={changeInput} type="number" placeholder="enter image id" value={info.id}/>
                <button type="submit">submit</button>
            </Form>
        </div>
    )
}

export default AdminImg