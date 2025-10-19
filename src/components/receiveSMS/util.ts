import { SetStateAction } from "react";
import axios from "axios";
import api from "../../lib/axios-config";
 const rate = localStorage.getItem("rate");

 

 const handlePollingTimeout = (msg = "⏱️ SMS polling timed out, code not sent.",setNumberInfo:React.Dispatch<SetStateAction<any>>,statusRef:any,setIsShow:React.Dispatch<SetStateAction<boolean>>) => {
    setNumberInfo({ number: "", sms: msg });
    statusRef.current.stat = "reject";
    localStorage.removeItem("numberInfo");
    localStorage.removeItem("req_id");
    localStorage.removeItem("lastDebitRef");
    setTimeout(() => {
      setNumberInfo({ number: "", sms: "" });
      setIsShow(false);
    }, 8000);
  };

  const refund = async (user_id: string | undefined, cost: number, debitRef: string, request_id: string) => {
    await api.post("/api/refund-user", {
      user_id,
      cost,
      debitRef,
      request_id
    });
  };
 const handlePolling = async (cancel:any,attempts:number,interval:any, cost:number,userId:any,lastDebitRef:any, actualCost:any,setNumberInfo:React.Dispatch<SetStateAction<any>>, statusRef:any,setIsShow:React.Dispatch<SetStateAction<boolean>>,req_id:any) => {
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
              rate:rate && JSON.parse(rate).rate,
              cost,
              user_id: userId,
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
          localStorage.removeItem("req_id");
          localStorage.removeItem("lastDebitRef");
        } else if (attempts >= 15) {
          handlePollingTimeout("",setNumberInfo,statusRef,setIsShow);
        }
      } catch (err) {
        clearInterval(interval);
        await refund(userId, cost, lastDebitRef.current, req_id);
        handlePollingTimeout("❌ Error polling SMS",setNumberInfo,statusRef,setIsShow);
      }
 }

 const fetchSMSNumber = async (target:any,cost:any,balance:any,setError:React.Dispatch<SetStateAction<boolean>>, setShowLoader:React.Dispatch<SetStateAction<boolean>>,actualCost:any,setTarget:React.Dispatch<SetStateAction<any>>,setErrorInfo:React.Dispatch<SetStateAction<any>>,setIsError:React.Dispatch<SetStateAction<boolean>>,lastDebitRef:any,setNumberInfo:React.Dispatch<SetStateAction<any>>,setIsShow:React.Dispatch<SetStateAction<boolean>>,setReqId:React.Dispatch<SetStateAction<any>>,statusRef:any) => {
     if (!target.service || !target.country) return;
     if (cost > balance) return setError(true);
     setShowLoader(true);
     try {
       const res = await axios.post("https://api.textflex.net/api/sms/get-number", {
         ...target,
         price: cost,
         actual: actualCost.current,
        
       });
       setTarget((prev:any) => {
         return{
           ...prev,
           service:""
         }
       })
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
       console.log(err)
       setShowLoader(false);
       setErrorInfo(err.response?.data?.error || "Error occurred");
       setIsError(true);
     }
}
 
    export {  handlePolling , fetchSMSNumber , refund}