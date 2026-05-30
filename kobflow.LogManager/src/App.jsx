import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LogDashBoard } from './pages/LogDashBoard'
import { CsvImport } from './pages/CsvImport'
import { kCourrier } from './utils/Kourrier'
import ManageList from './pages/ManageList'
import ListLoader from './utils/ListLoader'
import './App.css'

function App() {
      
  const{VITE_URL_MERCHANT,VITE_URL_EXPENSE_CATEGORY,VITE_URL_FORADD} = import.meta.env;
  const configs =  {
VITE_URL_MERCHANT,VITE_URL_EXPENSE_CATEGORY,VITE_URL_FORADD
    , VITE_URL_IMPORTSERVICE_BASE:import.meta.env.VITE_URL_IMPORTSERVICE_BASE}

  const listLoader_merchant= new ListLoader({context:"Merchant",kCourrier, configs});
  const listLoader_expenseCategory= new ListLoader({context:"Expense_Category",kCourrier, configs});

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Logs</Link>|
        <Link to="/import">CSV Import</Link>|
        <Link to="/ManageMerchants">Manage Merchants</Link>| 
        <Link to="/ManageCategories">Manage Categories</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LogDashBoard />} />
        <Route path="/import" element={<CsvImport kCourrier={kCourrier} configs= {configs} />} />
        <Route path="/ManageMerchants" element={<ManageList context="Merchants" listLoader={listLoader_merchant} />} />
        <Route path="/ManageCategories" element={<ManageList context="Categories" listLoader={listLoader_expenseCategory} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App