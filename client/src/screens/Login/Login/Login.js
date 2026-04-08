import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import Loader from "../../../components/loader/Loader";
import { loginFunction } from "../../../serviceApi/registerApi";
import styles from "../../../styles/TaskScheduler.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const result = await loginFunction({
      email,
      password,
    });

    if (result?.status === 200 && result?.data?.status) {
      if (result?.data?.user?.role !== 1) {
        sessionStorage.clear();
        toast.error("Admin access required for this scheduler");
        setLoader(false);
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      toast.success(result.data.message);

      setTimeout(() => {
        navigate("/home-page");
      }, 800);
    } else {
      toast.error(result?.data?.message || "Unable to sign in");
    }

    setLoader(false);
  };

  return (
    <Layout>
      <section className={styles.formShell}>
        <div className={styles.formCard}>
          <p className={styles.eyebrow}>Scheduler Console</p>
          <h1 className={styles.formTitle}>Admin Sign In</h1>
          <p className={styles.formSubtitle}>
            Use the admin account configured in backend to
            upload spreadsheets and monitor background processing.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter admin email"
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

            <div className={styles.loginActions}>
              <Button variant="success" type="submit" disabled={loader}>
                {loader ? "Signing In..." : "Sign In"}
              </Button>
            </div>

            {loader ? (
              <div style={{ marginTop: "20px" }}>
                <Loader />
              </div>
            ) : (
              <p className={styles.helperText}>
                admin@example.com / password123 (configured admin credentials)
              </p>
            )}
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
