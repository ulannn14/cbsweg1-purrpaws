import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function NewPet() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const org = JSON.parse(localStorage.getItem("org"));

  const [breeds, setBreeds] = useState([]);
  const [galleryImages, setGalleryImages] = useState([
    {
      id: crypto.randomUUID(),
      file: null,
      preview: "/images/placeholder.jpg",
      isExisting: false
    }
  ]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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
    conditionIds: [],
    vaccineIds: []
  });

  const [conditions, setConditions] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/breeds`)
      .then((res) => res.json())
      .then((data) => setBreeds(data))
      .catch((err) => console.error(err));

    // ✅ NEW
    fetch(`${API}/api/conditions`)
      .then(res => res.json())
      .then(data => setConditions(data))
      .catch(err => console.error(err));

    fetch(`${API}/api/vaccines`)
      .then(res => res.json())
      .then(data => setVaccines(data))
      .catch(err => console.error(err));

  }, [API]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
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
    setForm((prev) => ({
      ...prev,
      adoptionRequirements: e.target.value.split(",").map((s) => s.trim())
    }));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));

    setGalleryImages((prev) => {
      const isOnlyPlaceholder =
        prev.length === 1 &&
        prev[0].preview === "/images/placeholder.jpg" &&
        prev[0].file === null;

      const nextImages = isOnlyPlaceholder ? newImages : [...prev, ...newImages];

      if (isOnlyPlaceholder || prev.length === 0) {
        setActiveImageIndex(0);
      }

      return nextImages;
    });

    e.target.value = "";
  };

  const handleReplaceImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || galleryImages.length === 0) return;

    const updated = [...galleryImages];
    updated[activeImageIndex] = {
      ...updated[activeImageIndex],
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    };

    setGalleryImages(updated);
    e.target.value = "";
  };

  const handleDeleteImage = () => {
    if (galleryImages.length === 0) return;

    const updated = galleryImages.filter((_, index) => index !== activeImageIndex);

    if (updated.length === 0) {
      setGalleryImages([
        {
          id: crypto.randomUUID(),
          file: null,
          preview: "/placeholder.jpg",
          isExisting: false
        }
      ]);
      setActiveImageIndex(0);
      return;
    }

    setGalleryImages(updated);

    if (activeImageIndex >= updated.length) {
      setActiveImageIndex(updated.length - 1);
    }
  };

  const handleSetAsMainImage = (index) => {
    if (index === 0) return;

    const updated = [...galleryImages];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);

    setGalleryImages(updated);
    setActiveImageIndex(0);
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

      const formData = new FormData();

      // append normal fields
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });

      formData.append("organizationId", org.id);

      // append images
      galleryImages.forEach((img) => {
        if (img.file) {
          formData.append("petImages", img.file);
        }
      });

      const res = await fetch(`${API}/api/pets`, {
        method: "POST",
        body: formData // NO JSON HEADER
      });

      if (!res.ok) throw new Error("Failed to create pet");

      const created = await res.json();

      showSuccessPopup("Pet added successfully!");

      setTimeout(() => {
        navigate(`/org/pets`);
      }, 1800);

    } catch (err) {
      console.error(err);
      alert("Failed to create pet");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OrgAppLayout>
      <BackButton />

      <main className="main">
        <section className="section pet-detail">

          {successMessage && (
            <div className="success-popup">
              <span className="success-popup-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= HERO ================= */}
          <div className="pet-hero">

            <div className="edit-gallery">

              <div className="edit-gallery-main">
                {galleryImages.length > 0 ? (
                  <img
                    src={galleryImages[activeImageIndex]?.preview}
                    alt="pet preview"
                    className="edit-gallery-main-image"
                  />
                ) : (
                  <div className="edit-gallery-empty">No image</div>
                )}
              </div>

              <div className="edit-gallery-thumbs">
                {galleryImages.map((img, index) => (
                  <div key={img.id}>
                    <button
                      type="button"
                      className={`edit-thumb ${activeImageIndex === index ? "active" : ""}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={img.preview} alt={`thumb-${index}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetAsMainImage(index)}
                    >
                      Set as Main
                    </button>
                  </div>
                ))}
              </div>

              <div className="edit-gallery-count">
                {galleryImages.length > 0
                  ? `${activeImageIndex + 1} / ${galleryImages.length}`
                  : "0 / 0"}
              </div>

              <div className="edit-gallery-actions">
                <label htmlFor="add-pet-images" className="edit-upload-label">
                  Add Photos
                </label>
                <input
                  type="file"
                  id="add-pet-images"
                  className="edit-upload-input"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                />

                <label htmlFor="replace-pet-image" className="edit-upload-label secondary">
                  Replace Selected
                </label>
                <input
                  type="file"
                  id="replace-pet-image"
                  className="edit-upload-input"
                  accept="image/*"
                  onChange={handleReplaceImage}
                />

                <button
                  type="button"
                  className="edit-delete-btn"
                  onClick={handleDeleteImage}
                  disabled={galleryImages.length === 0}
                >
                  Delete Selected
                </button>
              </div>

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
                <span>ADOPTION FEE</span>
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
                <span>ADOPTION STATUS</span>
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
              <span>BREED</span>
              <select name="breedId" value={form.breedId} onChange={handleChange}>
                <option value="">Select breed</option>
                {breeds.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="quick-card">
              <span>AGE</span>
              <input type="number" name="age" value={form.age} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>GENDER</span>
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
              <span>SIZE</span>
              <select name="size" value={form.size} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>

            <div className="quick-card">
              <span>WEIGHT</span>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>COLOR</span>
              <input name="color" value={form.color} onChange={handleChange} />
            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="pet-details-grid">

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
                  <select
                    multiple
                    className="edit-input multi-select"
                    value={form.conditionIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                      setForm({ ...form, conditionIds: selected });
                    }}
                  >
                    {conditions.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </li>

                <li>
                  <strong>Vaccinations</strong>
                  <select
                    multiple
                    className="edit-input multi-select"
                    value={form.vaccineIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                      setForm({ ...form, vaccineIds: selected });
                    }}
                  >
                    {vaccines.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </li>

              </ul>
            </div>
          </div>

          {/* ================= RESCUE INFO ================= */}
          <div className="pet-org-box">

            <h3>Rescue Information</h3>

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

            <p>
              <strong>Adoption Requirements</strong>

              <label className="checkbox-row">
                <span>Zoom Meeting</span>
                <input
                  type="checkbox"
                  checked={form.adoptionRequirements.includes("ZOOM")}
                  onChange={(e) => {
                    const current = form.adoptionRequirements || [];
                    setForm({
                      ...form,
                      adoptionRequirements: e.target.checked
                        ? [...current, "ZOOM"]
                        : current.filter(r => r !== "ZOOM")
                    });
                  }}
                />
              </label>

              <label className="checkbox-row">
                <span>Shelter Visit</span>
                <input
                  type="checkbox"
                  checked={form.adoptionRequirements.includes("SHELTER_VISIT")}
                  onChange={(e) => {
                    const current = form.adoptionRequirements || [];
                    setForm({
                      ...form,
                      adoptionRequirements: e.target.checked
                        ? [...current, "SHELTER_VISIT"]
                        : current.filter(r => r !== "SHELTER_VISIT")
                    });
                  }}
                />
              </label>
            </p>

          </div>

          {/* ================= ACTIONS ================= */}
          <div className="pet-apply">
            <button
              className="apply-btn-large"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="btn-spinner"></span>
                  <span style={{ marginLeft: "8px" }}>Adding pet...</span>
                </>
              ) : (
                "Add Pet"
              )}
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