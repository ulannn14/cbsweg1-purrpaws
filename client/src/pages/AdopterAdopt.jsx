import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterAdopt() {

    const [organizations, setOrganizations] = useState([]);
    const [pets, setPets] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const [filters, setFilters] = useState({
        provinceId: "",
        age_min: "",
        age_max: ""
    });

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API}/api/organizations`)
        .then(res => res.json())
        .then(data => setOrganizations(data))
        .catch(err => console.error(err));

        fetch(`${API}/api/pets`)
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error(err));

        // fetch provinces for dropdown
        fetch(`${API}/api/provinces`)
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error(err));

    }, []);

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    }

    function handleFilterSubmit(e) {
        e.preventDefault();

        fetch(
        `${API}/api/pets?provinceId=${filters.provinceId}&age_min=${filters.age_min}&age_max=${filters.age_max}`
        )        
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error(err));
    }

    return (
        <AppLayout>
        <div className="has-filter">

        <main className="main">

            {/* Organizations Carousel */}
            <section className="section organizations">
            <div className="org-carousel">

                {organizations.map(org => (
                <div key={org.id} className="org-icon">
                    {org.name}
                </div>
                ))}

            </div>
            </section>

            {/* Adopt Grid */}
            <section className="section adopt-grid">

            {pets.map(pet => (
                <Link
                    key={pet.id}
                    to={`/adopt/${pet.id}`}
                    style={{ textDecoration: "none" }}
                >

                <div className="adopt-card">

                <div className="pet-photo">
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
                    <h3>{pet.name}</h3>
                    <p>{pet.breed?.name}</p>
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