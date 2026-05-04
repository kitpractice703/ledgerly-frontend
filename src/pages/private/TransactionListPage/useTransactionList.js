import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export function useTransactionList() {
  const navigate = useNavigate();
  const now = new Date();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const [filters, setFilters] = useState({
    year: now.getFullYear(),
    month: '',
    categoryId: '',
    type: '',
  });

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = { year: filters.year };
    if (filters.month) params.month = filters.month;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.type) params.type = filters.type;
    api.get('/api/transactions', { params }).then((res) => setTransactions(res.data)).catch(() => {});
  }, [filters, refreshTick]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      setRefreshTick((t) => t + 1);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  return { transactions, categories, filters, handleFilterChange, handleDelete, navigate };
}
