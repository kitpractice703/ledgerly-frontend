import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useReport() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [breakdownType, setBreakdownType] = useState('EXPENSE');
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [annualSummary, setAnnualSummary] = useState(null);

  useEffect(() => {
    api.get('/api/reports/monthly-trend', { params: { year } })
      .then((res) => setMonthlyTrend(res.data))
      .catch(() => {});

    api.get('/api/reports/annual-summary', { params: { year } })
      .then((res) => setAnnualSummary(res.data))
      .catch(() => {});
  }, [year]);

  useEffect(() => {
    api.get('/api/reports/category-breakdown', { params: { year, month, type: breakdownType } })
      .then((res) => setCategoryBreakdown(res.data))
      .catch(() => {});
  }, [year, month, breakdownType]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  return { year, month, setMonth, breakdownType, setBreakdownType, monthlyTrend, categoryBreakdown, annualSummary, prevYear, nextYear };
}
