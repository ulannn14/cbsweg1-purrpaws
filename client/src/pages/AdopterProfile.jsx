import { useState } from "react";
import AppLayout from "../components/AppLayout";

function AdopterProfile() {

  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState({
    email: "leigh@email.com",
    username: "leighalbo",
    password: "********",
    name: "Leigh Albo",
    contactNumber: "09123456789",
    birthdate: "April 15, 2003",
    address: "Santa Ana, Manila"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // later connect to backend
    console.log("Saving user:", user);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

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

            <div className="profile-grid">

              {/* ACCOUNT */}

              <h2 className="profile-section-title">Account Details</h2>

              <label>Email</label>
              {editing ? (
                <input name="email" value={user.email} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.email}</div>
              )}

              <label>Username</label>
              {editing ? (
                <input name="username" value={user.username} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.username}</div>
              )}

              <label>Password</label>
              {editing ? (
                <input name="password" value={user.password} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.password}</div>
              )}

              {/* PERSONAL */}

              <h2 className="profile-section-title">Personal Information</h2>

              <label>Name</label>
              {editing ? (
                <input name="name" value={user.name} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.name}</div>
              )}

              <label>Contact Number</label>
              {editing ? (
                <input name="contactNumber" value={user.contactNumber} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.contactNumber}</div>
              )}

              <label>Birthdate</label>
              {editing ? (
                <input name="birthdate" value={user.birthdate} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{user.birthdate}</div>
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