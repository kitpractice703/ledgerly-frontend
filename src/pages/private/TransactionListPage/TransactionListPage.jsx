import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useTransactionList } from './useTransactionList';

export default function TransactionListPage() {
  const { transactions, categories, filters, handleFilterChange, handleDelete, navigate } = useTransactionList();

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>거래 내역</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}
          onClick={() => navigate('/transactions/new')}>
          내역 추가
        </Button>
      </Box>

      {/* 필터 */}
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flexWrap="wrap">
            <TextField
              name="year"
              type="number"
              label="연도"
              value={filters.year}
              onChange={handleFilterChange}
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              select
              name="month"
              label="월"
              value={filters.month}
              onChange={handleFilterChange}
              size="small"
              sx={{ width: 100 }}
            >
              <MenuItem value="">전체</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>{m}월</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="categoryId"
              label="카테고리"
              value={filters.categoryId}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">전체</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="type"
              label="구분"
              value={filters.type}
              onChange={handleFilterChange}
              size="small"
              sx={{ width: 100 }}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="INCOME">수입</MenuItem>
              <MenuItem value="EXPENSE">지출</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* 테이블 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
      </Box>
      {transactions.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">조회된 거래 내역이 없습니다.</Typography>
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
              {transactions.map((tx) => (
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
    </AppLayout>
  );
}
