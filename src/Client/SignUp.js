import React, { useState } from "react";
import "./Client.css";
import { Link } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Api from "../MainApi";
import Loader from "./Loader";
export default function SignUp() {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleSubmit = async (e) => {
    setLoader(false);
    e.preventDefault();

    if (formData.password.length >= 6) {
      const Gotp = Math.floor(Math.random() * 899999 + 100000);
      window.sessionStorage.setItem("fname", formData.fname);
      window.sessionStorage.setItem("lname", formData.lname);
      window.sessionStorage.setItem("email", formData.email);
      window.sessionStorage.setItem("password", formData.password);
      window.sessionStorage.setItem("Gotp", Gotp);
      setFormData({ ...formData, otp: Gotp });
      await fetch(`${Api}/api/RegisterOtp`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          otp: Gotp,
          email: formData.email,
          user: formData.fname,
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (data.status === "400") {
          NotificationManager.error(data.msg, "Error", 3000);
          setLoader(false);
        } else {
          NotificationManager.success(data.msg, "Done", 3000);
          setTimeout(() => {
            window.location.href = "./RegisterOtp";
            setLoader(false);
          }, 1000);
        }
      });
    } else {
      NotificationManager.error(
        "Password must be 6 characters long",
        "Error",
        3000
      );
      setLoader(false);
    }
  };

  const handleChang = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="main-box-back">
      <NotificationContainer />
      <Loader loader={loader} />
      <div className="container main-box">
        <form onSubmit={handleSubmit}>
          <div className="fs-2 fw-bold text-center mt-2">Create Account</div>
          <div>
            <div className="row mt-4">
              <div className="col-6">
                <label htmlFor="fname" className="mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fname"
                  name="fname"
                  placeholder="Enter First Name"
                  value={formData.fname}
                  onChange={handleChang}
                  required
                />
              </div>
              <div className="col-6">
                <label htmlFor="lname" className="mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChang}
                  placeholder="Enter First Name"
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <label htmlFor="email" className="mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChang}
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <label htmlFor="password" className="mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChang}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="checkbox"
                  className="me-2"
                  name="checkbox"
                  required
                />
                <label htmlFor="password">
                  I agree to the Terms of Service
                </label>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="submit"
                  className="btn btn-success w-100"
                  id="submit"
                  name="submit"
                  value="Sign Up"
                />
              </div>
            </div>
            <div className="row mt-4 ">
              <div className="col-12 w-100">
                <div className="">
                  <p className="me-2" style={{ float: "left", color: "gray" }}>
                    Already have an account?
                  </p>
                  <Link className="nav-link text-success" to={"/SignIn"}>
                    Sign In.
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
