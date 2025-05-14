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
      <div id="main" className="flex flex-row h-screen bg-light dark:bg-dark text-light-text dark:text-dark-text">
        <Sidebar />
        <div className="h-screen w-full flex flex-col gap-0 bg-gray-700/40">
          <div className="h-5 w-full bg-light-800/5"></div>
            <div id="content-area" className="h-full w-[99%] p-4 flex flex-col justify-start align-center gap-10 border-2 border-white/8 rounded-2xl bg-dark text-dark-text/95">
              <Routes>
                <Route path="/" element={<HomeRoute />} />
                <Route path="/users" element={<UsersRoute />} />
                <Route path="/admins" element={<AdminsRoute />} />
                <Route path="/medicine" element={<MedicineRoute />} />
                <Route path="/schedules" element={<ScheduleRoute />} />
                <Route path="*" element={<NotFoundRoute />} />
              </Routes>
            </div>
          <div className="self-end h-5 w-full"></div>
        </div>
      </div>
    </>
  )
}

export default App
