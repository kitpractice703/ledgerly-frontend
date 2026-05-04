import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useReport } from './useReport';

const PIE_COLORS = ['#1976D2', '#f44336', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#795548', '#607D8B'];

function fmt(value) {
  return `₩${value.toLocaleString()}`;
}

function SummaryCard({ icon, label, amount, sub, color }) {
  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, flex: 1 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Box sx={{ color, display: 'flex' }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Stack>
        <Typography variant="h6" fontWeight={700} sx={{ color }}>
          {fmt(amount)}
        </Typography>
        {sub != null && (
          <Typography variant="caption" color="text.secondary">{sub}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

function PieLabel({ cx, cy, midAngle, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#555" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function PeakMonthBar(props) {
  const { fill, x, y, width, height, isPeak } = props;
  return <rect x={x} y={y} width={width} height={height} fill={isPeak ? '#d32f2f' : fill} rx={4} ry={4} />;
}

export default function ReportPage() {
  const {
    year, month, setMonth,
    breakdownType, setBreakdownType,
    monthlyTrend, categoryBreakdown, annualSummary,
    prevYear, nextYear,
  } = useReport();

  const hasAnyData = monthlyTrend.some((d) => d.income > 0 || d.expense > 0);

  const maxExpense = Math.max(...monthlyTrend.map((d) => d.expense), 0);

  const chartData = monthlyTrend.map((d) => ({
    name: `${d.month}월`,
    수입: d.income,
    지출: d.expense,
    isPeak: d.expense === maxExpense && maxExpense > 0,
  }));

  const totalBreakdown = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppLayout>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>리포트</Typography>

      {/* 연도 네비게이션 */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={prevYear} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
        <Typography variant="h6" fontWeight={700}>{year}년</Typography>
        <IconButton onClick={nextYear} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
      </Stack>

      {/* 연간 요약 카드 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <SummaryCard
          icon={<TrendingUpIcon />}
          label="총 수입"
          amount={annualSummary.totalIncome}
          color="#4CAF50"
        />
        <SummaryCard
          icon={<TrendingDownIcon />}
          label="총 지출"
          amount={annualSummary.totalExpense}
          color="#f44336"
        />
        <SummaryCard
          icon={<SavingsIcon />}
          label="순이익"
          amount={annualSummary.netSavings}
          sub={`저축률 ${annualSummary.savingsRate}%`}
          color={annualSummary.netSavings >= 0 ? '#1976D2' : '#f44336'}
        />
      </Stack>

      {/* 월별 트렌드 바 차트 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>월별 수입 / 지출</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
      </Box>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          {!hasAnyData ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">{year}년 거래 내역이 없습니다.</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(value) => fmt(value)} />
                <Legend />
                <Bar dataKey="수입" fill="#4CAF50" shape={<PeakMonthBar />} />
                <Bar dataKey="지출" fill="#f44336" shape={<PeakMonthBar />} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 카테고리별 분석 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>카테고리별 분석</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tabs
              value={breakdownType}
              onChange={(_, v) => setBreakdownType(v)}
              sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.8rem' } }}
            >
              <Tab label="지출" value="EXPENSE" />
              <Tab label="수입" value="INCOME" />
            </Tabs>
            <TextField
              select
              size="small"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              sx={{ width: 80 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>{m}월</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
        </Stack>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {categoryBreakdown.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              해당 월의 {breakdownType === 'EXPENSE' ? '지출' : '수입'} 내역이 없습니다.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
              <Box sx={{ width: { xs: '100%', md: 300 }, height: 280, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="amount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={<PieLabel />}
                    >
                      {categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ flex: 1, width: '100%' }}>
                {categoryBreakdown.map((item, i) => {
                  const pct = totalBreakdown > 0 ? ((item.amount / totalBreakdown) * 100).toFixed(1) : 0;
                  return (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <Typography variant="body2">{item.categoryName}</Typography>
                        <Chip label={`${pct}%`} size="small" sx={{ height: 18, fontSize: '0.7rem' }} />
                      </Stack>
                      <Typography variant="body2" fontWeight={600}>{fmt(item.amount)}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
