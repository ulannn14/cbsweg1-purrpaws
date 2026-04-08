import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgProfile() {
    const API = import.meta.env.VITE_API_URL;
    const storedUser = JSON.parse(localStorage.getItem("org")); // logged-in org
    const navigate = useNavigate();
    const id = storedUser?.id;

    const [editing, setEditing] = useState(false);
    const [orgInfo, setOrgInfo] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState("/images/org-avatar.png"); // default org avatar
    const [removeImage, setRemoveImage] = useState(false);

    const [changingPassword, setChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/organizations/${id}`)
        .then(res => res.json())
        .then(data => {
        setOrgInfo(data);

        setPreview(
            data.organizationImage || "/images/org-avatar.png"
        );

        setLoading(false);
        })
        .catch(err => {
        console.error(err);
        setLoading(false);
        });
    }, [API, id]);

    if (loading || !orgInfo) {
        return (
        <OrgAppLayout>
            <div className="page-loading">
            <p>Loading organization profile...</p>
            </div>
        </OrgAppLayout>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrgInfo({
        ...orgInfo,
        [name]: value
        });
    };

    const STATUS_LABELS = {
        CATS: "Cats",
        DOGS: "Dogs",
        BOTH: "Cats and Dogs"
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);

        if (value.length > 0 && value.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError("");
        }
    };

    const showSuccessPopup = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
        setSuccessMessage("");
    }, 2500);
    };

    const handleSave = async () => {
    if (isSaving) return;

    try {
        setIsSaving(true);

        const form = new FormData();

        // append fields
        Object.entries(orgInfo).forEach(([key, value]) => {
        form.append(key, value);
        });

        // upload image
        if (logoFile) {
        form.append("organizationImage", logoFile); // FIXED
        }

        // remove image
        if (removeImage) {
        form.append("removeImage", "true");
        }

        const res = await fetch(`${API}/api/organizations/${id}`, {
        method: "PUT",
        body: form
        });

        if (!res.ok) throw new Error("Update failed");

        const updated = await res.json();

        setOrgInfo(updated);
        setEditing(false);
        setLogoFile(null);
        setRemoveImage(false);

        // FIXED preview
        setPreview(
        updated.organizationImage || "/images/org-avatar.png"
        );

        showSuccessPopup("Profile updated successfully!");

    } catch (err) {
        console.error(err);
        alert("Failed to update profile");
    } finally {
        setIsSaving(false);
    }
    };

    const handleLogout = () => {
        localStorage.removeItem("org");
        navigate("/");
    };

    return (
        <OrgAppLayout>
            
        <main className="main">
            <section className="section apply-page">

            {successMessage && (
            <div className="success-popup">
                <span className="success-popup-icon">✓</span>
                <span>{successMessage}</span>
            </div>
            )}

            {/* ORG LOGO */}
            <div className="pet-header">

                {/* PROFILE PHOTO */}
                <div className="pet-header">
                    <div className="edit-upload-container">
                    <img 
                        src={preview}
                        alt="Profile"
                        className="edit-upload-preview"
                        onError={(e) => {
                            e.target.src = "/images/org-avatar.png";
                        }}
                    />
                    {editing && (
                    <div className="upload-buttons">
                        <input
                        type="file"
                        id="image-upload"
                        className="edit-upload-input"
                        accept="image/*"
                        onChange={(e) => {
                            handleLogoUpload(e);
                            setRemoveImage(false); // uploading = not removing
                        }}
                        />

                        <label htmlFor="image-upload" className="edit-upload-label">
                        Change Photo
                        </label>

                        <button
                        type="button"
                        className="edit-upload-label remove-btn"
                        onClick={() => {
                            setLogoFile(null);
                            setRemoveImage(true);
                            setPreview("/images/org-avatar.png"); // FIXED
                        }}
                        >
                        Remove Photo
                        </button>
                    </div>
                    )}
                    </div>
                </div>
                
            </div>

            {/* ACCOUNT DETAILS */}
            <h2 className="apply-title">Account Details</h2>
            <div className="apply-box">
                <div className="personal-grid">
                    <div className="info-row">
                        <label>Email</label>
                        {editing ? (
                        <input
                            className="edit-input"
                            name="email"
                            value={orgInfo.email}
                            onChange={handleChange}
                        />
                        ) : (
                        <span>{orgInfo.email}</span>
                        )}
                    </div>
                    <div className="info-row">
                    <label>Password</label>

                    {!editing && <span>********</span>}

                    {editing && !changingPassword && (
                        <div>
                        <span>********</span>
                        <button
                            className="change-password-btn"
                            onClick={() => setChangingPassword(true)}
                        >
                            Change Password
                        </button>
                        </div>
                    )}

                    {editing && changingPassword && (
                        <div className="password-change-box">
                        <input
                            type="password"
                            className="edit-input"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                        
                        {passwordError && (
                            <p className="error-text">{passwordError}</p>
                        )}
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* ORGANIZATION INFORMATION */}
            <h2 className="apply-title">Organization Information</h2>
            <div className="apply-box">
                <div className="personal-grid">
                <div className="info-row">
                    <label>Name</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="name"
                        value={orgInfo.name}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.name}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Contact Person</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="contactPerson"
                        value={orgInfo.contactPerson || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.contactPerson || "N/A"}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Contact Role</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="contactPersonRole"
                        value={orgInfo.contactPersonRole || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.contactPersonRole || "N/A"}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Contact Number</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="contactNumber"
                        value={orgInfo.contactNumber}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.contactNumber}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Organization Type</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="organizationType"
                        value={orgInfo.organizationType}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.organizationType}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Year Established</label>
                    {editing ? (
                    <input
                        type="date"
                        className="edit-input"
                        name="yearEstablished"
                        value={orgInfo.yearEstablished?.split("T")[0] || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{new Date(orgInfo.yearEstablished).getFullYear()}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Registration #</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="registrationNumber"
                        value={orgInfo.registrationNumber || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.registrationNumber || "N/A"}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Website</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="website"
                        value={orgInfo.website || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.website || "N/A"}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Social Media Links</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="socialMediaLinks"
                        value={orgInfo.socialMediaLinks?.join(", ") || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.socialMediaLinks?.join(", ") || "N/A"}</span>
                    )}
                </div>
                </div>
            </div>

            {/* LOCATION */}
            <h2 className="apply-title">Location</h2>
            <div className="apply-box">
                <div className="personal-grid">
                <div className="info-row">
                    <label>City</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="city"
                        value={orgInfo.city}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.city}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Province</label>
                    {editing ? (
                    <select
                        className="edit-input"
                        name="provinceId"
                        value={orgInfo.provinceId}
                        onChange={handleChange}
                    >
                        {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    ) : (
                    <span>{provinces.find(p => p.id === orgInfo.provinceId)?.name}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Address</label>
                    {editing ? (
                    <input
                        className="edit-input"
                        name="address"
                        value={orgInfo.address}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.address}</span>
                    )}
                </div>
                </div>
            </div>

            {/* ADDITIONAL INFO */}
            <h2 className="apply-title">Additional Info</h2>
            <div className="apply-box">
                <div className="personal-grid">
                <div className="info-row">
                    <label>Number of Animals</label>
                    {editing ? (
                    <input
                        type="number"
                        className="edit-input"
                        name="numberOfAnimals"
                        value={orgInfo.numberOfAnimals || 0}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.numberOfAnimals}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Foster Pets</label>
                    {editing ? (
                    <select
                    className="edit-input"
                    name="status"
                    value={orgInfo.status}
                    onChange={handleChange}
                    >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                        {label}
                        </option>
                    ))}
                    </select>
                    ) : (
                    <span>{STATUS_LABELS[orgInfo.status] || "Unknown"}</span>
                    )}
                </div>

                <div className="info-row">
                    <label>Description</label>
                    {editing ? (
                    <textarea
                        className="edit-input"
                        name="description"
                        value={orgInfo.description || ""}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>{orgInfo.description || "N/A"}</span>
                    )}
                </div>
                </div>
            </div>
            
            {/* CAMPAIGN BUTTON */}
            <button
                className="campaign-btn"
                onClick={() =>
                    window.open(
                    "https://forms.gle/6hSpVStRLjUQxpjQ8",
                    "_blank",
                    "noopener,noreferrer"
                    )
                }
                >
                Apply for Campaign
            </button>

            {/* ACTION BUTTONS */}
            <div className="apply-box-actions">
                {!editing && (
                <>
                    <button className="update-btn" onClick={() => setEditing(true)}>Update</button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
                )}
                {editing && (
                <>
                    <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                    >
                    {isSaving ? (
                        <>
                        <span className="btn-spinner"></span>
                        <span style={{ marginLeft: "8px" }}>Saving...</span>
                        </>
                    ) : (
                        "Save"
                    )}
                    </button>
                </>
                )}
            </div>

            </section>
        </main>
        </OrgAppLayout>
    );
}

export default OrgProfile;