import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import Root from "./route/root";
import DashBoard from "./route/dashboard";
import { Navigate } from "react-router-dom";
import ReceiveSms from "./route/receivesms";
import RentNumber from "./route/rent-number";
import Signup from "./route/signup";
import Settings from "./route/settings";
import { ContextProvider } from "./components/context-provider";
import Login from "./route/login";
import LandingPage from "./route/landing-page";
import Payment from "./components/payment";
import AdminImg from "./route/adminn/adminImg";
import 'react-loading-skeleton/dist/skeleton.css';
import Esim from "./route/esim";


function App() {
  
  return (
    <HashRouter>
      <ContextProvider>
        <Routes>
         <Route path="signup/:1" element={<Signup />} />
         <Route path="login/:1" element={<Login />} />
          <Route path="homepage/:1" element={<LandingPage/>} />
          <Route path="admin/:1" element={<AdminImg/>} />
          <Route path="/" element={<Root />}>
          <Route index element={<Navigate to="homepage/:1" />} />
          <Route path="payment/:1" element={<Payment/>} />
          <Route path="dashboard/:id" element={<DashBoard/>}/>
          <Route path="sms/:id" element={<ReceiveSms/>}/>
          <Route path="number/:id" element={<RentNumber/>}/>
          <Route path="esim/:id" element={<Esim/>}/>
          <Route path="settings/:1" element={<Settings/>}/>
        </Route>
        </Routes>
      </ContextProvider>
    </HashRouter>
  )
}

export default App