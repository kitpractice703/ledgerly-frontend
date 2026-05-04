import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useCategory() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'EXPENSE' });
  const [error, setError] = useState('');

  const fetchCategories = () => {
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/categories', form);
      setForm({ name: '', type: 'EXPENSE' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data || '등록에 실패했습니다.');
    }
  };

  const handleUpdate = async (id, name, type) => {
    try {
      await api.put(`/api/categories/${id}`, { name, type });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || '수정에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('카테고리를 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data || '삭제에 실패했습니다.');
    }
  };

  return { categories, form, error, handleChange, handleSubmit, handleUpdate, handleDelete };
}
