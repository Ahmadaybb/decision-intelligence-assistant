import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assistant from './pages/Assistant'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App