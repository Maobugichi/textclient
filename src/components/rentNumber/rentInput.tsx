import { useState , useEffect , useContext } from "react";
import axios from "axios";
import Form from "../form";
import Fieldset from "../fieldset";
import Option from "../option";
import Select from "../select";
import Duration from "./duration";
import Period from "./period";
import interwind from "../../assets/Interwind.svg"
import { ShowContext } from "../context-provider";
import {Dispatch , SetStateAction } from 'react';
import spinner from "../../assets/dualring.svg";

interface RentProps {
    theme:boolean;
    balance:string;
    setNumberInfo:Dispatch<SetStateAction<any>> ;
    setIsShow:Dispatch<SetStateAction<any>> ;
    tableValue:any
}

const RentInput:React.FC<RentProps> = ({ theme ,  setNumberInfo , setIsShow , tableValue }) => {
    const myContext = useContext(ShowContext);
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const [ apiResponse , setApiResponse ] = useState<any>('');
    const  balance = tableValue[0]?.balance;
    const [ list , setList ] = useState<any>('');
    const [ max , setMax ] = useState<number>(24);
    const [ limits , setLimits ] = useState<any>({
        countryId:"",
        count:"",
        cost:''
    });
    const [ info , setInfo ] = useState<any>({
        countryId:'',
        duration:'',
        period:'',
        price:'',
        user_id:userData.userId
    });
    
    const [ showBtn , setShowBtn ] = useState<boolean>(false);
    const [ showErr , setShowErr ] = useState<boolean>(false)
    const [ showLoader , setShowLoader ] = useState<any>(false);

    useEffect(() => {
        axios.get('https://api.textflex.net/api/sms/countries')
         .then(function(response) {
            setApiResponse(response.data)
         })
    },[]);

    useEffect(() => {
        if (apiResponse) {
            const listArray = Array.from(Object.values(apiResponse));
            const lists = listArray.map((item:any) => (
                 <Option
                  key={item.id}
                  value={item.id}
                 >
                    {item.title}
                 </Option>
            ))
            setList(lists)
        }
    },[apiResponse]);



    useEffect(() => {
       if ( info.countryId !== '' && info.duration !== '' && info.period !== '') {
             setTimeout(async () => {
                await axios.post('https://api.textflex.net/api/rent/countries', info)
                .then(function(res) {
                    const { data } = res.data;
                    const { limits } = data;
                   
                    if (limits.length >= 1) {
                    const { country_id , count , cost } = limits[0];
                    setShowBtn(true)    
                    setLimits((prev:any) => ({
                        ...prev,
                        countryId:country_id, 
                        count:count,
                        cost:cost
                    }))
                    
                    } else {
                        setLimits({
                         countryId:"",
                         count:0,
                         cost:0
                      })
                     setShowErr(true)
                      setInfo({
                            countryId:'',
                            duration:'',
                            period:''
                      })
                     setTimeout(() => {
                        setLimits({
                          countryId:"",
                          count:'',
                          cost:''
                      })
                      
                     }, 3000);
                    }
                })
            }, 1000);
       }
    },[info])

    useEffect(() => {
        if (limits.cost !== '') {
             setInfo((prev:any) => ({
                ...prev,
                price:limits.cost
            }))
        }
    },[limits.cost])

   
   function getCountryId(e:React.ChangeEvent<HTMLSelectElement>) {
     const target = e.target.value;
     setInfo((prev:any) => ({
        ...prev,
        countryId:target
    }));
   }

    function changeDuration(e:React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target.value;
        if (target == 'day') {
            setMax(7)
        } else if (target == 'week') {
            setMax(4)
        } else if (target == 'month') {
            setMax(1)
        } else if (target == 'hour') {
            setMax(24)
        }
        setInfo((prev:any) => ({
            ...prev,
            duration:target
        }))
    }

    function changePeriod(e:React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target.value;
        setInfo((prev:any) => ({
            ...prev,
            period:target
        }));
    }

    async function getNumber(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { countryId , duration, period , price } = info;
        if (countryId !== '' && duration !== '' && period !== '' && price !== '' || price !== 0) {
            setShowLoader(true)
            const response = await axios.post(`https://api.textflex.net/api/rent-number`, info);
            console.log(response.data)
            if (response.data?.number) {
                setNumberInfo({
                    number:response.data.number
                })
                setIsShow(true)
            }
            setShowLoader(false)
            setInfo({
                countryId:'',
                duration:'',
                period:''
            })
            setLimits({
                countryId:"",
                count:'',
                cost:''
            })

            setTimeout(() => {
              setShowBtn(false)
            }, 8000);
            
        } else {
            return
        }
       
    }

    useEffect(() => {
        let myTimeout:any
        if (showErr) {
            myTimeout = setTimeout(() => {
                setShowErr(false)
            }, 2000);
        }
        return () => clearTimeout(myTimeout)
    }, [limits])
    return(
        <Form
         className={`w-[95%] mx-auto md:w-[32%] h-fit  p-2 rounded-lg flex flex-col gap-4 justify-center border border-solid border-[#5252] ${theme ? 'bg-transparent border-blue-200' : 'bg-[#EEF4FD]'}`}
         onSubmit={getNumber}
        >
            <Fieldset
             provider='Country'
            > 
               <Select 
                onChange={getCountryId}
                value={info.countryId}
                theme={theme}
               >
                  <option value=""  disabled selected hidden>Select a Country</option>
                 {list}
               </Select>
            </Fieldset>
            <Fieldset
             provider='Duration'
             className=" flex  flex-col w-[97%] gap-4"
            > 
               <Select
                onChange={changeDuration}
                value={info.duration}
                className="ml-3"
                theme={theme}
               >
                 <option value=""  disabled selected hidden>Select a time</option>
                 <Duration/>
               </Select>
               <Select 
                onChange={changePeriod}
                value={info.period}
                theme={theme}
                className={`${info.duration !== '' ? 'block' : 'hidden'} ml-3`}
                >
                    <option value='' disabled selected hidden>Select a period</option>
                    <Period
                     max={max}
                    />
               </Select>
            </Fieldset>
            <Fieldset
             provider="Stock"
            >
                <div  className="relative w-full  flex items-center">
                   <input className={`p-3.5  rounded-sm border border-gray-300 border-solid focus:ring-2 focus:ring-blue-500 focus:outline-none  ${theme ? 'bg-transparent border-blue-200' : 'bg-white border-[#5252]'} w-[95%] mx-auto cursor-not-allowed text-gray-400`} disabled type="text" value={limits.count ?? ''}/>
                   {limits.count == '' && showBtn && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
                </div>
            </Fieldset>

            <Fieldset
             provider="Price"
            >
                <div className="relative w-full  flex items-center">
                 <input className={`p-3.5  rounded-sm border  border-gray-300 border-solid focus:ring-2 focus:ring-blue-500 focus:outline-none outline-1  ${theme ? 'bg-transparent border-blue-200' : 'bg-white border-[#5252]'} w-[95%] mx-auto cursor-not-allowed text-gray-400`} disabled type="text" value={limits.cost ?? ''}/>
                 {limits.cost == '' && showBtn && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
                </div>
                
            </Fieldset>
            {
               showBtn &&
               (
                <div className="w-[90%] mx-auto h-fit min-h-[100px] grid text-sm">
                    <div className="flex justify-between ">
                        <p className="flex flex-col">Cost <span>{`₦${Number(String(limits.cost).replace(/[^0-9.-]+/g, '')).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}`}</span></p>
                        <p className="flex flex-col">Wallet <span>{`₦${Number(String(balance).replace(/[^0-9.-]+/g, '')).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}`}</span></p>
                    </div>
                    <button className={`w-full  h-[40px]  md:h-10 mx-auto text-white text-sm grid place-items-center  rounded ${limits.cost > balance ? 'bg-[#0032a5]/20' : 'bg-[#0032a5]'}`}>{ showLoader ?  <img className="h-10" src={interwind}/> :'Get Number'}</button>
                </div>
               ) 
            }

            {
                showErr && 
                     (
                        <div className="border border-solid border-red-400 text-red-400 grid place-items-center h-fit min-h-[75px] text-[15px]  rounded-md">
                          <p className="w-[90%]">No stock available for the selected duration</p>
                        </div>
                     )
            }
           
        </Form>
    )
}

export default RentInput