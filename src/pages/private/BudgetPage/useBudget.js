/**
 * useBudget.js - 예산 페이지의 월 네비게이션, 데이터 페칭, CRUD를 관리하는 Custom Hook
 *
 * [설계] fetchBudgets를 내부 함수로 선언하여 등록·수정·삭제 후 공통 재조회 로직으로 재사용합니다.
 *        useEffect 의존성에 직접 넣지 않고 명시적 호출로 갱신 시점을 제어합니다.
 *
 * [설계] form의 year/month를 네비게이션 상태(year, month)와 동기화하여
 *        예산 등록 시 현재 보고 있는 달에 자동으로 예산이 연결됩니다.
 */
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
      .then((res) => setBudgetStatuses(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
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
      await api.post('/api/budgets', {
        ...form,
        categoryId: Number(form.categoryId),
        limitAmount: Number(form.limitAmount),
      });
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data || '등록에 실패했습니다.');
    }
  };

  const handleUpdate = async (id, limitAmount) => {
    try {
      // [설계] 한도 금액만 변경하므로 body 없이 query param으로 전달합니다.
      await api.put(`/api/budgets/${id}`, null, { params: { limitAmount } });
      fetchBudgets();
    } catch (err) {
      alert(err.response?.data || '수정에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('예산을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      alert(err.response?.data || '삭제에 실패했습니다.');
    }
  };

  return { budgetStatuses, categories, year, month, form, error, prevMonth, nextMonth, handleChange, handleSubmit, handleUpdate, handleDelete };
}
