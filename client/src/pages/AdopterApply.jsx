import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function AdopterApply() {
    const API = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const petId = parseInt(id);

    let storedUser = null;
    try {
    storedUser = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
    console.error("Invalid user data in localStorage");
    }

    const userId = storedUser?.id;

    if (!userId) {
    console.warn("User not logged in");
    navigate("/login");
    }

    console.log({ petId, userId });

    const [editing, setEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [previousApplication, setPreviousApplication] = useState(null);
    const [showReusePrompt, setShowReusePrompt] = useState(true);

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
        consentUnderstanding: "",
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
                const [userRes, provincesRes, appsRes] = await Promise.all([
                    fetch(`${API}/api/users/${userId}`),
                    fetch(`${API}/api/provinces`),
                    fetch(`${API}/api/applications/user/${userId}`) // 👈 NEW
                ]);

                const userData = await userRes.json();
                const provincesData = await provincesRes.json();
                const appsData = await appsRes.json();

                setPersonalInfo(userData);
                setProvinces(provincesData);

                if (appsData.length > 0) {
                    // get MOST RECENT
                    const latest = appsData.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )[0];

                    setPreviousApplication(latest);
                }

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

    const applyPreviousData = () => {
        if (!previousApplication) return;

        setFormData({
            residenceType: previousApplication.response1 || "",
            occupation: previousApplication.response2 || "",
            reasonAdopt: previousApplication.response3 || "",
            experience: previousApplication.response4 || "",
            preparationSteps: previousApplication.response5 || "",
            vetClinic: previousApplication.response6 || "",
            petDiet: previousApplication.response7 || "",
            otherPetsList: previousApplication.response8 || "",
            consent: previousApplication.response9 || "",
            petsNeutered: previousApplication.response10 || "",
            planNeuter: previousApplication.response11 || "",
            agreeUpdates: previousApplication.response12 || "",
            agreeEmergency: previousApplication.response13 || "",
            shareSocial: previousApplication.response14 || "",
            interviewTime: previousApplication.response16 || "",

            // files cannot be restored directly
            validId: [],
            consentProof: [],
            housePhotos: [],

            consentUnderstanding: ""
        });

        setShowReusePrompt(false);
    };

    const handleSkipReuse = () => {
        setShowReusePrompt(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors(prev => ({
            ...prev,
            [name]: false
        }));
    };

    const handlePersonalChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
    };

    const showSuccessPopup = (message) => {
        setSuccessMessage(message);

        setTimeout(() => {
        setSuccessMessage("");
        }, 2500);
    };

    const RequiredLabel = ({ children }) => (
        <label>
            {children} <span style={{ color: "red" }}>*</span>
        </label>
    );

    const getInputClass = (field) =>
        `edit-input ${errors[field] ? "input-error" : ""}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            setFormError("Please fill out all required fields before submitting.");

            setTimeout(() => {
                const firstError = document.querySelector(".input-error");
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);

            // auto-hide after 3 seconds
            setTimeout(() => setFormError(""), 3000);

            return;
        }

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const form = new FormData();

            // --- TEXT FIELDS ---
            form.append("petId", id);
            form.append("userId", userId);

            form.append("applicantFirstName", personalInfo.firstName);
            form.append("applicantLastName", personalInfo.lastName);
            form.append("applicantAddress", personalInfo.address);
            form.append("applicantPhoneNumber", personalInfo.phoneNumber);
            form.append("applicantEmail", personalInfo.email);
            form.append("applicantBirthdate", personalInfo.birthdate);

            // --- FORM DATA ---
            form.append("response1", formData.residenceType);
            form.append("response2", formData.occupation);
            form.append("response3", formData.reasonAdopt);
            form.append("response4", formData.experience);
            form.append("response5", formData.preparationSteps);
            form.append("response6", formData.vetClinic);
            form.append("response7", formData.petDiet);
            form.append("response8", formData.otherPetsList);
            form.append("response9", formData.consent);
            form.append("response10", formData.petsNeutered);
            form.append("response11", formData.planNeuter);
            form.append("response12", formData.agreeUpdates);
            form.append("response13", formData.agreeEmergency);
            form.append("response14", formData.shareSocial);
            form.append("response15", formData.consentUnderstanding);
            form.append("response16", formData.interviewTime);

            // --- FILES ---
            formData.validId.forEach(file => form.append("validId", file));
            formData.consentProof.forEach(file => form.append("consentProof", file));
            formData.housePhotos.forEach(file => form.append("housePhotos", file));

            const res = await fetch(`${API}/api/applications`, {
            method: "POST",
            body: form
            });

            if (!res.ok) {
            throw new Error("Submission failed");
            }

            showSuccessPopup("Application submitted successfully!");
            setShowSuccess(true);

            setTimeout(() => {
            navigate("/applications");
            }, 1800);
        } catch (err) {
            console.error(err);
            alert("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sections = [
        "Basic Information",
        "Adoption Details",
        "Residence Details",
        "Spaying and Neutering",
        "Updating the Organization",
        "Interview Schedule"
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.residenceType) newErrors.residenceType = true;
        if (!formData.occupation) newErrors.occupation = true;
        if (!formData.reasonAdopt) newErrors.reasonAdopt = true;
        if (!formData.experience) newErrors.experience = true;
        if (!formData.preparationSteps) newErrors.preparationSteps = true;
        if (!formData.vetClinic) newErrors.vetClinic = true;
        if (!formData.petDiet) newErrors.petDiet = true;
        if (!formData.otherPetsList) newErrors.otherPetsList = true;
        if (!formData.consent) newErrors.consent = true;
        if (!formData.petsNeutered) newErrors.petsNeutered = true;
        if (!formData.planNeuter) newErrors.planNeuter = true;
        if (!formData.interviewTime) newErrors.interviewTime = true;
        if (formData.validId.length === 0) newErrors.validId = true;
        if (formData.housePhotos.length === 0) newErrors.housePhotos = true;

        // consent already required
        if (!formData.consent) newErrors.consent = true;

        // IF YES → require proof
        if (formData.consent === "yes" && formData.consentProof.length === 0) {
            newErrors.consentProof = true;
        }

        // IF NO → require understanding
        if (formData.consent === "no" && !formData.consentUnderstanding) {
            newErrors.consentUnderstanding = true;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);

        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), ...files]
        }));

        setErrors(prev => ({
            ...prev,
            [field]: false
        }));
    };

    return (
    <>
    
    {successMessage && (
    <div className="success-popup">
        <span className="success-popup-icon">✓</span>
        <span>{successMessage}</span>
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

    {formError && (
    <div className="form-error-banner">
        {formError}
    </div>
    )}

    <form onSubmit={handleSubmit}>

    <div className="apply-box form-box fixed-box">

    {previousApplication && showReusePrompt ? (
        <div className="reuse-box">

            <h3 className="section-title">
                Use Previous Application?
            </h3>

            <p style={{ marginBottom: "16px" }}>
                We found a previous application. Would you like to reuse your previous answers?
            </p>

            <div className="reuse-actions">
                <button
                    type="button"
                    className="save-btn"
                    onClick={applyPreviousData}
                >
                    Yes, use previous answers
                </button>

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleSkipReuse}
                >
                    No, start fresh
                </button>
            </div>

        </div>
    ) : (

    <>

    <h3 className="section-title">{sections[step]}</h3>

    <div className="form-content">

        {/* ================= BASIC INFO ================= */}
        {step === 0 && (
        <>
            <div className="form-group">
            <RequiredLabel>
                What type of residence do you live in? (e.g., House, Apartment, Dormitory, Condominium, etc.)
            </RequiredLabel>
            <select
                className={getInputClass("residenceType")}
                name="residenceType"
                value={formData.residenceType || ""}
                onChange={handleChange}
            >
                <option value="">Select residence type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condominium</option>
                <option>Dormitory / Student housing</option>
                <option>Townhouse / Townhome</option>
                <option>Duplex / Triplex</option>
                <option>Boarding house / Lodging house</option>
                <option>Studio unit</option>
                <option>Shared housing / Co-living space</option>
                <option>Gated community / Subdivision home</option>
                <option>Rural home / Farmhouse</option>
                <option>Mobile home</option>
                <option>Temporary shelter (e.g., evacuation center)</option>
            </select>

            {errors.residenceType && (
            <p className="error-text">This field is required</p>
            )}

            </div> 

            <div className="form-group">
            <RequiredLabel>What is your occupation?</RequiredLabel>
            <input
                className={getInputClass("occupation")}
                name="occupation"
                value={formData.occupation || ""}
                onChange={handleChange}
            />

            {errors.occupation && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>
                Kindly submit any valid ID. (e.g., Government, School, or Work)
            </RequiredLabel>

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
            {errors.validId && (
            <p className="error-text">Please upload at least one valid ID</p>
            )}
            </div>
        </>
        )}

        {/* ================= ADOPTION DETAILS ================= */}
        {step === 1 && (
        <>
            <div className="form-group">
            <RequiredLabel>Why would you like to adopt a cat/dog from us?</RequiredLabel>
            <textarea
                className={errors.reasonAdopt ? "input-error" : ""}
                name="reasonAdopt"
                value={formData.reasonAdopt || ""}
                onChange={handleChange}
            />

            {errors.reasonAdopt && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>Do you have any prior experience taking care of cats/dogs?</RequiredLabel>
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

            {errors.experience && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>What steps are you taking to prepare for adopting a cat/dog?</RequiredLabel>
            <textarea
                className={errors.preparationSteps ? "input-error" : ""}
                name="preparationSteps"
                value={formData.preparationSteps || ""}
                onChange={handleChange}
            />

            {errors.preparationSteps && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>What vet clinic do you plan on taking your chosen cat/dog to?</RequiredLabel>
            <input
                className={getInputClass("vetClinic")}
                name="vetClinic"
                value={formData.vetClinic || ""}
                onChange={handleChange}
            />

            {errors.vetClinic && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>
                What is the diet that you are planning on feeding to your chosen cat/dog? Please specify the brands.
            </RequiredLabel>
            <textarea
                className={errors.petDiet ? "input-error" : ""}
                name="petDiet"
                value={formData.petDiet || ""}
                onChange={handleChange}
            />

            {errors.petDiet && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>
                Do you have other pets? Please list (e.g., 2 cats, 1 dog). Write “N/A” if none.
            </RequiredLabel>
            <input
                className={getInputClass("otherPetsList")}
                name="otherPetsList"
                value={formData.otherPetsList || ""}
                onChange={handleChange}
            />

            {errors.otherPetsList && (
            <p className="error-text">This field is required</p>
            )}
            </div>
        </>
        )}

        {/* ================= RESIDENCE ================= */}
        {step === 2 && (
        <>
            <div className="form-group">
            <RequiredLabel>
                If living with others (e.g., family, roommates) or renting, do you have consent from your housemate/s and/or landlord to keep a cat?
            </RequiredLabel>
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
            {errors.consent && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            {formData.consent === "yes" && (
            <div className="form-group">
                <RequiredLabel>
                If yes, please provide proof of their consent (e.g., screenshots, documents).
                </RequiredLabel>

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
                {errors.consentProof && (
                <p className="error-text">Proof of consent is required</p>
                )}
            </div>
            )}

            {formData.consent === "no" && (
            <div className="form-group">
                <RequiredLabel>
                If not, please understand that their consent is required for the organization to approve your application, and that proof may be provided at a later time or discussed further through Facebook Messenger.
                </RequiredLabel>

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
                <label>
                    <input
                    type="radio"
                    name="consentUnderstanding"
                    value="no"
                    checked={formData.consentUnderstanding === "no"}
                    onChange={handleChange}
                    />
                    No, I prefer not to communicate their consent to the organization, and I understand that this may affect the approval of my application.
                </label>
                </div>
                {errors.consentUnderstanding && (
                <p className="error-text">You must select an option</p>
                )}
            </div>
            )}

            <div className="form-group">
            <RequiredLabel>
                Kindly upload photos of your residence and where the cat will stay, both indoors and outside the house (include facade, garage, or gate, if any).
            </RequiredLabel>

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
            {errors.housePhotos && (
            <p className="error-text">Please upload residence photos</p>
            )}
            </div>
        </>
        )}

        {/* ================= SPAY ================= */}
        {step === 3 && (
        <>
            <div className="form-group">
            <RequiredLabel>If you have other cats/dogs, are they spayed or neutered?</RequiredLabel>
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
            {errors.petsNeutered && (
            <p className="error-text">This field is required</p>
            )}
            </div>

            <div className="form-group">
            <RequiredLabel>
                Do you plan to spay/neuter the cat/dog that you will be adopting (if the cat/dog is not spayed/neutered already)?
            </RequiredLabel>
            <div className="radio-group">
                <label><input type="radio" name="planNeuter" value="yes" checked={formData.planNeuter==="yes"} onChange={handleChange}/> Yes</label>
                <label><input type="radio" name="planNeuter" value="no" checked={formData.planNeuter==="no"} onChange={handleChange}/> No</label>
                <label><input type="radio" name="planNeuter" value="undecided" checked={formData.planNeuter==="undecided"} onChange={handleChange}/> I have not decided yet.</label>
                <label><input type="radio" name="planNeuter" value="already" checked={formData.planNeuter==="already"} onChange={handleChange}/> The cat/dog that I’m adopting is already spayed/neutered.</label>
            </div>
            {errors.planNeuter && (
            <p className="error-text">This field is required</p>
            )}
            </div>
        </>
        )}

        {/* ================= UPDATES ================= */}
        {step === 4 && (
        <>
            <div className="form-group">
            <RequiredLabel>
                Adopters are expected to send updates to the organization as regularly as possible through the organization’s email address.
            </RequiredLabel>
            <div className="radio-group">
                <label>
                <input type="radio" name="agreeUpdates" value="yes"
                    checked={formData.agreeUpdates==="yes"}
                    onChange={handleChange}/>
                I understand that I must send the organization regular updates as much as possible.
                </label>
                <label>
                <input type="radio" name="agreeUpdates" value="no"
                    checked={formData.agreeUpdates==="no"}
                    onChange={handleChange}/>
                No, I prefer not to send regular updates to the organization.
                </label>
            </div>
            </div>

            <div className="form-group">
            <RequiredLabel>
                Adopters are expected to update the organization as soon as possible for the following cases: escape, injury, sickness, accidents, and, in worst cases, death.
            </RequiredLabel>
            <div className="radio-group">
                <label>
                <input type="radio" name="agreeEmergency" value="yes"
                    checked={formData.agreeEmergency==="yes"}
                    onChange={handleChange}/>
                I understand that I must update the organization as soon as possible in case the cat’s safety or health is jeopardized.
                </label>
                <label>
                <input type="radio" name="agreeEmergency" value="no"
                    checked={formData.agreeEmergency==="no"}
                    onChange={handleChange}/>
                No, I prefer not to update the organization in case of emergencies.
                </label>
            </div>
            </div>

            <div className="form-group">
            <RequiredLabel>
                Adopters are encouraged to post their adopted pet on Facebook using the official hashtag #AdoptWithPurrPaws to help promote PurrPaws and support pet adoption awareness in reducing the number of stray animals in the country.
            </RequiredLabel>
            <div className="radio-group">
                <label>
                <input type="radio" name="shareSocial" value="yes"
                    checked={formData.shareSocial==="yes"}
                    onChange={handleChange}/>
                Sure! I am willing to post using the hashtag #AdoptWithPurrPaws to support PurrPaws' advocacy.
                </label>
                <label>
                <input type="radio" name="shareSocial" value="no"
                    checked={formData.shareSocial==="no"}
                    onChange={handleChange}/>
                No thanks, I prefer not to post on social media.
                </label>
            </div>
            </div>
        </>
        )}

        {/* ================= INTERVIEW ================= */}
        {step === 5 && (
        <div className="form-group">
            <RequiredLabel>What is your preferred date and time for a follow-up Zoom interview?</RequiredLabel>
            <input
            type="datetime-local"
            className={getInputClass("interviewTime")}
            name="interviewTime"
            value={formData.interviewTime || ""}
            onChange={handleChange}
            />

            {errors.interviewTime && (
            <p className="error-text">This field is required</p>
            )}
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

    </>

    )}

    </div>

    {/* BUTTONS */}

    <div className="pet-apply">

    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
    Cancel
    </button>

    <button
            className="save-btn"
            type="submit"
            disabled={isSubmitting}
        >
    {isSubmitting ? (
        <>
        <span className="btn-spinner"></span>
        <span style={{ marginLeft: "8px" }}>Submitting...</span>
        </>
    ) : (
        "Submit"
    )}
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