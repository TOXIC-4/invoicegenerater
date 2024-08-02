import React, { useState } from "react";
import "./Client.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Api from "../MainApi";
import Loader from "./Loader";
export default function NewPw() {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    email: window.sessionStorage.getItem("Femail"),
    password1: "",
    password2: "",
    otp: "",
  });

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (formData.password1.length >= 6) {
      if (formData.password1 === formData.password2) {
        await fetch(`${Api}/api/NewPw`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password1,
          }),
        }).then(async (res) => {
          const data = await res;
          if (data.status === "400") {
            NotificationManager.error(data.msg, "Error", 3000);
            setLoader(false);
          } else {
            window.sessionStorage.setItem("Fotp", "");
            NotificationManager.success(data.msg, "Done", 3000);
            setTimeout(() => {
              window.location.href = "/SignIn";
              setLoader(false);
            }, 2000);
          }
        });
      } else {
        NotificationManager.error("Not Match Re-Enter Password", "Error", 3000);
        setLoader(false);
      }
    } else {
      NotificationManager.error("Password must be at least 6 characters long");
      setLoader(false);
    }
  };

  const handleChang = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="main-box-back">
      <Loader loader={loader} />
      <NotificationContainer />
      <div className="container main-box">
        <form onSubmit={handleSubmit}>
          <div className="fs-2 text-center mt-2 fw-bold">New Password</div>
          <div>
            <div className="row mt-1"></div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="password"
                  value={formData.password1}
                  onChange={handleChang}
                  className="form-control"
                  id="password1"
                  name="password1"
                  placeholder="Enter New Password"
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="password"
                  value={formData.password2}
                  onChange={handleChang}
                  className="form-control"
                  id="password2"
                  name="password2"
                  placeholder="Re-Enter New Password"
                  required
                />
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col-12">
                <input
                  type="submit"
                  className="btn btn-success w-100"
                  id="submit"
                  name="submit"
                  value="Submit"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
