
import { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import api from '../../../lib/axios-config';

interface Transaction {
  id?: string | number;
  transaction_ref?: string;
  note: string | null;
  amount: string | number | null;
  status: "successful" | "refunded" | "pending" | "failed" | "used";
  created_at?: string;
  user_id?: string | number;
  source?: string | null;
  type?: string | null;
}

type FilterStatus = "successful" | "refunded" | "pending" | "failed" | "all";

export const useTransactionFilter = (userId: string | undefined | null) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch transactions with TanStack Query
  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["userTransactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get('/api/get-transaction', {
        headers: { "x-requires-auth": true }
      });
      // Filter by userId and only include specific statuses with valid amounts
      return response.data.filter((item: any) => 
        item.user_id == userId && 
        ['successful', 'refunded', 'failed'].includes(item.status) &&
        item.amount !== null &&
        item.amount !== undefined
      );
    },
    enabled: !!userId,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // Filtered transactions based on selected status
  const filteredTransactions = useMemo(() => {
    if (filterStatus === "all") return transactions;
    return transactions.filter(txn => txn.status === filterStatus);
  }, [transactions, filterStatus]);

  // Visible transactions with pagination
  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);

  // Filter handler
  const handleFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setVisibleCount(10); // Reset visible count when filter changes
  };

  // Clear filter
  const clearFilter = () => {
    setFilterStatus("all");
    setVisibleCount(10);
  };

  return {
    transactions,
    filteredTransactions,
    visibleTransactions,
    visibleCount,
    setVisibleCount,
    filterStatus,
    handleFilter,
    clearFilter,
    isLoading,
    error,
  };
};