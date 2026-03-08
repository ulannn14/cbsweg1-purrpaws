import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setLoginData({
        ...loginData,
        [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/adopter");
    };

    return (
        <main className="login-page">

        <div className="login-container">

            {/* LEFT LOGO */}
            <div className="logo-section">
                <img src="/images/logo.png" alt="PurrPaws Logo" />
            </div>

            {/* RIGHT LOGIN BOX */}
            <div className="login-box">

            <h2>LOG IN</h2>

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

                <button type="submit" className="login-btn">
                LOG IN
                </button>

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