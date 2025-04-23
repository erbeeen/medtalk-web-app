import About from './routes/About';
import Contact from './routes/Contact';
import Footer from './components/Footer';
import Home from './routes/Home';
import Login from './routes/Login';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />}/>
        {/* <Route path='/login' element={<Login />}/> */}
      </Routes>
      <Footer />
    </>
  )
}

export default App
