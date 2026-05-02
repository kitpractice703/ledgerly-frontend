import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
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
