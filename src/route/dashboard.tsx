// src/pages/Dashboard.tsx
import { useEffect, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
import { useTokenManager } from "../components/dashboard/hooks/useTokenManager";
import { useBalance } from "../balance";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";


const DashBoard = () => {
  const [ref, setRef] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { user:userData } = useAuth();

  useEffect(() => {
    console.log("user:" + userData)
  },[userData])
  
  const { balance, isLoading: loadingBalance, invalidateBalance } = useBalance();

  
  const { data:userOrders = [], isLoading: loadingOrders,error  } = useUserOrders( userData?.userId,);

  const { data:transactionHistory = [], isLoading: loadingTransactions } = useTransactionHistory(
    userData?.userId,
  );

  const { data: exchangeRate, isLoading: loadingRate } = useExchangeRate();
  const {  isLoading: loadingCost } = useCostDiff();

 
  const squadCallback = useSquadCallback({
    onSuccess: async () => {
       invalidateBalance();
    },
  });

  console.log(userOrders)
  console.log(error)
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


  
  
  useTokenManager(userData);

  
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
  console.log(!userData)

  if (!userData) {
      return <Navigate to={'/login'} replace/>
  }
  
  
  return (
    <DashInfo
      info={userOrders}
      theme={false}
      transaction={transactionHistory}
      balance={balance} 
      setTransaction={(newTransactions: any) => {
        queryClient.setQueryData(["transactions", userData?.userId], newTransactions);
      }}
      userData={userData}
    />
  );
};

export default DashBoard;