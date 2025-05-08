import MedicineRoute from './routes/Medicine';
import UsersRoute from './routes/Users';
import ScheduleRoute from './routes/Schedules';
import HomeRoute from './routes/Home';
import Login from './routes/Login';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NotFoundRoute from './routes/NotFound';

function App() {
  return (
    <>
      <div id="main" className="flex flex-row h-screen bg-light dark:bg-dark text-light-text dark:text-dark-text">
        <Sidebar />
        <div className="h-screen w-full flex flex-col">
          <div id="content-area" className="h-full w-full p-4 flex flex-col justify-start align-center gap-10">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/users" element={<UsersRoute />} />
              <Route path="/medicine" element={<MedicineRoute />} />
              <Route path="/schedules" element={<ScheduleRoute />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
