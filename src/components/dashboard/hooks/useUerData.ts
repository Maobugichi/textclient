import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBalance } from "../../../balance";
import api from "../../../lib/axios-config";



export const useUserOrders = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      const response = await api.get(`/api/orders`, {
        headers: { "x-requires-auth": true }
      });
      
      const purchaseArray = response.data.data.filter(
        (item: any) => item.purchased_number !== null
      );  
      localStorage.setItem("arr-length", JSON.stringify(purchaseArray.length));
      return purchaseArray;
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};


export const useTransactionHistory = (userId: string | null | undefined) => {
  const { refreshBalance } = useBalance();

  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const response = await api.get(`/api/get-transaction`, {
        headers: { "x-requires-auth": true }
      });
      
      const filteredData = response.data.filter(
        (item: any) => item.user_id == userId
      );
      
      await refreshBalance();
      
      return filteredData;
    },
    enabled: !!userId, 
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};


export const useExchangeRate = () => {
  return useQuery({
    queryKey: ["rate"],
    queryFn: async () => {
      const response = await api.get(`/api/get-rate`, {
        headers: { "x-requires-auth": true }
      });
      return response.data[0];
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnMount: "always",
    initialData: { squadmin: 0, cryptomin: 0 }, 
  });
};


export const useCostDiff = () => {
  return useQuery({
    queryKey: ["costDiff"],
    queryFn: async () => {
      const response = await api.get(`/api/costs`, {
        headers: { "x-requires-auth": true }
      });
      const cost = response.data[0];
      localStorage.setItem("cost_diff", JSON.stringify(cost));
      return cost;
    },
    staleTime: 300000,
    refetchOnMount: false,
  });
};


export const usePaymentRef = () => {
  const queryClient = useQueryClient();

  const { data: ref = null } = useQuery({
    queryKey: ['paymentRef'],
    queryFn: () => {
      // Initialize from URL parameter only
      const params = new URLSearchParams(window.location.search);
      return params.get("reference") || null;
    },
    staleTime: Infinity, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  const setPaymentRef = (newRef: string | null) => {
    queryClient.setQueryData(['paymentRef'], newRef);
  };

  const clearPaymentRef = () => {
    queryClient.setQueryData(['paymentRef'], null);
    
    // Clean URL
    const newUrl = window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  };

  return { ref, setPaymentRef, clearPaymentRef };
};

export const useSquadCallback = (options?: { onSuccess?: () => void | Promise<void> }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionRef: string) => {
      const response = await api.post(`/api/squad-callback`, {
        transaction_ref: transactionRef,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data?.data === "success") {
        toast.success("Payment confirmed successfully!");
        
        // Invalidate all related queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userOrders"] }),
          queryClient.invalidateQueries({ queryKey: ["transactions"] }),
          queryClient.invalidateQueries({ queryKey: ["userBalance"] }),
        ]);
        
        // Clear payment ref
        queryClient.setQueryData(['paymentRef'], null);
        
        // Clean URL
        const newUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, "", newUrl);
        
        if (options?.onSuccess) {
          await options.onSuccess();
        }
        
        return true;
      }
      return false;
    },
    onError: (error) => {
      console.error("Callback error:", error);
      toast.error("Failed to confirm payment");
      return false;
    },
  });
};