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
    setIsShow:Dispatch<SetStateAction<boolean>>;
    setIsError:Dispatch<SetStateAction<any>>
    setErrorInfo:Dispatch<SetStateAction<any>>
}

type ServiceInfo = {
  application: string;
  cost: string;
  application_id:any
};


const Input:React.FC<InputPorps> = ({ setTableValues , setNumberInfo, setIsShow , setIsError , setErrorInfo }) => {
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
    const [fullList, setFullList] = useState<ServiceInfo[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 100;
    const [ status , setStatus ] = useState<any>({
      stat:'',
      req_id:''
    });
    
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
              const serviceArray = response.data.price
              const parsed = typeof serviceArray === 'string' ? JSON.parse(serviceArray) : serviceArray;
              const result: ServiceInfo[] = [];
              Object.values(parsed).forEach((outer: any) => {
                Object.values(outer).forEach((inner: any) => {
                  if (inner?.application && inner?.cost) {
                    result.push({
                      application: inner.application,
                      application_id:inner.application_id,
                      cost: inner.cost
                    });
                  }
                });
              });
              setFullList(result);
              setOption(result.slice(0, page * PAGE_SIZE))
             })
          .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })

    },[countryOption,page])

    useEffect(() => {
      const checkStatus = async () => {
        if (status.stat !== '' && status.req_id !== '') {
            const response = await axios.get(`https://textflex-axd2.onrender.com/api/cancel-sms?request_id=${status.req_id}&status=${status.stat}`);
            console.log(response.data)
           return response.data
        }
      }
      checkStatus()
    },[status]);


    useEffect(() => {
      const run = async () => {
      async function postToBackEnd() {
        try {
          const response = await axios.post('https://textflex-axd2.onrender.com/api/sms/get-number', target);
          console.log(response.data)
           if (setNumberInfo && response.data.phone.number) {
             setNumberInfo((prev: any) => ({
               ...prev,
               number: response.data.phone.number,
             }));
             setStatus((prev:any) => ({
               ...prev,
               stat:'ready',
               req_id:response.data.phone.request_id
             }))
             setIsShow(true)
             
           }
          return response.data
         } catch(err:any) {
          if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Message:', err.response.data?.error || err.response.data?.message);
            setErrorInfo( err.response.data?.error || err.response.data?.message);
            setIsError(true)
          }
        
        }
       
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
                      setStatus((prev:any) => ({
                        ...prev,
                        stat:'used',
                        req_id:request_id
                      }))
                  }
                 
                  console.log("✅ SMS received:", res.data.sms_code);
                } else {
                  if (setNumberInfo) {
                    setNumberInfo((prev:any) => ({
                      ...prev,
                       sms: "⏱️ SMS polling timed out,code not sent."
                    }))
                  }
                  
                  setTimeout(() => {
                    setIsShow(false)
                    setStatus((prev:any) => ({
                      ...prev,
                      stat:'reject',
                      req_id:request_id
                    }))
                  }, 8000);
                  
                }
              }
            } catch (err) {
              if (setNumberInfo) {
                setNumberInfo((prev:any) => ({
                  ...prev,
                   sms: "❌ Error polling SMS:"
                }))
                
              }
              setStatus((prev:any) => ({
                ...prev,
                stat:'reject',
                req_id:request_id
              }))
              console.error("❌ Error polling SMS:", err);
              clearInterval(interval); // optional: stop polling on error
            }
        
            attempts++;
          }, 10000);
        };

        const countries = async () => {
          setOption(null)
          const res = await axios.get('https://textflex-axd2.onrender.com/api/sms/price', {
            params: {
              id:target.country ,
            }
          });
          setOption(Object.values(res.data))
        }
       countries()
       
        if (target.service && target.country) {
           const response = await postToBackEnd();
           setTableValues(response?.phone)
           setTarget((prev:any) => ({
            ...prev,
            service:''
           }))
           const id = response.phone.request_id
          if (response.phone.request_id) {
            pollSMS(id)
          }
        } 
      } 
    run();
    },[target]);

    
    function handleInputChange(e:React.ChangeEvent<HTMLSelectElement>) {
      setProvider(e.target.value)
      setTarget((prev:any) => ({
        ...prev,
        provider:e.target.value
      }))
      if (e.target.value == 'Dynamic') {
         const countriesArray = Array.from(Object.values(countries));
         setTarget((prev:any) => ({
          ...prev,
          country: (countriesArray as { id: string , title: string , code: string}[])[0].id
         }))
         const country = countriesArray.map((item:any) => {
           return(
            <option value={item.id}>
              {item.title}
            </option>
           )
         });
        setCountryOption(country);
      } else {
        setTarget((prev:any) => ({
          ...prev,
          country: '5'
         }))
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
      const val = e.target.value;
      console.log(val)
      if (val === "__load_more__") {
        setPage(prev => prev + 1);
         console.log('hello')
         return;
      }  else {
        setTarget((prev:any) => {
          return({
            ...prev,
            service:e.target.value
          })
         })
      }
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
             <div className="relative w-full grid h-fit"
             >
              <Select 
                onChange={extractCode} 
                value={target.service}
                id="services"
                >
                  {option?.map((item:any) => (
                      <option key={item.application_id} value={item.application_id}>{`${item.application} - ${item.cost}`}</option>
                    ))}
                  {option?.length < fullList?.length && (
                    <option value="__load_more__">⬇ Load more...</option>
                  )}
              </Select> 
              {!option && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
             </div>
             
            </Fieldset> 

        </Fieldset>
    )
}

export default Input
