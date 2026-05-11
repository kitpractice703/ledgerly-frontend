/**
 * DashboardPage.jsx - 월별 재정 현황을 한눈에 확인하는 메인 대시보드
 *
 * 수입·지출·잔액 요약 카드, 예산 현황 테이블, 거래 내역 테이블을 하나의 페이지에 구성합니다.
 *        데이터 페칭과 월 네비게이션 상태는 useDashboard 훅으로 분리하여 이 컴포넌트는 렌더링에만 집중합니다.
 *
 * 페이지 진입 시 data가 null이면 로딩 스피너를 표시하고,
 *        API 응답 완료 후 전체 레이아웃을 렌더링합니다. (조건부 early return 패턴)
 */
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

// 요약 카드 3개의 설정을 배열로 선언하여 렌더링 로직을 map()으로 일반화합니다.
//        카드 추가·순서 변경 시 이 배열만 수정하면 되므로 유지보수가 용이합니다.
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
    try {
      await api.delete(`/api/transactions/${id}`);
      refresh();
    } catch {
      alert('삭제에 실패했습니다.');
    }
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
      {/* 월 네비게이션: 이전/다음 달 이동. 1월 ↔ 12월 경계에서 연도도 함께 변경됩니다. */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton onClick={prevMonth} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
        <Typography variant="h5" fontWeight={700}>{year}년 {month}월</Typography>
        <IconButton onClick={nextMonth} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
      </Stack>

      {/* 요약 카드: 총 수입·총 지출·잔액을 STAT_CARDS 배열 기반으로 렌더링합니다. */}
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

      {/* 예산 현황: 등록된 예산이 없으면 섹션 전체를 숨겨 빈 테이블을 노출하지 않습니다. */}
      {data.budgetStatuses?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>예산 현황</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
          </Box>
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
                  <TableRow key={s.budgetId}>
                    <TableCell>{s.categoryName}</TableCell>
                    <TableCell align="right">₩{s.limitAmount.toLocaleString()}</TableCell>
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

      {/* 거래 내역: 빈 상태일 때 안내 메시지를 표시하고, 내역이 있을 때만 테이블을 렌더링합니다. */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>거래 내역</Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
        </Box>

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
