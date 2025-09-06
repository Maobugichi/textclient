import { createContext, useContext, useEffect, useState ,  } from "react";
import axios from "axios";
import { ShowContext } from "./components/context-provider";

type BalanceContextType = {
  balance: number;
  refreshBalance: () => Promise<void>;
};

const BalanceContext = createContext<BalanceContextType | null>(null);


export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);

  const myContext = useContext(ShowContext)

   if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
   const { userData } = myContext;
   const refreshBalance = async () => {
    try {
      const res = await axios.get("https://api.textflex.net/api/user-balance", {
        params: { user_id: userData.userId }, 
      });
     
      localStorage.setItem("user-balance", JSON.stringify(res.data));
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  
  useEffect(() => {
    const bal = localStorage.getItem("user-balance");
    if (bal) {
      try {
        setBalance(JSON.parse(bal).balance ?? 0);
      } catch {}
    }
    refreshBalance();
    const interval = setInterval(refreshBalance, 15000); 
    return () => clearInterval(interval);
  }, []);

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
