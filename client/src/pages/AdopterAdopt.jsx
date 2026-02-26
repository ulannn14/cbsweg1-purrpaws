import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterAdopt() {

    // ===============================
    // State Variables
    // ===============================

    const [organizations, setOrganizations] = useState([]);
    const [pets, setPets] = useState([]);

    const [filters, setFilters] = useState({
        location: "",
        age_min: "",
        age_max: ""
    });

    const API = import.meta.env.VITE_API_URL;

    // ===============================
    // Fetch Backend Data
    // Replace API URLs later if needed
    // ===============================

    useEffect(() => {

        fetch("http://localhost:5000/api/organizations")
        .then(res => res.json())
        .then(data => setOrganizations(data))
        .catch(err => console.error(err));

        fetch("http://localhost:5000/api/cats")
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error(err));

    }, []);

    // ===============================
    // Filter Input Change Handler
    // ===============================

    function handleChange(e) {
        setFilters({
        ...filters,
        [e.target.name]: e.target.value
        });
    }

    // ===============================
    // Filter Submit Handler
    // (Send filters to backend later)
    // ===============================

    function handleFilterSubmit(e) {
        e.preventDefault();

        console.log("FILTER VALUES:", filters);

        // Example backend filtering request
        /*
        fetch("http://localhost:5000/api/pets/filter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filters)
        })
        .then(res => res.json())
        .then(data => setPets(data));
        */
    }

    // ===============================
    // UI Render
    // ===============================

    return (
        <AppLayout>
        <div className="has-filter">

        <main className="main">

            {/* Organizations Carousel */}
            <section className="section organizations">
            <div className="org-carousel">

                {organizations.map(org => (
                <div key={org._id} className="org-icon">
                    {org.name}
                </div>
                ))}

            </div>
            </section>

            {/* Adopt Grid */}
            <section className="section adopt-grid">

            {pets.map(pet => (
                <Link key={pet._id} to={`/adopt/${pet._id}`} style={{ textDecoration: "none" }}>
                <div className="adopt-card">

                <div className="pet-photo">
                    <img
                    src={pet.image ? `http://localhost:5000${pet.image}` : '/images/placeholder-cat.svg'}
                    onError={(e) => {e.target.src = '/images/placeholder-cat.svg'}}
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
                    <p>{pet.breed}</p>

                    <div className="tags">
                    {pet.tags?.map((tag, index) => (
                        <span
                        key={index}
                        className={`tag ${tag.dark ? "dark" : ""}`}
                        >
                        {tag.label}
                        </span>
                    ))}
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

            {/* Location Filter */}
            <div className="filter-group">
                <label>Location</label>
                <input
                type="text"
                name="location"
                placeholder="Enter city or ZIP code"
                value={filters.location}
                onChange={handleChange}
                />
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