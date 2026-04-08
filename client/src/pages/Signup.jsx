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
  const [successMessage, setSuccessMessage] = useState("");

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

  // ================= FETCH PROVINCES =================
  useEffect(() => {
    fetch(`${API}/api/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, [API]);

  // ================= HANDLE IMAGE PREVIEW =================
  useEffect(() => {
    if (!imageFile) {
      setPreview("/images/avatar-placeholder.png");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // ================= SUCCESS POPUP =================
  const showSuccessPopup = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  };

  // ================= VALIDATION =================
  const validateField = (name, value) => {
    let error = "";

    if (
      ["firstName", "lastName", "email", "phoneNumber", "userName", "password", "birthdate", "city", "provinceId", "address"].includes(name) &&
      !value.trim()
    ) {
      return "This field is required.";
    }

    if (name === "email" && value && !value.includes("@")) {
      error = "Invalid email format.";
    }

    if (name === "phoneNumber" && value && !/^09\d{9}$/.test(value)) {
      error = "Mobile must be 11 digits (PH format).";
    }

    if (name === "userName" && value && value.length < 4) {
      error = "Username must be at least 4 characters.";
    }

    if (name === "password" && value && value.length < 6) {
      error = "Password must be at least 6 characters.";
    }

    return error;
  };

  const validateImage = (file) => {
    if (!file) return "Profile picture is required.";
    return "";
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

  const isFormComplete =
    imageFile &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phoneNumber.trim() &&
    formData.userName.trim() &&
    formData.password.trim() &&
    formData.birthdate.trim() &&
    formData.city.trim() &&
    String(formData.provinceId).trim() &&
    formData.address.trim();

  const hasValidationErrors =
    Object.values(formData).some((value, index) => {
      const key = Object.keys(formData)[index];
      return validateField(key, value);
    }) || validateImage(imageFile);

  const isSubmitDisabled = loading || !isFormComplete || !!hasValidationErrors;

  // ================= FORM HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    setErrors((prev) => ({
      ...prev,
      imageFile: ""
    }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);

    setErrors((prev) => ({
      ...prev,
      imageFile: "Profile picture is required."
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });

    const imageError = validateImage(imageFile);
    if (imageError) {
      newErrors.imageFile = imageError;
      hasError = true;
    }

    if (formData.birthdate) {
      const age = calculateAge(formData.birthdate);
      if (age < 18) {
        newErrors.birthdate = "You must be at least 18 years old to register.";
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      alert("Please complete all required fields correctly before submitting.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

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

      localStorage.setItem("user", JSON.stringify(data));

      showSuccessPopup("Account created successfully!");

      setTimeout(() => {
        navigate("/adopter");
      }, 1800);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <main className="signup-page">
      {successMessage && (
        <div className="success-popup">
          <span className="success-popup-icon">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="back-btn-wrapper">
        <BackButton />
      </div>

      <div className="signup-logo-area">
        <img src="/images/logo.png" className="signup-logo" alt="PurrPaws logo" />
      </div>

      <div className="signup-container">
        <div className="signup-box">
          <h2>SIGN UP</h2>

          <form onSubmit={handleSubmit}>
            {/* IMAGE UPLOAD */}
            <div className="edit-upload-container signup-upload">
              <img
                src={imageFile ? preview : "/images/placeholder.jpg"}
                alt="Preview"
                className="edit-upload-preview"
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
                    onClick={handleRemoveImage}
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

              {errors.imageFile && (
                <p className="error-text">{errors.imageFile}</p>
              )}
            </div>

            {/* NAME */}
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

            {/* EMAIL */}
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

            {/* PHONE */}
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

            {/* USERNAME */}
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

            {/* PASSWORD */}
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

            {/* BIRTHDATE */}
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

            {/* LOCATION */}
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
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId && <p className="error-text">{errors.provinceId}</p>}
              </div>
            </div>

            {/* ADDRESS */}
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

            <button
              type="submit"
              className="signup-btn"
              disabled={isSubmitDisabled}
            >
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