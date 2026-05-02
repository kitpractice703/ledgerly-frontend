import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export function useRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data || '회원가입에 실패했습니다.');
    }
  };

  return { form, error, success, handleChange, handleSubmit };
}
