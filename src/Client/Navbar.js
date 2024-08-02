import React from "react";
import "./Client.css";
import moon from "../Image/Logo/moon.png";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import Logo from "../Image/documents-1677020_1280.png";
export default function Navbar() {
  const logemail = window.sessionStorage.getItem("email");

  return (
    <div className="nav-box">
      <nav className="">
        <div className="container nav-menu-box">
          <div style={{ float: "left", marginTop: "10px" }}>
            <Link to={"/Home"} className="nav-link nav-title nav-menu">
              <img src={Logo} alt="Logo" style={{ width: "40px" }} />
              InvoiceGenerater.In
            </Link>
          </div>
          <ul className="">
            <li className="nav-menu-item-box">
              <Link to={"/Help"} className="nav-link nav-menu">
                Help
              </Link>
            </li>
            {logemail ? <MyInvoice /> : <History />}
            <li className="nav-menu-item-box">
              <Link to={"/Guidance"} className="nav-link nav-menu">
                Guidance
              </Link>
            </li>
            <li className="nav-menu-item-box nav-btn-box">
              <img src={moon} alt="Moon" className="nav-img" />
            </li>
            {logemail ? <BtnOut email={logemail} /> : <BtuSign />}
          </ul>
        </div>
      </nav>
    </div>
  );
}

const BtuSign = () => {
  return (
    <>
      <li className="nav-menu-item-box ms-3 nav-btn-Sign w-100">
        <Link to={"/SignUp"} className="nav-menu btn btn-success ">
          <MdAppRegistration />
        </Link>
      </li>
      <li className="nav-menu-item-box nav-btn-Sign w-100">
        <Link to={"/SignIn"} className="nav-menu nav-btn-SignIn btn btn-dark ">
          <FaSignInAlt />
        </Link>
      </li>
    </>
  );
};

const BtnOut = () => {
  return (
    <>
      <li className="nav-menu-item-box nav-btn-profile ms-3">
        <Link to={"/Profile"} className="nav-menu btn btn-success w-100">
          Profile
        </Link>
      </li>
    </>
  );
};

const MyInvoice = () => {
  return (
    <>
      <li className="nav-menu-item-box ">
        <Link to={"/MyInvoice"} className="nav-link nav-menu nav-myInvo">
          My Invoice
        </Link>
      </li>
    </>
  );
};

const History = () => {
  return (
    <>
      <li className="nav-menu-item-box">
        <Link to={"/History"} className="nav-link nav-menu">
          History
        </Link>
      </li>
    </>
  );
};
