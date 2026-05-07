/**
 * axios.js - 전역 Axios 인스턴스 및 JWT 인터셉터 설정
 *
 * [설계] 모든 API 요청을 단일 인스턴스로 통합하여 baseURL 중복 작성을 제거하고,
 *        인터셉터로 인증 처리를 중앙화합니다. 개별 컴포넌트에서 토큰을 직접 주입할
 *        필요 없이 이 모듈이 자동으로 처리합니다.
 */
import axios from 'axios';

// [설계] VITE_API_URL 환경 변수로 개발(localhost)/운영(Oracle Cloud) 환경을 분리.
//        값이 없을 경우 빈 문자열로 폴백하여 상대 경로로 동작하도록 합니다.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

// [보안] 모든 요청에 JWT를 자동으로 주입하는 Request 인터셉터.
//        localStorage에서 토큰을 읽어 Authorization: Bearer 헤더를 설정합니다.
//        토큰이 없는 경우(비로그인 상태)에는 헤더를 추가하지 않아 공개 API는 정상 접근됩니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [보안] 여러 요청이 동시에 401을 받을 때 window.location.href가 중복 실행되는
//        Race Condition을 방지하기 위한 플래그. 첫 번째 리다이렉트 이후 추가 호출을 차단합니다.
let isRedirecting = false;

// [보안] 401 Unauthorized 응답을 전역으로 처리하는 Response 인터셉터.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // [보안] 로그인/회원가입 엔드포인트의 401은 "잘못된 자격증명"을 의미하므로
    //        리다이렉트 대상에서 제외합니다. 제외하지 않으면 로그인 실패 시에도
    //        /login 페이지로 리다이렉트되어 오류 메시지가 사라지는 UX 문제가 발생합니다.
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
    if (error.response?.status === 401 && !isRedirecting && !isAuthEndpoint) {
      isRedirecting = true;
      // 만료된 토큰 및 사용자 정보를 localStorage에서 일괄 제거
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
