import Fieldset from "../fieldset";
import React, { useRef, useState , useCallback ,useEffect , useContext , useMemo } from "react";
import axios from "axios";
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
    setNumberInfo:Dispatch<SetStateAction<any>> ;
    setIsShow:Dispatch<SetStateAction<boolean>>;
    setIsError:Dispatch<SetStateAction<any>>
    setErrorInfo:Dispatch<SetStateAction<any>>
    setReqId:Dispatch<SetStateAction<any>>
    theme:boolean;
    cancel:boolean;
    req_id:string
}




const Input:React.FC<InputPorps> = ({ tableValues  , setNumberInfo, setIsShow , setIsError , setErrorInfo , theme , numberInfo , setReqId , cancel ,req_id }) => {
  const myContext = useContext(ShowContext);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const [ provider , setProvider ] = useState('Swift');
    const [ countries , setCountries ] = useState<any>({})
    const [ option , setOption ] = useState<any>([])
    const [ target, setTarget ] = useState<any>({
      provider:provider,
      country:'5',
      service:'',
      user_id: userData.userId
    });
    const shouldPoll = useRef(true);
    const statusRef = useRef({ stat: "", req_id: ""});
    const lastDebitRef = useRef("");
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
    },[provider])

      useEffect(() => {
        const savedInfo = localStorage.getItem("numberInfo");
        if (savedInfo) {
          setNumberInfo(JSON.parse(savedInfo));
        }
      }, []);

     useEffect(() => {
      if (numberInfo.number || numberInfo.sms) {
         localStorage.setItem("numberInfo", JSON.stringify(numberInfo));
      }
     }, [numberInfo]);

    useEffect(() => {
      const getCountries = async () => {
        try {
          console.log(target)
          const { country } = target
          setOption([])
            const response = await axios.get(`https://textflex-axd2.onrender.com/api/sms/price`,{
              params:{id: Number(country)}
            });
            console.log(country)
          setOption(Object.values(response.data));
        } catch (err) {
          console.error("Error fetching countries");
        }
      };
     getCountries();
    }, [target]);


    useEffect(() => {
        if (req_id == '' || cancel) return;
        let attempts = 0;
        const interval = setInterval(async () => {
        if (cancel || attempts >= 15) {
            clearInterval(interval);
            return;
        }
        attempts++;
        try {
            const response = await axios.get(`https://textflex-axd2.onrender.com/api/sms/status/${statusRef.current.req_id}`, {
                params: {
                    cost,
                    user_id: userData.userId,
                    attempts,
                    debitref: lastDebitRef.current
                }
            });
            console.log(response.data)
            const code = response.data.sms_code;
            if (code) {
                clearInterval(interval);
                setNumberInfo((prev: any) => ({ ...prev, sms: code }));
                statusRef.current.stat = "used";

            } else if (attempts >= 15) {
                clearInterval(interval);
                setNumberInfo({
                    number: "",
                    sms: "⏱️ SMS polling timed out, code not sent."
                });
                statusRef.current.stat = "reject";
                setTimeout(() => setIsShow(false), 8000);
                localStorage.removeItem("numberInfo");
            }
        } catch (err) {
            clearInterval(interval);
            console.error("Polling error", err);
            statusRef.current.stat = "reject";
            localStorage.removeItem("numberInfo");
            setNumberInfo({
                number: "",
                sms: "❌ Error polling SMS"
            });
            setTimeout(() => {
              setNumberInfo({
                 number: "",
                 sms: ""
               })
              setIsShow(false)
            }, 8000);
        }
    }, 10000);
        return () => clearInterval(interval);
    }, [req_id, cancel]);
  
 
      const fetchSMSNumber = useCallback(async () => {
        if (!target.service || !target.country) return;
        if (cost > balance) {
          setError(true);
          return;
        }

      try {
        const { data } = await axios.post(`https://textflex-axd2.onrender.com/api/sms/get-number`, {
          ...target,
          price: cost,
        });

        const requestId = data.phone.request_id;
        const smsNumber = data.phone.number;
        
        setNumberInfo((prev: any) => ({ ...prev, number: smsNumber }));
        setIsShow(true);
        lastDebitRef.current = data.debitRef;
        setReqId(requestId)
      
        statusRef.current.stat = "ready";
          setTarget((prev:any) => ({
              ...prev,
              service:''
            }))
      } catch (err: any) {
        const msg = err.response?.data?.error || "Error occurred";
        setErrorInfo(msg);
        setIsError(true);
      }
      },[target , cost , balance])

    useEffect(() => {
      if (target.service && target.country && !cancel) {
        fetchSMSNumber();
      }
    },[fetchSMSNumber]);

    useEffect(() => {
      if (cancel && setNumberInfo) {
         statusRef.current.stat = "reject";
         statusRef.current.req_id = "";
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

  
     const handleInputChange = useCallback((e:React.ChangeEvent<HTMLSelectElement>) => {
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
      } else {
        setTarget((prev:any) => ({
          ...prev,
          country: '5'
         }))
        
      }  
      },[countries])

    const handleCountryChange = useCallback((e:React.ChangeEvent<HTMLSelectElement>) => {
      setTarget((prev:any) => {
        return({
          ...prev,
          country: e.target.value
        })
      }) 
    },[])

    useEffect(() => {
      if (error) {
        setTimeout(() => {
          setError(false)
        }, 3000);
      }
    },[error])

     const extractCode = useCallback((e:React.ChangeEvent<HTMLSelectElement>) => {  
       const selectedId = e.target.value
       const selectedItem = option.find((item: any) => item.application_id == selectedId);
        if (selectedItem) {
          setCost(prev => {
            const newCost = selectedItem.cost * 50;
            return prev !== newCost ? newCost : prev;
          })
        }
        setTarget((prev:any) => {
          return({
            ...prev,
            service:e.target.value
          })
         })
    },[option])

    useEffect(() => {
      return () => {
        shouldPoll.current = false;
      };
    }, []);

    const countryOption = useMemo(() => {
      if (provider === 'Dynamic') {
        return Object.values(countries).map((item: any) => (
          <option key={item.id} value={item.id}>{item.title}</option>
        ));
      } else {
        return <option value="5">USA</option>;
      }
    }, [countries, provider]);
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
                  {countryOption}
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
                 
              </Select> 
              {option.length == 0 && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
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

export default React.memo(Input);
