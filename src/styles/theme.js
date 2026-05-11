/**
 * theme.js - MUI 전역 커스텀 테마 정의
 *
 * 색상·폰트·모서리 등 디자인 토큰을 한 곳에서 관리하여 일관된 UI를 유지합니다.
 *        컴포넌트별로 sx prop에 하드코딩된 색상을 반복하는 대신 테마 변수를 참조합니다.
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // 주 색상: 수입을 나타내는 녹색 계열. 재정 앱에서 긍정적 의미를 시각적으로 전달합니다.
    primary: {
      main: '#4CAF50',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    // 보조 색상: 링크·정보성 요소에 사용하는 파란색 계열
    secondary: {
      main: '#1976D2',
    },
    // 페이지 배경을 순수 흰색 대신 미세한 회색으로 설정하여 카드 컴포넌트가 부각되도록 합니다.
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    // Pretendard를 우선 적용하고, 미설치 환경에서는 Noto Sans KR로 폴백합니다.
    //        두 폰트 모두 한국어 가독성에 최적화되어 있습니다.
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: {
    // 전역 모서리 반경을 12px로 설정하여 부드러운 카드 스타일을 일관되게 유지합니다.
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // MUI 기본값인 대문자 변환(uppercase)을 비활성화하여 한국어 버튼 텍스트의 가독성 향상
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
