import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = ({ onLogin, onClose }) => {
  const navigate = useNavigate(); // Inside Login component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const location = useLocation();

  const handleClose = () => {
    if (onClose) {
      onClose(); // For Modal use (controlled by App.jsx)
    } else {
      navigate("/"); // For route /login, fallback to homepage
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!email || !password) {
      setErrorMsg("Email and Password are required");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8090/api/user/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Login response data:", data);

        const token = data.token;
        const username = data.user;
        const userId = data.user_id;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);

        setErrorMsg("");
        onLogin && onLogin(username);
        navigate("/");
        onClose && onClose();
      } else {
        const err = await response.text();
        setErrorMsg(err || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={{ marginBottom: "15px" }}>Login</h2>
          {errorMsg && <p style={styles.error}>{errorMsg}</p>}

          <label htmlFor="email">Email:</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <label htmlFor="password">Password:</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="/forgot-password" style={styles.forgotPassword}>
            Forgot Password?
          </a>

          <button type="submit" style={styles.loginBtn}>
            Login
          </button>

          <p style={styles.createAccount}>
            Don't have an account?{" "}
            <Link to="/register">Create your account</Link>
          </p>

          <button
            type="button"
            onClick={handleClose}
            style={styles.closeBtn}
            aria-label="Close login modal"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontFamily: "inherit",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    width: 350,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 10,
    margin: "6px 0 15px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontFamily: "inherit",
  },
  loginBtn: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    marginBottom: 10,
    fontFamily: "inherit",
  },
  closeBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007bff",
    textDecoration: "none",
    marginBottom: 15,
    display: "inline-block",
  },
  createAccount: {
    fontSize: 14,
    marginTop: 10,
  },
};

export default Login;
