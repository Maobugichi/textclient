import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ShowContext } from "./components/context-provider";

const API_BASE_URL = "https://api.textflex.net/api";

export const useBalance = () => {
  const queryClient = useQueryClient();
  const myContext = useContext(ShowContext);

  if (!myContext) {
    throw new Error("ShowContext must be used within a ContextProvider");
  }

  const { userData } = myContext;
  const userId = userData?.userId;

  
  const {
    data: balance = 0,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userBalance", userId],
    queryFn: async () => {
      if (!userId) return 0;

      const res = await axios.get(`${API_BASE_URL}/user-balance`, {
        params: { user_id: userId },
      });

      return res.data?.balance ?? 0;
    },
    enabled: Boolean(userId), 
    staleTime: 10000, 
    refetchInterval: 30000, 
    refetchOnWindowFocus: true,
    retry: 3, // Retry 3 times on failure
  });

  // Manual refresh function
  const refreshBalance = async () => {
    await refetch();
  };

  
  const updateBalance = (newBalance: number) => {
    queryClient.setQueryData(["userBalance", userId], newBalance);
  };

  const invalidateBalance = () => {
    queryClient.invalidateQueries({ queryKey: ["userBalance", userId] });
  };

  return {
    balance,
    isLoading,
    error,
    refreshBalance,
    updateBalance,
    invalidateBalance,
  };
};