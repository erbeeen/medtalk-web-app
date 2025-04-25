import MedicineRoute from './routes/Medicine';
import UsersRoute from './routes/Users';
import Footer from './components/Footer';
import ScheduleRoute from './routes/Schedules';
import Home from './routes/Home';
import Login from './routes/Login';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './layouts.css';

function App() {
  return (
    <>
      <div id="main" className="flex-row minh-100">
        <Navbar />
        <div id="content-area" className='p-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<UsersRoute />} />
            <Route path='/medicine' element={<MedicineRoute />} />
            <Route path='/schedules' element={<ScheduleRoute />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
