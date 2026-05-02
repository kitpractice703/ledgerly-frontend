import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { GUIDE_STEPS, FAQ } from './GuidePage.data';

export default function GuidePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={3}>
            HOW TO USE
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 3, mb: 2 }}>
            사용방법
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5, fontSize: '1.05rem', lineHeight: 1.8 }}>
            5단계로 쉽게 시작하는 Ledgerly 가이드입니다.
          </Typography>

          <Stack spacing={3}>
            {GUIDE_STEPS.map((s) => (
              <Paper key={s.step} elevation={0} sx={{
                display: 'flex', alignItems: 'flex-start', gap: 3, p: 3,
                border: '1px solid #e8f5e9', borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 20px rgba(76,175,80,0.1)' },
              }}>
                <Box sx={{
                  minWidth: 56, height: 56, borderRadius: '50%',
                  backgroundColor: 'primary.main', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                }}>
                  {s.step}
                </Box>
                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="h6" fontWeight={700} mb={0.5}>{s.title}</Typography>
                  <Typography color="text.secondary" lineHeight={1.8}>{s.desc}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          <Typography variant="h5" sx={{ mt: 7, mb: 4, fontWeight: 800 }}>자주 묻는 질문</Typography>
          <Stack spacing={2}>
            {FAQ.map((item) => (
              <Paper key={item.q} elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <Typography fontWeight={700} mb={0.5}>Q. {item.q}</Typography>
                <Typography color="text.secondary">A. {item.a}</Typography>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 12, mb: 4 }}>
            <Button variant="contained" color="primary" size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 6, py: 1.5, fontSize: '1rem' }}>
              지금 바로 시작하기
            </Button>
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
}
