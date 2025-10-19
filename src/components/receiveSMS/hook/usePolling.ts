import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { refund } from "../util";
import { useSmsInfo } from "../../../hooks/useSmsInfo";
import api from "../../../lib/axios-config";

interface PollSmsProps {
  cost: number;
  userId: string | undefined;
  actualCost: React.MutableRefObject<number>;
  statusRef: React.MutableRefObject<{ stat: string; req_id: string }>;
  setNumberInfo: React.Dispatch<React.SetStateAction<any>>;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  cancel: boolean;
}

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL = 6000;

export const usePollSms = ({
  cost,
  userId,
  actualCost,
  statusRef,
  setNumberInfo,
  setIsShow,
  cancel,
}: PollSmsProps) => {
  const queryClient = useQueryClient();
  const smsInfo = useSmsInfo();
  
  const req_id = smsInfo?.request_id;
  const lastDebitRef = smsInfo?.debitRef;
  
  const attemptsRef = useRef(0);
  const isStoppedRef = useRef(false);

 
  const enabled = Boolean(
    req_id && 
    !cancel && 
    !isStoppedRef.current &&
    attemptsRef.current < MAX_ATTEMPTS
  );

  const query = useQuery({
    queryKey: ["pollSms", req_id],
    enabled,
    refetchInterval: (data:any) => {
      
      if (data?.sms || attemptsRef.current >= MAX_ATTEMPTS || isStoppedRef.current) {
        return false;
      }
      return POLL_INTERVAL;
    },
    retry: false,
    queryFn: async () => {
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        throw new Error("Max attempts reached");
      }

      attemptsRef.current += 1;
      console.log(`Polling attempt ${attemptsRef.current}/${MAX_ATTEMPTS}`);
      
      const res = await api.get(`/api/sms/status/${req_id}`, {
        params: {
          cost,
          user_id: userId,
          debitref: lastDebitRef,
          actual: actualCost.current,
        },
      });
      
      console.log("Poll response:", res.data);
      return res.data;
    },
  });

  const stopPolling = (key: string) => {
    console.log("Stopping polling for:", key);
    isStoppedRef.current = true;
    
   
    queryClient.cancelQueries({ queryKey: ["pollSms", key] });
    
    queryClient.removeQueries({ queryKey: ["pollSms", key] });
    queryClient.removeQueries({ queryKey: ["smsRequest"] });
    
    
    attemptsRef.current = 0;
  };

  const handleTimeout = async () => {
    console.log("⏰ Timeout reached - refunding");
    stopPolling(req_id || "");
    
    try {
      await refund(userId, cost, lastDebitRef || "", req_id || "");
    } catch (error) {
      console.error("Refund failed:", error);
    }
    
    setNumberInfo((prev: any) => ({ 
      ...prev, 
      sms: "⏰ Timeout: No code received" 
    }));
    statusRef.current.stat = "timeout";
    setIsShow(true);
  };

  const handleError = async (error: any) => {
    console.error("❌ Polling error:", error);
    stopPolling(req_id || "");
    
    try {
      await refund(userId, cost, lastDebitRef || "", req_id || "");
    } catch (refundError) {
      console.error("Refund failed:", refundError);
    }
    
    setNumberInfo((prev: any) => ({ 
      ...prev, 
      sms: "❌ Error polling SMS" 
    }));
    statusRef.current.stat = "error";
    setIsShow(true);
  };

  
  useEffect(() => {
    if (query.data?.sms_code) {
      console.log("✅ SMS code received:", query.data.sms_code);
      stopPolling(req_id || "");
      
      setNumberInfo((prev: any) => ({ 
        ...prev, 
        sms: query.data.sms_code 
      }));
      statusRef.current.stat = "used";
      setIsShow(true);
    }
  }, [query.data?.sms_code]);

  
  useEffect(() => {
    if (attemptsRef.current >= MAX_ATTEMPTS && !isStoppedRef.current) {
      console.log("🚫 Max attempts reached");
      handleTimeout();
    }
  }, [attemptsRef.current]);

  // Handle query errors
  useEffect(() => {
    if (query.error && !isStoppedRef.current) {
      handleError(query.error);
    }
  }, [query.error]);

 
  useEffect(() => {
    if (cancel && !isStoppedRef.current) {
      console.log("❌ Manual cancel triggered");
      stopPolling(req_id || "");
      setNumberInfo((prev: any) => ({ 
        ...prev, 
        sms: "" 
      }));
      statusRef.current.stat = "cancelled";
    }
  }, [cancel]);

  
  useEffect(() => {
    return () => {
      if (req_id && !query.data?.sms_code) {
        console.log("🧹 Cleanup: Stopping polling on unmount");
        stopPolling(req_id);
      }
    };
  }, [req_id, query.data?.sms_code]);

  return {
    ...query,
    attempts: attemptsRef.current,
    isStopped: isStoppedRef.current,
    maxAttempts: MAX_ATTEMPTS,
  };
};

export default usePollSms;