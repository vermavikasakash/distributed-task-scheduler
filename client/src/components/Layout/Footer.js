import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <h4 className="text-center mb-2">© {year} Task Scheduler</h4>
      <p className="text-center mb-0">
        Admin console for uploading task batches and monitoring worker results.
      </p>
    </footer>
  );
};

export default Footer;
