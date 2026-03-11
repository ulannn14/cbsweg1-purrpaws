import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/pets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.debug("PetDetail fetched", data);
        setPet(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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

    <h2 className="pet-name">{pet.name}</h2>

    <div className="pet-fee">
      Adoption Fee: <span className="fee-price">₱{pet.adoptionFee?.toFixed(2) || "Not specified"}</span>
    </div>
    
    </div>

    {/* DETAILS GRID */}

    <div className="pet-details-grid">

    {/* LEFT COLUMN */}
    <div className="pet-details-box">

    <ul>
    <li><strong>Temperament:</strong> {pet.temperament || "Unknown"}</li>
    <li><strong>Species:</strong> {pet.species || "Unknown"}</li>
    <li><strong>Breed / Type:</strong> {pet.breed?.name || "Unknown"}</li>
    <li><strong>Gender / Sex:</strong> {pet.isMale ? "Male" : "Female"}</li>
    <li><strong>Age:</strong> {pet.age ?? "Unknown"}</li>
    <li><strong>Date of Birth:</strong> {pet.birthDate || "Unknown"}</li>
    <li><strong>Size:</strong> {pet.size || "Unknown"}</li>
    <li><strong>Weight:</strong> {pet.weight?.toFixed(2) || "Unknown"}</li>
    <li><strong>Color / Markings:</strong> {pet.color || "Unknown"}</li>
    </ul>

    </div>

    {/* RIGHT COLUMN */}

    <div className="pet-details-box">

    <ul>
    <li><strong>Dewormed:</strong> {pet.isDewormed ? "Yes" : "No"}</li>
    <li><strong>Spayed / Neutered:</strong> {pet.isSpayedOrNeutered ? "Yes" : "No"}</li>
    <li><strong>Good with Dogs:</strong> {pet.isGoodWithDogs ? "Yes" : "No"}</li>
    <li><strong>Good with Cats:</strong> {pet.isGoodWithCats ? "Yes" : "No"}</li>
    <li><strong>Good with Kids:</strong> {pet.isGoodWithKids ? "Yes" : "No"}</li>
    <li><strong>House Trained:</strong> {pet.isHouseTrained ? "Yes" : "No"}</li>
    <li><strong>Leash Trained:</strong> {pet.isLeashTrained ? "Yes" : "No"}</li>
    </ul>

    </div>

    </div>

    {/* ORGANIZATION */}

    <div className="pet-org-box">

      <Link 
        to={`/organizations/${pet.organizationId}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >

        <div className="org-circle">
          <img
            src={
              pet.organization?.logo
                ? `${API}/images/${pet.organization.logo}`
                : "/images/org-placeholder.png"
            }
            alt={pet.organization?.name}
          />
        </div>

        <div className="org-name">
          <h3>{pet.organization?.name || "Unknown Organization"}</h3>
        </div>

      </Link>

      <div className="org-details">

        <p>
          <strong>Rescued:</strong>{" "}
          {pet.dateRescued
            ? new Date(pet.dateRescued).toLocaleDateString()
            : "Unknown"}
        </p>

        <p>
          <strong>Rescue Story:</strong>{" "}
          {pet.rescueStory || "No story available"}
        </p>

        <p>
          <strong>Adoption Reason:</strong>{" "}
          {pet.adoptionReason || "Not specified"}
        </p>

      </div>

    </div>

    {/* APPLY BUTTON */}

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