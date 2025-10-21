import { useEffect } from "react";
import DashInfo from "../components/dashboard/dashInfo";
import LoadingScreen from "../components/loader";
import {
  useUserOrders,
  useTransactionHistory,
  useExchangeRate,
  useCostDiff,
  useSquadCallback,
} from "../components/dashboard/hooks/useUerData";
import { usePaymentPolling } from "../components/dashboard/hooks/usePolling";
import { usePaymentRef } from "../components/dashboard/hooks/useUerData";
import { useBalance } from "../balance";
import { useAuth } from "../context/authContext";

const DashBoard = () => {
  const { ref, setPaymentRef, clearPaymentRef } = usePaymentRef();
  const { user: userData } = useAuth();

  const { balance, isLoading: loadingBalance, invalidateBalance } = useBalance();
  const { data: userOrders = [], isLoading: loadingOrders } = useUserOrders(userData?.userId);
  const { isLoading: loadingTransactions } = useTransactionHistory(userData?.userId);
  const { isLoading: loadingRate } = useExchangeRate();
  const { isLoading: loadingCost } = useCostDiff();

  const squadCallback = useSquadCallback({
    onSuccess: async () => {
      invalidateBalance();
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("reference");
    
    if (refParam && refParam !== ref) {
      setPaymentRef(refParam);
    }
  }, []); 

  const { isPolling } = usePaymentPolling({
    transactionRef: ref,
    onSuccess: clearPaymentRef,
    mutateAsync: squadCallback.mutateAsync,
    maxTrials: 15,
    interval: 3000,
  });

  const isInitialLoading = 
    loadingOrders || 
    loadingTransactions || 
    loadingRate || 
    loadingCost || 
    loadingBalance;

  if (isInitialLoading) {
    return (
      <LoadingScreen 
        theme={false ? 'bg-black' : 'bg-white'} 
        message={isPolling ? "Verifying payment..." : "Loading your dashboard..."} 
      />
    );
  }

  return (
    <DashInfo
      info={userOrders}
      theme={false}
      balance={balance} 
      userData={userData}
    />
  );
};

export default DashBoard;