import React, { useState } from "react";
import "./Client.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Api from "../MainApi";
import Loader from "./Loader";
export default function RegisterOtp() {
  const [loader, setLoader] = useState(false);
  const mainOtp = window.sessionStorage.getItem("Gotp");

  const [formData, setFormData] = useState({
    fname: window.sessionStorage.getItem("fname"),
    lname: window.sessionStorage.getItem("lname"),
    email: window.sessionStorage.getItem("email"),
    password: window.sessionStorage.getItem("password"),
    date_time: "",
    otp: "",
  });

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (mainOtp === formData.otp) {
      await fetch(`${Api}/api/Register`, {
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
          window.sessionStorage.setItem("Gotp", "");
          NotificationManager.success(data.msg, "Done", 3000);
          setTimeout(() => {
            window.location.href = "/Home";
            setLoader(false);
          }, 2000);
        }
      });
    } else {
      NotificationManager.error("Enter Valid Otp", "Error", 3000);
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
          <div className="fs-2 text-center mt-2 fw-bold">OTP</div>
          <div>
            <div className="row mt-1"></div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="text"
                  value={formData.otp}
                  onChange={handleChang}
                  className="form-control"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
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
