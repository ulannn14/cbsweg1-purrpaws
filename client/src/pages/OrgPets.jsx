import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgPets() {

  const [activeTab, setActiveTab] = useState("all");
  const [pets, setPets] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const org = JSON.parse(localStorage.getItem("org"));

  useEffect(() => {

    if (!org) return;

    fetch(`${API}/api/organizations/${org.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Organization:", data);
        setPets(data.pets);
      })
      .catch(err => console.error(err));

  }, [API, org?.id]);

  const filteredPets =
    activeTab === "all"
      ? pets
      : pets.filter(pet => pet.species.toLowerCase() === activeTab);

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

          {filteredPets.map(pet => (

            <div key={pet.id} className="pet-row">

              <div className="pet-img"></div>

              <div>{pet.name}</div>

              <div>{pet.age}</div>

              <div>
                {new Date(pet.dateRescued).toLocaleDateString()}
              </div>

              <div>{pet.breed?.name}</div>

              <div>{pet.adoptionStatus}</div>

              <button className="edit-icon">
                <FaEdit />
              </button>

            </div>

          ))}

        </div>

        {/* Add Button */}

        <div className="add-pet-container">
          <button className="add-pet-btn">
            Add New +
          </button>
        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgPets;