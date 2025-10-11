// src/pages/Dashboard.tsx
import { useEffect, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DashInfo from "../components/dashboard/dashInfo";
import LoadingScreen from "../components/loader";
import { ShowContext } from "../components/context-provider";
import checkAuth from "../components/checkauth";

// Import ALL your new custom hooks
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

const DashBoard = () => {
  const [ref, setRef] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const myContext = useContext(ShowContext);
  if (!myContext) {
    throw new Error("ShowContext must be used within a ContextProvider");
  }
  
  const { userData, theme } = myContext;
  const isAuthenticated = checkAuth();
  const isEnabled = Boolean(isAuthenticated && userData?.userId);

  
  const { balance, isLoading: loadingBalance, invalidateBalance } = useBalance();

  
  const { data: userOrders = [], isLoading: loadingOrders } = useUserOrders(
    userData?.userId,
    isEnabled
  );

  const { data: transactionHistory = [], isLoading: loadingTransactions } = useTransactionHistory(
    userData?.userId,
    isEnabled
  );

  const { data: exchangeRate, isLoading: loadingRate } = useExchangeRate();
  const {  isLoading: loadingCost } = useCostDiff();

 
  const squadCallback = useSquadCallback({
    onSuccess: async () => {
      await invalidateBalance();
    },
  });

  const handlePaymentSuccess = () => {
    setRef(null);
    // Balance will auto-refresh from invalidateBalance in squadCallback
  };

  const { isPolling } = usePaymentPolling({
    transactionRef: ref,
    onSuccess: handlePaymentSuccess,
    mutateAsync: squadCallback.mutateAsync,
    maxTrials: 15,
    interval: 3000,
  });

  // ============================================
  // Token Management
  // ============================================
  useTokenManager(userData);

  // ============================================
  // Initialize Payment Reference
  // ============================================
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

  console.log( loadingOrders || 
    loadingTransactions || 
    loadingRate || 
    loadingCost || 
    loadingBalance
)
 
  const isInitialLoading = 
    loadingOrders || 
    loadingTransactions || 
    loadingRate || 
    loadingCost || 
    loadingBalance;

  const hasRequiredData = userData && exchangeRate;

  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg">
            Authentication Required
          </p>
          <p className="text-slate-600 text-sm">
            Please log in to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  
  if (isInitialLoading || !hasRequiredData) {
    return (
      <LoadingScreen 
        theme={theme ? 'bg-black' : 'bg-white'} 
        message={isPolling ? "Verifying payment..." : "Loading your dashboard..."} 
      />
    );
  }

  
  return (
    <DashInfo
      info={userOrders}
      theme={theme}
      transaction={transactionHistory}
      balance={balance} 
      setTransaction={(newTransactions: any) => {
        queryClient.setQueryData(["transactions", userData.userId], newTransactions);
      }}
      userData={userData}
    />
  );
};

export default DashBoard;