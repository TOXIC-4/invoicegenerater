import React, { useState } from "react";
import "./Client.css";
import { Link } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Api from "../MainApi";
import Loader from "./Loader";
export default function SignIn() {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (formData.password.length >= 6) {
      await fetch(`${Api}/api/Login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      }).then(async (res) => {
        const data = await res.json();
        if (data.status === "400") {
          NotificationManager.error(data.msg, "Error", 3000);
          setLoader(false);
        } else {
          window.sessionStorage.setItem("email", formData.email);
          NotificationManager.success(data.msg, "Done", 3000);
          setTimeout(() => {
            window.location.href = "/Home";
            setLoader(false);
          }, 2000);
        }
      });
    } else {
      NotificationManager.error(
        "Password must be 6 characters long",
        "Error",
        3000
      );
    }
  };

  const handleChang = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="main-box-back loader-Active">
      <NotificationContainer />
      <Loader loader={loader} />
      <div className="container main-box">
        <form onSubmit={handleSubmit}>
          <div className="fs-2 text-center mt-2 fw-bold">Sign In</div>
          <div>
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
                <label style={{ float: "right" }}>
                  <Link className="nav-link fs-6 forgot" to={"/ForgetPw"}>
                    <span style={{ fontSize: "13px" }}>Forgot password?</span>
                  </Link>
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
                <label htmlFor="password">Keep me logged in</label>
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
                    Don't have an account yet?
                  </p>
                  <Link className="nav-link text-success" to={"/SignUp"}>
                    Sign Up.
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
