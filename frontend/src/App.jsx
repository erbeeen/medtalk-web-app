import MedicineRoute from './routes/Medicine';
import UsersRoute from './routes/Users';
import Footer from './components/Footer';
import ScheduleRoute from './routes/Schedules';
import Home from './routes/Home';
import Login from './routes/Login';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// TODO: Apply Tailwind css, deprecate layouts.css

function App() {
  return (
    <>
      <div id="main">
        <Sidebar />
        <div id="content-area" className="">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<UsersRoute />} />
            <Route path='/medicine' element={<MedicineRoute />} />
            <Route path='/schedules' element={<ScheduleRoute />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
