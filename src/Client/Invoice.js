import React, { useEffect, useRef, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Navbar from "./Navbar";
import { TfiReload } from "react-icons/tfi";
import { FaDownload } from "react-icons/fa6";
import Api from "../MainApi";
import Loader from "./Loader";

export default function Invoice() {
  const [loader, setLoader] = useState(false);
  const inputRef = useRef(null);

  const decimals = 2;
  const [currencyList, setCurrencyList] = useState("₹");
  const [logo, setLogo] = useState(0);
  const [Tax, setTax] = useState(true);
  const [Discount, setDiscount] = useState(true);
  const [total, setTotal] = useState("0.00");
  const [balanceDue, setBalanceDue] = useState("0.00");
  const [currencyData, setCurrencyData] = useState([
    {
      countryName: "",
      currencySymbol: "",
    },
  ]);

  const [taxFormData, setTaxFormData] = useState({
    biltax: 0,
    taxType: "",
    billdiscount: 0,
    discountType: "",
    shipping: 0,
    paidAmount: 0,
  });

  const [itemList, setItemList] = useState([
    {
      itemName: "",
      itemQty: 1,
      itemRate: 0,
      itemAmount: 0,
      currency: currencyList,
    },
  ]);

  const [formData, setFormData] = useState({
    invoice: "INVOICE",
    invoiceNo: 1,
    formTitle: "",
    billTo: "",
    shipTo: "",
    billdate: "",
    paymentTerms: "",
    billDuedate: "",
    phoneNumber: "",
    itemNotes: "",
    itemTerms: "",
    items: itemList,
    currency: currencyList,
    subTotal: 0,
    biltax: 0,
    taxType: "",
    billdiscount: 0,
    discountType: "",
    shipping: 0,
    paidAmount: 0,
    total: "",
    balanceDue: "",
  });

  const getcurrencyData = async () => {
    setLoader(true);
    await fetch(`${Api}/api/CurrencyData`).then(async (res) => {
      const data = await res.json();
      setCurrencyData(data.msg);
    });
    setLoader(false);
  };

  const getInvoiceNumber = async () => {
    setLoader(true);

    await fetch(`${Api}/api/InvoiceNumber`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: window.sessionStorage.getItem("email") }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.msg) {
        setFormData({ ...formData, invoiceNo: data.msg });
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
  };

  const handleClick = (e) => {
    inputRef.current.click();
  };
  const handleImageChange = (e) => {
    setLogo(e.target.files[0]);
  };
  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoRemove = () => {
    setLogo(0);
  };

  const handelExtarTax = (e) => {
    setTaxFormData({ ...taxFormData, [e.target.name]: e.target.value });

    // totalCount();
  };

  const handleRefDiscount = (e) => {
    setDiscount(!Discount);
    totalCount();
  };

  const handleRefTax = (e) => {
    setTax(!Tax);
    totalCount();
  };

  const handleCurrency = (e) => {
    setCurrencyList(e.target.value);
  };

  const handleCurrencySymbol = () => {
    const updatedItemList = itemList.map((item) => ({
      ...item,
      currency: currencyList,
    }));
    setItemList(updatedItemList);
    setFormData({ ...formData, currency: currencyList });
  };

  const totalCount = () => {
    if (Tax && Discount) {
      var t1 =
        parseFloat(formData.subTotal) -
        parseFloat(taxFormData.billdiscount) +
        parseFloat(taxFormData.biltax) +
        parseFloat(taxFormData.shipping);
      setTaxFormData({
        ...taxFormData,
        taxType: currencyList,
        discountType: currencyList,
      });
      setTotal(t1.toFixed(decimals));
      setBalanceDue(
        (t1 - parseFloat(taxFormData.paidAmount)).toFixed(decimals)
      );
      return;
    } else if (Discount) {
      var dis =
        parseFloat(formData.subTotal) - parseFloat(taxFormData.billdiscount);
      var tax = dis * (parseFloat(taxFormData.biltax) / 100);
      var t = dis + tax + parseFloat(taxFormData.shipping);

      setTaxFormData({
        ...taxFormData,
        taxType: "%",
        discountType: currencyList,
      });

      setTotal(t.toFixed(decimals));
      setBalanceDue((t - parseFloat(taxFormData.paidAmount)).toFixed(decimals));
      return;
    } else if (Tax) {
      var dis1 =
        parseFloat(formData.subTotal) -
        parseFloat(formData.subTotal) *
          (parseFloat(taxFormData.billdiscount) / 100);

      var t2 =
        dis1 +
        parseFloat(taxFormData.biltax) +
        parseFloat(taxFormData.shipping);
      setTaxFormData({
        ...taxFormData,
        taxType: currencyList,
        discountType: "%",
      });
      setTotal(t2.toFixed(decimals));
      setBalanceDue(
        (t2 - parseFloat(taxFormData.paidAmount)).toFixed(decimals)
      );
      return;
    } else {
      var dis3 =
        parseFloat(formData.subTotal) -
        (parseFloat(formData.subTotal) * parseFloat(taxFormData.billdiscount)) /
          100;
      var tax3 = dis3 * (taxFormData.biltax / 100);
      var t3 = dis3 + tax3 + parseFloat(taxFormData.shipping);
      setTaxFormData({ ...taxFormData, taxType: "%", discountType: "%" });
      setTotal(t3.toFixed(decimals));
      setBalanceDue(
        (t3 - parseFloat(taxFormData.paidAmount)).toFixed(decimals)
      );
      return;
    }
  };

  const item = itemList.map((v, i) => {
    return (
      <ItemData
        decimals={decimals}
        itemList={itemList}
        setItemList={setItemList}
        value={v}
        key={i}
        index={i}
        currencyList={currencyList}
      />
    );
  });
  const addItem = (e) => {
    e.preventDefault();
    setItemList([
      ...itemList,
      {
        itemName: "",
        itemQty: 1,
        itemRate: 0,
        currency: currencyList,
        itemAmount: 0,
      },
    ]);
  };

  const currencyDataShow = currencyData.map((v, i) => {
    return (
      <CurrencySelect
        value={v}
        key={i}
        index={i}
        currencyList={currencyList}
        setCurrencyList={setCurrencyList}
      />
    );
  });

  const sendData = async (req, res) => {
    setFormData({
      ...formData,
      items: itemList,
      biltax: taxFormData.biltax,
      taxType: taxFormData.taxType,
      billdiscount: taxFormData.billdiscount,
      discountType: taxFormData.discountType,
      shipping: taxFormData.shipping,
      paidAmount: taxFormData.paidAmount,
      total: total,
      balanceDue: balanceDue,
    });
  };

  const handelSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (logo === 0) {
      const dateI = new Date().toString().substring(0, 15);
      const timeI = new Date().toString().substring(16, 24);
      const InvoicePDFName =
        "https://invoiceserver-nfyb.onrender.com/InvoiceGeneret/userInvoice/" +
        dateI.replaceAll(" ", "") +
        timeI.replaceAll(":", "") +
        ".pdf";

      await fetch(`${Api}/api/OnlyInvoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: formData,
          email: window.sessionStorage.getItem("email"),
          items: itemList,
          invoiceNo: formData.invoiceNo,
          invoiceName: InvoicePDFName,
          dateI: dateI,
          timeI: timeI,
        }),
      }).then(async (res) => {
        const resData = await res.status;
        const id = (dateI + timeI).replaceAll(" ", "");
        if (resData === "400") {
          NotificationManager.error(resData, "Error", 1000);
          setLoader(false);
        } else {
          NotificationManager.success(resData, "Done", 1000);
          setTimeout(() => {
            window.location.href = `/ViewInvoice/${id}`;
            setLoader(false);
          }, 1000);
        }
      });
      setLoader(false);
    } else {
      const data = new FormData();
      const dateI = new Date().toString().substring(0, 15);
      const timeI = new Date().toString().substring(16, 24);
      const InvoicePDFName =
        "https://invoice-server-pi.vercel.app/InvoiceGeneret/userInvoice/" +
        dateI.replaceAll(" ", "") +
        timeI.replaceAll(":", "") +
        ".pdf";

      data.append("file", logo);
      data.append("formData", JSON.stringify(formData));
      data.append("email", window.sessionStorage.getItem("email"));
      data.append("items", JSON.stringify(itemList));
      data.append("invoiceNo", JSON.stringify(formData.invoiceNo));
      data.append("invoiceName", InvoicePDFName);
      data.append("dateI", dateI);
      data.append("timeI", timeI);

      const respons = await fetch(`${Api}/api/LogoUpload`, {
        method: "POST",
        body: data,
      });
      const resData = await respons.status;
      console.log(resData);
      const id = (dateI + timeI).replaceAll(" ", "");
      if (resData === "400") {
        NotificationManager.error(resData, "Error", 1000);
        setLoader(false);
      } else {
        NotificationManager.success(resData, "Done", 1000);
        setTimeout(() => {
          window.location.href = `/ViewInvoice/${id}`;
          setLoader(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    setFormData({ ...formData, items: itemList });
    var total = parseFloat(
      itemList.reduce((acc, item) => acc + item.itemAmount, 0)
    );
    total = total.toFixed(decimals);
    setFormData({ ...formData, subTotal: total });
    // eslint-disable-next-line
  }, [itemList]);

  useEffect(() => {
    totalCount();
    // eslint-disable-next-line
  }, [formData.subTotal, Tax, Discount]);

  useEffect(() => {
    totalCount();
    // eslint-disable-next-line
  }, [
    taxFormData.biltax,
    taxFormData.billdiscount,
    taxFormData.shipping,
    taxFormData.paidAmount,
  ]);

  useEffect(() => {
    handleCurrencySymbol();
    // eslint-disable-next-line
  }, [currencyList]);

  useEffect(() => {
    getcurrencyData();
    getInvoiceNumber();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    sendData();
    // eslint-disable-next-line
  }, [balanceDue]);

  return (
    <div>
      <Navbar />
      <NotificationContainer />
      <Loader loader={loader} />
      <div className="container container-home">
        <div className="profile-box p-4">
          <form onSubmit={handelSubmit} encType="multipart/form-data">
            {/* Logo Part */}
            <div className="row">
              <div className="col-6 text-left">
                {logo ? (
                  <button className="btn-logoRemove" onClick={handleLogoRemove}>
                    x
                  </button>
                ) : (
                  ""
                )}
                <div className="upload-btn-wrapper">
                  {logo !== 0 ? (
                    <>
                      <img
                        src={URL.createObjectURL(logo)}
                        width="150px"
                        height="120px"
                        alt="logo"
                      />
                    </>
                  ) : (
                    <button className="btnFile" onClick={handleClick}>
                      + Add Logo
                    </button>
                  )}

                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleImageChange}
                    name="myfile"
                    id="myfile"
                  />
                </div>
              </div>
              <div className="col-6 text-right">
                <div className="text-right">
                  <input
                    type="text"
                    name="invoice"
                    onChange={handleChangeForm}
                    value={formData.invoice}
                    className="form-control text-right invoice-title fs-1"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-7" style={{ float: "right" }}></div>
                  <div className="col-1 pt-2">{/* <span>#</span> */}</div>
                  <div className="col-4">
                    <input
                      type="text"
                      className="form-control form-invoice fs-6 pe-4 w-100  me-2"
                      name="invoiceNo"
                      id="invoiceNo"
                      onChange={handleChangeForm}
                      style={{ float: "right" }}
                      value={formData.invoiceNo}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date Part */}
            <div className="row mt-4">
              <div className="col-6 col-lg-8 text-left">
                <div>
                  <textarea
                    type="text"
                    name="formTitle"
                    value={formData.formTitle}
                    onChange={handleChangeForm}
                    className="form-control mt-3 w-75"
                    placeholder="Who is this from ?"
                    style={{ height: "70px", color: "#9d9797" }}
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="billTo" className="mt-4 ps-3">
                      Bill To
                    </label>
                    <textarea
                      type="text"
                      name="billTo"
                      id="billTo"
                      value={formData.billTo}
                      onChange={handleChangeForm}
                      className="form-control mt-3 w-100"
                      placeholder="Who is this to ?"
                      style={{ height: "70px", color: "#9d9797" }}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="shipTo" className="mt-4 ps-3">
                      Ship To
                    </label>
                    <textarea
                      type="text"
                      name="shipTo"
                      id="shipTo"
                      value={formData.shipTo}
                      onChange={handleChangeForm}
                      className="form-control mt-3 w-100"
                      placeholder="(optional)"
                      style={{ height: "70px", color: "#9d9797" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-4 text-right">
                <div className="row pe-2 mt-3">
                  <div
                    className="col-6 text-right pt-2"
                    style={{ textAlign: "right" }}
                  >
                    <label>Date</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      name="billdate"
                      className="form-control"
                      value={formData.billdate}
                      onChange={handleChangeForm}
                      placeholder="dd-mm-yyyy"
                      min="1997-01-01"
                      max="2030-12-31"
                      required
                    />
                  </div>
                </div>

                <div className="row pe-2 mt-3">
                  <div
                    className="col-6 text-right pt-2"
                    style={{ textAlign: "right" }}
                  >
                    <label>Payment Terms</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="paymentTerms"
                      className="form-control"
                      value={formData.paymentTerms}
                      onChange={handleChangeForm}
                    />
                  </div>
                </div>

                <div className="row pe-2 mt-3">
                  <div
                    className="col-6 text-right pt-2"
                    style={{ textAlign: "right" }}
                  >
                    <label>Due Date</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      name="billDuedate"
                      className="form-control"
                      value={formData.billDuedate}
                      onChange={handleChangeForm}
                      placeholder="dd-mm-yyyy"
                      min="1997-01-01"
                      max="2030-12-31"
                      required
                    />
                  </div>
                </div>

                <div className="row pe-2 mt-3">
                  <div
                    className="col-6 text-right pt-2"
                    style={{ textAlign: "right" }}
                  >
                    <label>Phone Number</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control"
                      value={formData.phoneNumber}
                      onChange={handleChangeForm}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Item Part */}

            <div className="row mt-5">
              <div className="col-12">
                <table className="table">
                  <thead className="table table-dark ">
                    <tr className="item-th">
                      <td className="invoice-td-Item">Item</td>
                      <td className="invoice-td-qty">Quantitiy</td>
                      <td className="invoice-td-rate ps-3">Rate</td>
                      <td className="text-left">Amount</td>
                      <td className="text-center"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {item}
                    <tr>
                      <td>
                        <div
                          className="btn btn-outline-success"
                          onClick={addItem}
                        >
                          <span className="fw-bold">+</span> ITEM
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note */}
            <div className="row mt-4">
              <div className="col-4 col-lg-6">
                <div>
                  <label htmlFor="Notes" className="mb-3 ps-3">
                    Notes
                  </label>
                  <textarea
                    name="itemNotes"
                    placeholder="Notes - any relevant information not already covered"
                    className="form-control"
                    value={formData.itemNotes}
                    onChange={handleChangeForm}
                    style={{ height: "70px", color: "#9d9797" }}
                  ></textarea>
                </div>
                <div className="mt-4">
                  <label htmlFor="Notes" className="mb-3 ps-3">
                    Terms
                  </label>
                  <textarea
                    name="itemTerms"
                    placeholder="Terms and conditions - lase fees,payment methods, delivery schedule"
                    className="form-control"
                    value={formData.itemTerms}
                    onChange={handleChangeForm}
                    style={{ height: "70px", color: "#9d9797" }}
                  ></textarea>
                </div>
              </div>

              {/* Tax Discount */}
              <div className="col-8 col-lg-6">
                <div className="row">
                  <div className="col-7" style={{ textAlign: "right" }}>
                    <label>Subtotal</label>
                  </div>
                  <div className="col-5 pe-5" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {currencyList}&nbsp;
                      {formData.subTotal === 0 ? "0.00" : formData.subTotal}
                    </lable>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-7 pt-2 " style={{ textAlign: "right" }}>
                    <label>Discount</label>
                  </div>
                  <div className="col-5 pe-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-9">
                        <div className="invoice-Tax">
                          <label
                            className="pt-2 ps-2"
                            style={{ float: "left", border: "none" }}
                          >
                            {Discount ? currencyList : ""}
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-75 form-control"
                            style={{ float: "left", border: "none" }}
                            name="billdiscount"
                            value={taxFormData.billdiscount}
                            onChange={handelExtarTax}
                          />
                          <label className="pt-2 pe-2">
                            {Discount ? "" : "%"}
                          </label>
                        </div>
                      </div>
                      <div
                        className="col-3 invoice-Tax-ref pt-2 pe-3"
                        onClick={handleRefDiscount}
                      >
                        <lable className="">
                          <TfiReload />
                        </lable>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-7 pt-2" style={{ textAlign: "right" }}>
                    <label>Tax</label>
                  </div>
                  <div className="col-5 pe-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-9">
                        <div className="invoice-Tax">
                          <label
                            className="pt-2 ps-2"
                            style={{ float: "left", border: "none" }}
                          >
                            {Tax ? currencyList : ""}
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-75 form-control"
                            style={{ float: "left", border: "none" }}
                            name="biltax"
                            value={taxFormData.biltax}
                            onChange={handelExtarTax}
                          />
                          <label className="pt-2 pe-2">{Tax ? "" : "%"}</label>
                        </div>
                      </div>
                      <div
                        className="col-3 invoice-Tax-ref pt-2 pe-3"
                        onClick={handleRefTax}
                      >
                        <lable className="">
                          <TfiReload />
                        </lable>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-7 pt-2" style={{ textAlign: "right" }}>
                    <label>Shipping</label>
                  </div>
                  <div className="col-5 pe-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-12">
                        <div className="invoice-Tax">
                          <label
                            className="pt-2 ps-2"
                            style={{ float: "left", border: "none" }}
                          >
                            {currencyList}
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-75 form-control"
                            name="shipping"
                            style={{ border: "none" }}
                            value={taxFormData.shipping}
                            onChange={handelExtarTax}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-8" style={{ textAlign: "right" }}>
                    <label>Total</label>
                  </div>
                  <div className="col-4 pe-5" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {currencyList}&nbsp;
                      {total}
                    </lable>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-7 pt-2" style={{ textAlign: "right" }}>
                    <label>Amount Paid</label>
                  </div>
                  <div className="col-5 pe-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-12">
                        <div className="invoice-Tax">
                          <label
                            className="pt-2 ps-2"
                            style={{ float: "left", border: "none" }}
                          >
                            {currencyList}
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-75 form-control"
                            name="paidAmount"
                            style={{ border: "none" }}
                            value={taxFormData.paidAmount}
                            onChange={handelExtarTax}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-8" style={{ textAlign: "right" }}>
                    <label>Balance Due</label>
                  </div>
                  <div className="col-4 pe-5" style={{ textAlign: "right" }}>
                    <lable style={{ color: "gray" }}>
                      {currencyList}&nbsp;
                      {balanceDue}
                    </lable>
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-4" />

            {/* Submit */}
            <div className="row mt-3">
              <div className="col-3 col-lg-2 mt-4 pt-1">
                <button className="btn btn-success">
                  <FaDownload /> Download
                </button>
              </div>
              <div className="col-9 col-lg-10">
                <label className="">Currency</label>
                <select
                  className="form-control w-25 mt-1"
                  name="currencyList"
                  onChange={handleCurrency}
                >
                  <option value="₹">INR (₹)</option>
                  {currencyDataShow}
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const ItemData = ({
  decimals,
  currencyList,
  itemList,
  setItemList,
  value,
  index,
}) => {
  const [amount, setItemAmount] = useState("0.00");

  const updateItem = (index, key, value) => {
    setItemList((itemList) => {
      return itemList.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItemList = itemList.filter((_, i) => i !== index);
    setItemList(updatedItemList);
  };

  useEffect(() => {
    const a = itemList[index].itemQty * itemList[index].itemRate;
    const amount = parseFloat(a);
    setItemAmount(amount.toFixed(decimals));
    updateItem(index, "itemAmount", amount);
    // eslint-disable-next-line
  }, [itemList[index].itemQty]);

  useEffect(() => {
    const a = itemList[index].itemQty * itemList[index].itemRate;
    const amount = parseFloat(a);
    setItemAmount(amount.toFixed(decimals));
    updateItem(index, "itemAmount", amount);
    // eslint-disable-next-line
  }, [itemList[index].itemRate]);
  return (
    <>
      <tr>
        <td>
          <input
            type="text"
            className="form-control"
            name="itemName"
            placeholder="Description of item/service..."
            value={itemList[index].itemName}
            onChange={(e) => updateItem(index, e.target.name, e.target.value)}
            required
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control"
            name="itemQty"
            placeholder="1"
            value={itemList[index].itemQty}
            onChange={(e) => updateItem(index, e.target.name, e.target.value)}
            min="1"
          />
        </td>
        <td>
          <div className="row">
            <div className="col-1 mt-2 pe-1">
              <label className="">{currencyList}</label>
            </div>
            <div className="col-10">
              <input
                type="text"
                className="form-control w-100"
                name="itemRate"
                placeholder="0.00"
                value={itemList[index].itemRate}
                onChange={(e) =>
                  updateItem(index, e.target.name, e.target.value)
                }
                min="0"
              />
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col-1 mt-2 pe-1">
              <label className="">{currencyList}</label>
            </div>
            <div className="col-10 pt-2 ps-3">
              <label>{amount ? amount : "0.00"}</label>
            </div>
          </div>
        </td>
        {index === 0 ? (
          <></>
        ) : (
          <td onClick={(e) => handleRemoveItem(index)}>
            <spna className="btn-itemRemove">X</spna>
          </td>
        )}
      </tr>
    </>
  );
};

const CurrencySelect = ({ value, index, currencyList, setCurrencyList }) => {
  return (
    <option value={value.currencySymbol}>
      {value.countryName} &nbsp;&nbsp;({value.currencySymbol})
    </option>
  );
};
