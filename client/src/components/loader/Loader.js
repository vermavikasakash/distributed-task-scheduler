import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "30vh",
        flexDirection: "column",
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          width: "2rem",
          height: "2rem",
          color: "#1a472a", // green
          borderWidth: "2px",
        }}
      />

      <p style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
       Please wait...
      </p>
    </div>
  );
};

export default Loader;