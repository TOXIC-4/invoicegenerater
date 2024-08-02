import React, { useEffect, useRef, useState } from "react";
import { NotificationContainer } from "react-notifications";
import Navbar from "./Navbar";
import Loader from "./Loader";
import Api from "../MainApi";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
export default function ViewInvoice() {
  const contentToPrint = useRef(null);
  const loaction = useLocation().pathname.split("/")[2];
  const Uid = loaction;
  const [discount, setDiscount] = useState();
  const [tax, setTax] = useState();
  const [formData, setFormData] = useState({});
  const [itemsData, setItemsData] = useState([]);

  const [loader, setLoader] = useState(false);

  const countDiscount = () => {
    if (formData.discountType === "%") {
      let Discount_Amount =
        (parseFloat(formData.subTotal) * parseFloat(formData.discount)) / 100;

      setDiscount(Discount_Amount.toFixed(2));
      countTax(Discount_Amount.toFixed(2));
    } else {
      setDiscount(formData.discount);
      countTax(formData.discount);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const countTax = (d) => {
    if (formData.taxType === "%") {
      var dis = parseFloat(formData.subTotal) - d;
      var tax = dis * (parseFloat(formData.tax) / 100);
      setTax(tax.toFixed(2));
    } else {
      setTax(formData.tax);
    }
  };

  const getData = async (req, res) => {
    setLoader(true);
    try {
      await fetch(`${Api}/api/FindInvoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Uid }),
      }).then(async (res) => {
        const data = await res.json();
        setFormData(data.msg);
        setItemsData(data.msg.Items);
        setLoader(false);
      });
    } catch {
      setLoader(false);
      window.location.href = "/Error";
    }
  };

  const item = itemsData.map((v, i) => {
    return <DataShow index={i} value={v} key={i} />;
  });

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    countDiscount();
    // eslint-disable-next-line
  }, [formData]);
  return (
    <div>
      <Navbar />
      <NotificationContainer />
      <Loader loader={loader} />

      <div className="container container-home">
        <div className="profile-box p-4">
          <div className="row">
            <div className="col-10"></div>
            <div className="col-2">
              <button
                className="btn btn-success w-100 my-4"
                onClick={handlePrint}
              >
                Print
              </button>
            </div>
          </div>
          <div ref={contentToPrint} style={{ width: "100%" }}>
            <div className="row px-5">
              <div className="col-6 text-left">
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    width="150px"
                    height="120px"
                  />
                )}
              </div>
              <div className="col-6 text-right">
                <div className="text-right">
                  <p
                    className="form-control text-right invoice-title fs-1"
                    style={{ border: "none" }}
                  >
                    {formData.invoice}
                  </p>
                </div>
                <div className="row mt-3">
                  <div className="col-7" style={{ float: "right" }}></div>
                  <div className="col-1 pt-2">{/* <span>#</span> */}</div>
                  <div className="col-4">
                    <p
                      className="form-control form-invoice fs-6 pe-4 w-100  me-2"
                      style={{ float: "right", border: "none" }}
                    >
                      #{formData.invoiceNo}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Part */}
            <div className="row mt-4 px-5">
              <div className="col-6 col-lg-8 text-left">
                <div>
                  <p className="fs-5 fw-bold">{formData.formTitle}</p>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <label htmlFor="billTo" className="mt-4 pb-2">
                      Bill To :
                    </label>
                    <p>{formData.billTo}</p>
                  </div>
                  <div className="col-6">
                    <label htmlFor="shipTo" className="mt-4 pb-2">
                      Ship To :
                    </label>
                    <p>{formData.shipTo}</p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-4 mt-3 text-right">
                <div className="row pe-2">
                  <div
                    className="col-6 text-right"
                    style={{ textAlign: "right" }}
                  >
                    <label>Date :</label>
                  </div>
                  <div className="col-6" style={{ textAlign: "right" }}>
                    <p>{formData.createDate}</p>
                  </div>
                </div>

                <div className="row pe-2">
                  <div
                    className="col-6 text-right"
                    style={{ textAlign: "right" }}
                  >
                    <label>Payment Terms :</label>
                  </div>
                  <div className="col-6" style={{ textAlign: "right" }}>
                    <p>{formData.paymentTerms}</p>
                  </div>
                </div>

                <div className="row pe-2">
                  <div
                    className="col-6 text-right"
                    style={{ textAlign: "right" }}
                  >
                    <label>Due Date :</label>
                  </div>
                  <div className="col-6" style={{ textAlign: "right" }}>
                    <p>{formData.dueDate}</p>
                  </div>
                </div>

                <div className="row pe-2">
                  <div
                    className="col-6 text-right"
                    style={{ textAlign: "right" }}
                  >
                    <label>Phone Number :</label>
                  </div>
                  <div className="col-6">
                    <p style={{ textAlign: "right" }}>{formData.Phone}</p>
                  </div>
                </div>

                <div
                  className="row pe-2 mt-2"
                  style={{
                    background: "rgb(65 65 65 / 10%)",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    className="col-6 text-right pt-2"
                    style={{ textAlign: "right" }}
                  >
                    <label className="fw-bold text-dark fs-6">
                      Balance Due :{" "}
                    </label>
                  </div>
                  <div className="col-6 pt-2">
                    <p className="fw-bold fs-6" style={{ textAlign: "right" }}>
                      {formData.currency}
                      {formData.balanceDue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="row mt-5 px-5">
              <div className="col-12">
                <table className="table">
                  <thead className="table table-dark ">
                    <tr className="item-th">
                      <td className="invoice-td-Item">Item</td>
                      <td
                        className="invoice-td-qty"
                        style={{ textAlign: "right" }}
                      >
                        Quantitiy
                      </td>
                      <td
                        className="invoice-td-rate ps-5"
                        style={{ textAlign: "right" }}
                      >
                        Rate
                      </td>
                      <td className="" style={{ textAlign: "right" }}>
                        Amount
                      </td>
                    </tr>
                  </thead>
                  <tbody>{item}</tbody>
                </table>
              </div>
            </div>

            {/* Tax */}

            <div className="row mt-0 px-5">
              <div className="col-4 col-lg-6"></div>

              {/* Tax Discount */}
              <div className="col-8 col-lg-6">
                <div className="row">
                  <div className="col-6" style={{ textAlign: "right" }}></div>

                  <div className="col-6" style={{ textAlign: "right" }}>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-9" style={{ textAlign: "right" }}>
                    <label>Subtotal :</label>
                  </div>
                  <div className="col-3" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {formData.currency}&nbsp;
                      {formData.subTotal}
                    </lable>
                  </div>
                </div>

                <div className="row ">
                  <div className="col-9" style={{ textAlign: "right" }}>
                    <label>
                      Discount (
                      {formData.discountType === "%"
                        ? formData.discount + formData.discountType
                        : formData.currency + formData.discount}
                      ) :
                    </label>
                  </div>
                  <div className="col-3" style={{ textAlign: "right" }}>
                    {formData.discount === "0" ? (
                      <>
                        {formData.currency}
                        &nbsp;{formData.discount}
                      </>
                    ) : (
                      <lable style={{ color: "gray" }}>
                        {formData.currency}&nbsp;
                        {discount}
                      </lable>
                    )}
                  </div>
                </div>

                <div className="row ">
                  <div className="col-9" style={{ textAlign: "right" }}>
                    <label>
                      Tax (
                      {formData.taxType === "%"
                        ? formData.tax + formData.taxType
                        : formData.currency + formData.tax}
                      ) :
                    </label>
                  </div>

                  <div className="col-3" style={{ textAlign: "right" }}>
                    {formData.tax === "0" ? (
                      <>
                        {formData.currency}
                        &nbsp;{formData.tax}
                      </>
                    ) : (
                      <lable style={{ color: "gray" }}>
                        {formData.currency}&nbsp;
                        {tax}
                      </lable>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-9" style={{ textAlign: "right" }}>
                    <label>Shipping :</label>
                  </div>

                  <div className="col-3" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {formData.currency}&nbsp;
                      {formData.shipping}
                    </lable>
                  </div>
                </div>

                <div className="row mt-0">
                  <div className="col-6" style={{ textAlign: "right" }}></div>

                  <div className="col-6" style={{ textAlign: "right" }}>
                    <hr />
                  </div>
                </div>

                <div className="row mt-0 text-dark fw-bold fs-5">
                  <div className="col-9" style={{ textAlign: "right" }}>
                    <label>Total :</label>
                  </div>
                  <div className="col-3" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {formData.currency}&nbsp;
                      {formData.total}
                    </lable>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <hr className="my-2" />
            <div className="row px-5">
              <div className="col-12">Notes.</div>
            </div>

            <div className="row px-5">
              <div className="col-1"></div>
              <div className="col-10">{formData.notes}</div>
            </div>
            <div className="row mt-2 px-5">
              <div className="col-12">Terms.</div>
            </div>
            <div className="row px-5">
              <div className="col-1"></div>
              <div className="col-10">{formData.terms}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DataShow = ({ value, index }) => {
  return (
    <>
      <tr>
        <td>
          <label>{value.itemName}</label>
        </td>
        <td style={{ textAlign: "right" }}>
          <label className="">{value.itemQty}</label>
        </td>
        <td style={{ textAlign: "right" }}>
          <label className="">
            {value.currency}&nbsp;
            {value.itemRate.toFixed(2)}
          </label>
        </td>
        <td style={{ textAlign: "right" }}>
          <label className="">
            {value.currency}&nbsp;
            {value.itemAmount.toFixed(2)}
          </label>
        </td>
      </tr>
    </>
  );
};
