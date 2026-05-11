/**
 * 대시보드 데이터 페칭과 월 네비게이션 상태를 관리하는 Custom Hook입니다.
 * DashboardPage.jsx가 렌더링에만 집중할 수 있도록 상태·비동기 로직을 분리했습니다.
 */
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // getMonth()는 0-indexed

  // year/month가 같아도 삭제 후 새로고침이 필요할 때 트리거하는 카운터입니다.
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    api.get('/api/dashboard', { params: { year, month } })
      .then((res) => setData(res.data))
      .catch(() => {});
  }, [year, month, refreshTick]);

  const refresh = () => setRefreshTick((t) => t + 1);

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  return { data, year, month, refresh, prevMonth, nextMonth };
}
