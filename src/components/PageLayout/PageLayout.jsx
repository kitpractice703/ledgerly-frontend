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
