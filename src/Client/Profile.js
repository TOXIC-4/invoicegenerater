import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Api from "../MainApi";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link } from "react-router-dom";
import Loader from "./Loader";
export default function Profile() {
  const [loader, setLoader] = useState(false);
  const email = window.sessionStorage.getItem("email");
  const [formData, setformData] = useState({
    email: "",
    date_time: "",
    fname: "",
    lname: "",
  });

  const [pw, setPw] = useState({
    password: "",
    password1: "",
  });

  const getformData = async (email) => {
    setLoader(true);
    await fetch(`${Api}/api/FindUser`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: email }),
    }).then(async (res) => {
      const data = await res.json();
      setformData({
        email: data.msg.email,
        date_time: data.msg.date_time,
        fname: data.msg.fname,
        lname: data.msg.lname,
      });
      setLoader(false);
    });
  };
  const handleSubmit = async (e) => {
    setLoader(true);

    e.preventDefault();
    await fetch(`${Api}/api/EditProfile`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        fname: formData.fname,
        lname: formData.lname,
      }),
    }).then(async (res) => {
      const data = await res;
      if (data.status === "400") {
        NotificationManager.error(data.msg, "Error", 3000);
        setLoader(false);
      } else {
        NotificationManager.success(data.msg, "Done", 3000);
        setTimeout(() => {
          window.location.href = "/Profile";
          setLoader(false);
        }, 2000);
      }
    });
  };
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangePw = (e) => {
    setPw({ ...pw, [e.target.name]: e.target.value });
  };
  const handleSubmitPassword = async (e) => {
    setLoader(true);

    e.preventDefault();
    if (pw.password.length >= 6) {
      if (pw.password === pw.password1) {
        await fetch(`${Api}/api/NewPw`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: pw.password,
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
              window.location.href = "/Profile";
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
  useEffect(() => {
    getformData(email);
    // eslint-disable-next-line
  }, [email]);
  return (
    <div>
      <Loader loader={loader} />
      <Navbar />
      <NotificationContainer />
      <div className="container container-home ">
        <div className="profile-box px-5">
          <div className="mb-5">
            <h3 className="text-center pt-4">My Account</h3>
            <label className="w-100 text-center">
              Manage your user account, including your contact and sign in
              information.
            </label>
          </div>

          <div className="">
            <div className="text-right">
              <h6>Email</h6>
              <lable className="fw-bold color-gray">{formData.email}</lable>
              <div className="mt-4">
                <Link className="btn btn-danger" to={"/SignOut"}>
                  Log Out
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="fw-bold">Change Profile</h4>
            <hr />
            <form>
              <div className="row mt-4">
                <div className="col-6">
                  <label htmlFor="fname">First Name</label>
                  <input
                    type="text"
                    id="fname"
                    className="form-control mt-2"
                    value={formData.fname}
                    name="fname"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    className="form-control mt-2"
                    value={formData.lname}
                    id="lname"
                    name="lname"
                    onChange={handleChange}
                    required
                  />
                </div>
                <hr className="mt-4" />
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <input
                    type="submit"
                    className="btn btn-success "
                    value="Save"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Password */}

          <div className="mt-5 pb-5">
            <h4 className="fw-bold pt-4">Change Password</h4>
            <hr />
            <form>
              <div className="row mt-4">
                <div className="col-12 mt-2">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control mt-2"
                    value={formData.password}
                    name="password"
                    onChange={handleChangePw}
                    required
                    placeholder="Enter New Password"
                  />
                </div>

                <div className="col-12 mt-4">
                  <label htmlFor="lname">New Re-Password</label>
                  <input
                    type="password"
                    className="form-control mt-2"
                    value={formData.password1}
                    id="password1"
                    name="password1"
                    onChange={handleChangePw}
                    placeholder="Enter New Re-Password"
                    required
                  />
                </div>
                <hr className="mt-4" />
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <input
                    type="submit"
                    className="btn btn-success "
                    value="Save"
                    onClick={handleSubmitPassword}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
