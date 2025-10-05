import { useState, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AdminsRoute from './routes/Admins';
import HomeRoute from './routes/Home';
import MedicineRoute from './routes/Medicine';
import NotFoundRoute from './routes/NotFound';
import ScheduleRoute from './routes/Schedules';
import UsersRoute from './routes/Users';
import LoginRoute from './routes/Login';
import Sidebar from './components/Sidebar';
import VerifyAccountRoute from './routes/VerifyAccount';
import AccountVerifiedRoute from './routes/AccountVerified';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import UnauthorizedRoute from './routes/Unauthorized';
import './App.css';
import SystemLogsRoute from './routes/SystemLogs';
import AccountSettingsRoute from './routes/AccountSettings';
import ForgotPasswordRoute from './routes/ForgotPassword';
import ResetPasswordRoute from './routes/ResetPassword';
import { ToastProvider } from './contexts/ToastProvider';

function App() {
  const [isLoading, _setIsLoading] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  let showSidebar = true;
  // Pages that should not show the sidebar
  if (
    location.pathname === "/login" ||
    location.pathname === "/verify-account" ||
    location.pathname === "/account-verified" ||
    location.pathname === "/not-found" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/unauthorized"
  ) {
    showSidebar = false;
  }

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <UserProvider>
        <ToastProvider>
          {!isLoading && (
            <div
              id="main"
              className="h-screen flex bg-light dark:bg-dark
        text-light-text dark:text-dark-text">
              {showSidebar && <Sidebar />}
              <div
                ref={mainContentRef}
                id="content-area"
                className="w-full max-w-[1920px] flex flex-col flex-1 
          overflow-y-auto justify-start align-center gap-10 
          bg-light dark:bg-dark text-light-text dark:text-dark-text/95">
                <Routes>
                  {/* NOTE: public routes */}
                  <Route path="/verify-account" element={<VerifyAccountRoute />} />
                  <Route path="/account-verified" element={<AccountVerifiedRoute />} />
                  <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
                  <Route path="/reset-password" element={<ResetPasswordRoute />} />
                  <Route path="/not-found" element={<NotFoundRoute />} />
                  <Route path="/unauthorized" element={<UnauthorizedRoute />} />
                  <Route path="*" element={<Navigate to={"/not-found"} replace />} />

                  {/* NOTE: protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/login" element={<LoginRoute />} />

                    {/* Role-based dashboard redirect */}
                    <Route path="/dashboard" element={<RoleBasedRedirect />} />

                    {/* Dashboard - only for super admin and doctor */}
                    <Route path="/" element={
                      <RoleGuard allowedRoles={["super admin", "doctor"]}>
                        <HomeRoute />
                      </RoleGuard>
                    } />

                    {/* System Logs - only for admin and super admin */}
                    <Route path="/logs" element={
                      <RoleGuard allowedRoles={["admin", "super admin"]}>
                        <SystemLogsRoute />
                      </RoleGuard>
                    } />

                    {/* Users - only for admin and super admin */}
                    <Route path="/users" element={
                      <RoleGuard allowedRoles={["admin", "super admin"]}>
                        <UsersRoute scrollToTop={scrollToTop} />
                      </RoleGuard>
                    } />

                    {/* Admins - only for super admin */}
                    <Route path="/admins" element={
                      <RoleGuard allowedRoles={["super admin"]}>
                        <AdminsRoute scrollToTop={scrollToTop} />
                      </RoleGuard>
                    } />

                    {/* Medicine - only for doctor and super admin */}
                    <Route path="/medicine" element={
                      <RoleGuard allowedRoles={["doctor", "super admin"]}>
                        <MedicineRoute scrollToTop={scrollToTop} />
                      </RoleGuard>
                    } />

                    {/* Schedules - only for doctor and super admin */}
                    <Route path="/schedules" element={
                      <RoleGuard allowedRoles={["doctor", "super admin"]}>
                        <ScheduleRoute scrollToTop={scrollToTop} />
                      </RoleGuard>
                    } />

                    {/* Account - accessible to all authenticated users */}
                    <Route path="/account" element={<AccountSettingsRoute />} />
                  </Route>
                </Routes>
              </div>
            </div>
          )}
        </ToastProvider>
      </UserProvider>
    </>
  )
}

export default App
