import { useEffect, useRef, useState } from "react";
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
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!transactionRef) return;

    setIsPolling(true);
    count.current = 0;

    const pollCallback = async () => {
      try {
        const result = await mutateAsync(transactionRef);
        if (result) {
          onSuccess();
          setIsPolling(false);
        }
        count.current++;
      } catch (error) {
        count.current++;
        console.error("Polling error:", error);
      }
    };

    const intervalId = setInterval(() => {
      if (count.current >= maxTrials) {
        clearInterval(intervalId);
        setIsPolling(false);
        toast.info("Payment verification timeout. Please check your transaction history.");
        localStorage.removeItem("ref");
      } else {
        pollCallback();
      }
    }, interval);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [transactionRef, maxTrials, interval]);

  return { isPolling };
};