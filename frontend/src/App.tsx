import AdminsRoute from './routes/Admins';
import HomeRoute from './routes/Home';
import MedicineRoute from './routes/Medicine';
import NotFoundRoute from './routes/NotFound';
import { Routes, Route } from 'react-router-dom';
import ScheduleRoute from './routes/Schedules';
import Sidebar from './components/Sidebar';
import UsersRoute from './routes/Users';
// import Login from './routes/Login';
import './App.css';
import { useRef } from 'react';

function App() {
  const mainContentRef = useRef<HTMLDivElement>(null);

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
      <div id="main"
        className="h-screen flex bg-light dark:bg-dark
        text-light-text dark:text-dark-text">
        <Sidebar />
        <div
          ref={mainContentRef}
          id="content-area"
          className="w-full p-4 flex flex-col flex-1 
          overflow-y-auto justify-start align-center gap-10 
          bg-light dark:bg-dark text-light-text dark:text-dark-text/95">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/users" element={<UsersRoute scrollToTop={scrollToTop} />} />
            <Route path="/admins" element={<AdminsRoute scrollToTop={scrollToTop} />} />
            <Route path="/medicine" element={<MedicineRoute scrollToTop={scrollToTop} />} />
            <Route path="/schedules" element={<ScheduleRoute scrollToTop={scrollToTop} />} />
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
