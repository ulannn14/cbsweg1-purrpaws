import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/adopter");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later");
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <img src="/images/logo.png" alt="PurrPaws Logo" />
        </div>

        <div className="login-box">
          <h2>LOG IN</h2>
          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className="login-input"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="login-input"
            />

            <button type="submit" className="login-btn">LOG IN</button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
