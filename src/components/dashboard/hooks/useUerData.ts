// hooks/useDashboardData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useBalance } from "../../../balance";

const API_BASE_URL = "https://api.textflex.net/api";


export const useUserOrders = (userId: string | null, isEnabled: boolean) => {
  //const { refreshBalance } = useBalance();

  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: { userId },
      });
      
      const purchaseArray = response.data.data.filter(
        (item: any) => item.purchased_number !== null
      );
      
      localStorage.setItem("arr-length", JSON.stringify(purchaseArray.length));
      
      return purchaseArray;
    },
    enabled: isEnabled,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

// ============================================
// Transaction History Hook
// ============================================
export const useTransactionHistory = (userId: string | null, isEnabled: boolean) => {
  const { refreshBalance } = useBalance();

  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/get-transaction`, {
        params: { user_id: userId },
      });
      
      const filteredData = response.data.filter(
        (item: any) => item.user_id == userId
      );
      
      await refreshBalance();
      
      return filteredData;
    },
    enabled: isEnabled,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

// ============================================
// Exchange Rate Hook
// ============================================
export const useExchangeRate = () => {
  return useQuery({
    queryKey: ["exchangeRate"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/get-rate`);
      const rate = response.data[0];
      localStorage.setItem("rate", JSON.stringify(rate));
      return rate;
    },
    staleTime: 300000, // 5 minutes
    refetchOnMount: false,
  });
};

// ============================================
// Cost Difference Hook
// ============================================
export const useCostDiff = () => {
  return useQuery({
    queryKey: ["costDiff"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/costs`);
      const cost = response.data[0];
      localStorage.setItem("cost_diff", JSON.stringify(cost));
      return cost;
    },
    staleTime: 300000,
    refetchOnMount: false,
  });
};

// ============================================
// Squad Callback Mutation Hook
// ============================================
export const useSquadCallback = (options?: { onSuccess?: () => void | Promise<void> }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionRef: string) => {
      const response = await axios.post(`${API_BASE_URL}/squad-callback`, {
        transaction_ref: transactionRef,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data?.data === "success") {
        toast.success("Payment confirmed successfully!");
        
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ["userOrders"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["userBalance"] }); // NEW: Invalidate balance
        
        localStorage.removeItem("ref");
        
        const newUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, "", newUrl);
        
        // Call custom onSuccess callback if provided
        if (options?.onSuccess) {
          await options.onSuccess();
        }
        
        return true; // Signal success
      }
      return false;
    },
    onError: (error) => {
      console.error("Callback error:", error);
      toast.error("Failed to confirm payment");
    },
  });
};