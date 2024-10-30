import { HashRouter, Routes, Route } from 'react-router-dom';
// import './App.css'
import App from './pages/App';
import { Login } from './pages/Auth';
import Selling from './pages/Selling';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Dashboard/Home';
import Store from './pages/Dashboard/Store';
import NewItem from './pages/Dashboard/Store/NewItem';
import Stock from './pages/Dashboard/Store/Stock';
import InvoiceProvider from './contexts/InvoiceContext';
import UpdateStock from './pages/Dashboard/Store/UpdateStock';
import Setting from './pages/Dashboard/Setting';
import PaymentMethods from './pages/Dashboard/Setting/PaymentMethods';
// import Home from './pages/Home';

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/app" element={<App />}>
          <Route index element={
            <InvoiceProvider>
              <Selling />
            </InvoiceProvider>
          }>
          </Route>
          <Route path='dashboard' element={<Dashboard />}>
            <Route index element={<Home />}></Route>
            <Route path='store' element={<Store />}></Route>
            <Route path='store/newitem' element={<NewItem />}></Route>
            <Route path='store/stock' element={<Stock />}></Route>
            <Route path='store/updatestock' element={<UpdateStock />}></Route>
            <Route path='setting' element={<Setting />}></Route>
            <Route path='setting/paymentmethods' element={<PaymentMethods />}></Route>
          </Route>
          {/*<Route path='reports/borrowing' element={<BorrowingReport />}></Route>
          <Route path='reports/returning' element={<ReturningReport />}></Route>
          <Route path='warehouse/:warehouse_id' element={<Warehouse />}></Route>
          <Route path='warehouse/addamount' element={<AddAmount />}></Route>
          <Route path='borrow' element={<Borrow />}></Route>
          <Route path='returned' element={<Returned />}></Route>
          <Route path='damaged_goods_report' element={<DamagedGoodsReport />}></Route> */}
        </Route>
        <Route path='/' element={<Login />}></Route>
      </Routes>
    </HashRouter >
  )
}

export default Router