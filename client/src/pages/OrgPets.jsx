import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgPets() {
  const [activeTab, setActiveTab] = useState("all");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // stacked sorts: first item = highest priority
  const [sortConfigs, setSortConfigs] = useState([
    { key: "name", direction: "asc" },
  ]);

  const API = import.meta.env.VITE_API_URL;
  const org = JSON.parse(localStorage.getItem("org"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!org) return;

    fetch(`${API}/api/organizations/${org.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Organization:", data);
        setPets(data.pets);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API, org?.id]);

  const handleSort = (key) => {
    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);

      // if already in sort stack, toggle direction and move it to highest priority
      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const updated = {
          key,
          direction: existing.direction === "asc" ? "desc" : "asc",
        };

        const remaining = prev.filter((item) => item.key !== key);
        return [updated, ...remaining];
      }

      // if new sort, add it to the front as highest priority
      return [{ key, direction: "asc" }, ...prev];
    });
  };

  const getSortArrow = (key) => {
    const sortItem = sortConfigs.find((item) => item.key === key);
    if (!sortItem) return "↕";
    return sortItem.direction === "asc" ? "↑" : "↓";
  };

  const getSortValue = (pet, key) => {
    switch (key) {
      case "name":
        return pet.name?.toLowerCase() || "";

      case "age":
        return Number(pet.age) || 0;

      case "dateRescued":
        return new Date(pet.dateRescued).getTime() || 0;

      case "breed":
        return pet.breed?.name?.toLowerCase() || "";

      case "status":
        return pet.adoptionStatus?.toLowerCase() || "";

      default:
        return "";
    }
  };

  const filteredPets =
    activeTab === "all"
      ? pets
      : pets.filter((pet) =>
          activeTab === "dog"
            ? pet.breed?.isCat === false
            : pet.breed?.isCat === true
        );

  const sortedPets = [...filteredPets].sort((a, b) => {
    for (const sortConfig of sortConfigs) {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }

    return 0;
  });

  return (
    <OrgAppLayout>
      <main className="org-main">
        <h1 className="org-title">{org?.name}</h1>

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

        <div className="pets-header">
          <span></span>

          <button className="sort-header" onClick={() => handleSort("name")}>
            <span>NAME</span>
            <span className="sort-arrow">{getSortArrow("name")}</span>
          </button>

          <button className="sort-header" onClick={() => handleSort("age")}>
            <span>AGE</span>
            <span className="sort-arrow">{getSortArrow("age")}</span>
          </button>

          <button
            className="sort-header"
            onClick={() => handleSort("dateRescued")}
          >
            <span>DATE RESCUED</span>
            <span className="sort-arrow">{getSortArrow("dateRescued")}</span>
          </button>

          <button className="sort-header" onClick={() => handleSort("breed")}>
            <span>BREED</span>
            <span className="sort-arrow">{getSortArrow("breed")}</span>
          </button>

          <button className="sort-header" onClick={() => handleSort("status")}>
            <span>STATUS</span>
            <span className="sort-arrow">{getSortArrow("status")}</span>
          </button>

          <span></span>
        </div>

        <div className="pets-list">
          {loading ? (
            <p className="loading-text">Loading pets...</p>
          ) : sortedPets.length === 0 ? (
            <p className="empty-text">No pets available.</p>
          ) : (
            sortedPets.map((pet) => (
              <div key={pet.id} className="pet-row">
                <div className="pet-img">
                  <img
                    src={
                      pet.image
                        ? `${API}/images/${pet.image}`
                        : `https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/petImages/${encodeURIComponent(
                            pet.name
                          )}.jpg`
                    }
                    alt={pet.name}
                  />
                </div>

                <div>{pet.name}</div>

                <div>{pet.age}</div>

                <div>{new Date(pet.dateRescued).toLocaleDateString()}</div>

                <div>{pet.breed?.name}</div>

                <div>{pet.adoptionStatus}</div>

                <button
                  className="edit-icon"
                  onClick={() => navigate(`/edit-pet/${pet.id}`)}
                >
                  <FaEdit />
                </button>
              </div>
            ))
          )}
        </div>

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