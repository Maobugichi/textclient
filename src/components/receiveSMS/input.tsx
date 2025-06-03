import Fieldset from "../fieldset";
import React, { useRef, useState , useCallback ,useEffect , useContext , useMemo } from "react";
import axios from "axios";
import Select from "../select";
import { ShowContext } from "../context-provider";
import {Dispatch , SetStateAction } from 'react';
import spinner from "../../assets/dualring.svg";
import interwind from "../../assets/Interwind.svg"

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
      user_id: userData.userId,
      email:userData.userEmail
    });
    const shouldPoll = useRef(true);
    const statusRef = useRef({ stat: "", req_id: ""});
    const lastDebitRef = useRef("");
    const [ cost , setCost ] = useState<number>(0)
    const  balance = tableValues[0]?.balance;
    const [ error , setError ] = useState<boolean>(false);
    const [ showLoader , setShowLoader ] = useState<boolean>(false)
    const stock = useRef('')
    useEffect(() => {
       axios.get('https://api.textflex.net/api/sms/countries')
         .then(function(response) {
             setCountries(response.data);
         })
         .catch(function (error) {
            console.log(error)
           })
           .finally(function () {
         })
    },[provider]);


      useEffect(() => {
         const savedInfo = localStorage.getItem("numberInfo");
         const savedReqId = localStorage.getItem("req_id");
         const savedDebitRef = localStorage.getItem("lastDebitRef");
         const storedCost = localStorage.getItem("cost");
          if (savedReqId && savedDebitRef && savedInfo && storedCost) {
                setReqId(savedReqId);
                lastDebitRef.current = savedDebitRef;
                setNumberInfo(JSON.parse(savedInfo));
                setCost(parseFloat(storedCost))
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
          const { country } = target
          setOption([])
            const response = await axios.get(`https://api.textflex.net/api/sms/price`,{
              params:{id: Number(country)}
            });
            
          setOption(Object.values(response.data));
        } catch (err) {
          console.error("Error fetching countries");
        }
      };
     getCountries();
    }, [target]);

    async function refund(user_id:any , cost:any , debitRef:string , request_id:string) {
        await axios.post('https://api.textflex.net/api/refund-user', {
        user_id , cost , debitRef , request_id
       })
    }

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
         
            const response = await axios.get(`https://api.textflex.net/api/sms/status/${req_id}`, {
                params: {
                    cost,
                    user_id: userData.userId,
                    attempts,
                    debitref: lastDebitRef.current
                }
            });
            const code = response.data.sms_code;
            if (code) {
                clearInterval(interval);
                setNumberInfo((prev: any) => ({ ...prev, sms: code }));
                statusRef.current.stat = "used";
                localStorage.removeItem("req_id");
                localStorage.removeItem("lastDebitRef");
                localStorage.removeItem("cost");
                localStorage.removeItem("numberInfo");
            } else if (attempts >= 15) {
                clearInterval(interval);
                setNumberInfo({
                    number: "",
                    sms: "⏱️ SMS polling timed out, code not sent."
                });
                statusRef.current.stat = "reject";
                localStorage.removeItem("req_id");
                localStorage.removeItem("lastDebitRef");
                localStorage.removeItem("cost");
                localStorage.removeItem("numberInfo");
                setTimeout(() => {
                  setNumberInfo({
                    number: "",
                    sms: ""
                  });
                  setIsShow(false), 8000});
            }
        } catch (err) {
            clearInterval(interval);
            await refund(userData.userId, cost ,lastDebitRef.current ,req_id )
            statusRef.current.stat = "reject";
            localStorage.removeItem("req_id");
            localStorage.removeItem("lastDebitRef");
            localStorage.removeItem("cost");
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
      setShowLoader(true)
      try {
        const { data } = await axios.post(`https://api.textflex.net/api/sms/get-number`, {
          ...target,
          price: cost,
        });
       
         setShowLoader(false)
        if (data.phone?.error_msg) {
          setErrorInfo(data.phone?.error_msg);
          setIsError(true);
          return 
        }
        const requestId = data.phone.request_id;
        const smsNumber = data.phone.number;

        setNumberInfo((prev: any) => ({ ...prev, number: smsNumber }));
        setIsShow(true);
        lastDebitRef.current = data.debitRef;
        setReqId(requestId)
        localStorage.setItem("req_id", requestId);
        localStorage.setItem("lastDebitRef", data.debitRef);
        localStorage.setItem("cost", cost.toString());
        statusRef.current.stat = "ready";
          setTarget((prev:any) => ({
              ...prev,
              service:''
            }))
      } catch (err: any) {
        console.log(err)
        const msg = err.response?.data?.error || "Error occurred";
         setShowLoader(false)
        setErrorInfo(msg);
        setIsError(true);
      }
    },[target , cost , balance])

   

    useEffect(() => {
      console.log('hello')
      if (cancel) {
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
          <option className={`${theme ? "bg-black" : "bg-white"}`} key={item.id} value={item.id}>{item.title}</option>
        ));
      } else {
        return <option className={`${theme ? "bg-black" : "bg-white"}`} value="5">USA</option>;
      }
    }, [countries, provider]);

    useEffect(() => {
      const newArray = option.filter((item:any) =>  item.country_id == target.country && item.application_id == target.service)
      stock.current = newArray[0]?.count
    },[target,option])
    return(
        <Fieldset
         provider={`${provider} SMS`}
         className={`${theme ? 'bg-transparent border border-solid border-blue-200 text-white' :'bg-[#EEF4FD]'} w-[95%] mx-auto md:w-[32%] h-fit min-h-[340px] md:min-h-[300px] rounded-lg flex flex-col  gap-4 justify-center  border border-solid pb-5 border-[#5252]`}
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
              <option className={`${theme ? "bg-black" : "bg-white"}`} value="Swift">Swift SMS</option>
              <option className={`${theme ? "bg-black" : "bg-white"}`} value="Dynamic">Dynamic SMS</option>
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
                  {option?.map((item:any) => {
                    
                    const multiplier = item.cost > 200 ? 15 : 50
                    return  <option className={`${theme ? "bg-black" : "bg-white"}`} key={item.application_id} value={item.application_id}>{`${item.application} - ${(item.cost * multiplier).toLocaleString('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 2
                      }).replace('NGN', '').trim()}`}</option>
                    })}
                 
              </Select> 
              {option.length == 0 && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
             </div>
            </Fieldset> 
            { target.country !== '' && target.service !== '' &&  <Fieldset provider="Stock">
                <input className={`${theme ?  'bg-transparent' : "bg-white"} relative text-gray-500 border-blue-200 pl-5 w-[95%] mx-auto h-12 rounded-sm border border-solid cursor-not-allowed`} value={stock.current ?? ''} disabled /> 
                 {stock.current == '' && <img className="w-8 absolute left-[43%] top-[47%] md:top-[77%] md:left-32" src={spinner} alt="Loading" width="20" />}
              </Fieldset> }
             { target.country !== '' && target.service !== '' && <button onClick={fetchSMSNumber} className={`w-[90%]  h-[40px]  md:h-10 mx-auto text-white text-sm grid place-items-center  rounded ${cost > balance ? 'bg-[#0032a5]/20' : 'bg-[#0032a5]'}`}>{ showLoader ?  <img className="h-10" src={interwind}/> :'Get Number'}</button> }
          
          
            {
              numberInfo.number !== '' && (
              <div className=" h-20 mb-2 rounded-md mx-auto border border-solid grid place-items-center border-gray-300 bg-white w-[90%]">
                <p className="w-[90%] text-sm">number: {numberInfo.number}</p>
                 <p className="relative w-[90%] text-sm">code: {numberInfo.sms ? numberInfo.sms : <img className="w-8 absolute left-[33%] top-[-5px] " src={spinner} alt="Loading" />}</p>
              </div>)
            }
             
        </Fieldset>

    )
}

export default React.memo(Input);
