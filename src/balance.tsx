import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./lib/axios-config";
import { useAuth } from "./context/authContext";


export const useBalance = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.userId;

  const {
    data: balance = 0,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userBalance", userId],
    queryFn: async () => {
      if (!userId) return 0;

      const res = await api.get(`/api/user-balance`, {
        headers: { "x-requires-auth": true }
      });

      return res.data?.balance ?? 0;
    },
    enabled: Boolean(userId), 
    staleTime: 10000, 
    refetchInterval: 30000, 
    refetchOnWindowFocus: true,
    retry: 3, 
  });


  console.log(error)

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