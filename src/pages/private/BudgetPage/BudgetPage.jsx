/**
 * BudgetPage.jsx - 월별 예산 등록 및 현황을 관리하는 페이지
 *
 * [설계] BudgetRow를 독립 컴포넌트로 분리하여 각 행이 자체 편집 상태(limitAmount)를 가집니다.
 *        테이블 행 단위로 한도 금액을 수정하고 저장할 수 있어 UX가 개선됩니다.
 *
 * [설계] 월 네비게이션, 예산 등록 폼, 현황 테이블 세 섹션으로 구성됩니다.
 *        상태 관리와 API 호출은 useBudget 훅으로 분리합니다.
 */
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

/**
 * BudgetRow - 예산 현황 테이블의 개별 행 컴포넌트
 *
 * [설계] 각 행이 독립적인 limitAmount 상태를 가집니다. 한 행의 수정이 다른 행에 영향을
 *        주지 않도록 상태를 행 단위로 격리합니다.
 */
function BudgetRow({ status, onUpdate, onDelete }) {
  const [limitAmount, setLimitAmount] = useState(status.limitAmount);

  return (
    <TableRow hover>
      <TableCell>{status.categoryName}</TableCell>
      <TableCell>
        <TextField
          type="text"
          value={limitAmount === '' ? '' : Number(limitAmount).toLocaleString()}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            setLimitAmount(raw);
          }}
          size="small"
          sx={{ width: 130 }}
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
          <IconButton size="small" color="primary" onClick={() => onUpdate(status.budgetId, Number(limitAmount))}>
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(status.budgetId)} sx={{ color: '#f44336' }}>
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

      {/* 예산 등록 폼: 카테고리와 한도 금액을 선택하여 해당 월의 예산을 등록합니다. */}
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
                type="text"
                label="한도 금액"
                value={form.limitAmount === '' ? '' : Number(form.limitAmount).toLocaleString()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  handleChange({ target: { name: 'limitAmount', value: raw } });
                }}
                required
                size="small"
                sx={{ minWidth: 140 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ height: 40, px: 3 }}>
                등록
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 예산 현황 테이블: 실제 지출과 한도를 비교하여 초과 여부를 색상 및 Chip으로 표시합니다. */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>예산 현황</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>단위: 원</Typography>
      </Box>
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
                <BudgetRow key={s.budgetId} status={s} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppLayout>
  );
}
