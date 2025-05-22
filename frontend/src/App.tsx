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

function App() {
  return (
    <>
      <div id="main" className="flex min-h-screen bg-light dark:bg-dark text-light-text dark:text-dark-text">
        <Sidebar />
        <div id="content-area" className="min-h-full w-full p-4 flex flex-col justify-start align-center gap-10 bg-light dark:bg-[#181924] text-light-text dark:text-dark-text/95">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/users" element={<UsersRoute />} />
            <Route path="/admins" element={<AdminsRoute />} />
            <Route path="/medicine" element={<MedicineRoute />} />
            <Route path="/schedules" element={<ScheduleRoute />} />
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
