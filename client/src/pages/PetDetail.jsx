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
      <div className="pet-detail">

        <div className="pet-detail-photo">
          <img
            src="/images/placeholder-cat.svg"
            alt={pet.name}
          />
        </div>

        <div className="pet-detail-info">
          <h2>{pet.name}</h2>

          <p><strong>Breed:</strong> {pet.breed?.name || "Unknown"}</p>
          <p><strong>Age:</strong> {pet.age ?? "Unknown"}</p>
          <p><strong>Color:</strong> {pet.color ?? "Unknown"}</p>

          {pet.temperament && (
            <p><strong>Temperament:</strong> {pet.temperament}</p>
          )}

          {pet.rescueStory && (
            <p className="pet-detail-desc">{pet.rescueStory}</p>
          )}

        <Link to={`/apply/${pet.id}`}>
          <button
            style={{
              background: "#ff7a7a",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Apply for Adoption
          </button>
        </Link>

        </div>

      </div>
    </AppLayout>
  );
}

export default PetDetail;