import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgPets() {

  const [activeTab, setActiveTab] = useState("all");

  const pets = [
    {
      id: 1,
      name: "Milo",
      type: "dog",
      birthdate: "Jan 12 2022",
      surrendered: "Mar 5 2024",
      breed: "Shih Tzu",
      status: "Available"
    },
    {
      id: 2,
      name: "Luna",
      type: "cat",
      birthdate: "Feb 20 2023",
      surrendered: "Apr 1 2024",
      breed: "Persian",
      status: "Pending"
    },
    {
      id: 3,
      name: "Rocky",
      type: "dog",
      birthdate: "Aug 5 2021",
      surrendered: "May 11 2024",
      breed: "Aspins",
      status: "Adopted"
    }
  ];

  const filteredPets =
    activeTab === "all"
      ? pets
      : pets.filter(pet => pet.type === activeTab);

  return (
    <OrgAppLayout>

      <main className="org-main">

        <h1 className="org-title">ORGANIZATION NAME</h1>

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
          <span>BIRTHDATE</span>
          <span>DATE SURRENDERED</span>
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
              <div>{pet.birthdate}</div>
              <div>{pet.surrendered}</div>
              <div>{pet.breed}</div>
              <div>{pet.status}</div>

              <button className="edit-icon">
                <FaEdit />
              </button>

            </div>

          ))}

        </div>

        {/* Add Button */}

        <div className="add-pet-container">
          <button className="add-pet-btn">Add New +</button>
        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgPets;