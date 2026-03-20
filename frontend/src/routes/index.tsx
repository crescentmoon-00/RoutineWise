import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ParentLayout } from '@/layouts/ParentLayout';
import { DashboardPage } from '@/pages/parent/DashboardPage';
import { ProfilesPage } from '@/pages/parent/ProfilesPage';
import { ChildFormPage } from '@/pages/parent/ChildFormPage';
import { SettingsPage } from '@/pages/parent/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes - Parent Portal */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ParentLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/profiles/new" element={<ChildFormPage />} />
          <Route path="/profiles/:childId/edit" element={<ChildFormPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* More routes will be added in future phases */}
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};
