/**
 * ProfilePage.jsx - 사용자 기본 정보 수정 및 비밀번호 변경 페이지
 *
 * 프로필(닉네임)과 비밀번호를 별도 섹션·별도 폼으로 분리합니다.
 *        각 폼은 독립적인 성공/오류 메시지 상태를 가져 서로 영향을 주지 않습니다.
 *
 * 이메일 필드는 disabled로 처리하여 변경 불가임을 UI로 명시합니다.
 *        비밀번호 변경 시 현재 비밀번호를 먼저 입력받아 서버에서 재검증합니다.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { useProfile } from './useProfile';

export default function ProfilePage() {
  const {
    profile, username, setUsername, profileMsg, profileError, handleProfileSubmit,
    pwForm, pwMsg, pwError, handlePwChange, handlePwSubmit,
  } = useProfile();

  return (
    <AppLayout>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>내 프로필</Typography>

      {/* 기본 정보: 이메일은 읽기 전용, 닉네임만 수정 가능합니다. */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>기본 정보</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          {profileMsg && <Alert severity="success" sx={{ mb: 2 }}>{profileMsg}</Alert>}
          {profileError && <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>}
          <Box component="form" onSubmit={handleProfileSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="이메일"
              value={profile.email}
              disabled
              fullWidth
              helperText="이메일은 변경할 수 없습니다."
            />
            <TextField
              label="이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start', px: 4 }}>
              저장
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 비밀번호 변경: 현재 비밀번호 검증 후 새 비밀번호로 교체합니다. */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>비밀번호 변경</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {pwMsg && <Alert severity="success" sx={{ mb: 2 }}>{pwMsg}</Alert>}
          {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
          <Box component="form" onSubmit={handlePwSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              name="currentPassword"
              label="현재 비밀번호"
              type="password"
              value={pwForm.currentPassword}
              onChange={handlePwChange}
              required
              fullWidth
            />
            <TextField
              name="newPassword"
              label="새 비밀번호"
              type="password"
              value={pwForm.newPassword}
              onChange={handlePwChange}
              required
              fullWidth
              helperText="8자 이상"
            />
            <TextField
              name="confirmPassword"
              label="새 비밀번호 확인"
              type="password"
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start', px: 4 }}>
              변경
            </Button>
          </Box>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
