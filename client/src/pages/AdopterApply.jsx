import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function AdopterApply() {
    const API = import.meta.env.VITE_API_URL;
    const { id } = useParams();   // petId
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    const [editing, setEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        residenceType: "",
        occupation: "",
        validId: [],

        reasonAdopt: "",
        experience: "",
        preparationSteps: "",
        vetClinic: "",
        petDiet: "",
        otherPetsList: "",

        consent: "",
        consentProof: [],
        consentUnderstanding: false,
        housePhotos: [],

        petsNeutered: "",
        planNeuter: "",

        agreeUpdates: false,
        agreeEmergency: false,
        shareSocial: "",

        interviewTime: ""
    });

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
        try {
            const [userRes, provincesRes] = await Promise.all([
            fetch(`${API}/api/users/${userId}`),
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
    }, [API, userId]);

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

    const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        petId: id,
        userId: userId,

        applicantFirstName: personalInfo.firstName,
        applicantLastName: personalInfo.lastName,
        applicantAddress: personalInfo.address,
        applicantPhoneNumber: personalInfo.phoneNumber,
        applicantEmail: personalInfo.email,
        applicantBirthdate: personalInfo.birthdate,

        // REQUIRED FIELDS
        applicantOccupation: "N/A",
        applicantCompany: null,
        applicantSocialMedia: null,
        applicantCivilStatus: "SINGLE",
        adoptionPrompt: "WEBSITE",

        alternateContactName: "N/A",
        alternateContactRelationship: "N/A",
        alternateContactNumber: "0000000000",
        alternateContactEmail: "placeholder@email.com",

        // Map your current fields to schema
        response1: formData.buildingType,
        response2: formData.rent === "yes",
        response3: formData.movePet,
        response4: formData.liveWith,
        response5: formData.allergies === "yes",
        response6: formData.carePerson,
        response7: formData.financialPerson,
        response8: formData.emergencyCare,
        response9: formData.hoursAlone,
        response10: formData.introductionSteps,
        response11: formData.familySupport === "yes",
        response12: formData.familyExplain,
        response13: formData.otherPets === "yes",
        response14: formData.pastPets === "yes",
        response15: [],
        response16: formData.interviewTime
        })
    });

    if (!res.ok) {
    alert("Submission failed");
    return;
    }

    setShowSuccess(true);

    navigate("/applications");
    };

    const sections = [
        "Basic Information",
        "Adoption Details",
        "Residence Details",
        "Spaying and Neutering",
        "Updating the Organization",
        "Interview Schedule"
    ];

    const isFormComplete = () => {
        return (
            formData.residenceType &&
            formData.occupation &&
            formData.reasonAdopt &&
            formData.experience &&
            formData.preparationSteps &&
            formData.vetClinic &&
            formData.petDiet &&
            formData.otherPetsList &&
            formData.consent &&
            formData.petsNeutered &&
            formData.planNeuter &&
            formData.interviewTime
        );
    };

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);

        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), ...files]
        }));
        };

        const removeFile = (field, index) => {
        setFormData(prev => {
            const updated = [...prev[field]];
            updated.splice(index, 1);
            return { ...prev, [field]: updated };
        });
    };

    return (
    <>
    { showSuccess && (
        <div className="popup-overlay">
            <div className="popup-box">
            <h3>Application Submitted!</h3>
            <p>Your adoption application has been successfully sent.</p>

            <button
                className="save-btn"
                onClick={() => navigate("/applications")}
            >
                Go to Applications
            </button>
            </div>
        </div>
    )}

    <AppLayout>
        <BackButton />

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
        className="cancel-btn"
        onClick={() => setEditing(false)}
        >
        Cancel
        </button>
        
        <button
        className="save-btn"
        onClick={() => setEditing(false)}
        >
        Save
        </button>
    </>
    )}

    </div>

    </div>

    {/* ADOPTION DETAILS */}

    <h2 className="apply-title">Application Details</h2>

    <form onSubmit={handleSubmit}>

    <div className="apply-box form-box fixed-box">

    <h3 className="section-title">{sections[step]}</h3>

    <div className="form-content">

        {/* ================= BASIC INFO ================= */}
        {step === 0 && (
        <>
            <div className="form-group">
            <label>
                What type of residence do you live in? (e.g., House, Apartment, Dormitory, Condominium, etc.)
            </label>
            <input
                className="edit-input"
                name="residenceType"
                value={formData.residenceType || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>What is your occupation?</label>
            <input
                className="edit-input"
                name="occupation"
                value={formData.occupation || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>
                Kindly submit any valid ID. (e.g., Government, School, or Work)
            </label>

            <label className="upload-box">
                <input
                type="file"
                multiple
                onChange={(e)=>handleFileChange(e, "validId")}
                />
                <span>Upload file(s)</span>
            </label>

            <div className="file-preview">
                {formData.validId.map((file, i) => (
                <div key={i} className="file-chip">
                    {file.name}
                    <button onClick={()=>removeFile("validId", i)}>×</button>
                </div>
                ))}
            </div>
            </div>
        </>
        )}

        {/* ================= ADOPTION DETAILS ================= */}
        {step === 1 && (
        <>
            <div className="form-group">
            <label>Why would you like to adopt a cat/dog from us?</label>
            <textarea
                name="reasonAdopt"
                value={formData.reasonAdopt || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Do you have any prior experience taking care of cats/dogs?</label>
            <div className="radio-group">
                <label>
                <input
                    type="radio"
                    name="experience"
                    value="yes"
                    checked={formData.experience === "yes"}
                    onChange={handleChange}
                /> Yes
                </label>
                <label>
                <input
                    type="radio"
                    name="experience"
                    value="no"
                    checked={formData.experience === "no"}
                    onChange={handleChange}
                /> No
                </label>
            </div>
            </div>

            <div className="form-group">
            <label>What steps are you taking to prepare for adopting a cat/dog?</label>
            <textarea
                name="preparationSteps"
                value={formData.preparationSteps || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>What vet clinic do you plan on taking your chosen cat/dog to?</label>
            <input
                className="edit-input"
                name="vetClinic"
                value={formData.vetClinic || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>
                What is the diet that you are planning on feeding to your chosen cat/dog? Please specify the brands.
            </label>
            <textarea
                name="petDiet"
                value={formData.petDiet || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>
                Do you have other pets? Please list (e.g., 2 cats, 1 dog). Write “N/A” if none.
            </label>
            <input
                className="edit-input"
                name="otherPetsList"
                value={formData.otherPetsList || ""}
                onChange={handleChange}
            />
            </div>
        </>
        )}

        {/* ================= RESIDENCE ================= */}
        {step === 2 && (
        <>
            <div className="form-group">
            <label>
                If living with others (e.g., family, roommates) or renting, do you have consent from your housemate/s and/or landlord to keep a cat?
            </label>
            <div className="radio-group">
                <label>
                <input
                    type="radio"
                    name="consent"
                    value="yes"
                    checked={formData.consent === "yes"}
                    onChange={handleChange}
                /> Yes
                </label>
                <label>
                <input
                    type="radio"
                    name="consent"
                    value="no"
                    checked={formData.consent === "no"}
                    onChange={handleChange}
                /> No
                </label>
                <label>
                <input
                    type="radio"
                    name="consent"
                    value="alone"
                    checked={formData.consent === "alone"}
                    onChange={handleChange}
                /> I live alone.
                </label>
            </div>
            </div>

            {formData.consent === "yes" && (
            <div className="form-group">
                <label>
                If yes, please provide proof of their consent (e.g., screenshots, documents).
                </label>

                <label className="upload-box">
                <input
                    type="file"
                    multiple
                    onChange={(e)=>handleFileChange(e, "consentProof")}
                />
                <span>Upload files</span>
                </label>

                <div className="file-preview">
                {formData.consentProof.map((file, i) => (
                    <div key={i} className="file-chip">
                    {file.name}
                    <button onClick={()=>removeFile("consentProof", i)}>×</button>
                    </div>
                ))}
                </div>
            </div>
            )}

            {formData.consent === "no" && (
            <div className="form-group">
                <label>
                If not, please understand that their consent is required for the organization to approve your application, and that proof may be provided at a later time or discussed further through Facebook Messenger.
                </label>

                <div className="radio-group">
                <label>
                    <input
                    type="radio"
                    name="consentUnderstanding"
                    value="yes"
                    checked={formData.consentUnderstanding === "yes"}
                    onChange={handleChange}
                    />
                    Yes, I understand that I must communicate their consent to the organization in further communications.
                </label>
                </div>
            </div>
            )}

            <div className="form-group">
            <label>
                Kindly upload photos of your residence and where the cat will stay, both indoors and outside the house (include facade, garage, or gate, if any).
            </label>

            <label className="upload-box">
            <input
                type="file"
                multiple
                onChange={(e)=>handleFileChange(e, "housePhotos")}
            />
            <span>Upload files</span>
            </label>

            <div className="file-preview">
            {formData.housePhotos.map((file, i) => (
                <div key={i} className="file-chip">
                {file.name}
                <button onClick={()=>removeFile("housePhotos", i)}>×</button>
                </div>
            ))}
            </div>
            </div>
        </>
        )}

        {/* ================= SPAY ================= */}
        {step === 3 && (
        <>
            <div className="form-group">
            <label>If you have other cats/dogs, are they spayed or neutered?</label>
            <div className="radio-group">
                <label>
                <input type="radio" name="petsNeutered" value="yes"
                    checked={formData.petsNeutered === "yes"}
                    onChange={handleChange}/> Yes
                </label>
                <label>
                <input type="radio" name="petsNeutered" value="no"
                    checked={formData.petsNeutered === "no"}
                    onChange={handleChange}/> No
                </label>
                <label>
                <input type="radio" name="petsNeutered" value="none"
                    checked={formData.petsNeutered === "none"}
                    onChange={handleChange}/> I don’t have other pets.
                </label>
            </div>
            </div>

            <div className="form-group">
            <label>
                Do you plan to spay/neuter the cat/dog that you will be adopting (if the cat/dog is not spayed/neutered already)?
            </label>
            <div className="radio-group">
                <label><input type="radio" name="planNeuter" value="yes" checked={formData.planNeuter==="yes"} onChange={handleChange}/> Yes</label>
                <label><input type="radio" name="planNeuter" value="no" checked={formData.planNeuter==="no"} onChange={handleChange}/> No</label>
                <label><input type="radio" name="planNeuter" value="undecided" checked={formData.planNeuter==="undecided"} onChange={handleChange}/> I have not decided yet</label>
                <label><input type="radio" name="planNeuter" value="already" checked={formData.planNeuter==="already"} onChange={handleChange}/> The cat/dog that I’m adopting is already spayed/neutered</label>
            </div>
            </div>
        </>
        )}

        {/* ================= UPDATES ================= */}
        {step === 4 && (
        <>
            <div className="form-group">
            <label>
                Adopters are expected to send updates to the organization as regularly as possible through the organization’s email address.
            </label>
            <div className="radio-group">
                <label>
                <input type="radio" name="agreeUpdates" value="yes"
                    checked={formData.agreeUpdates==="yes"}
                    onChange={handleChange}/>
                I understand that I must send the organization regular updates as much as possible.
                </label>
            </div>
            </div>

            <div className="form-group">
            <label>
                Adopters are expected to update the organization as soon as possible for the following cases: escape, injury, sickness, accidents, and, in worst cases, death.
            </label>
            <div className="radio-group">
                <label>
                <input type="radio" name="agreeEmergency" value="yes"
                    checked={formData.agreeEmergency==="yes"}
                    onChange={handleChange}/>
                I understand that I must update the organization as soon as possible in case the cat’s safety or health is jeopardized.
                </label>
            </div>
            </div>

            <div className="form-group">
            <label>
                Adopters are encouraged to post their adopted pet on Facebook using the official hashtag #AdoptWithPurrPaws to help promote PurrPaws and support pet adoption awareness in reducing the number of stray animals in the country.
            </label>
            <div className="radio-group">
                <label>
                <input type="radio" name="shareSocial" value="yes"
                    checked={formData.shareSocial==="yes"}
                    onChange={handleChange}/>
                Sure! I am willing to post using the hashtag #AdoptWithPurrPaws to support your advocacy
                </label>
                <label>
                <input type="radio" name="shareSocial" value="no"
                    checked={formData.shareSocial==="no"}
                    onChange={handleChange}/>
                No thanks, I prefer not to post on social media
                </label>
            </div>
            </div>
        </>
        )}

        {/* ================= INTERVIEW ================= */}
        {step === 5 && (
        <div className="form-group">
            <label>What is your preferred date and time for a follow-up Zoom interview?</label>
            <input
            type="datetime-local"
            className="edit-input"
            name="interviewTime"
            value={formData.interviewTime || ""}
            onChange={handleChange}
            />
        </div>
        )}

    </div>

    {/* NAVIGATION */}
    <div className="carousel-nav">
        {step > 0 && (
        <button type="button" className="nav-link" onClick={()=>setStep(step-1)}>
            ← Back
        </button>
        )}

        {step < sections.length - 1 && (
        <button type="button" className="nav-link next" onClick={()=>setStep(step+1)}>
            Next →
        </button>
        )}
    </div>

    </div>

    {/* BUTTONS */}

    <div className="pet-apply">

    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
    Cancel
    </button>

    <button className="save-btn" type="submit" disabled={!isFormComplete()}>
    Submit
    </button>

    </div>

    </form>

    </section>

    </main>

    </AppLayout>
    </>
    );
}

export default AdopterApply;