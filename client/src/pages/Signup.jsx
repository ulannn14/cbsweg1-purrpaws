import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "Leigh",
    lastName: "Albo",
    email: "leigh@email.com",
    mobile: "09123456789",
    username: "leighalbo",
    password: "********",
    birthdate: "2003-04-15",
    city: "Manila",
    province: "Metro Manila",
    address: "2401 Taft Ave., Malate"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const age = calculateAge(formData.birthdate);
    if (age < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    console.log(formData);
    navigate("/adopter");
  };

  return (
    <main className="signup-page">

      <div className="signup-logo-area">
        <img src="/images/logo.png" className="signup-logo" />
      </div>

      <div className="signup-container">

        <div className="signup-box">

          <h2>SIGN UP</h2>

          <form onSubmit={handleSubmit}>

            <div className="signup-row">

              <div style={{ flex: 1 }}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="signup-input"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="signup-input"
                />
              </div>

            </div>

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="signup-input"
            />

            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="signup-input"
            />

            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="signup-input"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="signup-input"
            />

            <label>Date of Birth</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="signup-input"
            />

            <div className="signup-row">

              <div style={{ flex: 1 }}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="signup-input"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label>Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="signup-input"
                />
              </div>

            </div>

            <label>General Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="signup-input"
            />

            <button type="submit" className="signup-btn">
              CREATE ACCOUNT
            </button>

          </form>

          <p className="signup-text">
            Already have an account? <a href="/">Log in</a>
          </p>

          <div className="org-invite">

            <p>
              Are you an <strong>animal welfare organization</strong> interested in
              partnering with us?
            </p>

            <p>
              You can apply to register your organization by filling out our
              registration form.
            </p>

            <a
              href="https://forms.gle/fcwdAFCBUVLbXaBG8"
              target="_blank"
              rel="noopener noreferrer"
              className="org-btn"
            >
              Register Your Organization
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}

export default SignUpPage;