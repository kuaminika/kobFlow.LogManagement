import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LogDashBoard } from './pages/LogDashBoard'
import { CsvImport } from './pages/CsvImport'
import { kCourrier } from './utils/Kourrier'
import ManageList from './pages/ManageList'
import ManageExpenseList from './pages/ManageExpenseList'
import ManageMappings from './pages/ManageMappings'
import CacheManagerPage from './pages/CacheManagerPage'
import ListLoader from './utils/ListLoader'
import FakeListLoader from './utils/FakeListLoader'
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
  const merchantMappingEndpointSet = new EndpointSet({   list: configs["VITE_URL_MERCHANT_MAPPING"],  remove: configs["VITE_URL_FORDELETE"],  update: configs["VITE_URL_FORUPDATE"],  create: configs["VITE_URL_FORADD"]});



  const listLoader_expense = new ListLoader({context:"Expense",kCourrier, endpoints: expenseEndpointSet, cacher});
  const listLoader_kobHolder= new ListLoader({context:"KOBHOLDER",kCourrier, endpoints: kobHoldeEndpointSet, cacher});
  const listLoader_merchant= new ListLoader({context:"Merchant",kCourrier, endpoints:merchantEndpointSet , cacher});
  const listLoader_expenseCategory= new ListLoader({context:"ExpenseCategory",kCourrier, endpoints:expenseCategoryEndpointSet , cacher});
  //  const listLoader_merchantMapping = new ListLoader({ context: "MerchantMapping", kCourrier, endpoints: merchantMappingEndpointSet, cacher });
  // TODO: replace with a real ListLoader once the gateway has sourceContext=MerchantMapping

  const rawMerchantMappingSeed =  [{"_id":"6ad4d1c5d9af7517a06399d1","rawDescription":"best buy","ownerId":1,"merchantId":30,"name":"best buy","merchantName":"best buy","confidence":1,"confirmedByUser":false,"updatedAt":"2026-10-18T14:03:49.751Z","createdAt":"2026-10-18T14:03:49.757Z","__v":0},{"_id":"6ad4d1c5d9af7517a06399d3","rawDescription":"patreon","ownerId":1,"merchantId":139,"name":"Patreon - Dessalines ","merchantName":"Patreon - Dessalines ","confidence":1,"confirmedByUser":false,"updatedAt":"2026-10-18T14:03:49.751Z","createdAt":"2026-10-18T14:03:49.759Z","__v":0},{"_id":"6ad4d1c5d9af7517a06399d2","rawDescription":"walmart","ownerId":1,"merchantId":1,"name":"Dev- Walmart","merchantName":"Dev- Walmart","confidence":1,"confirmedByUser":false,"updatedAt":"2026-10-18T14:03:49.751Z","createdAt":"2026-10-18T14:03:49.758Z","__v":0}];
 
   rawMerchantMappingSeed.push({id: 4, rawDescription: "$SSESSO", merchantId: 4});
   rawMerchantMappingSeed.push({id: 10, rawDescription: "AMXN", merchantId: 10});
   rawMerchantMappingSeed.push({id: 12, rawDescription: "AMXN", merchantId: 10});
 
 
  const seed = rawMerchantMappingSeed.map(item => ({
    id: item._id,
    phrase: item.rawDescription,
    targetKey: item.merchantId,
    merchantId: item.merchantId
  })); 
  const listLoader_merchantMapping = new FakeListLoader({    seed});
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
        <Link to="/ManageMerchantMappings">Manage Merchant Mappings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LogDashBoard />} />
        <Route path="/import" element={<CsvImport kCourrier={kCourrier} configs= {configs} kobHolderLoader={listLoader_kobHolder} merchantLoader={listLoader_merchant} expenseCategoryLoader={listLoader_expenseCategory} />} />
        <Route path="/ManageMerchants" element={<ManageList context="Merchants" listLoader={listLoader_merchant} />} />
        <Route path="/KobHolders" element={<ManageList context="Kobholder" listLoader={listLoader_kobHolder} />} />
        <Route path="/ManageCategories" element={<ManageList context="Categories" listLoader={listLoader_expenseCategory} />} />
        <Route path="/ManageExpenses" element={<ManageExpenseList context="Expenses" listLoaders={allListHolders} />} />
        <Route path="/CacheManager" element={<CacheManagerPage cacher={cacher}/>} />
        <Route path="/ManageMerchantMappings" element={<ManageMappings targetLoader={ listLoader_merchant} listLoader={listLoader_merchantMapping}  targetKey="merchantId" context="MerchantMappings"/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App