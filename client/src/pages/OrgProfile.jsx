import { useState, useEffect } from "react";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgProfile() {

  const API = import.meta.env.VITE_API_URL;

  const [editing, setEditing] = useState(false);

  const [org, setOrg] = useState({
    email: "organization@email.com",
    password: "********",
    name: "Organization Name",
    birthdate: "January 1, 2000",
    address: "Santa Ana, Manila",
    city: "Manila",
    province: "NCR",
    contactName: "John Doe",
    contactPosition: "Founder",
    contactNumber: "09123456789",
    image: ""
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Fetch organization profile
  useEffect(() => {
    fetch(`${API}/api/organization`)
      .then(res => res.json())
      .then(data => setOrg(data))
      .catch(err => console.error(err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setOrg(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    setOrg(prev => ({
      ...prev,
      image: file
    }));
  };

  // Save profile
  const handleSave = async () => {

    const formData = new FormData();

    Object.keys(org).forEach(key => {
      formData.append(key, org[key]);
    });

    try {

      const res = await fetch(`${API}/api/organization`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) throw new Error("Update failed");

      setEditing(false);

    } catch (err) {
      console.error(err);
    }

  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);
    setPreviewImage(null);
  };

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

            {/* PROFILE IMAGE */}

            <div className="org-profile-image">

              <div className="org-avatar">

                <img
                  src={
                    previewImage
                      ? previewImage
                      : org.image
                      ? `${API}/images/${org.image}`
                      : "/images/org-placeholder.png"
                  }
                  alt="Organization Logo"
                />

              </div>

              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              )}

            </div>

            {/* PROFILE INFO */}

            <div className="profile-grid">

              <h2 className="profile-section-title">Account Details</h2>
              
              <label>Email</label>
              {editing ? (
                <input name="email" value={org.email} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.email}</div>
              )}

              <label>Password</label>
              {editing ? (
                <input name="password" value={org.password} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.password}</div>
              )}

              <h2 className="profile-section-title">Organization Details</h2>
              <label>Organization Name</label>
              {editing ? (
                <input name="name" value={org.name} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.name}</div>
              )}

              <label>Date Established</label>
              {editing ? (
                <input name="birthdate" value={org.birthdate} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.birthdate}</div>
              )}

              <label>City</label>
              {editing ? (
                <input name="city" value={org.city} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.city}</div>
              )}

              <label>Province</label>
              {editing ? (
                <input name="province" value={org.province} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.province}</div>
              )}

              <label>Address</label>
              {editing ? (
                <input name="address" value={org.address} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.address}</div>
              )}

              {/* CONTACT PERSON */}

              <h2 className="profile-section-title">Contact Person Details</h2>
              <label>Contact Name</label>
              {editing ? (
                <input name="contactName" value={org.contactName} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.contactName}</div>
              )}

              <label>Contact Position</label>
              {editing ? (
                <input name="contactPosition" value={org.contactPosition} onChange={handleChange} className="profile-input"/>
              ) : (
                <div className="profile-field">{org.contactPosition}</div>
              )}

              <label>Contact Number</label>
              {editing ? (
                <input name="contactNumber" value={org.contactNumber} onChange={handleChange} className="profile-input"/>
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