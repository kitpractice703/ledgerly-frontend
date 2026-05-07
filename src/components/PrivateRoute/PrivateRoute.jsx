/**
 * PrivateRoute.jsx - 인증된 사용자만 접근 가능한 라우트 가드 컴포넌트
 *
 * [설계] React Router의 레이아웃 라우트 패턴을 활용하여 인증 검사를 중앙화합니다.
 *        App.jsx에서 보호할 라우트를 이 컴포넌트로 감싸는 것만으로 인증 제어가 완성됩니다.
 *
 * [보안] localStorage의 토큰 존재 여부로 1차 접근 제어를 수행합니다.
 *        실제 토큰 유효성은 API 요청 시 서버에서 검증되며, 만료된 토큰은
 *        axios.js의 401 인터셉터가 자동으로 로그아웃 처리합니다.
 */
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  // 토큰이 없으면 로그인 페이지로 리다이렉트. replace 옵션으로 히스토리 스택에 남기지 않아
  // 로그인 후 뒤로가기 시 보호된 페이지로 돌아가는 것을 방지합니다.
  return token ? children : <Navigate to="/login" replace />;
}
