import './App.css';
import { Routes, Route } from 'react-router-dom';
import About from './routes/About';
import Contact from './routes/Contact';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Contact />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </>
  )
}

export default App
