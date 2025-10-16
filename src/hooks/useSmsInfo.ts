import { useQueryClient } from "@tanstack/react-query";

export const useSmsInfo = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<any>(["smsRequest"]);
}; 