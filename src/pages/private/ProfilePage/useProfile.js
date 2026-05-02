import { useEffect, useState } from 'react';
import api from '../../../api/axios';

export function useProfile() {
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
