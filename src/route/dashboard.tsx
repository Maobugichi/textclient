import { useEffect,  useState } from "react";
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

import { useBalance } from "../balance";
import { useAuth } from "../context/authContext";



const DashBoard = () => {
  const [ref, setRef] = useState<string | null>(null);
 
 
  const { user:userData } = useAuth();

  const { balance, isLoading: loadingBalance, invalidateBalance } = useBalance();

  const { data:userOrders = [], isLoading: loadingOrders  } = useUserOrders( userData?.userId,);

  const {  isLoading: loadingTransactions } = useTransactionHistory(
    userData?.userId,
  );

  const {  isLoading: loadingRate } = useExchangeRate();
  const {  isLoading: loadingCost } = useCostDiff();

 
  const squadCallback = useSquadCallback({
    onSuccess: async () => {
       invalidateBalance();
    },
  });

  const handlePaymentSuccess = () => {
    setRef(null);
   
  };

  const { isPolling } = usePaymentPolling({
    transactionRef: ref,
    onSuccess: handlePaymentSuccess,
    mutateAsync: squadCallback.mutateAsync,
    maxTrials: 15,
    interval: 3000,
  });


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("reference");
    const storedRef = localStorage.getItem("ref");
    
    const finalRef = refParam || storedRef;
    if (finalRef) {
      setRef(finalRef);
      localStorage.setItem("ref", finalRef);
    }
  }, []);

  
 
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