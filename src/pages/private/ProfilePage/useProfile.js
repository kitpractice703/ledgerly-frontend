/**
 * useProfile.js - 프로필 정보 조회·수정 및 비밀번호 변경 로직을 관리하는 Custom Hook
 *
 * [설계] 프로필 수정과 비밀번호 변경은 독립적인 폼과 메시지 상태를 가집니다.
 *        두 기능의 성공/오류 메시지가 서로 간섭하지 않도록 상태를 분리합니다.
 *
 * [설계] 초기 profile 값을 localStorage에서 가져오는 이유: API 응답 전 빈 화면 노출을 방지합니다.
 *        마운트 후 API 결과로 덮어씌워 최신 서버 데이터와 동기화합니다.
 */
import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useProfile() {
  // localStorage 캐시 값으로 초기화하여 API 로딩 전 빈 화면을 방지합니다.
  const [profile, setProfile] = useState({
    email: localStorage.getItem('email') || '',
    username: localStorage.getItem('username') || '',
  });
  const [username, setUsername] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  // 마운트 시 최신 프로필을 서버에서 불러와 localStorage 캐시를 최신 상태로 갱신합니다.
  useEffect(() => {
    api.get('/api/users/me')
      .then((res) => {
        setProfile(res.data);
        setUsername(res.data.username);
      })
      .catch(() => {});
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    try {
      await api.put('/api/users/me', { username });
      // 사이드바의 닉네임 표시도 즉시 갱신되도록 localStorage를 동기적으로 업데이트합니다.
      localStorage.setItem('username', username);
      setProfile((prev) => ({ ...prev, username }));
      setProfileMsg('이름이 변경되었습니다.');
    } catch {
      setProfileError('변경에 실패했습니다.');
    }
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwError('');
    // [보안] 새 비밀번호 확인은 클라이언트에서 1차 검증합니다.
    //        서버 왕복 없이 즉시 피드백을 제공하여 UX를 개선합니다.
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await api.put('/api/users/me/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('비밀번호가 변경되었습니다.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data || '비밀번호 변경에 실패했습니다.');
    }
  };

  return {
    profile, username, setUsername, profileMsg, profileError, handleProfileSubmit,
    pwForm, pwMsg, pwError, handlePwChange, handlePwSubmit,
  };
}
