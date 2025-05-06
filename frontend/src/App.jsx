import MedicineRoute from './routes/Medicine';
import UsersRoute from './routes/Users';
import ScheduleRoute from './routes/Schedules';
import Home from './routes/Home';
import Login from './routes/Login';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <div id="main" className="flex flex-row">
        <Sidebar />
        <div className="h-screen w-full flex flex-col">
          <div id="content-area" className="h-11/12 p-4">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/users' element={<UsersRoute />} />
              <Route path='/medicine' element={<MedicineRoute />} />
              <Route path='/schedules' element={<ScheduleRoute />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
