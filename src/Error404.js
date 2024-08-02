import React from "react";
import "./Error404.css";
export default function Error404() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className="not-found-link">
          Return to InvoiceGenerater.in
        </a>
      </div>
      <div className="animation-box">
        <div className="box red-box"></div>
        <div className="box green-box"></div>
        <div className="box white-box"></div>
      </div>
    </div>
  );
}
