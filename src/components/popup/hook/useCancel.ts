import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../../../lib/axios-config";
import { toast } from "sonner";

interface CancelProps {
  request_id: string;
  debitref: string;
  user_id: string;
  email: string;
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CancelProps) => {
      const res = await api.post("/api/sms/cancel", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('cancelled purchase successfully')
      queryClient.removeQueries({ queryKey: ["smsRequest"] });
    },
    onError: (error) => {
      toast.success(`Cancel failed: ${error}`)
     
    },
  });
}
