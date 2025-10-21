import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PendingPayment {
  ref: string;
  amount: number;
  timestamp: number;
  currency: string;
}

export const usePendingPayments = () => {
  const queryClient = useQueryClient();

  const { data: pendingPayments = [] } = useQuery<PendingPayment[]>({
    queryKey: ['pendingPayments'],
    queryFn: () => {
    
      const cached = queryClient.getQueryData<PendingPayment[]>(['pendingPayments']);
      return cached || [];
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const addPendingPayment = (payment: Omit<PendingPayment, 'timestamp'>) => {
    const newPayment: PendingPayment = {
      ...payment,
      timestamp: Date.now(),
    };
    
    const updated = [...pendingPayments, newPayment];
    queryClient.setQueryData(['pendingPayments'], updated);
  };

  const removePendingPayment = (ref: string) => {
    const updated = pendingPayments.filter(p => p.ref !== ref);
    queryClient.setQueryData(['pendingPayments'], updated);
  };

  const clearOldPayments = () => {
    // Remove payments older than 24 hours
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const updated = pendingPayments.filter(p => p.timestamp > oneDayAgo);
    queryClient.setQueryData(['pendingPayments'], updated);
  };

  return {
    pendingPayments,
    addPendingPayment,
    removePendingPayment,
    clearOldPayments,
  };
};