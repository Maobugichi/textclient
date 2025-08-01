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
import 'react-loading-skeleton/dist/skeleton.css';
import Esim from "./route/esim";
import ScrollToTop from "./components/scrollToTheTop";
import PrivacyPage from "./ui/privacy";
import TermsPage from "./ui/tandc";
import EsimPlans from "./route/EsimPlans";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationsInitializer } from "./components/NotifInitializer";

function App() {
  
  return (
    <HashRouter>
      <ContextProvider>
        <ScrollToTop />
        <NotificationsInitializer />
        <ToastContainer position="top-right"  />
        <Routes>
         <Route path="signup/:1" element={<Signup />} />
         <Route path="login/:1" element={<Login />} />
          <Route path="homepage/:1" element={<LandingPage/>} />
          <Route path="privacy/:1" element={<PrivacyPage/>} />
          <Route path="terms/:1" element={<TermsPage/>} />
          <Route path="/" element={<Root />}>
          <Route index element={<Navigate to="homepage/:1" />} />
          <Route path="payment/:1" element={<Payment/>} />
          <Route path="dashboard/:id" element={<DashBoard/>}/>
          <Route path="sms/:id" element={<ReceiveSms/>}/>
          <Route path="number/:id" element={<RentNumber/>}/>
          <Route path="esim/:id" element={<Esim/>}/>
          <Route path="esimplan/:id" element={<EsimPlans/>}/>
          <Route path="settings/:1" element={<Settings/>}/>
        </Route>
        </Routes>
      </ContextProvider>
    </HashRouter>
  )
}

export default App