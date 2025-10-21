import Fieldset from "../fieldset";
import { SingleValue } from "react-select";
import React, { useRef, useState, useEffect } from "react";
import Select from "../select";
import type { InputProps } from "./types";
import spinner from "../../assets/dualring.svg";
import { OptionType } from "../select";
import ClipLoader from "react-spinners/ClipLoader";
import { useCountries } from "./hook/useCountries";
import { useServices } from "./hook/useServices";
import { useGetSMSNumber } from "./hook/useSms";
import { useQueryClient } from "@tanstack/react-query";
import { usePollSms } from "./hook/usePolling";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
import { useTheme } from "next-themes";
import { useExchangeRate } from "../dashboard/hooks/useUerData";

const Input: React.FC<InputProps> = ({
  tableValues,
  setNumberInfo,
  setIsShow,
  numberInfo,
  setReqId,
  cancel,
}) => {
  const [provider, setProvider] = useState<any>("Swift");
  const queryClient = useQueryClient();

  const { user:userData } = useAuth();
  
  const balance = tableValues[0]?.balance;

  const [options, setOptions] = useState<any[]>([]);
  const [cost, setCost] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [ stocksCount , setStocksCount ] = useState()
  //const stock = useRef("");
  const actualCost = useRef<number>(0);
  const statusRef = useRef({ stat: "", req_id: "" });
  const { data:rateObj } = useExchangeRate();
  console.log(setOptions)
  console.log(setError)
  const raw = localStorage.getItem("cost_diff");
  const myCost = raw ? JSON.parse(raw) : null;

  const [target, setTarget] = useState<any>({
    provider,
    country: "5",
    service: "",
    user_id: userData?.userId,
    email: userData?.userEmail,
  });

  console.log(options)
  const { data: countries, isLoading } = useCountries(provider);
  const { data: services, isLoading: serviceLoading } = useServices(
    target.country
  );
  const { mutate: getSMSNumber, isPending } = useGetSMSNumber();

 
  usePollSms({
    cost,
    userId: userData?.userId,
    actualCost,
    statusRef,
    setNumberInfo,
    setIsShow,
    cancel,
  });

  
  useEffect(() => {
    const smsInfo = queryClient.getQueryData<any>(["smsRequest"]);
    if (smsInfo) {
      setNumberInfo({ number: smsInfo.purchased_number, sms: "" });
      setReqId(smsInfo.request_id);
      setCost(smsInfo.cost);
    }
  }, []);

 
  useEffect(() => {
    if (cancel) {
      statusRef.current = { stat: "reject", req_id: "" };
      setReqId("");
      setNumberInfo({ number: "", sms: "" });
      setTarget((prev: any) => ({ ...prev, service: "" }));
    }
  }, [cancel]);


  useEffect(() => {
    const match = services?.find(
      (item) =>
        item.country_id === target.country &&
        item.application_id === target.service
    );

    setStocksCount(match?.count || "")
    
  }, [target, services]);

  
  const handleInputChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;
    const selectedProvider = selectedOption.value;
    setProvider(selectedProvider);

    const country =
      selectedProvider === "Dynamic"
        ? Object.values(countries ?? [])[0]?.id || "5"
        : "5";

    setTarget((prev: any) => ({ ...prev, provider: selectedProvider, country }));
  };

 
  const handleCountryChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;
    setTarget((prev: any) => ({ ...prev, country: selectedOption.value }));
  };

  const extractCode = (selectedOption: SingleValue<OptionType>) => {
    const match = selectedOption?.label.match(/₦([\d,]+\.\d{2})/);
    const selectedId = selectedOption?.value;
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      setCost(amount);
      setTarget((prev: any) => ({ ...prev, service: selectedId }));
    }
  };

  
  const handleClick = () => {
    getSMSNumber(
      {
        target,
        cost,
        balance,
        actualCost: actualCost.current,
      },
      {
        onSuccess: () => {
          toast.success('purchased number successfully')
          setIsShow(true);
        },
      }
    );
  };

   const { theme } = useTheme(); 
   const isDark = theme === "dark";
  return (
   <Card className="dark:bg-[#171717] bg-[#EEF4FD]  h-fit">
     <Fieldset
      provider={`${provider} SMS`}
      className="font-semibold "
    >
        <Select
          id="providers"
          onChange={handleInputChange}
        
          options={[
            { label: "Swift SMS", value: "Swift" },
            { label: "Dynamic SMS", value: "Dynamic" },
          ]}
          value={{ label: provider, value: provider }}
        />
      </Fieldset>

      <Fieldset className="font-semibold " provider="Country">
        {isLoading ? (
          <div className="flex bg-white dark:bg-[#242424] w-[95%] dark:text-white dark:border-blue-400 rounded-xl mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} color={isDark ? '#fff' : '#000'}/>
            <span className="ml-2 text-sm dark:text-white text-gray-500">
              Loading countries...
            </span>
          </div>
        ) : (
          <Select
            id="country"
            onChange={handleCountryChange}
            
            options={Object.values(countries ?? []).map((item: any) => ({
              label: item.title,
              value: item.id.toString(),
            }))}
            value={
              Object.values(countries ?? [])
                .map((item: any) => ({
                  label: item.title,
                  value: item.id.toString(),
                }))
                .find((opt) => opt.value === target.country) || null
            }
          />
        )}
      </Fieldset>
      
      <Fieldset className="font-semibold " provider="Service">
        {serviceLoading ? (
          <div className="flex rounded-xl border dark:bg-[#242424] dark:text-white dark:border-blue-400 bg-white w-[95%] mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} color={isDark ? '#fff' : '#000'}/>
            <span className="ml-2 text-sm dark:text-white text-gray-500">
              Loading services...
            </span>
          </div>
        ) : (
          <Select
            id="services"
            onChange={extractCode}
           
            isDisabled={error}
            options={(services ?? []).map((opt) => {
             
              const usd = opt.cost / 100;
              const nairaCost = usd * rateObj.rate;
              const gains =
                nairaCost <= 1000
                  ? parseFloat(myCost.low_cost)
                  : parseFloat(myCost.high_cost);
              const totalPrice = nairaCost * (1 + gains);
              const price = totalPrice.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              });
              return {
                label: `${opt.application} - ${price.replace("NGN", "").trim()}`,
                value: opt.application_id,
              };
            })}
            value={
               Object.values(services ?? [])
                .map((opt:any) => ({
                  label: opt.application,
                  value: opt.application_id,
                }))
                .find((opt) => {
                  
                 return opt.value === target.service
                }) 
                || null
            }
          />
        )}
      </Fieldset>
     
      {target.country && target.service && (
        <Fieldset className="font-semibold grid place-items-center" provider="Stock">
          {
            stocksCount == "" ?
            <div
            className={`${
                theme ? "bg-transparent" : "bg-white"
              } text-gray-500 pl-5 w-[95%] mx-auto h-12 grid place-items-center rounded-xl border border-blue-200`}
            > 
            <ClipLoader size={20}/>
            </div>  : 
            (<input
            disabled
            value={stocksCount}
            className={`${
              theme ? "bg-transparent" : "bg-white"
            } text-gray-500 pl-5 w-[95%] mx-auto h-12 rounded-xl border border-blue-200`}
          />)
          }
          
        </Fieldset>
      )}

      
      {target.country && target.service && (
        <button
          onClick={handleClick}
          className={`w-[90%] h-10 mx-auto text-white text-sm grid place-items-center rounded ${
            cost > balance ? "bg-[#0032a5]/20" : "bg-[#0032a5]"
          }`}
        >
          {isPending ? <ClipLoader size={14} color="white"/> : "Get Number"}
        </button>
      )}

      {numberInfo.number && (
        <div className="h-20 mb-2 rounded-md mx-auto border grid place-items-center border-gray-300 bg-white w-[90%]">
          <p className="text-sm w-[90%]">number: {numberInfo.number}</p>
          <p className="relative text-sm w-[90%]">
            code:{" "}
            {numberInfo.sms || (
              <img
                className="w-8 absolute left-[33%] top-[-5px]"
                src={spinner}
              />
            )}
          </p>
        </div>
      )}
    
   </Card>
   
  );
};

export default React.memo(Input);
