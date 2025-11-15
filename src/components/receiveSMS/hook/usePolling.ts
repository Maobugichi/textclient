import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import api from '../../../lib/axios-config';
import { useEffect, useRef } from 'react';

interface SMSStatusResponse {
  status: 'idle' | 'polling' | 'pending' | 'completed' | 'error' | 'timeout';
  sms_code?: string;
  attempts: number;
  elapsed_seconds: number;
  last_checked?: string;
  order: Order;
}

interface Order {
  id: number;
  user_id: number;
  purchased_number: string;
  reference_code: string;
  country: string;
  service: string;
  provider: string;
  amount: string;
  status: string;
  polling_attempts: number;
  last_polled_at?: string;
  error_message?: string;
  sms_code?: string;
  received_at?: string;
  created_at: string;
  elapsed_seconds?: number;
}

interface ManualCheckResponse {
  success: boolean;
  sms_code?: string;
  message: string;
  data?: any;
}

interface PurchaseNumberData {
  provider: string;
  country: string;
  service: string;
  email: string;
  price: number;
}

interface PurchaseNumberResponse {
  phone: {
    number: string;
    request_id: string;
  };
  table: Order;
  debitRef: string;
  message?: string;
}

interface SMSPollingOptions {
  onSuccess?: (code: string, order?: Order) => void;
  onError?: (error: string) => void;
  onTimeout?: () => void;
  enabled?: boolean;
}

interface PurchaseNumberOptions {
  onSuccess?: (data: PurchaseNumberResponse) => void;
  onError?: (error: string) => void;
}

interface MyOrdersOptions {
  refetchInterval?: number | false;
}

const checkSMSStatus = async (requestId: string): Promise<SMSStatusResponse> => {
  const { data } = await api.get<SMSStatusResponse>(`/api/sms/status/${requestId}`);
  return data;
};

const manualCheckSMS = async (requestId: string): Promise<ManualCheckResponse> => {
  const { data } = await api.post<ManualCheckResponse>(`/api/sms/check/${requestId}`);
  return data;
};

const purchaseNumber = async (purchaseData: PurchaseNumberData): Promise<PurchaseNumberResponse> => {
  
  const { data } = await api.post<PurchaseNumberResponse>('/api/sms/get-number', purchaseData, {
    headers: { "x-requires-auth": true }
  });
  return data;
};

const fetchMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<{ orders: Order[] }>('/api/sms/my-orders');
  return data.orders;
};

export const useSMSPolling = (requestId: string | null, options: SMSPollingOptions = {}) => {
  const {
    onSuccess,
    onError,
    onTimeout,
    enabled = true,
  } = options;

  const queryClient = useQueryClient();
  

  const callbacksCalledRef = useRef({
    success: false,
    timeout: false,
    error: false,
  });


  useEffect(() => {
    callbacksCalledRef.current = {
      success: false,
      timeout: false,
      error: false,
    };
  }, [requestId]);

  const query = useQuery({
    queryKey: ['sms-status', requestId],
    queryFn: () => checkSMSStatus(requestId!),
    enabled: enabled && !!requestId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 5000;
      if (['completed', 'error', 'timeout'].includes(data.status)) {
        return false;
      }
      return 5000;
    },
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const data = query.data;
  const error = query.error;

  useEffect(() => {
    if (data?.status === 'completed' && data.sms_code && !callbacksCalledRef.current.success) {
      callbacksCalledRef.current.success = true;
      onSuccess?.(data.sms_code, data.order);
    }
  }, [data?.status, data?.sms_code, data?.order, onSuccess]);

  useEffect(() => {
    if (data?.status === 'timeout' && !callbacksCalledRef.current.timeout) {
      callbacksCalledRef.current.timeout = true;
      onTimeout?.();
    }
  }, [data?.status, onTimeout]);


  useEffect(() => {
    if (error && !callbacksCalledRef.current.error) {
      callbacksCalledRef.current.error = true;
      const errorMessage = (error as any)?.response?.data?.message || (error as Error).message;
      onError?.(errorMessage);
    }
  }, [error, onError]);


  const manualCheck = useMutation({
    mutationFn: () => manualCheckSMS(requestId!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sms-status', requestId] });
      
      if (data.success && data.sms_code && !callbacksCalledRef.current.success) {
        callbacksCalledRef.current.success = true;
        onSuccess?.(data.sms_code);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message;
      onError?.(errorMessage);
    },
  });

  return {
    status: query.data?.status || 'idle',
    smsCode: query.data?.sms_code,
    attempts: query.data?.attempts || 0,
    elapsedTime: query.data?.elapsed_seconds || 0,
    order: query.data?.order,
    
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isPolling: query.fetchStatus === 'fetching',
    
    manualCheck: manualCheck.mutate,
    isManualChecking: manualCheck.isPending,
    
    refetch: query.refetch,
    stopPolling: () => queryClient.cancelQueries({ queryKey: ['sms-status', requestId] }),
  };
};

export const usePurchaseNumber = (options: PurchaseNumberOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (purchaseData: PurchaseNumberData) => purchaseNumber(purchaseData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message;
      console.log(error)
      onError?.(errorMessage);
    },
  });

  return {
    purchaseNumber: mutation.mutate,
    purchaseNumberAsync: mutation.mutateAsync,
    isPurchasing: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};

export const useMyOrders = (options: MyOrdersOptions = {}) => {
  const { refetchInterval = false } = options;

  const query = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    refetchInterval,
    staleTime: 30000,
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export const useOrder = (
  requestId: string | null, 
  options?: Omit<UseQueryOptions<SMSStatusResponse>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery({
    queryKey: ['order', requestId],
    queryFn: () => checkSMSStatus(requestId!),
    enabled: !!requestId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 5000;
      if (['completed', 'error', 'timeout'].includes(data.status)) {
        return false;
      }
      return 5000;
    },
    ...options,
  });

  return query;
};

interface CancelRequestData {
  request_id: string;
  debitref: string;
  user_id: string;
  email: string;
}

interface CancelRequestOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const cancelRequest = async (cancelData: CancelRequestData): Promise<any> => {
  const { data } = await api.post('/api/sms/cancel', cancelData);
  return data;
};

export const useCancelRequest = (options: CancelRequestOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cancelData: CancelRequestData) => cancelRequest(cancelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['sms-status'] });
      queryClient.removeQueries({ queryKey: ['smsRequest'] });
      
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message;
      onError?.(errorMessage);
    },
  });

  return {
    cancelRequest: mutation.mutate,
    cancelRequestAsync: mutation.mutateAsync,
    isCancelling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};