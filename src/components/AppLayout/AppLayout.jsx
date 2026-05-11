/**
 * AppLayout.jsx - 인증된 사용자 전용 앱 레이아웃 컴포넌트
 *
 * 데스크톱(md 이상)에서는 permanent Drawer(고정 사이드바)를,
 *        모바일(md 미만)에서는 temporary Drawer(햄버거 메뉴)를 사용합니다.
 *        MUI의 useMediaQuery 훅으로 반응형 분기를 처리합니다.
 *
 * SidebarContent를 별도 컴포넌트로 분리하여 permanent/temporary 두 Drawer에서
 *        동일한 콘텐츠를 재사용합니다. 코드 중복 없이 반응형 레이아웃을 구현합니다.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const DRAWER_WIDTH = 240;

// 사이드바 네비게이션 항목을 배열로 선언하여 순서·항목 변경이 이 배열만 수정하면 됩니다.
const NAV_ITEMS = [
  { label: '대시보드', path: '/dashboard', Icon: DashboardIcon },
  { label: '거래내역', path: '/transaction-list', Icon: ReceiptLongIcon },
  { label: '예산관리', path: '/budgets', Icon: AccountBalanceWalletIcon },
  { label: '리포트', path: '/reports', Icon: BarChartIcon },
  { label: '카테고리', path: '/categories', Icon: CategoryIcon },
  { label: '내 프로필', path: '/profile', Icon: PersonIcon },
];

/**
 * SidebarContent - 사이드바 내부 콘텐츠 컴포넌트
 * permanent/temporary 두 Drawer에서 재사용됩니다.
 */
function SidebarContent({ currentPath, onNavClick, onLogout }) {
  // localStorage에서 닉네임을 읽어 사이드바 하단 프로필 영역에 표시합니다.
  const username = localStorage.getItem('username') || '사용자';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          color="primary"
          onClick={() => onNavClick('/dashboard')}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          Ledgerly
        </Typography>
      </Box>
      <Divider />

      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          const active = currentPath === path;
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavClick(path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  color: active ? '#fff' : 'text.primary',
                  '& .MuiListItemIcon-root': { color: active ? '#fff' : 'text.secondary' },
                  '&:hover': {
                    backgroundColor: active ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}><Icon /></ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 400, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
            {username[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>{username}</Typography>
        </Box>
        <ListItemButton onClick={onLogout} sx={{ borderRadius: 2, color: 'text.secondary', py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="로그아웃" primaryTypographyProps={{ fontSize: '0.875rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    // 로그아웃 시 localStorage에 저장된 인증 관련 데이터를 모두 제거합니다.
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/');
  };

  const handleNavClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const sidebarContent = (
    <SidebarContent
      currentPath={location.pathname}
      onNavClick={handleNavClick}
      onLogout={handleLogout}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {!isMobile ? (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#fff',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile && (
          <AppBar position="sticky" color="inherit" elevation={1} sx={{ backgroundColor: '#fff' }}>
            <Toolbar>
              <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={800} color="primary">Ledgerly</Typography>
            </Toolbar>
          </AppBar>
        )}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
