import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PendingPayment {
  ref: string;
  amount: number;
  timestamp: number;
  currency: string;
}

const STORAGE_KEY = 'pendingPayments';


const loadFromStorage = (): PendingPayment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading pending payments:', error);
    return [];
  }
};

const saveToStorage = (payments: PendingPayment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving pending payments:', error);
  }
};

export const usePendingPayments = () => {
  const queryClient = useQueryClient();

  const { data: pendingPayments = [] } = useQuery<PendingPayment[]>({
    queryKey: ['pendingPayments'],
    queryFn: loadFromStorage, 
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
    saveToStorage(updated); 
  };

  const removePendingPayment = (ref: string) => {
    const updated = pendingPayments.filter(p => p.ref !== ref);
    queryClient.setQueryData(['pendingPayments'], updated);
    saveToStorage(updated); 
  };

  const clearOldPayments = () => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const updated = pendingPayments.filter(p => p.timestamp > oneDayAgo);
    queryClient.setQueryData(['pendingPayments'], updated);
    saveToStorage(updated); 
  };

  return {
    pendingPayments,
    addPendingPayment,
    removePendingPayment,
    clearOldPayments,
  };
};