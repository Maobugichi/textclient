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


function App() {
  return (
    <HashRouter>
      <ContextProvider>
        <Routes>
        <Route path="signup/:1" element={<Signup />} />
          <Route path="/" element={<Root />}>
          <Route index element={<Navigate to="dashboard/:1" />} />
          <Route path="dashboard/:id" element={<DashBoard/>}/>
          <Route path="sms/:id" element={<ReceiveSms/>}/>
          <Route path="number/:id" element={<RentNumber/>}/>
          <Route path="settings/:1" element={<Settings/>}/>
        </Route>
        </Routes>
      </ContextProvider>
    </HashRouter>
  )
}

export default App