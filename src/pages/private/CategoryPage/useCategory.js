/**
 * useCategory.js - 카테고리 CRUD 상태와 API 로직을 관리하는 Custom Hook
 *
 * [설계] fetchCategories를 내부 함수로 선언하여 등록·수정·삭제 후 공통 재조회 로직으로 재사용합니다.
 */
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useCategory() {
  const [categories, setCategories] = useState([]);
  // 신규 카테고리 등록 폼. type 기본값을 'EXPENSE'로 설정합니다.
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
