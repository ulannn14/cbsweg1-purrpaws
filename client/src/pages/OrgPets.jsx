import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgPets() {

  const [activeTab, setActiveTab] = useState("all");
  const [pets, setPets] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const org = JSON.parse(localStorage.getItem("org"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!org) return;

    fetch(`${API}/api/organizations/${org.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Organization:", data);
        setPets(data.pets);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [API, org?.id]);

  const filteredPets =
    activeTab === "all"
      ? pets
      : pets.filter(pet =>
          activeTab === "dog"
            ? pet.breed?.isCat === false
            : pet.breed?.isCat === true
        );
        
  return (
    <OrgAppLayout>

      <main className="org-main">

        <h1 className="org-title">{org?.name}</h1>

        {/* Tabs */}

        <div className="pet-tabs">

          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            ALL
          </button>

          <button
            className={activeTab === "dog" ? "active" : ""}
            onClick={() => setActiveTab("dog")}
          >
            DOGS
          </button>

          <button
            className={activeTab === "cat" ? "active" : ""}
            onClick={() => setActiveTab("cat")}
          >
            CATS
          </button>

        </div>

        {/* Table Header */}

        <div className="pets-header">

          <span></span>
          <span>NAME</span>
          <span>AGE</span>
          <span>DATE RESCUED</span>
          <span>BREED</span>
          <span>STATUS</span>
          <span></span>

        </div>

        {/* Pet List */}

        <div className="pets-list">

          {loading ? (
            <p className="loading-text">Loading pets...</p>
          ) : filteredPets.length === 0 ? (
            <p className="empty-text">No pets available.</p>
          ) : (

          filteredPets.map(pet => (

            <div key={pet.id} className="pet-row">

              <div className="pet-img">
                <img
                  src={pet.image ? `${API}/images/${pet.image}` 
                  : `/temp-photos/pets/pet-main-${pet.id}.jpg`}
                  alt={pet.name}
                />
              </div>

              <div>{pet.name}</div>

              <div>{pet.age}</div>

              <div>
                {new Date(pet.dateRescued).toLocaleDateString()}
              </div>

              <div>{pet.breed?.name}</div>

              <div>{pet.adoptionStatus}</div>

              <button
                className="edit-icon"
                onClick={() => navigate(`/edit-pet/${pet.id}`)}
              >
                <FaEdit />
              </button>

            </div>

          )))}

        </div>

        {/* Add Button */}

        <div className="add-pet-container">
          <button
            className="add-pet-btn"
            onClick={() => navigate("/new-pet")}
          >
            Add New +
          </button>
        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgPets;