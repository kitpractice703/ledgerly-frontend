import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppLayout from '../../../components/AppLayout/AppLayout';
import api from '../../../api/axios';
import { useDashboard } from './useDashboard';

const STAT_CARDS = [
  { key: 'totalIncome', label: '총 수입', Icon: TrendingUpIcon, color: '#4CAF50', bg: '#e8f5e9' },
  { key: 'totalExpense', label: '총 지출', Icon: TrendingDownIcon, color: '#f44336', bg: '#ffebee' },
  { key: 'balance', label: '잔액', Icon: AccountBalanceIcon, color: '#1976D2', bg: '#e3f2fd' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, year, month, refresh, prevMonth, nextMonth } = useDashboard();

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    await api.delete(`/api/transactions/${id}`);
    refresh();
  };

  if (!data) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" />
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* 월 네비게이션 */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton onClick={prevMonth} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
        <Typography variant="h5" fontWeight={700}>{year}년 {month}월</Typography>
        <IconButton onClick={nextMonth} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
      </Stack>

      {/* 요약 카드 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {STAT_CARDS.map(({ key, label, Icon, color, bg }) => (
          <Grid size={{ xs: 12, sm: 4 }} key={key}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color }}>
                    ₩{data[key]?.toLocaleString() ?? 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 예산 현황 */}
      {data.budgetStatuses?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>예산 현황</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell fontWeight={600}>카테고리</TableCell>
                  <TableCell align="right">예산</TableCell>
                  <TableCell align="right">지출</TableCell>
                  <TableCell align="right">잔여</TableCell>
                  <TableCell align="center">상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.budgetStatuses.map((s) => (
                  <TableRow key={s.budget.id}>
                    <TableCell>{s.budget.category.name}</TableCell>
                    <TableCell align="right">₩{s.budget.limitAmount.toLocaleString()}</TableCell>
                    <TableCell align="right">₩{s.spentAmount.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: s.exceeded ? '#f44336' : '#4CAF50', fontWeight: 600 }}>
                      ₩{s.remaining.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={s.exceeded ? '초과' : '안전'}
                        size="small"
                        sx={{
                          backgroundColor: s.exceeded ? '#ffebee' : '#e8f5e9',
                          color: s.exceeded ? '#f44336' : '#4CAF50',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* 거래 내역 */}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>거래 내역</Typography>

        {data.transactions.length === 0 ? (
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">이번 달 거래 내역이 없습니다.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell>날짜</TableCell>
                  <TableCell>카테고리</TableCell>
                  <TableCell>메모</TableCell>
                  <TableCell align="center">구분</TableCell>
                  <TableCell align="right">금액</TableCell>
                  <TableCell align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{tx.transactionDate}</TableCell>
                    <TableCell>{tx.category.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{tx.description}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={tx.type === 'INCOME' ? '수입' : '지출'}
                        size="small"
                        sx={{
                          backgroundColor: tx.type === 'INCOME' ? '#e8f5e9' : '#fff3e0',
                          color: tx.type === 'INCOME' ? '#4CAF50' : '#e65100',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: tx.type === 'INCOME' ? '#4CAF50' : '#f44336' }}>
                      {tx.type === 'INCOME' ? '+' : '-'}₩{tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" spacing={0.5}>
                        <IconButton size="small" onClick={() => navigate(`/transactions/${tx.id}/edit`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(tx.id)} sx={{ color: '#f44336' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />}
            onClick={() => navigate('/transactions/new')}>
            내역 추가
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}
