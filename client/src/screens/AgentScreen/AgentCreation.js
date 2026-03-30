import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./AgentCreation.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { registerFunction } from "../../serviceApi/registerApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const AgentCreation = () => {
  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  //form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const packageInfo = {
      name,
      email,
      phone,
      password,
    };
    setLoader(true);
    const result = await registerFunction(packageInfo);

    if (result.data.success) {
      toast.success(result.data.message);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setTimeout(() => {
        navigate("/view-agent");
      }, 2000);
    } else {
      toast.error(result.data.message);
    }
    setLoader(false);
  };

  // ! JSX START
  return (
    <Layout>
      <div className={styles.register}>
        <h3 style={{ marginTop: "15px" }}>👤 Add New Agent</h3>
        <Form style={{ width: "30%" }} onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Agent Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Please Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>

            <PhoneInput
              country={"in"} // Default country (India)
              value={phone}
              onChange={(value) => setPhone(value)}
              inputStyle={{ width: "100%", height: "40px" }}
              enableSearch={true} // Enables country search
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>

            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength="6"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <Form.Text muted>Minimum 6 characters</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Agent
          </Button>
          {loader && <Loader />}
        </Form>
      </div>
    </Layout>
  );
};

export default AgentCreation;
