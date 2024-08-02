import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Client.css";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdOutlineNotInterested } from "react-icons/md";
import { MdFileDownloadDone, MdEditDocument, MdPreview } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Api from "../MainApi";
import Loader from "./Loader";
export default function MyInvoice() {
  // const invoice = useState(false);

  const [loader, setLoader] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);

  const email = window.sessionStorage.getItem("email");

  const getInvoice = async (req, res) => {
    setLoader(true);
    await fetch(`${Api}/api/UserInvoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(async (res) => {
      const data = await res.json();
      setInvoiceData(data.msg);
      setLoader(false);
    });
  };

  const InvoiceShow = invoiceData.map((v, i) => {
    return (
      <InvoiceDataTable
        index={i}
        key={i}
        value={v}
        getInvoice={getInvoice}
        loader={loader}
        setLoader={setLoader}
      />
    );
  });

  useEffect(() => {
    getInvoice();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <Navbar />
      <NotificationContainer />
      <Loader loader={loader} />
      <div className="container-fluid container-home">
        <div className="profile-box p-4">
          <div className="row">
            <div className="col-6">
              <h4 className="fw-bold">My Invoice</h4>
            </div>
            <div className="col-6">
              <Link
                to={"/CreateInvoice"}
                className="btn btn-success"
                style={{ float: "right" }}
              >
                New Invoice
              </Link>
            </div>
          </div>
          <div className="row my-5">
            <div className="col-12">
              {invoiceData.length === 0 ? (
                "No Invoices found."
              ) : (
                <table className="table myinvoice-table">
                  <thead
                    className="table text-light fw-bold"
                    style={{ background: "#000000b8", height: "40px" }}
                  >
                    <td className="pb-2 ps-2">CUSTOMER</td>
                    <td className="pb-2">INVOICE NO</td>
                    <td className="pb-2">DATE</td>
                    <td className="pb-2">DUE DATE</td>
                    <td className="pb-2">STATUS</td>
                    <td className="pb-2">TOTAL</td>
                    <td className="pb-2"></td>
                  </thead>
                  {InvoiceShow}
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InvoiceDataTable = ({ value, index, getInvoice, loader, setLoader }) => {
  const handleDelete = async (id) => {
    setLoader(true);
    await fetch(`${Api}/api/InvoiceDelete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ InvoiceId: id }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.status === 400) {
        NotificationManager.error("Record Not Delete", "ERROR", 2000);
        setLoader(false);
      } else {
        NotificationManager.success("Record Delete", "Success", 2000);
        getInvoice();
        setLoader(false);
      }
    });
  };
  const handleEdit = async (id) => {
    setLoader(true);
    var status = "";
    if (value.status === "true") {
      status = "false";
    } else {
      status = "true";
    }
    await fetch(`${Api}/api/InvoiceStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, status: status }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.status === 400) {
        NotificationManager.error(data.msg, "ERROR", 2000);
        setLoader(false);
      } else {
        NotificationManager.success(data.msg, "Success", 2000);
        getInvoice();
        setLoader(false);
      }
    });
  };

  return (
    <tbody className="fs-6">
      <tr className="">
        <td className="">{value.billTo.substring(0, 12)}...</td>
        <td className="">#{value.invoiceNo}</td>
        <td className="">{value.createDate}</td>
        <td className="">{value.dueDate}</td>
        <td className="">
          {value.status !== "false" ? (
            <span classNames="" style={{ color: "#00c600f2" }}>
              <MdFileDownloadDone classNames="" />
              &nbsp;Paid
            </span>
          ) : (
            <span classNames="" style={{ color: "#f50000f2" }}>
              <MdOutlineNotInterested classNames="" />
              &nbsp;Not Paid
            </span>
          )}
        </td>
        <td className="">
          {value.currency}
          {value.total}
        </td>
        <td className="pe-3 menu-container">
          <DropdownButton id="dropdown-basic-button" title="View ">
            {value.status === "false" ? (
              <Dropdown.Item className=" mt-1">
                <Link
                  to={`/Updateinvoice/${value._id}`}
                  className="text-dark nav-link"
                >
                  <MdEditDocument />
                  &nbsp;&nbsp; Edit
                </Link>
              </Dropdown.Item>
            ) : (
              ""
            )}
            <Dropdown.Item className="text-info mt-1">
              <Link to={`/ViewInvoice/${value._id}`} className="nav-link">
                <MdPreview />
                &nbsp; View
              </Link>
            </Dropdown.Item>

            {value.status === "false" ? (
              <Dropdown.Item
                onClick={(e) => handleEdit(value._id)}
                className="text-primary mt-1"
              >
                <IoCheckmarkDone /> &nbsp;Mark as Paid
              </Dropdown.Item>
            ) : (
              ""
            )}

            <Dropdown.Item
              className="text-danger mt-1 mb-1"
              onClick={(e) => handleDelete(value._id)}
            >
              <RiDeleteBin6Line />
              &nbsp;&nbsp; Delete
            </Dropdown.Item>
          </DropdownButton>
        </td>
      </tr>
    </tbody>
  );
};
