import React from "react";
import footerlogo from "../assets/footerlogo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <img src={footerlogo} alt="Mouritech Logo" className="footer-logo" />
      <div className="footer-text">
        &copy; 2026 Mouritech (Shift Allowance Tracker). All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;