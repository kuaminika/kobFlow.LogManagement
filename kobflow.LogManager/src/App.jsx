import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LogDashBoard } from './pages/LogDashBoard'
import { CsvImport } from './pages/CsvImport'
import { kCourrier } from './utils/Kourrier'
import ManageList from './pages/ManageList'
import ManageExpenseList from './pages/ManageExpenseList'
import CacheManagerPage from './pages/CacheManagerPage'
import ListLoader from './utils/ListLoader'
import KCaher from './utils/KCacher'
import './App.css'


function EndpointSet({ remove, create, update, list, genericEndpoint }) {
    const self = this;

    self.setGenericEndPoint = function(url) {
        self.delete = url;
        self.create = url;
        self.update = url;
        self.list = url;
    };

    if (genericEndpoint) self.setGenericEndPoint(genericEndpoint);

    // specific values override the generic default, not the other way around
    if (remove)  self.delete = remove;
    if (create)  self.create = create;
    if (update)  self.update = update;
    if (list)    self.list   = list;
}





function App() {
      

  const configs ={...import.meta.env}



  const cacher = new KCaher();



  const expenseEndpointSet = new EndpointSet({list:configs["VITE_URL_EXPENSE"],remove: configs["VITE_URL_FORDELETE"],update:configs["VITE_URL_FORUPDATE"],create:configs["VITE_URL_FORADD"]})
  const merchantEndpointSet = new EndpointSet({list:configs["VITE_URL_MERCHANT"],remove: configs["VITE_URL_FORDELETE"],update:configs["VITE_URL_FORUPDATE"],create:configs["VITE_URL_FORADD"]});
  const kobHoldeEndpointSet = new EndpointSet({list:configs["VITE_URL_KOBHOLDER"],remove: configs["VITE_URL_FORDELETE"],update:configs["VITE_URL_FORUPDATE"],create:configs["VITE_URL_FORADD"]});
  const expenseCategoryEndpointSet = new EndpointSet({list:configs["VITE_URL_EXPENSE_CATEGORY"],remove: configs["VITE_URL_FORDELETE"],update:configs["VITE_URL_FORUPDATE"],create:configs["VITE_URL_FORADD"]});

  const listLoader_expense = new ListLoader({context:"Expense",kCourrier, endpoints: expenseEndpointSet, cacher});
  const listLoader_kobHolder= new ListLoader({context:"KOBHOLDER",kCourrier, endpoints: kobHoldeEndpointSet, cacher});
  const listLoader_merchant= new ListLoader({context:"Merchant",kCourrier, endpoints:merchantEndpointSet , cacher});
  const listLoader_expenseCategory= new ListLoader({context:"ExpenseCategory",kCourrier, endpoints:expenseCategoryEndpointSet , cacher});

  
//TODO: need to make sure that there is a page to manage expenses
//TODO: need to make sure that there is a page to manage mappings. 
  const allListHolders = {listLoader_expenseCategory,listLoader_expense,listLoader_kobHolder,listLoader_merchant};
 
 console.log()
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Logs</Link>|
        <Link to="/import">CSV Import</Link>|
        <Link to="/ManageCategories">Manage Categories</Link>|
        <Link to="/ManageMerchants">Manage Merchants</Link>|  
        <Link to="/KobHolders">Kob holders</Link>|
        <Link to="/ManageExpenses">Manage Expenses</Link>|  
      </nav>
      <Routes>
        <Route path="/" element={<LogDashBoard />} />
        <Route path="/import" element={<CsvImport kCourrier={kCourrier} configs= {configs} kobHolderLoader={listLoader_kobHolder} merchantLoader={listLoader_merchant} expenseCategoryLoader={listLoader_expenseCategory} />} />
        <Route path="/ManageMerchants" element={<ManageList context="Merchants" listLoader={listLoader_merchant} />} />
        <Route path="/KobHolders" element={<ManageList context="Kobholder" listLoader={listLoader_kobHolder} />} />
        <Route path="/ManageCategories" element={<ManageList context="Categories" listLoader={listLoader_expenseCategory} />} />
        <Route path="/ManageExpenses" element={<ManageExpenseList context="Expenses" listLoaders={allListHolders} />} />
        <Route path="/CacheManager" element={<CacheManagerPage cacher={cacher}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App