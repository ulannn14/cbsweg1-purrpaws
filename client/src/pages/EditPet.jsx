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
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [conditions, setConditions] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  
  useEffect(() => {
    if (!id) return;

    // Fetch pet details
    fetch(`${API}/api/pets/${id}`)
    .then(res => res.json())
    .then(data => {

      console.log("DATA:", data);
      setPet(data);
      setForm(data);

      const images = data?.petImages?.length
        ? data.petImages.map(url => ({
            id: crypto.randomUUID(),
            file: null,
            preview: url,
            isExisting: true
          }))
        : [{
            id: crypto.randomUUID(),
            file: null,
            preview: "/images/placeholder.jpg",
            isExisting: true
          }];

      setGalleryImages(images);
      setActiveImageIndex(0);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));

    // Fetch breeds
    fetch(`${API}/api/breeds`)
      .then(res => res.json())
      .then(data => setBreeds(data))
      .catch(err => console.error(err));

    // fetch conditions
    fetch(`${API}/api/conditions`)
      .then(res => res.json())
      .then(data => setConditions(data))
      .catch(err => console.error(err));

    // fetch vaccines
    fetch(`${API}/api/vaccines`)
      .then(res => res.json())
      .then(data => setVaccines(data))
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet? This cannot be undone.");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/api/pets/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete pet");

      alert("Pet deleted successfully");

      // redirect after delete
      navigate("/org/pets"); // adjust if your route is different
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet");
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

      const {
        breed,
        organization,
        petConditions,
        vaccinations,
        ...payload
      } = form;

      const formData = new FormData();

      const existingImages = galleryImages
        .filter(img => img.isExisting && !img.file)
        .map(img => img.preview);

      formData.append("existingImages", JSON.stringify(existingImages));

      galleryImages.forEach((img) => {
        if (img.file) {
          formData.append("petImages", img.file);
        }
      });

      // Append normal fields
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });

      // Append condition + vaccine IDs
      formData.append("conditionIds", JSON.stringify(form.conditionIds || []));
      formData.append("vaccineIds", JSON.stringify(form.vaccineIds || []));

      const res = await fetch(`${API}/api/pets/${id}`, {
        method: "PUT",
        body: formData, // NO JSON HEADERS
      });

      if (!res.ok) throw new Error("Failed to update pet");

      const updated = await res.json();

      setPet(updated);
      setForm({
        ...updated,
        conditionIds: updated.petConditions?.map(pc => pc.conditionId) || [],
        vaccineIds: updated.vaccinations?.map(v => v.vaccineId) || []
      });

      showSuccessPopup("Pet saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
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

    setGalleryImages((prev) => [...prev, ...newImages]);

    if (galleryImages.length === 0) {
      setActiveImageIndex(0);
    }

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
    setGalleryImages(updated);

    if (updated.length === 0) {
      setActiveImageIndex(0);
    } else if (activeImageIndex >= updated.length) {
      setActiveImageIndex(updated.length - 1);
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
                  <button
                    key={img.id}
                    type="button"
                    className={`edit-thumb ${activeImageIndex === index ? "active" : ""}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={img.preview} alt={`thumb-${index}`} />
                  </button>
                ))}
              </div>

              <div className="edit-gallery-count">
                {galleryImages.length > 0 ? `${activeImageIndex + 1} / ${galleryImages.length}` : "0 / 0"}
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
              value={form.name || ""}
              onChange={handleChange}
            />

            {/* MATCHES QUICK CARD STYLE */}
            <div className="pet-meta-grid">

              <div className="quick-card highlight">
                <span>ADOPTION FEE</span>
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
                <span>ADOPTION STATUS</span>
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
              <span>BREED</span>
              <select name="breedId" value={form.breedId || ""} onChange={handleChange}>
                <option value="">Select breed</option>
                {breeds.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="quick-card">
              <span>AGE</span>
              <input type="number" name="age" value={form.age || ""} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>GENDER</span>
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
              <span>SIZE</span>
              <select name="size" value={form.size || ""} onChange={handleChange}>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>

            <div className="quick-card">
              <span>WEIGHT</span>
              <input type="number" name="weight" value={form.weight || ""} onChange={handleChange} />
            </div>

            <div className="quick-card">
              <span>COLOR</span>
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
                  <select
                    multiple
                    className="edit-input multi-select"
                    value={form.conditionIds || []}
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

                {/* VACCINATIONS */}
                <li>
                  <strong>Vaccinations</strong>
                  <select
                    multiple
                    className="edit-input multi-select"
                    value={form.vaccineIds || []}
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

            <p>
              <strong>Adoption Requirements</strong>
              <label className="checkbox-row">
                <span>Zoom Meeting</span>
                <input
                  type="checkbox"
                  checked={form.adoptionRequirements?.includes("ZOOM") || false}
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
                  checked={form.adoptionRequirements?.includes("SHELTER_VISIT") || false}
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
                  <span style={{ marginLeft: "8px" }}>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>

            <button className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>

            {/* 🔥 NEW DELETE BUTTON */}
            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete Pet
            </button>
          </div>

        </section>
      </main>
    </OrgAppLayout>
  );
}

export default EditPet;