import Fieldset from "../fieldset";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Select from "../select";

interface InputPorps {
    type?: string;
    label?:string;
}

const Input:React.FC<InputPorps> = () => {
    const [ provider , setProvider ] = useState('Swift');
    const [ countries , setCountries ] = useState<any>({})
    const [ option , setOption ] = useState<any>(null)
    const [ countryOption , setCountryOption ] = useState<any>(<option>United States</option>);
    const [ target, setTarget ] = useState<any>({
      country:'usa',
      service:''
    })
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
      if (target.service && target.country) {
        axios.post('https://textflex-axd2.onrender.com/api/sms/get-number', target);
      }
    },[target]);

    
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
         provider={provider}
         className="bg-yellow-100 w-[30%] h-[330px] rounded-lg flex flex-col gap-4 justify-center"
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
