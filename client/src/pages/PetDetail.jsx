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


const images = pet?.petImages?.length
  ? [
      pet.petImage, // main image FIRST
      ...pet.petImages.filter(img => img !== pet.petImage) // avoid duplicate
    ]
  : pet?.petImage
  ? [pet.petImage]
  : ["/images/placeholder.jpg"];
  
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
                <span>ADOPTION FEE</span>
                <strong>
                  ₱{pet.adoptionFee?.toFixed(2) || "Not specified"}
                </strong>
              </div>

              <div className={`quick-card highlight status ${pet.adoptionStatus?.toLowerCase()}`}>
                <span>ADOPTION STATUS</span>
                <strong>{pet.adoptionStatus}</strong>
              </div>

            </div>
          </div>

          {/* ================= QUICK INFO ================= */}
          <div className="pet-quick-grid">

            <div className="quick-card">
              <span>BREED</span>
              <strong>{pet.breed?.name || "Unknown"}</strong>
            </div>

            <div className="quick-card">
              <span>AGE</span>
              <strong>{pet.age ?? "Unknown"}</strong>
            </div>

            <div className="quick-card">
              <span>GENDER</span>
              <strong>{pet.isMale ? "Male" : "Female"}</strong>
            </div>

            <div className="quick-card">
              <span>SIZE</span>
              <strong>{formatText(pet.size)}</strong>
            </div>

            <div className="quick-card">
              <span>WEIGHT</span>
              <strong>{pet.weight?.toFixed(1) || "—"} kg</strong>
            </div>

            <div className="quick-card">
              <span>COLOR</span>
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
                  <strong>Medical Conditions:</strong>{" "}
                  {pet.petConditions && pet.petConditions.length > 0
                    ? pet.petConditions
                        .map(pc => pc?.condition?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "None"}
                </li>

                <li>
                  <strong>Vaccinations:</strong>{" "}
                  {pet.vaccinations && pet.vaccinations.length > 0
                    ? pet.vaccinations
                        .map(v => v?.vaccine?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "None listed"}
                </li>

              </ul>
            </div>

          </div>

          {/* ================= ORG + RESCUE GRID ================= */}
          <div className="pet-details-grid">

            {/* ================= RESCUE INFO ================= */}
            <div className="pet-details-box org-rescue-box rescue">
              <h3>Rescue Information</h3>

              <div className="org-rescue-content">

                <ul>
                  <li>
                    <strong>Date Rescued:</strong>{" "}
                    {pet.dateRescued
                      ? new Date(pet.dateRescued).toLocaleDateString()
                      : "—"}
                  </li>

                  <li>
                    <strong>Rescue Story:</strong>
                    <p>{pet.rescueStory || "—"}</p>
                  </li>

                  <li>
                    <strong>Adoption Requirements:</strong>

                    {pet.adoptionRequirements?.length > 0 ? (
                      <ul>
                        {pet.adoptionRequirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>None listed</p>
                    )}
                  </li>

                </ul>

              </div>
            </div>

            {/* ================= ORGANIZATION ================= */}
            <div className="pet-details-box org-rescue-box">
              <h3>Organization Information</h3>

              <div className="org-rescue-content">
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

                <ul>
                  <li><strong>Type:</strong> {pet.organization?.organizationType || "—"}</li>
                  <li><strong>Location:</strong> {pet.organization?.city || "—"}</li>
                  <li><strong>Contact:</strong> {pet.organization?.contactNumber || "—"}</li>
                </ul>
              </div>
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