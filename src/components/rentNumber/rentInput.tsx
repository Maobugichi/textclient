import { useState , useEffect , useContext , useMemo } from "react";
import axios from "axios";
import Form from "../form";
import Fieldset from "../fieldset";
import Select from "../select";
import { getPeriodOptions } from "./getPeriod";
import interwind from "../../assets/Interwind.svg"
import { ShowContext } from "../context-provider";
import {Dispatch , SetStateAction } from 'react';
import spinner from "../../assets/dualring.svg";
import { OptionType } from "../select";

interface RentProps {
    balance:string;
    setNumberInfo:Dispatch<SetStateAction<any>> ;
    setIsShow:Dispatch<SetStateAction<any>> ;
    tableValue:any
}


const RentInput:React.FC<RentProps> = ({   setNumberInfo , setIsShow , tableValue }) => {
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
  
    
    const [ liveCost, setLiveCost ] = useState({
        low_Cost:"",
        hight_cost:"",
        rent_cost:""
    })
  

    useEffect(() => {
      axios.get('https://api.textflex.net/api/costs')
       .then(function(response) {
        
            setLiveCost(response.data[0])
         })
    },[])
    useEffect(() => {
        axios.get('https://api.textflex.net/api/sms/countries')
         .then(function(response) {
            setApiResponse(response.data);
         })
    },[]);

    useEffect(() => {
        if (apiResponse) {
            const listArray = Object.values(apiResponse);
            const formattedOptions = listArray.map((item: any) => ({
            label: item.title,
            value: item.id,
            }));
            setList(formattedOptions); 
             if (formattedOptions.length > 0) {
            setInfo((prev: any) => ({
                ...prev,
                countryId: formattedOptions[0].value,
            }));
            }
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
                   
                    const dollarCost = Number(cost) / 100
                    const rate:any = localStorage.getItem("rate")
                    const rateObj = JSON.parse(rate)
                   
                    const nairaCost = dollarCost * rateObj.rate
                  
                    const gains = parseFloat(liveCost.rent_cost) 
                   
                    const price = nairaCost * (1 + gains)
                    setShowBtn(true)    
                    setLimits((prev:any) => ({
                        ...prev,
                        countryId:country_id, 
                        count:count,
                        cost:price
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

    const durationOptions: OptionType[] = ["hour", "day", "week", "month"].map((item) => ({
    label: item,
    value: item,
    }));

    const periodOptions = useMemo(() => getPeriodOptions(max), [max]);
   
   function getCountryId(selectedOption: OptionType | null) {
     const target = selectedOption?.value || "";
     setInfo((prev:any) => ({
        ...prev,
        countryId:target
    }));
   }

    function changeDuration(selectedOption: OptionType | null) {
        const target = selectedOption?.value || "";
        if (target == 'day') {
            setMax(7)
        } else if (target == 'week') {
            setMax(4)
        } else if (target == 'month') {
            setMax(12)
        } else if (target == 'hour') {
            setMax(24)
        }
        setInfo((prev:any) => ({
            ...prev,
            duration:target
        }))
    }

    function changePeriod(selectedOption: OptionType | null) {
        const target = selectedOption?.value || "";
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
            }, 4000);
        }
        return () => clearTimeout(myTimeout)
    }, [limits])
    return(
        <Form
         className={` mx-auto dark:bg-[#171717] bg-[#EEF4FD]  w-full font-normal h-fit  py-5 rounded-xl flex flex-col gap-4 justify-center border border-solid border-[#5252]  dark:text-white`}
         onSubmit={getNumber}
        >
            <Fieldset
             provider='Country'
             className="font-semibold"
            > 
            <Select
             options={list} 
             onChange={getCountryId}
             value={list.length && list.find((option:any) => option.value === info.countryId) || null}
           
            />
               
            </Fieldset>
            <Fieldset
             provider='Duration'
             className=" flex font-semibold flex-col w-[97%] gap-4"
            > 
               <Select
                options={durationOptions}
                onChange={changeDuration}
                value={durationOptions.find(option => option.value === info.duration) || null}
                className="ml-3"
             
                placeholder="Select a time"
                />
              <Select 
                onChange={changePeriod}
                options={periodOptions}
                value={periodOptions.find(opt => opt.value === info.period) || null}
               
                className={`${info.duration !== '' ? 'block ml-3' : 'hidden'}`}
                placeholder="Select a period"
                />

            </Fieldset>
            <Fieldset
             provider="Stock"
             className="font-semibold"
            >
                <div  className="relative w-full  flex items-center">
                   <input className={`p-3 rounded-xl  border border-gray-300 border-solid focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-[#242424] dark:text-white dark:border-blue-400 w-[95%] mx-auto cursor-not-allowed text-gray-400`} disabled type="text" value={limits.count ?? ''}/>
                   {limits.count == '' && showBtn && <img className="w-8 absolute left-[43%] top-[20%]" src={spinner} alt="Loading" width="20" />}
                </div>
            </Fieldset>

            <Fieldset
             provider="Price"
            className="font-semibold"
            >
                <div className="relative w-full  flex items-center">
                 <input className={`p-3 rounded-xl border  border-gray-300 border-solid focus:ring-2 focus:ring-blue-500 focus:outline-none outline-1  dark:bg-[#242424] dark:text-white dark:border-blue-400 w-[95%] mx-auto cursor-not-allowed text-gray-400`} disabled type="text" value={limits.cost ?? ''}/>
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
                        <div className="border border-solid border-red-400 text-red-400 grid place-items-center h-fit min-h-[75px] text-[15px] w-[90%] mx-auto rounded-md">
                          <p className="w-[90%]">No stock available for the selected duration</p>
                        </div>
                     )
            }
           
        </Form>
    )
}

export default RentInput