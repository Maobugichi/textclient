import Fieldset from "../fieldset";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import Select from "../select";
import { ShowContext } from "../context-provider";
import { Dispatch, SetStateAction } from "react";
import spinner from "../../assets/dualring.svg";
import interwind from "../../assets/Interwind.svg";
import { OptionType } from "../select";
interface InputProps {
  tableValues: any;
  numberInfo: any;
  setNumberInfo: Dispatch<SetStateAction<any>>;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<any>>;
  setErrorInfo: Dispatch<SetStateAction<any>>;
  setReqId: Dispatch<SetStateAction<any>>;
  theme: boolean;
  cancel: boolean;
  req_id: string;
}



interface Country {
  id: string;
  title: string;
  [key: string]: any;
}

interface Cost {
  id: number;
  low_cost: number;
  high_cost: number;
}

const Input: React.FC<InputProps> = ({
  tableValues,
  setNumberInfo,
  setIsShow,
  setIsError,
  setErrorInfo,
  theme,
  numberInfo,
  setReqId,
  cancel,
  req_id
}) => {
  const myContext = useContext(ShowContext);
  if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");

  const { userData } = myContext;
  const balance = tableValues[0]?.balance;

  const [provider, setProvider] = useState<any>("Swift");
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [options, setOptions] = useState<any[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [cost, setCost] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
   const [adminCosts, setAdminCosts] = useState<Cost[]>([]);
  const stock = useRef("");
  const actualCost = useRef("");
  const lastDebitRef = useRef("");
  //const shouldPoll = useRef(true);
  const statusRef = useRef({ stat: "", req_id: "" });

  const [target, setTarget] = useState<any>({
    provider,
    country: "5",
    service: "",
    user_id: userData.userId,
    email: userData.userEmail
  });

   useEffect(() => {
    axios.get<Cost[]>("https://api.textflex.net/api/costs").then((res) => setAdminCosts(res.data));
  }, []);

  useEffect(() => {
    axios
      .get("https://api.textflex.net/api/sms/countries")
      .then((res) => setCountries(res.data))
      .catch(console.error);
  }, [provider]);


  useEffect(() => {
    const savedInfo = localStorage.getItem("numberInfo");
    const savedReqId = localStorage.getItem("req_id");
    const savedDebitRef = localStorage.getItem("lastDebitRef");
    const storedCost = localStorage.getItem("cost");
    if (savedInfo && savedReqId && savedDebitRef && storedCost) {
      setNumberInfo(JSON.parse(savedInfo));
      setReqId(savedReqId);
      lastDebitRef.current = savedDebitRef;
      setCost(parseFloat(storedCost));
    }
  }, []);

  useEffect(() => {
    if (numberInfo.number || numberInfo.sms) {
      localStorage.setItem("numberInfo", JSON.stringify(numberInfo));
    }
  }, [numberInfo]);


  useEffect(() => {
    const getServices = async () => {
      try {
        setOptions([]);
        const res = await axios.get("https://api.textflex.net/api/sms/price", {
          params: { id: Number(target.country) }
        });
        setOptions(Object.values(res.data));
      } catch {
        console.error("Error fetching price options");
      }
    };
    getServices();
  }, [target.country]);

 
  useEffect(() => {
    if (!req_id || cancel) return;
    let attempts = 0;
    const interval = setInterval(async () => {
      if (cancel || attempts >= 15) {
        clearInterval(interval);
        return;
      }
      attempts++;
      try {
        const res = await axios.get(
          `https://api.textflex.net/api/sms/status/${req_id}`,
          {
            params: {
              cost,
              user_id: userData.userId,
              attempts,
              debitref: lastDebitRef.current,
              actual: actualCost.current
            }
          }
        );

        const code = res.data.sms_code;
        if (code) {
          clearInterval(interval);
          setNumberInfo((prev: any) => ({ ...prev, sms: code }));
          statusRef.current.stat = "used";
          localStorage.removeItem("numberInfo");
        } else if (attempts >= 15) {
          handlePollingTimeout();
        }
      } catch (err) {
        clearInterval(interval);
        await refund(userData.userId, cost, lastDebitRef.current, req_id);
        handlePollingTimeout("❌ Error polling SMS");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [req_id, cancel]);

  const handlePollingTimeout = (msg = "⏱️ SMS polling timed out, code not sent.") => {
    setNumberInfo({ number: "", sms: msg });
    statusRef.current.stat = "reject";
    localStorage.removeItem("numberInfo");
    setTimeout(() => {
      setNumberInfo({ number: "", sms: "" });
      setIsShow(false);
    }, 8000);
  };

  const refund = async (user_id: string, cost: number, debitRef: string, request_id: string) => {
    await axios.post("https://api.textflex.net/api/refund-user", {
      user_id,
      cost,
      debitRef,
      request_id
    });
  };

  const fetchSMSNumber = useCallback(async () => {
    if (!target.service || !target.country) return;
    if (cost > balance) return setError(true);
    setShowLoader(true);
    try {
      const res = await axios.post("https://api.textflex.net/api/sms/get-number", {
        ...target,
        price: cost,
        actual: actualCost.current
      });
      setShowLoader(false);
      if (res.data.phone?.error_msg) {
        setErrorInfo(res.data.phone.error_msg);
        setIsError(true);
        return;
      }

      const { number, request_id } = res.data.phone;
      lastDebitRef.current = res.data.debitRef;
      setNumberInfo((prev: any) => ({ ...prev, number }));
      setIsShow(true);
      setReqId(request_id);
      statusRef.current.stat = "ready";
      localStorage.setItem("req_id", request_id);
      localStorage.setItem("lastDebitRef", res.data.debitRef);
      localStorage.setItem("cost", cost.toString());
    } catch (err: any) {
      setShowLoader(false);
      setErrorInfo(err.response?.data?.error || "Error occurred");
      setIsError(true);
    }
  }, [target, cost, balance]);

  useEffect(() => {
    if (cancel) {
      statusRef.current = { stat: "reject", req_id: "" };
      setReqId("");
      setNumberInfo({ number: "", sms: "" });
      setTarget((prev:any) => ({ ...prev, service: "" }));
    }
  }, [cancel]);

  const handleInputChange = useCallback(
    (selectedOption: OptionType | null) => {
       if (!selectedOption) return;

      const selectedProvider = selectedOption.value;
      setProvider(selectedProvider);

      const country = selectedProvider === "Dynamic"
        ? Object.values(countries)[0]?.id || "5"
        : "5";

      setTarget((prev:any) => ({ ...prev, provider: selectedProvider, country }));
    },
    [countries]
  );


  useEffect(() => {
    //console.log(options)
  },[options])

  const handleCountryChange = useCallback((selectedOption: OptionType | null) => {
     if (!selectedOption) return;
     setTarget((prev:any) => ({ ...prev, country: selectedOption.value }));
  }, []);

  const extractCode = useCallback(
    (selectedOption: OptionType | null) => {
       if (!selectedOption) return;

      const selectedId = selectedOption.value;
      const selectedItem = options.find((opt) => opt.application_id === selectedId);

      if (selectedItem) {
        actualCost.current = selectedItem.cost;
        const multiplier = selectedItem.cost > 200 ? 15 : 50;
        setCost(selectedItem.cost * multiplier);
        setTarget((prev:any) => ({ ...prev, service: selectedId }));
      }
    },
    [options]
  );

  useEffect(() => {
    const match = options.find(
      (item) => item.country_id === target.country && item.application_id === target.service
    );
    stock.current = match?.count || "";
  }, [target, options]);

  
  return (
    <Fieldset provider={`${provider} SMS`} className={`w-full border border-[#ccc] p-1 border-solid rounded-md h-fit min-h-[300px] bg-[#EEF4FD] md:w-[35%]`}>
      <Fieldset provider="Service Provider">
        <Select
          id="providers"
          onChange={handleInputChange}
          theme={theme}
          options={[
            { label: "Swift SMS", value: "Swift" },
            { label: "Dynamic SMS", value: "Dynamic" }
          ]}
          value={{ label: provider, value: provider }}
        />
      </Fieldset>

      <Fieldset provider="Country">
       <Select
        id="country"
        onChange={handleCountryChange}
        theme={theme}
        options={
          provider === "Swift"
            ? Object.values(countries)
                .filter((item: any) => item.title.toLowerCase() === "usa")
                .map((item: any) => ({
                  label: item.title,
                  value: item.id.toString()
                }))
            : Object.values(countries).map((item: any) => ({
                label: item.title,
                value: item.id.toString()
              }))
        }
        value={Object.values(countries)
          .map((item: any) => ({
            label: item.title,
            value: item.id.toString()
          }))
          .find((opt) => opt.value === target.country) || null}
      />
      </Fieldset>

      <Fieldset provider="Service">
       <Select
        id="services"
        onChange={extractCode}
        theme={theme}
        isDisabled={error}
        options={options.map((opt) => {
          const rate:any = localStorage.getItem("rate")
          const usd = opt.cost / 100
          const nairaCost = usd * rate
          const price = (nairaCost).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN"
          });
          return {
            label: `${opt.application} - ${price.replace("NGN", "").trim()}`,
            value: opt.application_id
          };
        })}
        value={
          options
            .map((opt) => {
              const rate:any = localStorage.getItem("rate")
              const usd = opt.cost / 100
              const nairaCost = usd * rate
              return({
              label: `${opt.application} - ${(nairaCost)
                .toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                .replace("NGN", "")
                .trim()}`,
              value: opt.application_id
            })})
            .find((opt) => opt.value === target.service) || null
        }
        />
      </Fieldset>

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
          onClick={fetchSMSNumber}
          className={`w-[90%] h-10 mx-auto text-white text-sm grid place-items-center rounded ${
            cost > balance ? "bg-[#0032a5]/20" : "bg-[#0032a5]"
          }`}
        >
          {showLoader ? <img className="h-10" src={interwind} /> : "Get Number"}
        </button>
      )}

      {numberInfo.number && (
        <div className="h-20 mb-2 rounded-md mx-auto border grid place-items-center border-gray-300 bg-white w-[90%]">
          <p className="text-sm w-[90%]">number: {numberInfo.number}</p>
          <p className="relative text-sm w-[90%]">
            code: {numberInfo.sms || <img className="w-8 absolute left-[33%] top-[-5px]" src={spinner} />}
          </p>
        </div>
      )}
    </Fieldset>
  );
};

export default React.memo(Input);
