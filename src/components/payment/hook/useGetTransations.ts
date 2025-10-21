import { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import api from '../../../lib/axios-config';
import { useBalance } from '../../../balance';

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
  const { refreshBalance } = useBalance();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["userTransactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get('/api/get-transaction', {
        headers: { "x-requires-auth": true }
      });
      await refreshBalance();
      
      const filtered = response.data.filter((item: any) => 
        item.user_id == userId && 
        ['successful', 'refunded', 'failed'].includes(item.status) &&
        item.amount !== null &&
        item.amount !== undefined
      );
      
      
      return filtered.sort((a: Transaction, b: Transaction) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });
    },
    enabled: !!userId,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // Filter transactions by status (already sorted from query)
  const filteredTransactions = useMemo(() => {
    if (filterStatus === "all") return transactions;
    return transactions.filter(txn => txn.status === filterStatus);
  }, [transactions, filterStatus]);

  // Get visible transactions (slice maintains sort order)
  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);

  const handleFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setVisibleCount(10); 
  };

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