import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { NEWS_ITEMS, TAG_COLORS } from './NewsPage.data';

export default function NewsPage() {
  return (
    <PageLayout>
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#fff' }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={3}>
            UPDATES & NEWS
          </Typography>
          <Typography variant="h3" fontWeight={800} mt={1} mb={1}>
            소식
          </Typography>
          <Typography color="text.secondary" mb={8} fontSize="1.05rem">
            Ledgerly의 최신 업데이트와 출시 예정 기능을 확인하세요.
          </Typography>

          <Stack spacing={3} divider={<Divider />}>
            {NEWS_ITEMS.map((n) => (
              <Card key={n.title} elevation={0} sx={{ border: 'none', borderRadius: 0, py: 1 }}>
                <CardContent sx={{ px: 0 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Chip label={n.tag} size="small" color={TAG_COLORS[n.tag] || 'default'} sx={{ fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>{n.date}</Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={700} mb={1}>{n.title}</Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{n.desc}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>
    </PageLayout>
  );
}
