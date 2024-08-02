import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Client/Home";
import SignIn from "./Client/SignIn";
import SignUp from "./Client/SignUp";
import SignOut from "./Client/SignOut";
import RegisterOtp from "./Client/RegisterOtp";
import ForgetPw from "./Client/ForgetPw";
import NewPw from "./Client/NewPw";
import ForgetOtp from "./Client/ForgetOtp";
import Profile from "./Client/Profile";
import MyInvoice from "./Client/MyInvoice";
import Invoice from "./Client/Invoice";
import UpdateInvoice from "./Client/UpdateInvoice";
import Error404 from "./Error404";
import ViewInvoice from "./Client/ViewInvoice";
import TestUp from "./Client/TestUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignOut" element={<SignOut />} />
      <Route path="/RegisterOtp" element={<RegisterOtp />} />
      <Route path="/ForgetPw" element={<ForgetPw />} />
      <Route path="/ForgetOtp" element={<ForgetOtp />} />
      <Route path="/NewPw" element={<NewPw />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MyInvoice" element={<MyInvoice />} />
      <Route path="/CreateInvoice" element={<Invoice />} />
      <Route path="/UpdateInvoice/:id" element={<UpdateInvoice />} />
      <Route path="/ViewInvoice/:id" element={<ViewInvoice />} />
      <Route path="/Up" element={<TestUp />} />
      <Route path="*" element={<Error404 />} />
      <Route path="/Error" element={<Error404 />} />
    </Routes>
  );
}

export default App;
