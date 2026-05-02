import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { FEATURES } from './LandingPage.data';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Box sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 60%, #fff 100%)',
        py: { xs: 10, md: 16 },
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={3}>
            PERSONAL FINANCE
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
            돈 관리, 이제 <Box component="span" color="primary.main">Ledgerly</Box>로
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.8 }}>
            수입·지출을 기록하고, 예산을 세우고, 소비 패턴을 분석하세요.<br />
            재정 목표를 향한 첫 걸음을 Ledgerly와 함께 시작하세요.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="contained" color="primary" size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
              무료로 시작하기
            </Button>
            <Button variant="outlined" color="primary" size="large"
              onClick={() => navigate('/guide')}
              sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
              사용방법 보기
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, fontWeight: 800 }}>
            유용한 기능
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 6 }}>
            Ledgerly가 제공하는 스마트한 가계부 기능을 경험해보세요.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {FEATURES.map(({ Icon, title, desc }) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={title}>
                <Card elevation={0} sx={{
                  height: '100%', p: 1, border: '1px solid #e8f5e9',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 8px 32px rgba(76,175,80,0.12)' },
                }}>
                  <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                    <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={700} mt={2} mb={1}>{title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </PageLayout>
  );
}
