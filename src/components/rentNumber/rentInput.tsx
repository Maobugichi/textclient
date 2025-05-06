import { useState , useEffect } from "react";
import axios from "axios";
import Form from "../form";
import Fieldset from "../fieldset";
import Option from "../option";
import Select from "../select";
import Duration from "./duration";
import Period from "./period";
import Button from "../button";


const RentInput = () => {
    const [ apiResponse , setApiResponse ] = useState<any>('');
    const [ list , setList ] = useState<any>('');
    const [ max , setMax ] = useState<number>(24);
    const [ info , setInfo ] = useState<any>({
        countryId:'',
        duration:'',
        period:''
    });
    const [ limits , setLimits ] = useState<any>({
        countryId:"",
        count:"",
        cost:''
    });
    const [ showBtn , setShowBtn ] = useState<boolean>(false);
    const [ showErr , setShowErr ] = useState<boolean>(false)
    const [ rentDetails , setRentDetails ] = useState<any>('');

    useEffect(() => {
        axios.get('https://textflex-axd2.onrender.com/api/sms/countries')
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
                await axios.post('https://textflex-axd2.onrender.com/api/rent/countries', info)
                .then(function(res) {
                    const { data } = res.data;
                    const { limits } = data;
                    if (limits.length >= 1) {
                        console.log('hello');
                    const { country_id , count , cost } = limits[0];
                    setShowBtn(true)    
                    setLimits((prev:any) => ({
                        ...prev,
                        countryId:country_id, 
                        count:count,
                        cost:cost
                    }))
                    setShowErr(false)
                    } else {
                        setInfo({
                            countryId:'',
                            duration:'',
                            period:''
                          })
                          setLimits({
                            countryId:"",
                            count:0,
                            cost:''
                            })
                        setShowErr(true)
                    }
                })
            }, 1000);
       }
    },[info])

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
       const { countryId , duration, period } = info;
       if (countryId !== '' && duration !== '' && period !== '') {
          const response = await axios.post(`https://textflex-axd2.onrender.com/api/rent-number`, info);
          console.log(response.data)
          setRentDetails(response)
          setInfo({
            countryId:'',
            duration:'',
            period:''
          })
          setLimits({
            countryId:"",
            count:0,
            cost:''
            })
          console.log(rentDetails)
       } else {
        return
       }
       
    }
    return(
        
        <Form
         className='w-[95%] mx-auto md:w-[32%] h-fit min-h-[350px] p-2 rounded-lg flex flex-col gap-4 justify-center border border-solid border-[#5252]'
         onSubmit={getNumber}
        >
            <Fieldset
             provider='Country'
            > 
               <Select 
                onChange={getCountryId}
                value={info.countryId}
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
               >
                 <option value=""  disabled selected hidden>Select a time</option>
                 <Duration/>
               </Select>
               <Select 
                onChange={changePeriod}
                value={info.period}
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
               <input className="p-3.5  rounded-sm outline-1 outline-[#5252] w-[95%] mx-auto cursor-not-allowed text-gray-400" disabled type="text" value={limits.count ?? ''}/>
            </Fieldset>

            <Fieldset
             provider="Price"
            >
               <input className="p-3.5  rounded-sm outline-1 w-[95%] outline-[#5252] mx-auto cursor-not-allowed text-gray-400" disabled type="text" value={limits.cost ?? ''} />
            </Fieldset>
            {
               showBtn &&
               (
                <div className="w-[90%] mx-auto h-fit min-h-[100px] grid text-sm">
                    <div className="flex justify-between ">
                        <p className="flex flex-col">Cost <span>{limits.cost}</span></p>
                        <p className="flex flex-col">Wallet <span></span></p>
                    </div>
                    <Button
                      content="Rent Number"
                      className="w-full bg-[#0032a5]  h-10 rounded-sm text-white"
                    />
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