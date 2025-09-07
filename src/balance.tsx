import { createContext, useContext, useEffect, useState , useCallback } from "react";
import axios from "axios";
import { ShowContext } from "./components/context-provider";

type BalanceContextType = {
  balance: number;
  refreshBalance: () => Promise<void>;
};

const BalanceContext = createContext<BalanceContextType | null>(null);


export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);

  const myContext = useContext(ShowContext);

   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
   const { userData } = myContext;
   const refreshBalance = useCallback(async (signal?: AbortSignal) => {
    if (!userData?.userId) return;
  
    try {
      const res = await axios.get("https://api.textflex.net/api/user-balance", {
        params: { user_id: userData.userId },
        signal, 
      });
      
      const newBalance = res.data?.balance ?? 0;
      const storageKey = `user-balance-${userData.userId}`;
      localStorage.setItem(storageKey,JSON.stringify({ balance: newBalance }))
     
      setBalance(newBalance);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Failed to fetch balance:", err);
       
      }
    }
}, [userData?.userId]);

  
  useEffect(() => {
    if (!userData?.userId) return;

    const storageKey = `user-balance-${userData.userId}`
    const bal = localStorage.getItem(storageKey);
    if (bal) {
      try {
        setBalance(JSON.parse(bal).balance ?? 0);
      } catch {}
    }
    refreshBalance();
    const interval = setInterval(refreshBalance, 15000); 
    return () => clearInterval(interval);
  }, [userData?.userId]);

  return (
    <BalanceContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be used inside BalanceProvider");
  return ctx;
};
