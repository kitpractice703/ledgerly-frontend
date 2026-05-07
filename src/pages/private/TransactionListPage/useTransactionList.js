/**
 * useTransactionList.js - 거래 내역 목록의 필터 상태와 데이터 페칭을 관리하는 Custom Hook
 *
 * [설계] 카테고리 목록은 최초 1회만 로드하고(마운트 시), 거래 내역은 필터 변경·삭제 후 재로드합니다.
 *        두 데이터의 갱신 주기가 다르므로 useEffect를 분리합니다.
 *
 * [설계] 필터 값이 빈 문자열('')이면 해당 조건을 API 파라미터에서 제외합니다.
 *        "전체" 선택 시 빈 값을 유지하면 서버에서 필터 없이 조회합니다.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export function useTransactionList() {
  const navigate = useNavigate();
  const now = new Date();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  // refreshTick: 삭제 후 동일 필터로 목록을 다시 불러오기 위한 카운터
  const [refreshTick, setRefreshTick] = useState(0);
  // 초기 필터: 연도는 현재 연도, 나머지는 전체('') 조회
  const [filters, setFilters] = useState({
    year: now.getFullYear(),
    month: '',
    categoryId: '',
    type: '',
  });

  // 카테고리 목록은 최초 마운트 시 1회만 불러옵니다.
  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // 필터나 refreshTick이 바뀔 때마다 거래 내역을 재조회합니다.
  useEffect(() => {
    // 빈 값 필터는 파라미터에서 제외하여 불필요한 쿼리 조건을 제거합니다.
    const params = { year: filters.year };
    if (filters.month) params.month = filters.month;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.type) params.type = filters.type;
    api.get('/api/transactions', { params }).then((res) => setTransactions(res.data)).catch(() => {});
  }, [filters, refreshTick]);

  // 필터 필드 변경을 name 기반으로 통합 처리합니다.
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      // 삭제 후 refreshTick을 증가시켜 현재 필터 조건으로 목록을 재로드합니다.
      setRefreshTick((t) => t + 1);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  return { transactions, categories, filters, handleFilterChange, handleDelete, navigate };
}
