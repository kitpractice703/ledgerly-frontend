import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LandingPage from './pages/public/LandingPage/LandingPage';
import GuidePage from './pages/public/GuidePage/GuidePage';
import NewsPage from './pages/public/NewsPage/NewsPage';
import ContactPage from './pages/public/ContactPage/ContactPage';
import LoginPage from './pages/public/LoginPage/LoginPage';
import RegisterPage from './pages/public/RegisterPage/RegisterPage';
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
