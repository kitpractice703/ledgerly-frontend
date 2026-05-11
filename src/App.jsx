/**
 * App.jsx - 애플리케이션 최상위 라우팅 구성
 *
 * 라우트를 Public(비인증 접근 가능)과 Private(인증 필요) 두 그룹으로 분리합니다.
 *        Private 라우트는 PrivateRoute 컴포넌트로 감싸 인증 검사를 선언적으로 처리하며,
 *        개별 페이지 컴포넌트는 인증 로직을 알 필요가 없습니다.
 *
 * TransactionPage를 신규(/transactions/new)와 수정(/transactions/:id/edit) 두
 *        경로에서 재사용합니다. URL 파라미터 :id 존재 여부로 내부에서 모드를 구분합니다.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Public 페이지: 로그인 없이 접근 가능
import LandingPage from './pages/public/LandingPage/LandingPage';
import GuidePage from './pages/public/GuidePage/GuidePage';
import NewsPage from './pages/public/NewsPage/NewsPage';
import ContactPage from './pages/public/ContactPage/ContactPage';
import LoginPage from './pages/public/LoginPage/LoginPage';
import RegisterPage from './pages/public/RegisterPage/RegisterPage';

// Private 페이지: 로그인 후에만 접근 가능 (PrivateRoute로 보호)
import DashboardPage from './pages/private/DashboardPage/DashboardPage';
import TransactionPage from './pages/private/TransactionPage/TransactionPage';
import TransactionListPage from './pages/private/TransactionListPage/TransactionListPage';
import BudgetPage from './pages/private/BudgetPage/BudgetPage';
import CategoryPage from './pages/private/CategoryPage/CategoryPage';
import ReportPage from './pages/private/ReportPage/ReportPage';
import ProfilePage from './pages/private/ProfilePage/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public 라우트 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private 라우트: PrivateRoute가 토큰 유무를 검사하고 미인증 시 /login으로 리다이렉트 */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/transactions/new" element={<PrivateRoute><TransactionPage /></PrivateRoute>} />
        <Route path="/transactions/:id/edit" element={<PrivateRoute><TransactionPage /></PrivateRoute>} />
        <Route path="/transaction-list" element={<PrivateRoute><TransactionListPage /></PrivateRoute>} />
        <Route path="/budgets" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
