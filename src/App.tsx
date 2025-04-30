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


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Root />}>
        <Route index element={<Navigate to="signup/:1" />} />
        <Route path="dashboard/:id" element={<DashBoard/>}/>
        <Route path="sms/:id" element={<ReceiveSms/>}/>
        <Route path="number/:id" element={<RentNumber/>}/>
        <Route path="signup/:1" element={<Signup/>}/>
        <Route path="settings/:1" element={<Settings/>}/>
      </Route>
      </Routes>
    </HashRouter>
  )
}

export default App