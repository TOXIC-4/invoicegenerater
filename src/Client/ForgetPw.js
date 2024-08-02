import React, { useState } from "react";
import "./Client.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Api from "../MainApi";
import Loader from "./Loader";
export default function ForgetPw() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    const Gotp = Math.floor(Math.random() * 899999 + 100000);
    window.sessionStorage.setItem("Fotp", Gotp);
    await fetch(`${Api}/api/ForgetPw`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp: Gotp }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.status === "400") {
        NotificationManager.error(data.msg, "Error", 3000);
        setLoader(false);
      } else {
        window.sessionStorage.setItem("Femail", formData.email);
        NotificationManager.success(data.msg, "Done", 3000);
        setTimeout(() => {
          window.location.href = "/ForgetOtp";
          setLoader(false);
        }, 2000);
      }
    });
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
          <div className="fs-2 text-center mt-2 fw-bold">Email</div>
          <div>
            <div className="row mt-1"></div>
            <div className="row mt-4">
              <div className="col-12">
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChang}
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
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
