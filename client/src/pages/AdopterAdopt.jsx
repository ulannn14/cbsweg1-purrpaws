import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function AdopterAdopt() {
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingPets, setLoadingPets] = useState(false);
  const [pets, setPets] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [selectedOrg, setSelectedOrg] = useState(null);

  const defaultFilters = {
    provinceId: "",
    species: "",
    isMale: "",
    isNeutered: "",
    age_min: "",
    age_max: "",
    fee_min: "",
    fee_max: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const API = import.meta.env.VITE_API_URL;

  const availableProvinceIds = new Set(
    pets.map((p) => p.organization?.provinceId)
  );

  const filteredProvinces = provinces.filter((p) =>
    availableProvinceIds.has(p.id)
  );

  useEffect(() => {
    setLoadingOrgs(true);

    fetch(`${API}/api/organizations`)
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingOrgs(false));

    fetch(`${API}/api/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));

    setLoadingPets(true);

    fetch(`${API}/api/pets?status=AVAILABLE`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingPets(false));
  }, [API]);

  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  function handleOrgClick(orgId) {
    setFilters(defaultFilters);
    setLoadingPets(true);

    if (selectedOrg === orgId) {
      setSelectedOrg(null);

      fetch(`${API}/api/pets?status=AVAILABLE`)
        .then((res) => res.json())
        .then((data) => setPets(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingPets(false));

      return;
    }

    setSelectedOrg(orgId);

    fetch(`${API}/api/pets?organizationId=${orgId}&status=AVAILABLE`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingPets(false));
  }

  function handleFilterSubmit(e) {
    e.preventDefault();

    setSelectedOrg(null);
    setLoadingPets(true);

    const params = new URLSearchParams();
    params.append("status", "AVAILABLE");

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        params.append(key, value);
      }
    });

    fetch(`${API}/api/pets?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingPets(false));
  }

  return (
    <AppLayout>
      <BackButton />

      <div className="has-filter">
        <main className="main">
          <section className="section organizations">
            <div className="org-carousel">
              {loadingOrgs ? (
                <p className="orgs-loading">Loading organizations...</p>
              ) : (
                organizations.map((org) => (
                  <div
                    key={org.id}
                    className={`org-icon ${
                      selectedOrg === org.id ? "active" : ""
                    }`}
                    onClick={() => handleOrgClick(org.id)}
                  >
                    <img
                      src={
                        org.organizationImage
                          ? org.organizationImage
                          : "/images/org-placeholder.png"
                      }
                      alt={org.name}
                      className="org-profile-img"
                      onError={(e) => {
                        e.target.src = "/images/org-placeholder.png";
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="section adopt-grid">
            {loadingPets && <p className="pets-loading">Loading pets...</p>}

            {!loadingPets &&
              pets.map((pet) => (
                <Link
                  key={pet.id}
                  to={`/adopt/${pet.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="adopt-card">
                    <div className="adopt-pet-photo">
                      <img
                        src={
                          pet.petImage
                            ? pet.petImage
                            : "/images/placeholder.jpg"
                        }
                        alt={pet.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="pet-info">
                      <div className="pet-text">
                        <h3>{pet?.name}</h3>
                        <p>{pet?.breed?.name}</p>

                        <p className="pet-org-province">
                          <FaMapMarkerAlt className="location-icon" />
                          {pet?.organization?.province?.name ||
                            pet?.organization?.province ||
                            "Unknown province"}
                        </p>

                        <div className="pet-tags">
                          {pet?.age && (
                            <span className="tag">{pet.age} yrs</span>
                          )}
                          {pet?.isSpayedOrNeutered && (
                            <span className="tag dark">Neutered</span>
                          )}
                        </div>
                      </div>

                      <div className="pet-side-info">
                        <div
                          className={`pet-type ${
                            pet?.isMale === true
                              ? "male"
                              : pet?.isMale === false
                              ? "female"
                              : ""
                          }`}
                        >
                          <img
                            src={
                              pet?.breed?.isCat
                                ? "/images/flags/cat.jpg"
                                : "/images/flags/dog.jpg"
                            }
                            alt={pet?.breed?.isCat ? "Cat" : "Dog"}
                          />
                        </div>

                        <div className="pet-org-avatar">
                          <img
                            src={
                              pet?.organization?.organizationImage
                                ? pet.organization.organizationImage
                                : "/images/org-placeholder.png"
                            }
                            alt={pet?.organization?.name}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

            {!loadingPets && pets.length === 0 && (
              <p className="pets-loading">No pets found.</p>
            )}
          </section>
        </main>

        <aside className="filter-bar">
          <h3>FILTER</h3>

          <form className="filter-form" onSubmit={handleFilterSubmit}>
            <div className="filter-group">
              <label>Province</label>
              <select
                name="provinceId"
                value={filters.provinceId}
                onChange={handleChange}
              >
                <option value="">Available Provinces</option>

                {filteredProvinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Species</label>
              <select
                name="species"
                value={filters.species}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sex</label>
              <select
                name="isMale"
                value={filters.isMale}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Neutered</label>
              <select
                name="isNeutered"
                value={filters.isNeutered}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Age Range</label>

              <div className="age-range">
                <input
                  type="number"
                  name="age_min"
                  placeholder="Min"
                  min="0"
                  value={filters.age_min}
                  onChange={handleChange}
                />

                <span className="age-separator">-</span>

                <input
                  type="number"
                  name="age_max"
                  placeholder="Max"
                  min="0"
                  value={filters.age_max}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Adoption Fee Range</label>

              <div className="age-range">
                <input
                  type="number"
                  name="fee_min"
                  placeholder="Min"
                  min="0"
                  value={filters.fee_min}
                  onChange={handleChange}
                />

                <span className="age-separator">-</span>

                <input
                  type="number"
                  name="fee_max"
                  placeholder="Max"
                  min="0"
                  value={filters.fee_max}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="filter-btn">
              Apply Filters
            </button>
          </form>
        </aside>
      </div>
    </AppLayout>
  );
}

export default AdopterAdopt;