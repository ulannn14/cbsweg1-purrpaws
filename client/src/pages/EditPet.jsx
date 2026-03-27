import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [breeds, setBreeds] = useState([]);
  const [imageFile, setImageFile] = useState(null); // new image
  const [preview, setPreview] = useState("");
  
  useEffect(() => {
    if (!id) return;

    // Fetch pet details
    fetch(`${API}/api/pets/${id}`)
      .then(res => res.json())
      .then(data => {
        setPet(data);
        setForm(data);
        setPreview(
          data.name
            ? `https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/petImages/${encodeURIComponent(data.name)}.jpg`
            : ""
        ); 
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Fetch breeds
    fetch(`${API}/api/breeds`)
      .then(res => res.json())
      .then(data => setBreeds(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" || name === "breedId"
          ? Number(value)
          : name === "dateRescued"
          ? value
          : value
    }));
  };

  const handleArrayChange = (e) => {
    setForm(prev => ({
      ...prev,
      adoptionRequirements: e.target.value.split(",").map(s => s.trim())
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  {/*
  const handleSave = async () => {
    try {
      const { breed, organization, ...payload } = form;

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });

      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API}/api/pets/${id}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to update pet");

      const updated = await res.json();
      setPet(updated);
      setForm(updated);
      if (updated.image) setPreview(`${API}/images/${updated.image}`);
      alert("Pet updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };
  */}

    const handleSave = async () => {
    try {

      const { breed, organization, ...payload } = form;

      const res = await fetch(`${API}/api/pets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to update pet");

      const updated = await res.json();
      setPet(updated);
      setForm(updated);

      alert("Pet updated successfully!");

    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  if (loading) return (
    <OrgAppLayout>
      <div className="org-profile-loading">Loading pet...</div>
    </OrgAppLayout>
  );

  if (!pet) return (
    <OrgAppLayout>
      <div className="org-profile-loading">Pet not found.</div>
    </OrgAppLayout>
  );

  return (
    <OrgAppLayout>
      <BackButton />

      <main className="main">
        <section className="section pet-detail">

          {/* ================= HERO ================= */}
          <div className="pet-hero">

            <div className="edit-upload-container">
            <img
              src={preview || null}
              alt="pet preview"
              className="edit-upload-preview"
            />
              <label htmlFor="image-upload" className="edit-upload-label">
                Change Photo
              </label>
              <input
                type="file"
                id="image-upload"
                className="edit-upload-input"
                onChange={handleImageUpload}
              />
            </div>

            <input
              className="edit-input pet-name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
            />

            {/* MATCHES QUICK CARD STYLE */}
            <div className="pet-meta-grid">

              <div className="quick-card highlight">
                <span>Adoption Fee</span>
                <div className="meta-value">
                  ₱
                  <input
                    type="number"
                    name="adoptionFee"
                    value={form.adoptionFee || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={`quick-card highlight status ${form.adoptionStatus?.toLowerCase()}`}>
                <span>Adoption Status</span>
                <select
                  name="adoptionStatus"
                  value={form.adoptionStatus || ""}
                  onChange={handleChange}
                >
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
              <select name="breedId" value={form.breedId || ""} onChange={handleChange}>
                <option value="">Select breed</option>
                {breeds.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="quick-card">
              <span>Age</span>
              <input type="number" name="age" value={form.age || ""} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>Gender</span>
              <select
                name="isMale"
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
              <select name="size" value={form.size || ""} onChange={handleChange}>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>

            <div className="quick-card">
              <span>Weight</span>
              <input type="number" name="weight" value={form.weight || ""} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>Color</span>
              <input name="color" value={form.color || ""} onChange={handleChange} />
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
                  <select name="temperament" value={form.temperament || ""} onChange={handleChange}>
                    <option value="CALM">Calm</option>
                    <option value="PLAYFUL">Playful</option>
                    <option value="SHY">Shy</option>
                    <option value="FRIENDLY">Friendly</option>
                    <option value="AGGRESSIVE">Aggressive</option>
                  </select>
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
                    checked={form.isSpayedOrNeutered || false}
                    onChange={handleChange}
                  />
                </li>

                {/* CONDITIONS */}
                <li>
                  <strong>Medical Conditions</strong>
                  <textarea
                    name="conditions"
                    value={
                      form.petConditions?.map(pc => pc.condition.name).join(", ") || ""
                    }
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

                {/* VACCINATIONS */}
                <li>
                  <strong>Vaccinations</strong>
                  <textarea
                    name="vaccinations"
                    value={
                      form.vaccinations?.map(v => v.vaccine.name).join(", ") || ""
                    }
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
                value={form.dateRescued ? form.dateRescued.split("T")[0] : ""}
                onChange={handleChange}
              />
            </p>

            <p>
              <strong>Rescue Story</strong>
              <textarea
                name="rescueStory"
                value={form.rescueStory || ""}
                onChange={handleChange}
              />
            </p>

          </div>

          {/* ================= ACTIONS ================= */}
          <div className="pet-apply">
            <button className="apply-btn-large" onClick={handleSave}>
              Save Changes
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

export default EditPet;