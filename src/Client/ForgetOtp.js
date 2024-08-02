import React, { useState } from "react";
import "./Client.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Loader from "./Loader";
export default function ForgetOtp() {
  const mainOtp = window.sessionStorage.getItem("Fotp");
  const [formData, setFormData] = useState({
    email: window.sessionStorage.getItem("Femail"),
    otp: "",
  });
  const [loader, setLoader] = useState(false);
  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (mainOtp === formData.otp) {
      NotificationManager.success("Otp Match Successfully", "Done", 3000);
      setTimeout(() => {
        window.location.href = "/NewPw";
        setLoader(false);
      }, 2000);
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
