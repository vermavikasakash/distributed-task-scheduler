import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { loginFunction } from "../../../serviceApi/registerApi";
import { useNavigate } from "react-router-dom";
import styles from "../../AgentScreen/AgentCreation.module.css";
import Layout from "../../../components/Layout/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  //form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = {
      email,
      password,
    };
    const result = await loginFunction(userInfo);

    if (result.status === 200) {
      if (result.data.status) {
        sessionStorage.setItem("role", JSON.stringify(result.data.user.role));
        sessionStorage.setItem("user", JSON.stringify(result.data));
        sessionStorage.setItem("token", result.data.token);
        toast.success(result.data.message);
        setTimeout(() => {
          navigate("/home-page");
        }, 1000);
      } else toast.error(result.data.message);
    } else {
      toast.error(result.response.data.message);
    }
  };

  return (
    <Layout>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Welcome to Task Scheduler
      </h3>
      <h6 style={{ textAlign: "center" }}>
        Streamline task distribution with intelligent scheduling
      </h6>
      <div className={styles.register}>
        <h1>Sign In</h1>
        <Form style={{ width: "30%" }} onSubmit={(e) => handleSubmit(e)}>
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>

            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </Form.Group>
          <div className={styles.login_bottom_btn}>
            <Button variant="primary" type="submit">
              Login
            </Button>
            {/* <Button
            variant="primary"
            onClick={() => navigate("/register")}
          >
            Sign up
            </Button> */}
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default Login;
