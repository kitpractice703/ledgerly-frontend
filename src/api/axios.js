/**
 * 전역 Axios 인스턴스 설정 파일입니다.
 *
 * 모든 API 요청에 JWT를 자동으로 주입하고, 토큰 만료(401) 시
 * 로그인 페이지로 이동시키는 인터셉터를 등록합니다.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

// 로그인 상태라면 모든 요청 헤더에 JWT를 자동으로 추가합니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 여러 요청이 동시에 401을 받으면 window.location이 중복 호출될 수 있어
// 플래그로 첫 번째 이후의 리다이렉트를 막습니다.
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그인·회원가입 요청의 401은 "잘못된 자격증명"이므로 리다이렉트 대상에서 제외합니다.
    // 여기서 제외하지 않으면 로그인 실패 시 오류 메시지가 표시되기 전에 페이지가 이동합니다.
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
    if (error.response?.status === 401 && !isRedirecting && !isAuthEndpoint) {
      isRedirecting = true;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
