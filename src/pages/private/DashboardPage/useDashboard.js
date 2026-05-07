/**
 * useDashboard.js - 대시보드 데이터 페칭 및 월 네비게이션 상태를 관리하는 Custom Hook
 *
 * [설계] 데이터 페칭 로직과 UI 렌더링 로직을 분리(관심사 분리)하기 위해 Custom Hook으로 추출했습니다.
 *        DashboardPage.jsx는 렌더링에만 집중하고, 이 훅이 상태·비동기·사이드이펙트를 전담합니다.
 */
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useDashboard() {
  const [data, setData] = useState(null);
  // 초기값을 현재 연월로 설정하여 첫 렌더링 시 이번 달 데이터를 즉시 표시
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // getMonth()는 0-indexed이므로 +1

  // [설계] refreshTick은 외부(삭제 등 CUD 작업) 이후 동일한 year/month로 재요청을 트리거하기 위한
  //        카운터입니다. year/month 의존성만으로는 같은 달에서 새로고침을 표현할 수 없습니다.
  const [refreshTick, setRefreshTick] = useState(0);

  // year, month, refreshTick 중 하나라도 변경되면 API를 재호출하여 최신 데이터를 반영합니다.
  useEffect(() => {
    api.get('/api/dashboard', { params: { year, month } })
      .then((res) => setData(res.data))
      .catch(() => {});
  }, [year, month, refreshTick]);

  // 거래 내역 삭제 후 같은 달의 데이터를 다시 불러오기 위해 외부에서 호출합니다.
  const refresh = () => setRefreshTick((t) => t + 1);

  // 1월에서 이전 달 이동 시 연도를 함께 감소시켜 연속적인 네비게이션을 구현합니다.
  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };

  // 12월에서 다음 달 이동 시 연도를 함께 증가시킵니다.
  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  return { data, year, month, refresh, prevMonth, nextMonth };
}
