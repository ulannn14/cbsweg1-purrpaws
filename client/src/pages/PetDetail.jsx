import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const API = import.meta.env.VITE_API_URL;

  const images = pet?.imageUrls?.length
  ? pet.imageUrls
  : ["https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/petImages/Shadow.jpg"];

  useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/pets/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <AppLayout>
      <div className="page-loading">Loading pet...</div>
    </AppLayout>
  );

  if (!pet) return (
    <AppLayout>
      <div>Pet not found.</div>
    </AppLayout>
  );

  const formatText = (text) => {
    if (!text) return "Unknown";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <AppLayout>
      <BackButton />

      <main className="main">
        <section className="section pet-detail">

          {/* ================= HERO ================= */}
          <div className="pet-hero">

            {/* ================= CHANGE BACKEND HERE ================= */}
            <div className="pet-gallery">
              {/* MAIN IMAGE */}
              <div className="gallery-main">
                <img src={images[activeImage]} alt="pet" />
              </div>

              {/* THUMBNAILS */}
              <div className="gallery-thumbs">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumb ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`thumb-${index}`} />
                  </div>
                ))}
              </div>
          </div>

          <div className="gallery-count">
            {activeImage + 1} / {images.length}
          </div>
           
            <h1 className="pet-name">{pet.name}</h1>

            <div className="pet-meta-grid">

              <div className="quick-card highlight">
                <span>Adoption Fee</span>
                <strong>
                  ₱{pet.adoptionFee?.toFixed(2) || "Not specified"}
                </strong>
              </div>

              <div className={`quick-card highlight status ${pet.adoptionStatus?.toLowerCase()}`}>
                <span>Adoption Status</span>
                <strong>{pet.adoptionStatus}</strong>
              </div>

            </div>
          </div>

          {/* ================= QUICK INFO ================= */}
          <div className="pet-quick-grid">

            <div className="quick-card">
              <span>Breed</span>
              <strong>{pet.breed?.name || "Unknown"}</strong>
            </div>

            <div className="quick-card">
              <span>Age</span>
              <strong>{pet.age ?? "Unknown"}</strong>
            </div>

            <div className="quick-card">
              <span>Gender</span>
              <strong>{pet.isMale ? "Male" : "Female"}</strong>
            </div>

            <div className="quick-card">
              <span>Size</span>
              <strong>{formatText(pet.size)}</strong>
            </div>

            <div className="quick-card">
              <span>Weight</span>
              <strong>{pet.weight?.toFixed(1) || "—"} kg</strong>
            </div>

            <div className="quick-card">
              <span>Color</span>
              <strong>{pet.color}</strong>
            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="pet-details-grid">

            {/* Behavior */}
            <div className="pet-details-box">
              <h3>Behavior & Traits</h3>
              <ul>
                <li><strong>Temperament:</strong> {formatText(pet.temperament)}</li>
                <li><strong>Good with Dogs:</strong> {pet.isGoodWithDogs ? "Yes" : "No"}</li>
                <li><strong>Good with Cats:</strong> {pet.isGoodWithCats ? "Yes" : "No"}</li>
                <li><strong>Good with Kids:</strong> {pet.isGoodWithKids ? "Yes" : "No"}</li>
                <li><strong>House Trained:</strong> {pet.isHouseTrained ? "Yes" : "No"}</li>
                <li><strong>Leash Trained:</strong> {pet.isLeashTrained ? "Yes" : "No"}</li>
              </ul>
            </div>

            {/* Medical */}
            <div className="pet-details-box">
              <h3>Medical & Health</h3>
              <ul>
                <li><strong>Spayed / Neutered:</strong> {pet.isSpayedOrNeutered ? "Yes" : "No"}</li>

                <li>
                  <strong>Conditions:</strong>{" "}
                  {pet.petConditions?.length
                    ? pet.petConditions.map(pc => pc.condition.name).join(", ")
                    : "None"}
                </li>

                <li>
                  <strong>Vaccinations:</strong>{" "}
                  {pet.vaccinations?.length
                    ? pet.vaccinations.map(v => v.vaccine.name).join(", ")
                    : "None listed"}
                </li>
              </ul>
            </div>

          </div>

          {/* ================= ORGANIZATION ================= */}
          <div className="pet-org-box">

            <Link to={`/organizations/${pet.organizationId}`}>
              <div className="org-circle">
                <img
                  src={
                    pet.organization?.image
                      ? `${API}/images/${pet.organization.organizationImage}`
                      : `/temp-photos/orgs/org-profile-${pet.organization?.id}.png`
                  }
                  alt={pet.organization?.name}
                />
              </div>

              <h3>{pet.organization?.name}</h3>
            </Link>

            <div className="org-details">
              <p><strong>Rescued:</strong> {new Date(pet.dateRescued).toLocaleDateString()}</p>
              <p><strong>Rescue Story:</strong> {pet.rescueStory}</p>
            </div>

          </div>

          {/* ================= APPLY ================= */}
          <div className="pet-apply">
            <Link to={`/apply/${pet.id}`}>
              <button className="apply-btn-large">
                Apply for Adoption
              </button>
            </Link>
          </div>

        </section>
      </main>
    </AppLayout>
  );
}

export default PetDetail;