import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useRegister } from './useRegister';

export default function RegisterPage() {
  const { form, error, success, handleChange, handleSubmit } = useRegister();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      px: 2,
    }}>
      <Card elevation={0} sx={{ width: '100%', maxWidth: 420, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800} color="primary" sx={{ textAlign: 'center', mb: 0.5 }}>
            Ledgerly
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            무료로 시작하세요.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="username"
              type="text"
              label="이름"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="email"
              type="email"
              label="이메일"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="password"
              type="password"
              label="비밀번호 (8자 이상)"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5, mt: 1 }}>
              회원가입
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#4CAF50', fontWeight: 600, textDecoration: 'none' }}>
              로그인
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
