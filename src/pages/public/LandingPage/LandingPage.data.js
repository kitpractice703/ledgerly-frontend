import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export const FEATURES = [
  {
    Icon: AccountBalanceWalletIcon,
    title: '수입 · 지출 관리',
    desc: '날짜별, 카테고리별로 수입과 지출을 손쉽게 기록하고 한눈에 파악하세요.',
  },
  {
    Icon: BarChartIcon,
    title: '예산 설정 & 분석',
    desc: '월별 예산을 설정하고, 지출 현황을 차트로 시각화해 소비 패턴을 파악하세요.',
  },
  {
    Icon: CategoryIcon,
    title: '카테고리 분류',
    desc: '나만의 카테고리를 만들어 지출을 세분화하고 불필요한 소비를 줄이세요.',
  },
  {
    Icon: NotificationsActiveIcon,
    title: '예산 초과 알림',
    desc: '설정한 예산을 초과하면 즉시 알려드려 올바른 소비 습관을 만들어드립니다.',
  },
];
