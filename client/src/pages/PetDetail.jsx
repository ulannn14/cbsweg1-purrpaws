import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/cats/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.debug('PetDetail fetched', data);
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
            src={pet.image ? `${API}/images/${pet.image}` : '/images/placeholder-cat.svg'}
            alt={pet.name}
          />
        </div>

        <div className="pet-detail-info">
          <h2>{pet.name}</h2>
          <p><strong>Breed:</strong> {pet.breed || 'Unknown'}</p>
          <p><strong>Gender:</strong> {pet.gender || 'Unknown'}</p>
          <p><strong>Age:</strong> {pet.age ?? 'Unknown'}</p>
          {pet.status && <p><strong>Status:</strong> {pet.status}</p>}
          {pet.temperament && <p><strong>Temperament:</strong> {pet.temperament}</p>}
          {pet.vaccinationStatus && pet.vaccinationStatus.length > 0 && (
            <p><strong>Vaccinations:</strong> {pet.vaccinationStatus.join(', ')}</p>
          )}
          {pet.description && <p className="pet-detail-desc">{pet.description}</p>}
        </div>
      </div>
    </AppLayout>
  );
}

export default PetDetail;
