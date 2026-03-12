import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function OrgProfile() {
    const API = import.meta.env.VITE_API_URL;
    const storedUser = JSON.parse(localStorage.getItem("user")); // logged-in org
    const navigate = useNavigate();
    const orgUser = JSON.parse(localStorage.getItem("org"));
    const id = orgUser?.id;

    const [editing, setEditing] = useState(false);
    const [orgInfo, setOrgInfo] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState("/images/org-avatar.png"); // default org avatar

    useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/organizations/${id}`)
        .then(res => res.json())
        .then(data => {
        setOrgInfo(data);
        setPreview(data.logo ? `${API}/images/${data.logo}` : "/images/org-avatar.png");
        setLoading(false);
        })
        .catch(err => {
        console.error(err);
        setLoading(false);
        });
    }, [API, id]);

    if (loading || !orgInfo) {
        return (
        <AppLayout>
            <div className="page-loading">
            <p>Loading organization profile...</p>
            </div>
        </AppLayout>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrgInfo({
        ...orgInfo,
        [name]: value
        });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        try {
        const {
            id, province, pets, ...payload
        } = orgInfo;

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
            else formData.append(key, value);
        });

        if (logoFile) formData.append("logo", logoFile);

        const res = await fetch(`${API}/api/organizations/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) throw new Error("Failed to update organization");

        const updated = await res.json();
        setOrgInfo(updated);
        setPreview(updated.logo ? `${API}/images/${updated.logo}` : "/images/org-avatar.png");
        setEditing(false);
        alert("Organization profile updated successfully!");
        } catch (err) {
        console.error(err);
        alert("Failed to save changes");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <AppLayout>
        <main className="main">
            <section className="section apply-page">

            {/* ORG LOGO */}
            <div className="pet-header">
                {editing ? (
                <div className="edit-upload-container">
                    <img src={preview} alt="org logo" className="edit-upload-preview" />
                    <label htmlFor="logo-upload" className="edit-upload-label">Change Logo</label>
                    <input
                    type="file"
                    id="logo-upload"
                    className="edit-upload-input"
                    onChange={handleLogoUpload}
                    />
                </div>
                ) : (
                <div className="pet-photo-large">
                    <img src={preview} alt={orgInfo.name} />
                </div>
                )}
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
                    {editing ? (
                    <input
                        type="password"
                        className="edit-input"
                        name="password"
                        value={orgInfo.password}
                        onChange={handleChange}
                    />
                    ) : (
                    <span>••••••••</span>
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
                    <label>Status</label>
                    {editing ? (
                    <select
                        className="edit-input"
                        name="status"
                        value={orgInfo.status}
                        onChange={handleChange}
                    >
                        <option value="CATS">Cats</option>
                        <option value="DOGS">Dogs</option>
                        <option value="BOTH">Both</option>
                    </select>
                    ) : (
                    <span>{orgInfo.status}</span>
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

export default OrgProfile;