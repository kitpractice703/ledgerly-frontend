import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const NAV_ITEMS = [
  { label: 'Ledgerly', path: '/' },
  { label: '사용방법', path: '/guide' },
  { label: '소식', path: '/news' },
  { label: '문의', path: '/contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}
      sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>

        <Typography variant="h6" fontWeight={700} color="primary"
          sx={{ cursor: 'pointer' }} onClick={() => handleNavClick('/')}>
          Ledgerly
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button key={item.label} color="inherit"
                onClick={() => handleNavClick(item.path)}
                sx={{ color: '#333', fontWeight: 500 }}>
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          {!isMobile && (
            <>
              <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => handleNavClick(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setDrawerOpen(false); navigate('/login'); }}>
                <ListItemText primary="로그인" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setDrawerOpen(false); navigate('/register'); }}>
                <ListItemText primary="회원가입" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
