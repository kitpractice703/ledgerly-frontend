/**
 * 로그인한 사용자만 접근할 수 있는 라우트 가드입니다.
 * 토큰 존재 여부로 1차 접근을 막고, 실제 유효성은 API 요청 시 서버가 검증합니다.
 * 만료된 토큰은 axios.js의 401 인터셉터가 자동으로 로그아웃 처리합니다.
 */
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  // replace를 쓰면 히스토리 스택에 남지 않아 로그인 후 뒤로가기로 보호 페이지에 진입하는 것을 막습니다.
  return token ? children : <Navigate to="/login" replace />;
}
