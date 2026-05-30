import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LogDashBoard } from './pages/LogDashBoard'
import { CsvImport } from './pages/CsvImport'
import { kCourrier } from './utils/Kourrier'
import ManageList from './pages/ManageList'
import ListLoader from './utils/ListLoader'
import KCaher from './utils/KCacher'
import './App.css'

function App() {
      

  const configs ={...import.meta.env}

  const cacher = new KCaher();
  const listLoader_kobHolder= new ListLoader({context:"KOBHOLDER",kCourrier, configs, cacher});
  const listLoader_merchant= new ListLoader({context:"Merchant",kCourrier, configs, cacher});
  const listLoader_expenseCategory= new ListLoader({context:"Expense_Category",kCourrier, configs, cacher});

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
        <Route path="/import" element={<CsvImport kCourrier={kCourrier} configs= {configs} kobHolderLoader={listLoader_kobHolder} merchantLoader={listLoader_merchant} expenseCategoryLoader={listLoader_expenseCategory} />} />
        <Route path="/ManageMerchants" element={<ManageList context="Merchants" listLoader={listLoader_merchant} />} />
        <Route path="/ManageCategories" element={<ManageList context="Categories" listLoader={listLoader_expenseCategory} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App