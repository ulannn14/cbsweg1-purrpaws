import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterApply() {
    const API = import.meta.env.VITE_API_URL;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const id = storedUser?.id;

    const [editing, setEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        buildingType: "",
        rent: "",
        movePet: "",
        liveWith: "",
        allergies: "",
        carePerson: "",
        financialPerson: "",
        emergencyCare: "",
        hoursAlone: "",
        introductionSteps: "",
        familySupport: "",
        familyExplain: "",
        otherPets: "",
        pastPets: "",
        housePhotos: "",
        interviewTime: ""
    });

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

            setPersonalInfo(userData);
            setProvinces(provincesData);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [API, id]);

    if (loading || !personalInfo) {
        return (
        <AppLayout>
            <div className="page-loading">
            <p>Loading adoption application...</p>
            </div>
        </AppLayout>
        );
    }

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handlePersonalChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Application submitted", formData);
    };

    return (

    <AppLayout>

    <main className="main">

    <section className="section apply-page">

    {/* PERSONAL INFO */}

    <h2 className="apply-title">Personal Information</h2>

    <div className="apply-box">

    <div className="personal-grid">

    <div className="info-row">
    <label>First Name</label>
    {editing ? (
    <input
        className="edit-input"
        name="firstName"
        value={personalInfo.firstName}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.firstName}</span>
    )}
    </div>

    <div className="info-row">
    <label>Last Name</label>
    {editing ? (
    <input
        className="edit-input"
        name="lastName"
        value={personalInfo.lastName}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.lastName}</span>
    )}
    </div>

    <div className="info-row">
    <label>Username</label>
    {editing ? (
    <input
        className="edit-input"
        name="userName"
        value={personalInfo.userName}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.userName}</span>
    )}
    </div>

    <div className="info-row">
    <label>Email</label>
    {editing ? (
    <input
        className="edit-input"
        name="email"
        value={personalInfo.email}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.email}</span>
    )}
    </div>

    <div className="info-row">
    <label>Birthdate</label>
    {editing ? (
    <input
        type="date"
        className="edit-input"
        name="birthdate"
        value={personalInfo.birthdate?.split("T")[0] || ""}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{new Date(personalInfo.birthdate).toLocaleDateString()}</span>
    )}
    </div>

    <div className="info-row">
    <label>City</label>
    {editing ? (
    <input
        className="edit-input"
        name="city"
        value={personalInfo.city}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.city}</span>
    )}
    </div>

    <div className="info-row">
    <label>Province</label>
    {editing ? (
        <select
        className="edit-input"
        name="provinceId"
        value={personalInfo.provinceId}
        onChange={handlePersonalChange}
        >
        {provinces.map((p) => (
            <option key={p.id} value={p.id}>
            {p.name}
            </option>
        ))}
        </select>
    ) : (
        <span>
        {provinces.find(p => p.id === personalInfo.provinceId)?.name}
        </span>
    )}
    </div>

    <div className="info-row">
    <label>Address</label>
    {editing ? (
    <input
        className="edit-input"
        name="address"
        value={personalInfo.address}
        onChange={handlePersonalChange}
    />
    ) : (
    <span>{personalInfo.address}</span>
    )}
    </div>

    </div>

    <div className="apply-box-actions">

    {!editing && (
    <button
        className="apply-btn"
        onClick={() => setEditing(true)}
    >
        Update
    </button>
    )}

    {editing && (
    <>
        <button
        className="save-btn"
        onClick={() => setEditing(false)}
        >
        Save
        </button>

        <button
        className="cancel-btn"
        onClick={() => setEditing(false)}
        >
        Cancel
        </button>
    </>
    )}

    </div>

    </div>

    {/* ADOPTION DETAILS */}

    <h2 className="apply-title">Adoption Details</h2>

    <form onSubmit={handleSubmit}>

    <div className="apply-box form-box">

    <div className="form-group">
    <label>What type of building do you live in?</label>
    <input className="edit-input" name="buildingType" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Do you rent?</label>
    <input className="edit-input" name="rent" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>What happens to your pet if or when you move?</label>
    <textarea name="movePet" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Who do you live with?</label>
    <input className="edit-input" name="liveWith" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Are any members of your household allergic to animals?</label>
    <input className="edit-input" name="allergies" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Who will be responsible for feeding, grooming, and generally caring for your pet?</label>
    <textarea name="carePerson" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Who will be financially responsible for your pet’s needs?</label>
    <textarea name="financialPerson" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Who will look after your pet if you go on vacation or emergency?</label>
    <textarea name="emergencyCare" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>How many hours in an average workday will your pet be left alone?</label>
    <input className="edit-input" name="hoursAlone" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>What steps will you take to introduce your new pet?</label>
    <textarea name="introductionSteps" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Does everyone in the family support your decision to adopt a pet?</label>
    <input className="edit-input" name="familySupport" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Please explain</label>
    <textarea name="familyExplain" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Do you have other pets?</label>
    <input className="edit-input" name="otherPets" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Have you had pets in the past?</label>
    <input className="edit-input" name="pastPets" onChange={handleChange}/>
    </div>

    <div className="form-group">
    <label>Attach photos of your home</label>

    <label className="file-upload">
        <input
        type="file"
        multiple
        onChange={(e) =>
            setFormData({
            ...formData,
            housePhotos: e.target.files
            })
        }
        />
        <span className="file-upload-btn">Choose Files</span>
    </label>

    <p className="file-upload-note">
        You may upload multiple photos.
    </p>
    </div>

    <div className="form-group">
    <label>Preferred date and time for Zoom interview</label>
    <input
        type="datetime-local"
        className="edit-input"
        name="interviewTime"
        onChange={handleChange}
    />
    </div>

    </div>

    {/* BUTTONS */}

    <div className="pet-apply">

    <button className="save-btn" type="submit">
    Submit
    </button>

    <button type="button" className="cancel-btn">
    Cancel
    </button>

    </div>

    </form>

    </section>

    </main>

    </AppLayout>

    );
}

export default AdopterApply;