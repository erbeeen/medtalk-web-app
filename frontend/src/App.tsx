import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminsRoute from './routes/Admins';
import HomeRoute from './routes/Home';
import MedicineRoute from './routes/Medicine';
import NotFoundRoute from './routes/NotFound';
import ScheduleRoute from './routes/Schedules';
import UsersRoute from './routes/Users';
import LoginRoute from './routes/Login';
import Sidebar from './components/Sidebar';
import './App.css';
import automaticLogin from './auth/auth';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const showSidebar = location.pathname !== "/login";

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    setIsLoading(true);

    const login = async () => {
      try {
        await automaticLogin(navigate, `${location.pathname}`);
      } catch (err) {
        console.error("login failed: ", err);
      } finally {
        setIsLoading(false);
      }
    }


    login();
  }, [location.pathname, navigate]);

  return (
    <>
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
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/users" element={<UsersRoute scrollToTop={scrollToTop} />} />
              <Route path="/admins" element={<AdminsRoute scrollToTop={scrollToTop} />} />
              <Route path="/medicine" element={<MedicineRoute scrollToTop={scrollToTop} />} />
              <Route path="/schedules" element={<ScheduleRoute scrollToTop={scrollToTop} />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  )
}

export default App
