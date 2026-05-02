import { useState } from 'react';
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
import Alert from '@mui/material/Alert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useBudget } from './useBudget';

function BudgetRow({ status, onUpdate, onDelete }) {
  const [limitAmount, setLimitAmount] = useState(status.budget.limitAmount);

  return (
    <TableRow hover>
      <TableCell>{status.budget.category.name}</TableCell>
      <TableCell>
        <TextField
          type="number"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          size="small"
          sx={{ width: 130 }}
          inputProps={{ min: 1 }}
        />
      </TableCell>
      <TableCell align="right">₩{status.spentAmount.toLocaleString()}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600, color: status.exceeded ? '#f44336' : '#4CAF50' }}>
        ₩{status.remaining.toLocaleString()}
      </TableCell>
      <TableCell align="center">
        <Chip
          label={status.exceeded ? '초과' : '안전'}
          size="small"
          sx={{
            backgroundColor: status.exceeded ? '#ffebee' : '#e8f5e9',
            color: status.exceeded ? '#f44336' : '#4CAF50',
            fontWeight: 700,
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" justifyContent="center" spacing={0.5}>
          <IconButton size="small" color="primary" onClick={() => onUpdate(status.budget.id, limitAmount)}>
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(status.budget.id)} sx={{ color: '#f44336' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default function BudgetPage() {
  const { budgetStatuses, categories, year, month, form, error, prevMonth, nextMonth, handleChange, handleSubmit, handleUpdate, handleDelete } = useBudget();

  return (
    <AppLayout>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton onClick={prevMonth} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
        <Typography variant="h5" fontWeight={700}>{year}년 {month}월 예산 관리</Typography>
        <IconButton onClick={nextMonth} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
      </Stack>

      {/* 예산 등록 폼 */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>예산 등록</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="center">
              <TextField
                select
                name="categoryId"
                label="카테고리"
                value={form.categoryId}
                onChange={handleChange}
                required
                size="small"
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">카테고리 선택</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                name="limitAmount"
                type="number"
                label="한도 금액"
                value={form.limitAmount}
                onChange={handleChange}
                required
                size="small"
                inputProps={{ min: 1 }}
                sx={{ minWidth: 140 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ height: 40, px: 3 }}>
                등록
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 예산 현황 테이블 */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>예산 현황</Typography>
      {budgetStatuses.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">등록된 예산이 없습니다.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>카테고리</TableCell>
                <TableCell>예산 한도</TableCell>
                <TableCell align="right">실제 지출</TableCell>
                <TableCell align="right">잔여</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetStatuses.map((s) => (
                <BudgetRow key={s.budget.id} status={s} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppLayout>
  );
}
