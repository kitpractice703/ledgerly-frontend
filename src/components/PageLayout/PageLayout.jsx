/**
 * PageLayout.jsx - 공개 페이지(비인증)를 위한 공통 레이아웃 컴포넌트
 *
 * Navbar + 콘텐츠 + 푸터 구조를 제공합니다. 공개 페이지들은 이 레이아웃을 공유하여
 *        상단 네비게이션과 하단 저작권 표시를 중복 없이 재사용합니다.
 */
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Navbar from '../Navbar/Navbar';

export default function PageLayout({ children }) {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Divider />
      <Box sx={{ py: 3, backgroundColor: '#fff', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2026 Ledgerly. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
