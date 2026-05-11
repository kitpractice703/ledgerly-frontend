/**
 * TransactionPage.jsx - 거래 내역 등록 및 수정 폼 페이지
 *
 * 신규 등록(/transactions/new)과 수정(/transactions/:id/edit)을 하나의 컴포넌트로 처리합니다.
 *        URL 파라미터 :id 유무를 useTransaction 훅에서 감지하여 모드를 결정하므로,
 *        이 컴포넌트는 렌더링 모드(제목·버튼 텍스트)만 조건부로 다르게 표시합니다.
 *
 * 금액 입력 필드는 숫자만 허용하면서 천 단위 구분 기호(,)를 표시합니다.
 *        입력 시 비숫자를 제거하고(raw value), 표시 시 toLocaleString()으로 포맷합니다.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useTransaction } from './useTransaction';

export default function TransactionPage() {
  const { id, categories, form, error, handleChange, handleSubmit, navigate } = useTransaction();

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 520 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {id ? '거래 내역 수정' : '거래 내역 등록'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem', mt: 0.5 }}>단위: 원</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                select
                name="categoryId"
                label="카테고리"
                value={form.categoryId}
                onChange={handleChange}
                required
                fullWidth
              >
                <MenuItem value="">카테고리 선택</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="type"
                label="구분"
                value={form.type}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="EXPENSE">지출</MenuItem>
                <MenuItem value="INCOME">수입</MenuItem>
              </TextField>

              <TextField
                name="amount"
                type="text"
                label="금액"
                value={form.amount === '' ? '' : Number(form.amount).toLocaleString()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  handleChange({ target: { name: 'amount', value: raw } });
                }}
                required
                fullWidth
              />

              <TextField
                name="transactionDate"
                type="date"
                label="날짜"
                value={form.transactionDate}
                onChange={handleChange}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                name="description"
                type="text"
                label="메모 (선택)"
                value={form.description}
                onChange={handleChange}
                fullWidth
              />

              <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
                  {id ? '수정하기' : '등록하기'}
                </Button>
                <Button variant="outlined" fullWidth sx={{ py: 1.5 }} onClick={() => navigate(-1)}>
                  취소
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
