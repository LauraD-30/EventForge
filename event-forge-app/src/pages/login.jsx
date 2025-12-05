import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import pilateImage from "../assets/pilateImage.jpg";
import "../styling/Login.css";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // USE BACKEND VIA PROXY: /api/auth/login
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let errorMessage = "Login failed";
        try {
          const err = await res.json();
          errorMessage = err.error || errorMessage;
        } catch {
           errorMessage = "Login failed. Please check your credentials and try again.";
        }
        throw new Error(errorMessage);
      }

      const response = await res.json();
      if (response?.data) {
        const userData = response.data;
        localStorage.setItem("token", userData.token);
        setUser(userData);

        // Normalize role (backend returns uppercase)
        const role = (userData.role || "").toUpperCase();

        // Redirect based on role
        switch (role) {
          case "ORGANIZER":
            navigate("/organizer-dashboard");
            break;
          case "GUEST":
          default:
            navigate("/guest-dashboard");
            break;
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const myStyle = {
    backgroundImage: `url(${pilateImage})`,
    minHeight: "80vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="login-background" style={myStyle}>
      <div
        className="login-box"
        style={{
          maxWidth: 480,
          margin: "48px auto",
          padding: 24,
          border: "1px solid #e6e6e6",
          borderRadius: 8,
        }}
      >
        <div className="header">
          <h1>Welcome to EventForge!</h1>
          <h2>Your gateway to unforgettable events.</h2>
        </div>

        <div className="login-form-box">
          <form
            className="login-form"
            onSubmit={handleSubmit}
            aria-label="login form"
          >
            <div className="email-input" style={{ marginBottom: 12 }}>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: 14, marginBottom: 6 }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="password-input" style={{ marginBottom: 12 }}>
              <label
                htmlFor="password"
                style={{ display: "block", fontSize: 14, marginBottom: 6 }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              className="remember-me-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  name="remember"
                  style={{ marginRight: 8 }}
                />
                Remember me
              </label>
              <a className="forgot-button" href="/forgot" style={{ fontSize: 13 }}>
                Forgot login?
              </a>
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0366d6",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </form>
        </div>

        <div
          className="bottom-div"
          style={{
            alignItems: "center",
            marginTop: 14,
            fontSize: 14,
          }}
        >
          <h2 style={{ color: "black" }}>Or</h2>

          <div className="login-social">
            <button>Sign in with Apple</button>
            <button>Sign in with Google</button>
            <button>Sign in with Facebook</button>
          </div>

          <h1 style={{ color: "black" }}>
            ----------------------------------------------
          </h1>

          <div className="register-here">
            <p style={{ color: "black" }}>Don't Have an Account?</p>
            <button
              id="login_registerHereBTN"
              onClick={handleRegisterClick}
              style={{
                color: "#0366d6",
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Register Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
