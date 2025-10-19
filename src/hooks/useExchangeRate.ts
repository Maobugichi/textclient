import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useExchangeRate } from "../components/dashboard/hooks/useUerData";

export const usePrefetchRate = () => {
  const queryClient = useQueryClient();
  const { data } = useExchangeRate();

  useEffect(() => {
    if (data) {
      queryClient.setQueryData(["rate"], data);
    }
  }, [data, queryClient]);
};
