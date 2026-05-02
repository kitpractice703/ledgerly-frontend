import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import PageLayout from '../../../components/PageLayout/PageLayout';

const CONTACT_ITEMS = [
  {
    icon: <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: '이메일 문의',
    desc: '가장 빠른 문의 방법입니다. 서비스 이용 중 불편한 점이나 개선 의견을 자유롭게 보내주세요.',
    action: (
      <Button variant="contained" color="primary"
        href="mailto:kitpractice703@gmail.com"
        startIcon={<EmailIcon />}
        sx={{ mt: 2 }}>
        이메일로 문의하기
      </Button>
    ),
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: '응답 시간',
    desc: '문의 접수 후 평균 1–2 영업일 이내에 답변드립니다. 주말 및 공휴일은 다음 영업일에 처리됩니다.',
    action: null,
  },
  {
    icon: <HelpOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: '문의 전 확인사항',
    desc: '사용방법 페이지의 FAQ를 먼저 확인해주세요. 자주 묻는 질문에 이미 답변이 있을 수 있습니다.',
    action: null,
  },
];

export default function ContactPage() {
  return (
    <PageLayout>
      <Box sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 60%, #fff 100%)',
        py: { xs: 8, md: 12 },
      }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={3}>
            CONTACT
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 2, mb: 3 }}>
            문의하기
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 8, fontSize: '1.05rem', lineHeight: 1.8 }}>
            궁금한 점이나 불편한 점이 있으시면 언제든지 연락주세요.
          </Typography>

          <Stack spacing={3}>
            {CONTACT_ITEMS.map((item) => (
              <Paper key={item.title} elevation={0} sx={{
                p: 4, border: '1px solid #e8f5e9', borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 20px rgba(76,175,80,0.1)' },
              }}>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Box sx={{ pt: 0.5, flexShrink: 0 }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={1}>{item.title}</Typography>
                    <Typography color="text.secondary" lineHeight={1.8}>{item.desc}</Typography>
                    {item.action}
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 8, p: 6, textAlign: 'center', background: '#fff', borderRadius: 4, border: '2px solid #4CAF50' }}>
            <EmailIcon sx={{ fontSize: 52, color: 'primary.main', mb: 3 }} />
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>바로 문의하기</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              아래 버튼을 누르면 이메일 앱이 열립니다.
            </Typography>
            <Button variant="contained" color="primary" size="large"
              href="mailto:kitpractice703@gmail.com"
              startIcon={<EmailIcon />}
              sx={{ px: 6, py: 1.5, fontSize: '1rem' }}>
              이메일 보내기
            </Button>
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
}
