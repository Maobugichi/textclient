import Fieldset from "../fieldset";
import { useState } from "react";
import axios from "axios";
import { useEffect , useContext } from "react";
import Select from "../select";
import { ShowContext } from "../context-provider";


interface InputPorps {
    type?: string;
    label?:string;
}

const Input:React.FC<InputPorps> = () => {
  const myContext = useContext(ShowContext);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const [ provider , setProvider ] = useState('Swift');
    const [ countries , setCountries ] = useState<any>({})
    const [ option , setOption ] = useState<any>(null)
    const [ countryOption , setCountryOption ] = useState<any>(<option>United States</option>);
    const [ target, setTarget ] = useState<any>({
      country:'usa',
      service:'',
      user_id:userData.userId
    });
    const [ tableValues , setTableValues ] = useState<any>('')
    
    useEffect(() => {
       axios.get('https://textflex-axd2.onrender.com/api/sms/countries')
         .then(function(response) {
             setCountries(response.data);
         })
         .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })

         axios.get('https://textflex-axd2.onrender.com/api/sms/service')
          .then(function(response) {
              const serviceArray = Array.from(Object.values(response.data));
              const option = serviceArray.map((item:any) => (
                <option value={item.id}>{item.title}</option>
              ))
              setOption(option)
          })
          .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })
    },[])


   

    useEffect(() => {
      const run = async () => {
      async function postToBackEnd() {
        const response = await axios.post('https://textflex-axd2.onrender.com/api/sms/get-number', target);
        return response.data
        }

        const pollSMS = (request_id: string) => {
          let attempts = 0;
          const maxAttempts = 15;
          const interval = setInterval(async () => {
            
            const res = await axios.get(`/api/sms/status/${request_id}`);
            if (res.data.sms_code || attempts >= maxAttempts) {
              clearInterval(interval);
              if (res.data.sms_code) {
                console.log("✅ SMS received:", res.data.sms);
                // Handle the SMS in UI
              } else {
                console.warn("⏱️ SMS polling timed out");
              }
            }
            attempts++;
          }, 2000);
        };
      
        if (target.service && target.country) {
          const response = await postToBackEnd();
          setTableValues(response.phone)
          const id = response.phone.request_id
          if (response.phone.request_id) {
            pollSMS(id)
          }
         
        }
      } 
    run();
    },[target]);

   

   useEffect(() => {
    //const { request_id , application_id , country_id , number } = tableValues;
    console.log(tableValues)

   },[tableValues])
   
    
    function handleInputChange(e:React.ChangeEvent<HTMLSelectElement>) {
      setProvider(e.target.value)
      if (e.target.value == 'Dynamic') {
         const countriesArray = Array.from(Object.values(countries));
         console.log(countriesArray)
         const country = countriesArray.map((item:any) => {
           return(
            <option value={item.id}>
              {item.title}
            </option>
           )
         });
        setCountryOption(country);
      } else {
        setCountryOption(<option>United States</option>)
      }  
    }

    function handleCountryChange(e:React.ChangeEvent<HTMLSelectElement>) {
      setTarget((prev:any) => {
        return({
          ...prev,
          country: e.target.value
        })
      }) 
    }

    function extractCode(e:React.ChangeEvent<HTMLSelectElement>) {
      setTarget((prev:any) => {
        return({
          ...prev,
          service:e.target.value
        })
       })
       
    }
    return(
      
        <Fieldset
         provider={`${provider} SMS`}
         className="bg-[#fdf4ee] w-[32%] h-[330px] rounded-lg flex flex-col gap-4 justify-center border border-solid border-[#5252]"
         fclass="pl-5 text-sm"
        >
            <Fieldset
             provider="Service Provider"
            >
            <Select
             id="providers"
             onChange={handleInputChange}
             >
              <option value="Swift">Swift SMS</option>
              <option value="Dynamic">Dynamic SMS</option>
             </Select> 
            </Fieldset> 
            <Fieldset
             provider="Country"
            >
              <Select 
               onChange={handleCountryChange} 
               id="country" 
              >
                    { countryOption }
             </Select> 
            </Fieldset>

            <Fieldset
             provider="Service"
            >
             
             <Select 
              onChange={extractCode} 
              id="services"
               >
                { option }
             </Select> 
            </Fieldset> 

        </Fieldset>
    )
}

export default Input
