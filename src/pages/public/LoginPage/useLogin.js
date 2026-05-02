import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export function useLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || '로그인에 실패했습니다.');
    }
  };

  return { form, error, handleChange, handleSubmit };
}
