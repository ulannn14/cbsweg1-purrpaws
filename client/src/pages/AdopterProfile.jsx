import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";

function AdopterProfile() {

  const API = import.meta.env.VITE_API_URL;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const id = storedUser?.id;

  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile
  useEffect(() => {

    if (!id) return;

    fetch(`${API}/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setOriginalUser(data);
      })
      .catch(err => console.error(err));

  }, [API, id]);

  if (loading) return (
    <AppLayout>
      <div className="page-loading">
        <p>Loading profile...</p>
      </div>
    </AppLayout>
  );

  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: value
    }));

  };

  // Save profile
  const handleSave = async () => {

    try {

      const res = await fetch(`${API}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      localStorage.setItem("user", JSON.stringify(updated));

      setUser(updated);
      setOriginalUser(updated);
      setEditing(false);

    } catch (err) {
      console.error(err);
    }

  };

  // Cancel editing
  const handleCancel = () => {
    setUser(originalUser);
    setEditing(false);
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="main">Loading profile...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <main className="main">

        <section className="section profile-section">

          <div className="profile-box">

            {/* ACTION BUTTONS */}

            {!editing ? (

              <button
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                EDIT
              </button>

            ) : (

              <div className="profile-actions">

                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  CANCEL
                </button>

                <button
                  className="save-btn"
                  onClick={handleSave}
                >
                  SAVE
                </button>

              </div>

            )}

            {/* PROFILE INFO */}

            <div className="profile-grid">

              <h2 className="profile-section-title">Account Details</h2>

              <label>Email</label>
              {editing ? (
                <input
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.email}</div>
              )}

              <label>Username</label>
              {editing ? (
                <input
                  name="userName"
                  value={user.userName || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.userName}</div>
              )}

              <h2 className="profile-section-title">Personal Information</h2>

              <label>First Name</label>
              {editing ? (
                <input
                  name="firstName"
                  value={user.firstName || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.firstName}</div>
              )}

              <label>Last Name</label>
              {editing ? (
                <input
                  name="lastName"
                  value={user.lastName || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.lastName}</div>
              )}

              <label>Birthdate</label>
              {editing ? (
                <input
                  type="date"
                  name="birthdate"
                  value={user.birthdate?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">
                  {new Date(user.birthdate).toLocaleDateString()}
                </div>
              )}

              <label>City</label>
              {editing ? (
                <input
                  name="city"
                  value={user.city || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.city}</div>
              )}

              <label>Address</label>
              {editing ? (
                <input
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{user.address}</div>
              )}

            </div>

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterProfile;