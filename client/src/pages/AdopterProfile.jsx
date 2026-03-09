import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";

function AdopterProfile() {

  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from backend
  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    fetch(`http://localhost:5000/users/${storedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error(err));

  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSave = async () => {

    try {

      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const updatedUser = await res.json();

      // update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);
      setEditing(false);

    } catch (err) {
      console.error(err);
    }

  };

  const handleCancel = () => {
    setEditing(false);
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <AppLayout>

      <main className="main">

        <section className="section profile-section">

          <div className="profile-box">

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

            <div className="profile-grid">

              <h2 className="profile-section-title">Account Details</h2>

              <label>Email</label>
              {editing ? (
                <input name="email" value={user.email} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.email}</div>
              )}

              <label>Username</label>
              {editing ? (
                <input name="userName" value={user.userName} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.userName}</div>
              )}

              <h2 className="profile-section-title">Personal Information</h2>

              <label>First Name</label>
              {editing ? (
                <input name="firstName" value={user.firstName} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.firstName}</div>
              )}

              <label>Last Name</label>
              {editing ? (
                <input name="lastName" value={user.lastName} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.lastName}</div>
              )}

              <label>Birthdate</label>
              {editing ? (
                <input
                  type="date"
                  name="birthdate"
                  value={user.birthdate?.split("T")[0]}
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
                <input name="city" value={user.city} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.city}</div>
              )}

              <label>Address</label>
              {editing ? (
                <input name="address" value={user.address} onChange={handleChange} className="profile-input"/>
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