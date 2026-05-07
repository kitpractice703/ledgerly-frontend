/**
 * useTransaction.js - 거래 내역 등록/수정 폼의 상태와 API 로직을 관리하는 Custom Hook
 *
 * [설계] URL 파라미터 :id 유무로 등록(POST)과 수정(PUT) 모드를 자동으로 구분합니다.
 *        - id 없음: 빈 폼으로 시작 → POST /api/transactions
 *        - id 있음: 기존 데이터를 불러와 폼에 채움 → PUT /api/transactions/:id
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';

export function useTransaction() {
  const navigate = useNavigate();
  // URL에서 거래 ID를 추출합니다. 수정 모드에서만 값이 존재합니다.
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  // 폼 초기값: type을 'EXPENSE'로 설정하여 지출이 더 자주 입력되는 UX를 반영합니다.
  const [form, setForm] = useState({
    categoryId: '', amount: '', description: '', type: 'EXPENSE', transactionDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // 카테고리 목록은 등록·수정 모두 필요하므로 항상 로드합니다.
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
    if (id) {
      // 수정 모드: 기존 거래 데이터를 불러와 폼에 채웁니다.
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

  // 폼 필드 변경을 name 속성 기반으로 통합 처리하여 핸들러를 하나로 유지합니다.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 문자열로 관리되던 categoryId·amount를 서버 요청 전 숫자로 변환합니다.
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
      // 저장 완료 후 대시보드로 이동하여 변경된 거래 현황을 즉시 확인하게 합니다.
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || '저장에 실패했습니다.');
    }
  };

  return { id, categories, form, error, handleChange, handleSubmit, navigate };
}
