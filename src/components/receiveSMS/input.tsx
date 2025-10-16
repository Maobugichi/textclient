import Fieldset from "../fieldset";
import { SingleValue } from "react-select";
import React, { useRef, useState, useEffect, useContext } from "react";
import Select from "../select";
import { ShowContext } from "../context-provider";
import type { InputProps } from "./types";
import spinner from "../../assets/dualring.svg";
import { OptionType } from "../select";
import ClipLoader from "react-spinners/ClipLoader";
import { useCountries } from "./hook/useCountries";
import { useServices } from "./hook/useServices";
import { useGetSMSNumber } from "./hook/useSms";
import { useQueryClient } from "@tanstack/react-query";
import { usePollSms } from "./hook/usePolling";

const Input: React.FC<InputProps> = ({
  tableValues,
  setNumberInfo,
  setIsShow,
  theme,
  numberInfo,
  setReqId,
  cancel,
}) => {
  const [provider, setProvider] = useState<any>("Swift");
  const queryClient = useQueryClient();

  const myContext = useContext(ShowContext);
  if (!myContext)
  throw new Error("ShowContext must be used within a ContextProvider");
  const { userData } = myContext;
  const balance = tableValues[0]?.balance;

  const [options, setOptions] = useState<any[]>([]);
  const [cost, setCost] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const stock = useRef("");
  const actualCost = useRef<number>(0);
  const statusRef = useRef({ stat: "", req_id: "" });
  console.log(setOptions)
  console.log(setError)
  const raw = localStorage.getItem("cost_diff");
  const myCost = raw ? JSON.parse(raw) : null;

  const [target, setTarget] = useState<any>({
    provider,
    country: "5",
    service: "",
    user_id: userData.userId,
    email: userData.userEmail,
  });

  const { data: countries, isLoading } = useCountries(provider);
  const { data: services, isLoading: serviceLoading } = useServices(
    target.country
  );
  const { mutate: getSMSNumber, isPending } = useGetSMSNumber();

 
  usePollSms({
    cost,
    userId: userData.userId,
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
    stock.current = match?.count || "";
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

  // 🧩 Country change handler
  const handleCountryChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;
    setTarget((prev: any) => ({ ...prev, country: selectedOption.value }));
  };

  // 🧩 Service change handler
  const extractCode = (selectedOption: SingleValue<OptionType>) => {
    const match = selectedOption?.label.match(/₦([\d,]+\.\d{2})/);
    const selectedId = selectedOption?.value;
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      setCost(amount);
      setTarget((prev: any) => ({ ...prev, service: selectedId }));
    }
  };

  // 🧩 Get number mutation trigger
  const handleClick = () => {
    getSMSNumber(
      {
        target,
        cost,
        balance,
        actualCost: actualCost.current,
      },
      {
        onSuccess: (data) => {
          console.log("SMS Number:", data);
          setIsShow(true);
        },
      }
    );
  };

  return (
    <Fieldset
      provider={`${provider} SMS`}
      className={`w-full  border border-[#ccc] p-1 py-5 border-solid rounded-md h-fit min-h-[300px] grid space-y-4 bg-[#EEF4FD] md:w-[35%]`}
    >
     
      <Fieldset provider="Service Provider">
        <Select
          id="providers"
          onChange={handleInputChange}
          theme={theme}
          options={[
            { label: "Swift SMS", value: "Swift" },
            { label: "Dynamic SMS", value: "Dynamic" },
          ]}
          value={{ label: provider, value: provider }}
        />
      </Fieldset>

      {/* Country */}
      <Fieldset provider="Country">
        {isLoading ? (
          <div className="flex bg-white w-[95%] mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} />
            <span className="ml-2 text-sm text-gray-500">
              Loading countries...
            </span>
          </div>
        ) : (
          <Select
            id="country"
            onChange={handleCountryChange}
            theme={theme}
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

      {/* Service */}
      <Fieldset provider="Service">
        {serviceLoading ? (
          <div className="flex bg-white w-[95%] mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} />
            <span className="ml-2 text-sm text-gray-500">
              Loading services...
            </span>
          </div>
        ) : (
          <Select
            id="services"
            onChange={extractCode}
            theme={theme}
            isDisabled={error}
            options={(services ?? []).map((opt) => {
              const rate: any = localStorage.getItem("rate");
              const rateObj = JSON.parse(rate);
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
              options
                .map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))
                .find((opt) => opt.value === target.service) || null
            }
          />
        )}
      </Fieldset>

      {/* Stock */}
      {target.country && target.service && (
        <Fieldset provider="Stock">
          <input
            disabled
            value={stock.current}
            className={`${
              theme ? "bg-transparent" : "bg-white"
            } text-gray-500 pl-5 w-[95%] mx-auto h-12 rounded-sm border border-blue-200`}
          />
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

      {/* Number + Code Display */}
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
    </Fieldset>
  );
};

export default React.memo(Input);
