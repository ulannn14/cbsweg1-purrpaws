import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterAdopt() {

    const [organizations, setOrganizations] = useState([]);
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
        fee_max: ""
    };

    const [filters, setFilters] = useState(defaultFilters);



    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API}/api/organizations`)
        .then(res => res.json())
        .then(data => setOrganizations(data))
        .catch(err => console.error(err));

        fetch(`${API}/api/provinces`)
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error(err));

        setLoadingPets(true);

        fetch(`${API}/api/pets`)
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingPets(false));

    }, []);

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    }

    function handleOrgClick(orgId) {

      // reset sidebar filters
    setFilters(defaultFilters);
    setLoadingPets(true);

    // if same org clicked again -> reset filter
    if (selectedOrg === orgId) {

        setSelectedOrg(null);

           fetch(`${API}/api/pets`)
           .then(res => res.json())
           .then(data => setPets(data))
           .catch(err => console.error(err))
           .finally(() => setLoadingPets(false));

            return;
        }

        // otherwise apply org filter
        setSelectedOrg(orgId);

        fetch(`${API}/api/pets?organizationId=${orgId}`)
            .then(res => res.json())
            .then(data => setPets(data))
            .catch(err => console.error(err))
            .finally(() => setLoadingPets(false));
    }

    function handleFilterSubmit(e) {
        e.preventDefault();

        setSelectedOrg(null);
        setLoadingPets(true);

        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") {
                params.append(key, value);
            }
        });

        fetch(`${API}/api/pets?${params.toString()}`)
            .then(res => res.json())
            .then(data => setPets(data))
            .catch(err => console.error(err))
            .finally(() => setLoadingPets(false));
    }

    return (
        <AppLayout>
        <div className="has-filter">

        <main className="main">

            {/* Organizations Carousel */}
            <section className="section organizations">
            <div className="org-carousel">

                {loadingPets && (
                    <p className="orgs-loading">Loading organizations...</p>
                )}
                
                {!loadingPets && organizations.map(org => (
                <div
                    key={org.id}
                    className={`org-icon ${selectedOrg === org.id ? "active" : ""}`}
                    onClick={() => handleOrgClick(org.id)}
                >
                    {org.name}
                </div>
                ))}

            </div>
            </section>

            {/* Adopt Grid */}
            <section className="section adopt-grid">

            {loadingPets && (
                <p className="pets-loading">Loading pets...</p>
            )}

            {!loadingPets && pets.map(pet => (
                <Link
                    key={pet.id}
                    to={`/adopt/${pet.id}`}
                    style={{ textDecoration: "none" }}
                >

                <div className="adopt-card">

                <div className="adopt-pet-photo">
                    <img
                        src="/images/placeholder-cat.svg"
                        alt={pet.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </div>

                <div className="pet-info">

                        <div className="pet-text">
                            <h3>{pet.name}</h3>
                            <p>{pet.breed?.name}</p>

                            <div className="pet-tags">
                            {pet.age && <span className="tag">{pet.age} yrs</span>}
                            {pet.isSpayedOrNeutered && <span className="tag dark">Neutered</span>}
                            </div>
                        </div>

                        {/* SPECIES INDICATOR */}
                        <div
                            className={`pet-type ${
                            pet.isMale === true
                                ? "male"
                                : pet.isMale === false
                                ? "female"
                                : ""
                            }`}
                        >
                            <img
                            src={
                                pet.species === "DOG"
                                ? "/images/flags/dog.jpg"
                                : "/images/flags/cat.jpg"
                            }
                            alt={pet.species}
                            />
                        </div>

                    </div>

                </div>

                </Link>
            ))}

            </section>

        </main>

        {/* Filter Sidebar */}
        <aside className="filter-bar">

            <h3>FILTER</h3>

            <form className="filter-form" onSubmit={handleFilterSubmit}>

            {/* Province Filter */}
            <div className="filter-group">
                <label>Province</label>

                <select
                    name="provinceId"
                    value={filters.provinceId}
                    onChange={handleChange}
                >

                    <option value="">All Provinces</option>

                    {provinces.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}

                </select>
            </div>

            {/* Species Filter */}
            <div className="filter-group">
            <label>Species</label>

            <select
                name="species"
                value={filters.species}
                onChange={handleChange}
            >
                <option value="">All</option>
                <option value="DOG">Dog</option>
                <option value="CAT">Cat</option>
            </select>
            </div>

            {/* Sex Filter */}
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

            {/* Neutered Filter */}
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

            {/* Age Range Filter */}
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

            {/* Adoption Fee Range */}
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