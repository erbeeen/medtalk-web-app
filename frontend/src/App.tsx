import { useState, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AdminsRoute from './routes/Admins';
import HomeRoute from './routes/Home';
import MedicineRoute from './routes/Medicine';
import NotFoundRoute from './routes/NotFound';
// import ScheduleRoute from './routes/Schedules';
import UsersRoute from './routes/Users';
import LoginRoute from './routes/Login';
import Sidebar from './components/Sidebar';
import VerifyAccountRoute from './routes/VerifyAccount';
import AccountVerifiedRoute from './routes/AccountVerified';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import SystemLogsRoute from './routes/SystemLogs';
import AccountSettingsRoute from './routes/AccountSettings';
import ForgotPasswordRoute from './routes/ForgotPassword';
import ResetPasswordRoute from './routes/ResetPassword';

// TODO: 
// - Create switch for light and dark mode

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
    location.pathname === "/reset-password"
  ) {
    showSidebar = false;
  }

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }

  return (
    <>
      <UserProvider>
        {!isLoading && (
          <div
            id="main"
            className="h-screen flex bg-light dark:bg-dark
        text-light-text dark:text-dark-text">
            {showSidebar && <Sidebar />}
            <div
              ref={mainContentRef}
              id="content-area"
              className="w-full max-w-[1920px] p-4 flex flex-col flex-1 
          overflow-y-auto justify-start align-center gap-10 
          bg-light dark:bg-dark text-light-text dark:text-dark-text/95">
              <Routes>
                {/* NOTE: public routes */}
                <Route path="/verify-account" element={<VerifyAccountRoute />} />
                <Route path="/account-verified" element={<AccountVerifiedRoute />} />
                <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
                <Route path="/reset-password" element={<ResetPasswordRoute />} />
                <Route path="/not-found" element={<NotFoundRoute />} />
                <Route path="*" element={<Navigate to={"/not-found"} replace />} />

                {/* NOTE: protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<HomeRoute />} />
                  <Route path="/login" element={<LoginRoute />} />
                  <Route path="/logs" element={<SystemLogsRoute />} />
                  <Route path="/users" element={<UsersRoute scrollToTop={scrollToTop} />} />
                  <Route path="/admins" element={<AdminsRoute scrollToTop={scrollToTop} />} />
                  <Route path="/medicine" element={<MedicineRoute scrollToTop={scrollToTop} />} />
                  {/* <Route path="/schedules" element={<ScheduleRoute scrollToTop={scrollToTop} />} /> */}
                  <Route path="/account" element={<AccountSettingsRoute />} />
                </Route>
              </Routes>
            </div>
          </div>
        )}
      </UserProvider>
    </>
  )
}

export default App
