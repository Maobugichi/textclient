import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface UsePaymentPollingProps {
  transactionRef: string | null;
  onSuccess: () => void;
  mutateAsync: (ref: string) => Promise<any>;
  maxTrials?: number;
  interval?: number;
}

export const usePaymentPolling = ({
  transactionRef,
  onSuccess,
  mutateAsync,
  maxTrials = 15,
  interval = 3000,
}: UsePaymentPollingProps) => {
  const count = useRef(0);
  const isPollingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
   
    if (!transactionRef) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
      count.current = 0;
      return;
    }

    
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;
    count.current = 0;

    const pollCallback = async () => {
      try {
        const result = await mutateAsync(transactionRef);
        
        if (result) {
        
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          isPollingRef.current = false;
          count.current = 0;
          onSuccess();
          return true;
        }
        
        count.current++;
        
     
        if (count.current >= maxTrials) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          isPollingRef.current = false;
          toast.info("Payment verification timeout. Please check your transaction history.");
          onSuccess(); 
          return false;
        }
        
        return false;
      } catch (error) {
        count.current++;
        console.error("Polling error:", error);
        
      
        if (count.current >= maxTrials) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          isPollingRef.current = false;
          toast.error("Payment verification failed. Please check your transaction history.");
          onSuccess(); 
          return false;
        }
        
        return false;
      }
    };

    
    pollCallback();
    
    intervalRef.current = setInterval(() => {
      pollCallback();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [transactionRef, maxTrials, interval, mutateAsync, onSuccess]);

  return { isPolling: isPollingRef.current };
};
