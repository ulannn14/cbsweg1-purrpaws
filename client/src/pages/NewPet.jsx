import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function NewPet() {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const org = JSON.parse(localStorage.getItem("org"));

    const [breeds, setBreeds] = useState([]);

    const [form, setForm] = useState({
        name: "",
        isMale: true,
        age: "",
        size: "",
        weight: "",
        color: "",
        breedId: "",
        rescueStory: "",
        dateRescued: "",
        temperament: "",
        isSpayedOrNeutered: false,
        isGoodWithDogs: false,
        isGoodWithCats: false,
        isGoodWithKids: false,
        isHouseTrained: false,
        isLeashTrained: false,
        adoptionFee: "",
        adoptionRequirements: [],
        adoptionStatus: "",
        petConditions: [],
        vaccinations: []
    });

    const [preview, setPreview] = useState("/images/placeholder-cat.svg");
    const [imageFile, setImageFile] = useState(null);

    const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        fetch(`${API}/api/breeds`)
        .then(res => res.json())
        .then(data => setBreeds(data))
        .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
        ...prev,
        [name]:
            type === "checkbox"
            ? checked
            : type === "number" || name === "breedId"
            ? Number(value)
            : value
        }));
    };

    const handleArrayChange = (e) => {
        setForm(prev => ({
        ...prev,
        adoptionRequirements: e.target.value.split(",").map(s => s.trim())
        }));
    };

    const handleSave = async () => {
        try {
        const res = await fetch(`${API}/api/pets`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            ...form,
            organizationId: org.id
            })
        });

        if (!res.ok) throw new Error("Failed to create pet");

        const created = await res.json();

        navigate(`/edit-pet/${created.id}`);

        } catch (err) {
        console.error(err);
        alert("Failed to create pet");
        }
    };

    return (
        <OrgAppLayout>
        <BackButton />

        <main className="main">
            <section className="section pet-detail">

            {/* ================= HERO ================= */}
            <div className="pet-hero">

                <div className="edit-upload-container">
                    <img src={preview} alt="pet preview" className="edit-upload-preview" />

                    {/*<label htmlFor="image-upload" className="edit-upload-label">
                        Upload Photo
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        className="edit-upload-input"
                        onChange={handleImageUpload}
                    />*/}
                </div>

                <input
                className="edit-input pet-name"
                name="name"
                placeholder="Pet Name"
                value={form.name}
                onChange={handleChange}
                />

                {/* QUICK META */}
                <div className="pet-meta-grid">

                <div className="quick-card highlight">
                    <span>Adoption Fee</span>
                    <div className="meta-value">
                    ₱
                    <input
                        type="number"
                        name="adoptionFee"
                        value={form.adoptionFee}
                        onChange={handleChange}
                    />
                    </div>
                </div>

                <div className={`quick-card highlight status ${form.adoptionStatus.toLowerCase()}`}>
                    <span>Adoption Status</span>
                    <select
                    name="adoptionStatus"
                    value={form.adoptionStatus}
                    onChange={handleChange}
                    >
                    <option value="">Select status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                    <option value="ADOPTED">Adopted</option>
                    </select>
                </div>

                </div>
            </div>

            {/* ================= QUICK INFO ================= */}
            <div className="pet-quick-grid">

                <div className="quick-card">
                <span>Breed</span>
                <select name="breedId" value={form.breedId} onChange={handleChange}>
                    <option value="">Select breed</option>
                    {breeds.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
                </div>

                <div className="quick-card">
                <span>Age</span>
                <input type="number" name="age" value={form.age} onChange={handleChange} />
                </div>

                <div className="quick-card">
                <span>Gender</span>
                <select
                    value={form.isMale ? "true" : "false"}
                    onChange={(e) =>
                    setForm({ ...form, isMale: e.target.value === "true" })
                    }
                >
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                </select>
                </div>

                <div className="quick-card">
                <span>Size</span>
                <select name="size" value={form.size} onChange={handleChange}>
                    <option value="">Select size</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                </select>
                </div>

                <div className="quick-card">
                <span>Weight</span>
                <input type="number" name="weight" value={form.weight} onChange={handleChange} />
                </div>

                <div className="quick-card">
                <span>Color</span>
                <input name="color" value={form.color} onChange={handleChange} />
                </div>

            </div>

            {/* ================= DETAILS ================= */}
            <div className="pet-details-grid">

                {/* Behavior */}
                <div className="pet-details-box">
                <h3>Behavior & Traits</h3>
                <ul>

                    <li>
                    <strong>Temperament</strong>
                    <select name="temperament" value={form.temperament} onChange={handleChange}>
                        <option value="">Select temperament</option>
                        <option value="CALM">Calm</option>
                        <option value="PLAYFUL">Playful</option>
                        <option value="SHY">Shy</option>
                        <option value="FRIENDLY">Friendly</option>
                        <option value="AGGRESSIVE">Aggressive</option>
                    </select>
                    </li>

                    {[
                    ["isGoodWithDogs", "Good with Dogs"],
                    ["isGoodWithCats", "Good with Cats"],
                    ["isGoodWithKids", "Good with Kids"],
                    ["isHouseTrained", "House Trained"],
                    ["isLeashTrained", "Leash Trained"]
                    ].map(([key, label]) => (
                    <li key={key} className="checkbox-row">
                        <strong>{label}</strong>
                        <input
                        type="checkbox"
                        name={key}
                        checked={form[key]}
                        onChange={handleChange}
                        />
                    </li>
                    ))}

                </ul>
                </div>

                {/* Medical */}
                <div className="pet-details-box">
                <h3>Medical & Health</h3>
                <ul>

                    <li className="checkbox-row">
                    <strong>Spayed / Neutered</strong>
                    <input
                        type="checkbox"
                        name="isSpayedOrNeutered"
                        checked={form.isSpayedOrNeutered}
                        onChange={handleChange}
                    />
                    </li>

                    <li>
                    <strong>Medical Conditions</strong>
                    <textarea
                        value={form.petConditions.map(c => c.condition?.name || "").join(", ")}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            petConditions: e.target.value.split(",").map(name => ({
                            condition: { name: name.trim() }
                            }))
                        })
                        }
                    />
                    </li>

                    <li>
                    <strong>Vaccinations</strong>
                    <textarea
                        value={form.vaccinations.map(v => v.vaccine?.name || "").join(", ")}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            vaccinations: e.target.value.split(",").map(name => ({
                            vaccine: { name: name.trim() }
                            }))
                        })
                        }
                    />
                    </li>

                </ul>
                </div>
            </div>

            {/* ================= RESCUE INFO ================= */}
            <div className="pet-org-box">

                <p>
                <strong>Date Rescued</strong>
                <input
                    type="date"
                    name="dateRescued"
                    value={form.dateRescued}
                    onChange={handleChange}
                />
                </p>

                <p>
                <strong>Rescue Story</strong>
                <textarea
                    name="rescueStory"
                    value={form.rescueStory}
                    onChange={handleChange}
                />
                </p>

            </div>

            {/* ================= ACTIONS ================= */}
            <div className="pet-apply">
                <button className="apply-btn-large" onClick={handleSave}>
                Add Pet
                </button>
                <button className="cancel-btn" onClick={() => navigate(-1)}>
                Cancel
                </button>
            </div>

            </section>
        </main>
        </OrgAppLayout>
    );
}

export default NewPet;