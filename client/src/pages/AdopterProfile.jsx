import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";

function AdopterProfile() {
  const API = import.meta.env.VITE_API_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const id = storedUser?.id;

  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("/images/avatar-placeholder.png"); // new default avatar

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [userRes, provincesRes] = await Promise.all([
          fetch(`${API}/api/users/${id}`),
          fetch(`${API}/api/provinces`)
        ]);

        const userData = await userRes.json();
        const provincesData = await provincesRes.json();

        setUserInfo(userData);
        setProvinces(provincesData);
        setPreview(userData.photo ? `${API}/images/${userData.photo}` : "/images/avatar-placeholder.png");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API, id]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {

    try {

      const res = await fetch(`${API}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      localStorage.setItem("user", JSON.stringify(updated));

      setUser(updated);
      setOriginalUser(updated);
      setEditing(false);
      alert("Profile saved");

    } catch (err) {
      console.error(err);
    }

  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading || !userInfo) return (
    <AppLayout>
      <div className="page-loading">
        <p>Loading profile...</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <main className="main">
        <section className="section apply-page">

          {/* PROFILE PHOTO */}
          <div className="pet-header">
            <div className="edit-upload-container">
              <img 
                src={storedUser?.userImage || `/temp-photos/users/user-profile-${storedUser?.id}.jpg`}
                alt="Profile"
                className="edit-upload-preview"
              />
              {/*editing && (
                <>
                  <label htmlFor="image-upload" className="edit-upload-label">Change Photo</label>
                  <input type="file" id="image-upload" className="edit-upload-input" onChange={handleImageUpload} />
                </>
              )*/}
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <h2 className="apply-title">Account Details</h2>
          <div className="apply-box">
            <div className="personal-grid">
              <div className="info-row">
                <label>Email</label>
                {editing ? (
                  <input className="edit-input" name="email" value={userInfo.email} onChange={handleChange} />
                ) : <span>{userInfo.email}</span>}
              </div>
              <div className="info-row">
                <label>Username</label>
                {editing ? (
                  <input className="edit-input" name="userName" value={userInfo.userName} onChange={handleChange} />
                ) : <span>{userInfo.userName}</span>}
              </div>
              <div className="info-row">
                <label>Password</label>
                {editing ? (
                  <input type="password" className="edit-input" name="password" value={userInfo.password} onChange={handleChange} />
                ) : <span>********</span>}
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <h2 className="apply-title">Personal Information</h2>
          <div className="apply-box">
            <div className="personal-grid">
              <div className="info-row">
                <label>First Name</label>
                {editing ? (
                  <input className="edit-input" name="firstName" value={userInfo.firstName} onChange={handleChange} />
                ) : <span>{userInfo.firstName}</span>}
              </div>
              <div className="info-row">
                <label>Last Name</label>
                {editing ? (
                  <input className="edit-input" name="lastName" value={userInfo.lastName} onChange={handleChange} />
                ) : <span>{userInfo.lastName}</span>}
              </div>
              <div className="info-row">
                <label>Birthdate</label>
                {editing ? (
                  <input type="date" className="edit-input" name="birthdate" value={userInfo.birthdate?.split("T")[0] || ""} onChange={handleChange} />
                ) : <span>{new Date(userInfo.birthdate).toLocaleDateString()}</span>}
              </div>
              <div className="info-row">
                <label>City</label>
                {editing ? (
                  <input className="edit-input" name="city" value={userInfo.city} onChange={handleChange} />
                ) : <span>{userInfo.city}</span>}
              </div>
              <div className="info-row">
                <label>Province</label>
                {editing ? (
                  <select className="edit-input" name="provinceId" value={userInfo.provinceId} onChange={handleChange}>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                ) : (
                  <span>{provinces.find(p => p.id === userInfo.provinceId)?.name}</span>
                )}
              </div>
              <div className="info-row">
                <label>Address</label>
                {editing ? (
                  <input className="edit-input" name="address" value={userInfo.address} onChange={handleChange} />
                ) : <span>{userInfo.address}</span>}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="apply-box-actions">
            {!editing && (
              <>
                <button className="save-btn" onClick={() => setEditing(true)}>Update</button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
            {editing && (
              <>
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              </>
            )}
          </div>

        </section>
      </main>
    </AppLayout>
  );
}

export default AdopterProfile;