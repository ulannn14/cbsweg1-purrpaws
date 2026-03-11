import { useState, useEffect } from "react";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgProfile() {

  const API = import.meta.env.VITE_API_URL;

  const orgUser = JSON.parse(localStorage.getItem("org"));
  const id = orgUser?.id;

  const [org, setOrg] = useState(null);
  const [originalOrg, setOriginalOrg] = useState(null);
  const [editing, setEditing] = useState(false);

  // Fetch organization profile
  useEffect(() => {

    if (!id) return;

    fetch(`${API}/api/organizations/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrg(data);
        setOriginalOrg(data);
      })
      .catch(err => console.error(err));

  }, [API, id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setOrg(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile
  const handleSave = async () => {

    try {

      const res = await fetch(`${API}/api/organizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(org)
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      setOrg(updated);
      setOriginalOrg(updated);
      setEditing(false);

    } catch (err) {
      console.error(err);
    }

  };

  // Cancel editing
  const handleCancel = () => {
    setOrg(originalOrg);
    setEditing(false);
  };

  if (!org) {
    return (
      <OrgAppLayout>
        <div className="org-main">Loading profile...</div>
      </OrgAppLayout>
    );
  }

  return (
    <OrgAppLayout>

      <main className="org-main">

        <section className="org-profile-section">

          <div className="org-profile-box">

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

            {/* PROFILE IMAGE (placeholder only for now) */}

            <div className="org-profile-image">

              <div className="org-avatar">

                <img
                  src="/images/org-placeholder.png"
                  alt="Organization Logo"
                />

              </div>

            </div>

            {/* PROFILE INFO */}

            <div className="profile-grid">

              <h2 className="profile-section-title">Account Details</h2>

              <label>Email</label>
              {editing ? (
                <input
                  name="email"
                  value={org.email || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.email}</div>
              )}

              <h2 className="profile-section-title">Organization Details</h2>

              <label>Organization Name</label>
              {editing ? (
                <input
                  name="name"
                  value={org.name || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.name}</div>
              )}

              <label>Date Established</label>
              {editing ? (
                <input
                  name="yearEstablished"
                  value={org.yearEstablished || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.yearEstablished}</div>
              )}

              <label>City</label>
              {editing ? (
                <input
                  name="city"
                  value={org.city || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.city}</div>
              )}

              <label>Address</label>
              {editing ? (
                <input
                  name="address"
                  value={org.address || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.address}</div>
              )}

              <h2 className="profile-section-title">Contact Person</h2>

              <label>Contact Name</label>
              {editing ? (
                <input
                  name="contactPerson"
                  value={org.contactPerson || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.contactPerson}</div>
              )}

              <label>Contact Role</label>
              {editing ? (
                <input
                  name="contactPersonRole"
                  value={org.contactPersonRole || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.contactPersonRole}</div>
              )}

              <label>Contact Number</label>
              {editing ? (
                <input
                  name="contactNumber"
                  value={org.contactNumber || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field">{org.contactNumber}</div>
              )}

            </div>

          </div>

        </section>

      </main>

    </OrgAppLayout>
  );
}

export default OrgProfile;