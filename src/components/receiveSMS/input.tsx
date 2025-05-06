import Fieldset from "../fieldset";
import React, { useState } from "react";
import axios from "axios";
import { useEffect , useContext } from "react";
import Select from "../select";
import { ShowContext } from "../context-provider";
import {Dispatch , SetStateAction } from 'react';
import spinner from "../../assets/dualring.svg";

interface InputPorps {
    type?: string;
    label?:string;
    tableValues:any;
    setTableValues:Dispatch<SetStateAction<any>> ;
    setNumberInfo?:Dispatch<SetStateAction<any>> ;
    setIsShow:Dispatch<SetStateAction<boolean>>
}

const Input:React.FC<InputPorps> = ({tableValues , setTableValues , setNumberInfo, setIsShow}) => {
  const myContext = useContext(ShowContext);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const [ provider , setProvider ] = useState('Swift');
    const [ countries , setCountries ] = useState<any>({})
    const [ option , setOption ] = useState<any>(null)
    const [ countryOption , setCountryOption ] = useState<any>(<option value="5">USA</option>);
    const [ target, setTarget ] = useState<any>({
      provider:provider,
      country:'5',
      service:'',
      user_id: userData.userId
    });
    
    useEffect(() => {
       axios.get('https://textflex-axd2.onrender.com/api/sms/countries')
         .then(function(response) {
             setCountries(response.data);
             //console.log(response.data)
         })
         .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })
       
         if (countryOption.props) {
           if (countryOption.props.value == '5') {
              const countries = async () => {
                const res = await axios.get('https://textflex-axd2.onrender.com/api/sms/price', {
                  params: {
                    id:countryOption.props.value ,
                  }
                });
                const service = await  axios.get('https://textflex-axd2.onrender.com/api/sms/service');
                type ResItem = { application_id: number; [key: string]: any };
                type ServiceItem = { id: number; [key: string]: any };
                const resArray: ResItem[] = Array.from(Object.values(res.data));
                const serviceArray: ServiceItem[] = Array.from(Object.values(service.data));
                const matched = serviceArray.filter(serviceItem =>
                  resArray.find(resItem => resItem.application_id === serviceItem.id)
                );
                if (matched) {
                  const option = matched.map((item:any) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))
                  setOption(option)
                }
              
              }
            countries()
           }
         } else {
          axios.get('https://textflex-axd2.onrender.com/api/sms/service')
          .then(function(response) {
              const serviceArray = Array.from(Object.values(response.data));
              const option = serviceArray.map((item:any) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))
              setOption(option)
          })
          .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })
         }
         
    },[countryOption])

    useEffect(() => {
      const run = async () => {
      async function postToBackEnd() {
         const response = await axios.post('https://textflex-axd2.onrender.com/api/sms/get-number', target);
          console.log(response.data)
          if (setNumberInfo && response.data.phone.number) {
            setNumberInfo((prev: any) => ({
              ...prev,
              number: response.data.phone.number,
            }));
            setIsShow(true)
          }

         return response.data
        }

        const pollSMS = async (request_id: string) => {
          let attempts = 0;
          const maxAttempts = 15;
          const interval = setInterval(async () => {
            try {
              const res = await axios.get(`https://textflex-axd2.onrender.com/api/sms/status/${request_id}`);
              console.log(res.data)
              const sms = res.data?.sms_code;
              if (sms || attempts >= maxAttempts) {
                clearInterval(interval);
                if (sms) {
                  if (setNumberInfo) {
                    setNumberInfo((prev:any) => ({
                        ...prev,
                         sms: res.data.sms_code
                      }))
                  }
                  
                  console.log("✅ SMS received:", res.data.sms_code);
                } else {
                  if (setNumberInfo) {
                    setNumberInfo((prev:any) => ({
                      ...prev,
                       sms: "⏱️ SMS polling timed out"
                    }))
                  }
                  
                  console.warn("⏱️ SMS polling timed out");
                }
              }
            } catch (err) {
              if (setNumberInfo) {
                setNumberInfo((prev:any) => ({
                  ...prev,
                   sms: "❌ Error polling SMS:"
                }))
              }
              console.error("❌ Error polling SMS:", err);
              clearInterval(interval); // optional: stop polling on error
            }
        
            attempts++;
          }, 10000);
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
    //console.log(tableValues)
   },[tableValues])
   
    
    function handleInputChange(e:React.ChangeEvent<HTMLSelectElement>) {
      setProvider(e.target.value)
      if (e.target.value == 'Dynamic') {
         const countriesArray = Array.from(Object.values(countries));
         const country = countriesArray.map((item:any) => {
           return(
            <option value={item.id}>
              {item.title}
            </option>
           )
         });
        setCountryOption(country);
      } else {
        setCountryOption(<option value="5">USA</option>)
      }  
    }

    async function handleCountryChange(e:React.ChangeEvent<HTMLSelectElement>) {
      
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
         className="bg-[#fdf4ee] w-[95%] mx-auto md:w-[32%] h-[330px] rounded-lg flex flex-col  gap-4 justify-center  border border-solid border-[#5252]"
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
            <div className="relative w-full grid ">
              <Select 
               onChange={handleCountryChange} 
               id="country" 
              >
                  { countryOption }
              </Select> 
             {!countryOption && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
            </div> 
            </Fieldset>

            <Fieldset
             provider="Service"
            >
             <div className="relative w-full grid ">
              <Select 
                onChange={extractCode} 
                id="services"
                >
                  { option }
              </Select> 
              {!option && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
             </div>
             
            </Fieldset> 

        </Fieldset>
    )
}

export default Input
