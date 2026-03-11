import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function EditPet() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [breeds, setBreeds] = useState([]);

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!id) return;

        // Fetch pet details
        fetch(`${API}/api/pets/${id}`)
        .then(res => res.json())
        .then(data => {
            setPet(data);
            setForm(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

        // Fetch breeds for dropdown
        fetch(`${API}/api/breeds`)
        .then(res => res.json())
        .then(data => setBreeds(data))
        .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
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
        const res = await fetch(`${API}/api/pets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error("Failed to update pet");
        navigate(`/pets/${id}`);
        } catch (err) {
        console.error(err);
        alert("Failed to save changes");
        }
    };

    if (loading) return (
        <AppLayout>
        <div>Loading...</div>
        </AppLayout>
    );

    if (!pet) return (
        <AppLayout>
        <div>Pet not found.</div>
        </AppLayout>
    );

    return (
        <AppLayout>
        <main className="main">
            <section className="section pet-detail">

            {/* PET IMAGE */}
            <div className="pet-header">
                <div className="pet-photo-large">
                <img
                    src={pet.image ? `${API}/images/${pet.image}` : "/images/placeholder-cat.svg"}
                    alt={pet.name}
                />
                </div>

                <input
                className="edit-input pet-name"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                />

                <div className="pet-fee">
                Adoption Fee: ₱
                <input
                    type="number"
                    name="adoptionFee"
                    value={form.adoptionFee || ""}
                    onChange={handleChange}
                    className="edit-input"
                />
                </div>
            </div>

            {/* DETAILS GRID */}
            <div className="pet-details-grid">

                {/* LEFT COLUMN */}
                <div className="pet-details-box">
                <ul>

                    <li>
                    <strong>Temperament:</strong>
                    <select name="temperament" value={form.temperament || ""} onChange={handleChange}>
                        <option value="CALM">Calm</option>
                        <option value="PLAYFUL">Playful</option>
                        <option value="SHY">Shy</option>
                        <option value="FRIENDLY">Friendly</option>
                        <option value="AGGRESSIVE">Aggressive</option>
                    </select>
                    </li>

                    <li>
                    <strong>Species:</strong>
                    <select name="species" value={form.species || ""} onChange={handleChange}>
                        <option value="CAT">Cat</option>
                        <option value="DOG">Dog</option>
                    </select>
                    </li>

                    <li>
                    <strong>Breed:</strong>
                    <select name="breedId" value={form.breedId || ""} onChange={handleChange}>
                        {breeds.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                    </li>

                    <li>
                    <strong>Gender:</strong>
                    <select name="isMale" value={form.isMale ? "true" : "false"} onChange={e => setForm({...form,isMale:e.target.value==="true"})}>
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                    </li>

                    <li>
                    <strong>Age:</strong>
                    <input type="number" name="age" value={form.age || ""} onChange={handleChange}/>
                    </li>

                    <li>
                    <strong>Size:</strong>
                    <select name="size" value={form.size || ""} onChange={handleChange}>
                        <option value="SMALL">Small</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LARGE">Large</option>
                    </select>
                    </li>

                    <li>
                    <strong>Weight:</strong>
                    <input type="number" name="weight" value={form.weight || ""} onChange={handleChange}/>
                    </li>

                    <li>
                    <strong>Color:</strong>
                    <input name="color" value={form.color || ""} onChange={handleChange}/>
                    </li>

                </ul>
                </div>

                {/* RIGHT COLUMN */}
                <div className="pet-details-box">
                <ul>
                    <li className="checkbox-row">
                    <strong>Dewormed</strong>
                    <input type="checkbox" name="isDewormed" checked={form.isDewormed || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>Spayed / Neutered</strong>
                    <input type="checkbox" name="isSpayedOrNeutered" checked={form.isSpayedOrNeutered || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>Good with Dogs</strong>
                    <input type="checkbox" name="isGoodWithDogs" checked={form.isGoodWithDogs || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>Good with Cats</strong>
                    <input type="checkbox" name="isGoodWithCats" checked={form.isGoodWithCats || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>Good with Kids</strong>
                    <input type="checkbox" name="isGoodWithKids" checked={form.isGoodWithKids || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>House Trained</strong>
                    <input type="checkbox" name="isHouseTrained" checked={form.isHouseTrained || false} onChange={handleChange}/>
                    </li>

                    <li className="checkbox-row">
                    <strong>Leash Trained</strong>
                    <input type="checkbox" name="isLeashTrained" checked={form.isLeashTrained || false} onChange={handleChange}/>
                    </li>

                    <li>
                    <strong>Adoption Status:</strong>
                    <select name="adoptionStatus" value={form.adoptionStatus || ""} onChange={handleChange}>
                        <option value="AVAILABLE">Available</option>
                        <option value="PENDING">Pending</option>
                        <option value="ADOPTED">Adopted</option>
                    </select>
                    </li>

                    <li>
                    <strong>Adoption Requirements:</strong>
                    <textarea
                        value={form.adoptionRequirements?.join(", ") || ""}
                        onChange={handleArrayChange}
                    />
                    </li>

                </ul>
                </div>

            </div>

            {/* RESCUE INFO */}
            <div className="pet-org-box">

                <p>
                <strong>Date Rescued:</strong>
                <input
                    type="date"
                    name="dateRescued"
                    value={form.dateRescued ? form.dateRescued.split("T")[0] : ""}
                    onChange={handleChange}
                />
                </p>

                <p>
                <strong>Rescue Story:</strong>
                <textarea
                    name="rescueStory"
                    value={form.rescueStory || ""}
                    onChange={handleChange}
                />
                </p>

                <p>
                <strong>Adoption Reason:</strong>
                <textarea
                    name="adoptionReason"
                    value={form.adoptionReason || ""}
                    onChange={handleChange}
                />
                </p>

            </div>

            {/* ACTION BUTTONS */}
            <div className="pet-apply">
                <button className="save-btn" onClick={handleSave}>
                Save Changes
                </button>
                <button className="cancel-btn" onClick={()=>navigate(-1)}>
                Cancel
                </button>
            </div>

            </section>
        </main>
        </AppLayout>
    );
}

export default EditPet;