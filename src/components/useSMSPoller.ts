import { useEffect, useRef } from "react";
import axios from "axios";

export function useSMSPoller({
  requestId,
  debitRef,
  userId,
  cost,
  onCodeReceived,
  onTimeout,
  cancelPolling
}: {
  requestId: string;
  debitRef: string;
  userId: string;
  cost: number;
  cancelPolling: boolean;
  onCodeReceived: (code: string) => void;
  onTimeout: (reason?: string) => void;
}) {
  const shouldPoll = useRef(true);

  useEffect(() => {
    if (!requestId || cancelPolling) return;

    shouldPoll.current = true;
    let attempts = 0;
    const interval = setInterval(async () => {
      if (!shouldPoll.current || attempts >= 15) {
        clearInterval(interval);
        return;
      }

      attempts++;
      try {
        const response = await axios.get(`https://textflex-axd2.onrender.com/api/sms/status/${requestId}`, {
          params: { cost, user_id: userId, attempts, debitref: debitRef },
        });

        const code = response.data.sms_code;
        if (code) {
          shouldPoll.current = false;
          clearInterval(interval);
          onCodeReceived(code);
        } else if (attempts >= 15) {
          shouldPoll.current = false;
          clearInterval(interval);
          onTimeout();
        }
      } catch (err) {
        shouldPoll.current = false;
        clearInterval(interval);
        onTimeout("❌ Error polling SMS");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [requestId, cancelPolling]);
}
