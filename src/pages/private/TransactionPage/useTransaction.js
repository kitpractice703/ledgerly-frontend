import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';

export function useTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: '', amount: '', description: '', type: 'EXPENSE', transactionDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
    if (id) {
      api.get(`/api/transactions/${id}`).then((res) => {
        const tx = res.data;
        setForm({
          categoryId: tx.category.id,
          amount: tx.amount,
          description: tx.description || '',
          type: tx.type,
          transactionDate: tx.transactionDate,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
      };
      if (id) {
        await api.put(`/api/transactions/${id}`, payload);
      } else {
        await api.post('/api/transactions', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || '저장에 실패했습니다.');
    }
  };

  return { id, categories, form, error, handleChange, handleSubmit, navigate };
}
