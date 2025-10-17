import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios-config";


export const useUserOrdersPolling = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get("/api/orders", {
        headers: { "x-requires-auth": true }
      });

      const purchaseArray = response.data.data.filter(
        (item: any) => item.purchased_number !== null
      );

      return purchaseArray;
    },
    enabled: !!userId,              
    refetchInterval: 5000,          
    refetchOnWindowFocus: false,    
    staleTime: 0,                  
  });
};
