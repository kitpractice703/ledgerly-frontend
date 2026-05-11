/**
 * CategoryPage.jsx - 사용자 카테고리를 등록·수정·삭제하는 관리 페이지
 *
 * CategoryRow를 독립 컴포넌트로 분리하여 각 행이 자체 편집 상태(name, type)를 가집니다.
 *        테이블 행 단위로 이름과 타입을 수정한 후 저장 버튼으로 반영합니다.
 *
 * 카테고리 삭제 시 해당 카테고리를 사용 중인 거래 내역이 있으면 서버에서 400을 반환합니다.
 *        CategoryController가 DataIntegrityViolationException을 캐치하여 적절한 오류 메시지를 반환합니다.
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
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useCategory } from './useCategory';

// 수입/지출 타입을 구분하는 Chip의 색상 스타일을 타입 키로 관리합니다.
// 타입이 추가될 경우 이 객체에만 색상을 추가하면 됩니다.
const TYPE_CHIP_STYLE = {
  EXPENSE: { backgroundColor: '#fff3e0', color: '#e65100' },
  INCOME:  { backgroundColor: '#e8f5e9', color: '#4CAF50' },
};

/**
 * CategoryRow - 카테고리 목록 테이블의 개별 행 컴포넌트
 *
 * 각 행이 독립적인 name/type 편집 상태를 가집니다.
 *        "현재 구분" 컬럼은 저장 전 원본 타입을, "구분 변경" 컬럼은 편집 중인 값을 표시합니다.
 */
function CategoryRow({ category, onUpdate, onDelete }) {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState(category.type);

  return (
    <TableRow hover>
      <TableCell>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          sx={{ width: 160 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          select
          value={type}
          onChange={(e) => setType(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        >
          <MenuItem value="EXPENSE">지출</MenuItem>
          <MenuItem value="INCOME">수입</MenuItem>
        </TextField>
      </TableCell>
      <TableCell>
        <Chip
          label={category.type === 'EXPENSE' ? '지출' : '수입'}
          size="small"
          sx={{ fontWeight: 700, ...TYPE_CHIP_STYLE[category.type] }}
        />
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" justifyContent="center" spacing={0.5}>
          <IconButton size="small" color="primary" onClick={() => onUpdate(category.id, name, type)}>
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(category.id)} sx={{ color: '#f44336' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default function CategoryPage() {
  const { categories, form, error, handleChange, handleSubmit, handleUpdate, handleDelete } = useCategory();

  return (
    <AppLayout>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>카테고리 관리</Typography>

      {/* 카테고리 등록 폼: 이름과 타입(수입/지출)을 입력하여 새 카테고리를 등록합니다. */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>카테고리 등록</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="center">
              <TextField
                name="name"
                type="text"
                label="카테고리명"
                value={form.name}
                onChange={handleChange}
                required
                size="small"
                sx={{ minWidth: 180 }}
              />
              <TextField
                select
                name="type"
                label="구분"
                value={form.type}
                onChange={handleChange}
                size="small"
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="EXPENSE">지출</MenuItem>
                <MenuItem value="INCOME">수입</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" color="primary" sx={{ height: 40, px: 3 }}>
                등록
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 카테고리 목록: 등록된 카테고리가 없으면 안내 메시지를, 있으면 테이블을 렌더링합니다. */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>카테고리 목록</Typography>
      {categories.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">등록된 카테고리가 없습니다.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>카테고리명</TableCell>
                <TableCell>구분 변경</TableCell>
                <TableCell>현재 구분</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((c) => (
                <CategoryRow key={c.id} category={c} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppLayout>
  );
}
