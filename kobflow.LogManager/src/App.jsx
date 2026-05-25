import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LogDashBoard } from './pages/LogDashBoard'
import { CsvImport } from './pages/CsvImport'
import { kCourrier } from './utils/Kourrier'
import './App.css'

function App() {
 
  const configs =  {VITE_URL_IMPORTSERVICE_BASE:import.meta.env.VITE_URL_IMPORTSERVICE_BASE}



  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Logs</Link>
        <Link to="/import">CSV Import</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LogDashBoard />} />
        <Route path="/import" element={<CsvImport kCourrier={kCourrier} configs= {configs} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App