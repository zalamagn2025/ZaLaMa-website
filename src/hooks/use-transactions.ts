import { useState, useEffect } from 'react';
import { Transaction, TransactionsResponse } from '@/types/transaction';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des transactions');
      }
      
      const data: TransactionsResponse = await response.json();
      setTransactions(data.transactions);
      setTotal(data.total);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des transactions:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    total,
    refetch: fetchTransactions
  };
} 