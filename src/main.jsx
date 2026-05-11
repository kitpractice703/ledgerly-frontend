/**
 * main.jsx - 애플리케이션 진입점 (Entry Point)
 *
 * MUI 전역 설정을 최상위에서 한 번만 선언합니다.
 *  - ThemeProvider: 커스텀 테마(색상, 폰트, 컴포넌트 스타일)를 앱 전체에 적용
 *  - CssBaseline: 브라우저 간 기본 스타일 차이를 정규화하고 MUI 기본 스타일을 주입
 *
 * React.StrictMode로 개발 환경에서 잠재적인 문제(부작용 이중 호출 등)를
 *        조기에 감지합니다. 운영 빌드에서는 StrictMode가 추가 렌더링을 수행하지 않습니다.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
