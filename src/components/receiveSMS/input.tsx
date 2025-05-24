import Fieldset from "../fieldset";
import React, { useState } from "react";
import axios from "axios";
import { useEffect , useContext } from "react";
import Select from "../select";
import { ShowContext } from "../context-provider";
import {Dispatch , SetStateAction } from 'react';
import spinner from "../../assets/dualring.svg";
import { AnimatePresence , motion } from "motion/react";


interface InputPorps {
    type?: string;
    label?:string;
    tableValues:any;
    numberInfo:any
    setNumberInfo?:Dispatch<SetStateAction<any>> ;
    setIsShow:Dispatch<SetStateAction<boolean>>;
    setIsError:Dispatch<SetStateAction<any>>
    setErrorInfo:Dispatch<SetStateAction<any>>
    setReqId:Dispatch<SetStateAction<any>>
    theme:boolean;
    cancel:boolean
}




const Input:React.FC<InputPorps> = ({ tableValues  , setNumberInfo, setIsShow , setIsError , setErrorInfo , theme , numberInfo , setReqId ,cancel }) => {
  const myContext = useContext(ShowContext);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const [ provider , setProvider ] = useState('Swift');
    const [ countries , setCountries ] = useState<any>({})
    const [ option , setOption ] = useState<any>([])
    const [ countryOption , setCountryOption ] = useState<any>(<option value="5">USA</option>);
    const [ target, setTarget ] = useState<any>({
      provider:provider,
      country:'5',
      service:'',
      user_id: userData.userId
    });
    const [page, setPage] = useState(1);
    const [ status , setStatus ] = useState<any>({
      stat:'',
      req_id:''
    });
    const [ cost , setCost ] = useState<number>(0)
    const  balance = tableValues[0]?.balance;
    const [ error , setError ] = useState<boolean>(false)
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
        let ref : any;
        if (cost > balance) {
           setError(true)
          return
        }
        async function postToBackEnd() {
        try {
          const response = await axios.post('https://textflex-axd2.onrender.com/api/sms/get-number',  {
            ...target,
            balance: balance,
            price:cost
          })
          console.log(response.data)
          if (response.data.debitRef){
            ref = response.data.debitRef
          }
          
           if (setNumberInfo && response.data.phone.number) {
             setNumberInfo((prev: any) => ({
               ...prev,
               number: response.data.phone.number,
             }));
             setReqId(response.data.phone.request_id)
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
            attempts++;
            try {
              const res = await axios.get(`https://textflex-axd2.onrender.com/api/sms/status/${request_id}`, {
                params: {cost , user_id:userData.userId , attempts , debitref:ref }
              });
               
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
              clearInterval(interval);
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
              clearInterval(interval); 
            }
        
           
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
           const id = response?.phone.request_id
          if (response.phone.request_id && !cancel) {
              pollSMS(id)
              setTarget((prev:any) => ({
                ...prev,
                service:''
              }))
           }
        } 
      } 
      run();
    },[target,cancel]);

    useEffect(() => {
      if (cancel && setNumberInfo) {
        setReqId('')
        setNumberInfo({
           number:'',
           sms:''
        })
       setTarget((prev:any) => ({
            ...prev,
            service:''
        }))
      }
    }, [cancel])

  
 
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
          country: (countriesArray as { id: string , title: string , code: string}[])[0]?.id
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

    useEffect(() => {
      if (error) {
        setTimeout(() => {
          setError(false)
        }, 3000);
      }
    },[error])

    function extractCode(e:React.ChangeEvent<HTMLSelectElement>) {
      const val = e.target.value;
      if (val === "__load_more__") {
        setPage(prev => prev + 1);
         
         return;
      }  else {
       const selectedId = e.target.value
       const selectedItem = option.find((item: any) => item.application_id == selectedId);
        if (selectedItem) {
           setCost(selectedItem.cost * 50)
          }
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
         className={`${theme ? 'bg-transparent border border-solid border-blue-200 text-white' :'bg-[#EEF4FD]'} w-[95%] mx-auto md:w-[32%] h-fit min-h-[330px] rounded-lg flex flex-col  gap-4 justify-center  border border-solid border-[#5252]`}
         fclass="pb-3 text-sm bg-transparent"
        >
            <Fieldset
             provider="Service Provider"
            >
            <Select
             id="providers"
             onChange={handleInputChange}
             theme={theme}
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
               theme={theme}
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
                isDisabled={error}
                theme={theme}
                >
                  {option?.map((item:any) => (
                      <option key={item.application_id} value={item.application_id}>{`${item.application} - ${(item.cost * 50).toLocaleString('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 2
                      }).replace('NGN', '').trim()}`}</option>
                    ))}
                  {option && (
                    <option value="__load_more__">⬇ Load more...</option>
                  )}
              </Select> 
              {!option && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
             </div>
             
            </Fieldset> 
            {
              error && (
                 <AnimatePresence>
                  <motion.div 
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  exit={{ opacity: 0}}
                  className="border border-solid border-red-600 text-sm rounded-sm  h-20 w-[90%] grid place-content-center p-2 mx-auto mb-5">
                    <p className="text-red-500">insufficient funds, fund your wallet and try again</p>
                  </motion.div>
                </AnimatePresence>
              )
            }
            {
              numberInfo.number !== '' && (
              <div className="h-20 mb-2 rounded-md mx-auto border border-solid grid place-items-center border-gray-300 bg-white w-[90%]">
                <p className="w-[90%] text-sm">number: {numberInfo.number}</p>
                 <p className="w-[90%] text-sm">code: {numberInfo.sms}</p>
              </div>)
            }
             
        </Fieldset>

    )
}

export default Input
