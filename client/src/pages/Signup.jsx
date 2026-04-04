import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function SignUpPage() {

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("/images/avatar-placeholder.png");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userName: "",
    password: "",
    birthdate: "",
    city: "",
    provinceId: "",
    address: ""
  });

  useEffect(() => {
    fetch(`${API}/api/provinces`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.includes("@")) {
        error = "Invalid email format.";
      }
    }

    if (name === "phoneNumber") {
      if (!/^09\d{9}$/.test(value)) {
        error = "Mobile must be 11 digits (PH format).";
      }
    }

    if (name === "userName") {
      if (value.length < 4) {
        error = "Username must be at least 4 characters.";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters.";
      }
    }

    if (name === "firstName" || name === "lastName" || name === "city" || name === "provinceId" || name === "birthdate" || name === "address") {
      if (!value.trim()) {
        error = "This field is required.";
      }
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ age validation
    const age = calculateAge(formData.birthdate);
    if (age < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    // ✅ basic front-end validation (optional but recommended)
    let hasError = false;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use FormData instead of JSON
      const form = new FormData();

      // append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      // ✅ append image if selected
      if (imageFile) {
        form.append("userImage", imageFile);
      }

      const res = await fetch(`${API}/api/users/signup`, {
        method: "POST",
        body: form
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      console.log("Submitted:", formData);

      navigate("/adopter");

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">

      <div className="back-btn-wrapper">
        <BackButton />
      </div>

      <div className="signup-logo-area">
        <img src="/images/logo.png" className="signup-logo" />
      </div>

      <div className="signup-container">

        <div className="signup-box">

          <h2>SIGN UP</h2>

          <form onSubmit={handleSubmit}>

            <div className="edit-upload-container signup-upload">
              <img
                src={preview}
                alt="Preview"
                className="edit-upload-preview"
                onError={(e) => {
                  e.target.src = "/images/avatar-placeholder.png";
                }}
              />

              <input
                type="file"
                id="signup-photo"
                accept="image/*"
                onChange={handleImageUpload}
                className="edit-upload-input"
              />

              <div className="upload-buttons">
                <label htmlFor="signup-photo" className="edit-upload-label">
                  Choose Photo
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreview("/images/avatar-placeholder.png");
                    }}
                    className="edit-upload-label remove-btn"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {imageFile && (
                <div className="edit-upload-filename">
                  {imageFile.name}
                </div>
              )}
            </div>

            <div className="signup-row">

              <div style={{ flex: 1 }}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`signup-input ${errors.firstName ? "error" : ""}`}
                />
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>

              <div style={{ flex: 1 }}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`signup-input ${errors.lastName ? "error" : ""}`}
                />
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>

            </div>

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.email ? "error" : ""}`}
            />

            {errors.email && <p className="error-text">{errors.email}</p>}

            <label>Mobile Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.phoneNumber ? "error" : ""}`}
            />

            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}

            <label>Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.userName ? "error" : ""}`}
            />

            {errors.userName && <p className="error-text">{errors.userName}</p>}

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.password ? "error" : ""}`}
            />

            {errors.password && <p className="error-text">{errors.password}</p>}

            <label>Date of Birth</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.birthdate ? "error" : ""}`}
            />

            {errors.birthdate && <p className="error-text">{errors.birthdate}</p>}

            <div className="signup-row">

              <div style={{ flex: 1 }}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`signup-input ${errors.city ? "error" : ""}`}
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>

              <div style={{ flex: 1 }}>
                <label>Province</label>
                <select
                  name="provinceId"
                  value={formData.provinceId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`signup-input ${errors.provinceId ? "error" : ""}`}
                >
                  <option value="">Select a province</option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId && <p className="error-text">{errors.provinceId}</p>}
              </div>

            </div>

            <label>General Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`signup-input ${errors.address ? "error" : ""}`}
            />

            {errors.address && <p className="error-text">{errors.address}</p>}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : "CREATE ACCOUNT"}
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