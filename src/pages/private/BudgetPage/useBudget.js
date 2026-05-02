import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useBudget() {
  const [budgetStatuses, setBudgetStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [form, setForm] = useState({
    categoryId: '', limitAmount: '',
    year: new Date().getFullYear(), month: new Date().getMonth() + 1,
  });
  const [error, setError] = useState('');

  const fetchBudgets = () => {
    api.get('/api/budgets', { params: { year, month } })
      .then((res) => setBudgetStatuses(res.data));
  };

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchBudgets();
    setForm((prev) => ({ ...prev, year, month }));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/budgets', form);
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data || '등록에 실패했습니다.');
    }
  };

  const handleUpdate = async (id, limitAmount) => {
    await api.put(`/api/budgets/${id}`, null, { params: { limitAmount } });
    fetchBudgets();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('예산을 삭제하시겠습니까?')) return;
    await api.delete(`/api/budgets/${id}`);
    fetchBudgets();
  };

  return { budgetStatuses, categories, year, month, form, error, prevMonth, nextMonth, handleChange, handleSubmit, handleUpdate, handleDelete };
}
