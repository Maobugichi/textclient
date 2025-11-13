import Fieldset from "../fieldset";
import { SingleValue } from "react-select";
import React, { useRef, useState, useEffect } from "react";
import Select from "../select";
import type { InputProps } from "./types";
import { OptionType } from "../select";
import ClipLoader from "react-spinners/ClipLoader";
import { useCountries } from "./hook/useCountries";
import { useServices } from "./hook/useServices";
import { useQueryClient } from "@tanstack/react-query";
import { useSMSPolling, usePurchaseNumber } from "./hook/usePolling";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
import { useTheme } from "next-themes";
import { useExchangeRate } from "../dashboard/hooks/useUerData";
import { useCancelRequest } from "./hook/usePolling";
import { refund } from "./util";
import api from "../../lib/axios-config";

// Helper functions for localStorage persistence
const STORAGE_KEY = 'sms_active_request';

interface ActiveRequest {
  requestId: string;
  debitRef: string;
  numberInfo: {
    number: string;
    sms: string;
  };
  timestamp: number;
}

const saveActiveRequest = (data: ActiveRequest) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getActiveRequest = (): ActiveRequest | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored);
   
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() - data.timestamp > thirtyMinutes) {
      clearActiveRequest();
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const clearActiveRequest = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const Input: React.FC<InputProps> = ({
  tableValues,
  setNumberInfo,
  numberInfo,
  setReqId,
  cancel,
}) => {
  const [provider, setProvider] = useState<any>("Swift");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [debitRef, setDebitRef] = useState<string>("");
  const queryClient = useQueryClient();

  const { user: userData } = useAuth();
  
  const balance = tableValues[0]?.balance;

  const [options, setOptions] = useState<any[]>([]);
  const [cost, setCost] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [stocksCount, setStocksCount] = useState();
 
  const actualCost = useRef<number>(0);
  const { data: rateObj } = useExchangeRate();
  
  console.log(setOptions);
  console.log(setError);
  
  const raw = localStorage.getItem("cost_diff");
  const myCost = raw ? JSON.parse(raw) : null;

  const [target, setTarget] = useState<any>({
    provider,
    country: "5",
    service: "",
    user_id: userData?.userId,
    email: userData?.userEmail,
  });

  console.log(options);
  
  const { data: countries, isLoading } = useCountries(provider);
  const { data: services, isLoading: serviceLoading } = useServices(
    target.country
  );

  // Restore active request on mount
  useEffect(() => {
    const activeRequest = getActiveRequest();
    if (activeRequest) {
      setRequestId(activeRequest.requestId);
      setDebitRef(activeRequest.debitRef);
      setNumberInfo(activeRequest.numberInfo);
      setReqId(activeRequest.requestId);
     
    }
  }, [setNumberInfo, setReqId]);

  const { purchaseNumber, isPurchasing } = usePurchaseNumber({
    onSuccess: (data) => {
      toast.success("Number purchased successfully! 📱");
      
      const newNumberInfo = {
        number: data.phone.number,
        sms: "", 
      };
      
      setNumberInfo(newNumberInfo);
      setDebitRef(data.debitRef);
      setRequestId(data.table.reference_code);
      setReqId(data.table.reference_code);
    
      
    
      saveActiveRequest({
        requestId: data.table.reference_code,
        debitRef: data.debitRef,
        numberInfo: newNumberInfo,
        timestamp: Date.now(),
      });
      
      console.log("Purchase data:", data);
    },
    onError: (error) => {
      toast.error(`Purchase failed: ${error}`);
    },
  });

 
  const { 
    status,
    smsCode, 
    attempts, 
    elapsedTime,
    isPolling,
    manualCheck,
    isManualChecking,
  } = useSMSPolling(requestId, {
    enabled: !!requestId, 
    onSuccess: async (code, order) => {
      toast.success(`SMS Code received: ${code} 🎉`);
      
      const updatedNumberInfo = {
        ...numberInfo,
        sms: code,
      };
      
      setNumberInfo(updatedNumberInfo);
      
      clearActiveRequest();
      await api.post('/sms/code-success' , {debitRef})
      console.log("SMS received:", code);
      console.log("Order:", order);
    },
    onError: (error) => {
      toast.error(`Error: ${error}`);
    },
    onTimeout: async () => {
      toast.warning("SMS timeout. Please try again or contact support.");
      await refund(userData?.userId, cost, debitRef || "", requestId || "");
      clearActiveRequest();
    },
  });

 
  useEffect(() => {
    if (smsCode) {
      const updatedNumberInfo = {
        ...numberInfo,
        sms: smsCode,
      };
      setNumberInfo(updatedNumberInfo);
      
      // Update localStorage
      const activeRequest = getActiveRequest();
      if (activeRequest) {
        saveActiveRequest({
          ...activeRequest,
          numberInfo: updatedNumberInfo,
        });
      }
    }
  }, [smsCode]);

  useEffect(() => {
    if (cancel) {
      setReqId("");
      setRequestId(null);
      setNumberInfo({ number: "", sms: "" });
      setTarget((prev: any) => ({ ...prev, service: "" }));
      
      
      clearActiveRequest();
      
    
      queryClient.removeQueries({ queryKey: ["sms-status"] });
      queryClient.removeQueries({ queryKey: ["smsRequest"] });
      queryClient.removeQueries({ queryKey: ["pollSms"] });
    }
  }, [cancel, queryClient, setNumberInfo, setReqId]);

  const { cancelRequest, isCancelling } = useCancelRequest({
    onSuccess: () => {
      toast.success("Purchase cancelled successfully");
      
      setRequestId(null);
      setReqId("");
      setDebitRef("");
      setNumberInfo({ number: "", sms: "" });
     
      setTarget((prev: any) => ({ ...prev, service: "" }));
      
      
      clearActiveRequest();
    },
    onError: (error: any) => {
      toast.error(`Cancel failed: ${error}`);
    },
  });

  useEffect(() => {
    const match = services?.find(
      (item) =>
        item.country_id === target.country &&
        item.application_id === target.service
    );

    setStocksCount(match?.count || "");
  }, [target, services]);

  const handleInputChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;
    const selectedProvider = selectedOption.value;
    setProvider(selectedProvider);

    const country =
      selectedProvider === "Dynamic"
        ? Object.values(countries ?? [])[0]?.id || "5"
        : "5";

    setTarget((prev: any) => ({ 
      ...prev, 
      provider: selectedProvider, 
      country 
    }));
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
      actualCost.current = amount;
      setTarget((prev: any) => ({ ...prev, service: selectedId }));
    }
  };

  const handleClick = () => {
    purchaseNumber({
      provider: target.provider,
      country: target.country,
      service: target.service,
      email: target.email,
      price: cost,
    });
  };

  const handleCancel = () => {
    console.log(debitRef);
    if (!requestId || !debitRef) {
      toast.error("No active request to cancel");
      return;
    }

    cancelRequest({
      request_id: requestId,
      debitref: debitRef,
      user_id: userData?.userId || "",
      email: userData?.userEmail || "",
    });
  };

  const { theme } = useTheme(); 
  const isDark = theme === "dark";
  
  return (
    <Card className="dark:bg-[#171717] bg-[#EEF4FD] h-fit">
      <Fieldset provider={`${provider} SMS`} className="font-semibold">
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

      <Fieldset className="font-semibold" provider="Country">
        {isLoading ? (
          <div className="flex bg-white dark:bg-[#242424] w-[95%] dark:text-white dark:border-blue-400 rounded-xl mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} color={isDark ? "#fff" : "#000"} />
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
      
      <Fieldset className="font-semibold" provider="Service">
        {serviceLoading ? (
          <div className="flex rounded-xl border dark:bg-[#242424] dark:text-white dark:border-blue-400 bg-white w-[95%] mx-auto h-12 items-center justify-center py-4">
            <ClipLoader size={20} color={isDark ? "#fff" : "#000"} />
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
                .map((opt: any) => ({
                  label: opt.application,
                  value: opt.application_id,
                }))
                .find((opt) => opt.value === target.service) || null
            }
          />
        )}
      </Fieldset>
     
      {target.country && target.service && (
        <Fieldset className="font-semibold grid place-items-center" provider="Stock">
          {stocksCount === "" ? (
            <div
              className={`${
                theme ? "bg-transparent" : "bg-white"
              } text-gray-500 pl-5 w-[95%] mx-auto h-12 grid place-items-center rounded-xl border border-blue-200`}
            > 
              <ClipLoader size={20} />
            </div>
          ) : (
            <input
              disabled
              value={stocksCount}
              className={`${
                theme ? "bg-transparent" : "bg-white"
              } text-gray-500 pl-5 w-[95%] mx-auto h-12 rounded-xl border border-blue-200`}
            />
          )}
        </Fieldset>
      )}

      {target.country && target.service && (
        <button
          onClick={handleClick}
          disabled={isPurchasing || cost > balance}
          className={`w-[90%] h-10 mx-auto text-white text-lg tracking-wider rounded-xl grid place-items-center  ${
            cost > balance || isPurchasing ? "bg-[#0032a5]/20 cursor-not-allowed" : "bg-[#0032a5]"
          }`}
        >
          {isPurchasing ? <ClipLoader size={14} color="white" /> : "Get Number"}
        </button>
      )}

      {numberInfo.number && (
        <div className="space-y-3 p-4 mb-2 rounded-md mx-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#242424] w-[90%]">
          {/* Phone Number */}
          <div className="flex items-center justify-between">
            <p className="text-sm dark:text-white">
              <span className="font-semibold">Number:</span> {numberInfo.number}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(numberInfo.number);
                toast.success("Number copied!");
              }}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>

          <div className="border-t pt-3 dark:border-gray-600">
            {status === 'completed' && smsCode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm dark:text-white">
                    <span className="font-semibold">SMS Code:</span>{" "}
                    <span className="text-xl font-mono font-bold text-green-600 dark:text-green-400">
                      {smsCode}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(smsCode);
                      toast.success("Code copied!");
                    }}
                    className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span>✓</span> Received successfully!
                </p>
              </div>
            ) : status === 'error' ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                <p className="text-sm text-red-600 dark:text-red-400">
                  ❌ Error receiving SMS. Please contact support.
                </p>
              </div>
            ) : status === 'timeout' ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⏰ SMS timeout. Please try again.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
                    <p className="text-sm dark:text-white">
                      <span className="font-semibold">SMS Code:</span>{" "}
                      <span className="text-blue-600 dark:text-blue-400">Waiting...</span>
                    </p>
                  </div>
                  <button
                    onClick={() => manualCheck()}
                    disabled={isManualChecking}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded disabled:opacity-50"
                  >
                    {isManualChecking ? "Checking..." : "Check Now"}
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Attempts: {attempts}</span>
                  <span>Time: {elapsedTime}s</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((attempts / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {status !== 'completed' && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full mt-2 h-9 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isCancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <ClipLoader size={14} color="white" />
                  Cancelling...
                </span>
              ) : (
                "Cancel Request"
              )}
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default React.memo(Input);