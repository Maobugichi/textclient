import { useState , useEffect } from "react";
import axios from "axios";
import Form from "../form";
import Fieldset from "../fieldset";
import Option from "../option";
import Select from "../select";
import Duration from "./duration";
import Period from "./period";


const RentInput = () => {
    const [ apiResponse , setApiResponse ] = useState<any>('');
    const [ list , setList ] = useState<any>('');
    const [ max , setMax ] = useState<number>(24);
    const [ info , setInfo ] = useState<any>({
        countryId:'',
        duration:'',
        period:''
    });
    const [ stock , setStock ] = useState<any>('');
    const [ cost , setCost ] = useState<any>('')
    useEffect(() => {
        axios.get('/api/sms/countries')
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
            await axios.post('/api/rent/countries', info)
             .then(function(res) {
                const { data } = res.data;
                const { limits } = data;
                if (limits.length >= 1) {
                   setStock(limits[0].count)
                   setCost(limits[0].cost)
                } else {
                    setStock(0)
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
    return(
        
        <Form
         className='w-[32%] h-[350px] p-2 rounded-lg flex flex-col gap-4 justify-center bg-red-200'
        >
            <Fieldset
             provider='Country'
            > 
               <Select 
                onChange={getCountryId}
               >
                  <option value=""  disabled selected hidden>Select a Country</option>
                 {list}
               </Select>
            </Fieldset>
            <Fieldset
             provider='Duration'
             className=" flex items-center"
            > 
               <Select
                onChange={changeDuration}
               >
                 <option value=""  disabled selected hidden>Select a time</option>
                 <Duration/>
               </Select>
               <Select 
                onChange={changePeriod}
                className={`${info.duration !== '' ? 'block' : 'hidden'}`}
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
               <input className="p-2.5  rounded-sm outline-1 w-[95%] mx-auto" disabled type="text" value={stock ?? ''}/>
            </Fieldset>

            <Fieldset
             provider="Price"
            >
               <input className="p-2.5  rounded-sm outline-1 w-[95%] mx-auto" disabled type="text" value={cost ?? ''} />
            </Fieldset>

        </Form>
    )
}

export default RentInput