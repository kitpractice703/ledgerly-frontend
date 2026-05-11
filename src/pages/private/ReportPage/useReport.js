/**
 * useReport.js - 리포트 페이지의 세 가지 통계 데이터를 페칭하는 Custom Hook
 *
 * 리포트는 연도 단위 데이터(월별 트렌드, 연간 요약)와 월 단위 데이터(카테고리 분석)를
 *        독립적으로 갱신해야 하므로 useEffect를 두 개로 분리했습니다.
 *        - 연도 변경 시: 월별 트렌드 + 연간 요약만 재요청
 *        - 연도·월·타입 변경 시: 카테고리 분석만 재요청
 *        이를 통해 불필요한 API 중복 호출을 방지합니다.
 */
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useReport() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  // 카테고리 분석의 기본 타입을 지출(EXPENSE)로 초기화합니다.
  const [breakdownType, setBreakdownType] = useState('EXPENSE');
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  // 연간 요약의 초기값을 0으로 설정하여 데이터 로딩 전에도 렌더링이 안전하게 동작합니다.
  const [annualSummary, setAnnualSummary] = useState({ totalIncome: 0, totalExpense: 0, netSavings: 0, savingsRate: 0 });

  // 연도가 바뀔 때만 연간 범위 데이터(월별 트렌드, 연간 요약)를 재요청합니다.
  useEffect(() => {
    api.get('/api/reports/monthly-trend', { params: { year } })
      .then((res) => setMonthlyTrend(res.data))
      .catch(() => {});

    api.get('/api/reports/annual-summary', { params: { year } })
      .then((res) => { if (res.data) setAnnualSummary(res.data); })
      .catch(() => {});
  }, [year]);

  // 연도·월·수입/지출 타입이 변경될 때마다 카테고리 분석 데이터를 재요청합니다.
  useEffect(() => {
    api.get('/api/reports/category-breakdown', { params: { year, month, type: breakdownType } })
      .then((res) => setCategoryBreakdown(res.data))
      .catch(() => {});
  }, [year, month, breakdownType]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  return { year, month, setMonth, breakdownType, setBreakdownType, monthlyTrend, categoryBreakdown, annualSummary, prevYear, nextYear };
}
