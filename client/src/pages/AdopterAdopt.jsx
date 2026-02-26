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
        .then(data => {
            console.debug('Adopt page fetched cats', data?.length, data);
            setPets(data);
        })
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
        fetch("http://localhost:5000/api/cats/filter", {
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
                <div key={pet._id} className="adopt-card">

                <Link to={`/pets/${pet._id}`} className="pet-link">
                    <div className="pet-photo">
                    <img
                        src={pet.image ? `http://localhost:5000/images/${pet.image}` : '/images/placeholder-cat.svg'}
                        alt={pet.name}
                    />
                    </div>

                    <div className="pet-meta">
                    <h4 className="pet-name">{pet.name}</h4>
                    <p className="pet-sub">
                      {pet.gender || 'Unknown'}
                      {pet.age ? ` • ${pet.age} yr${pet.age > 1 ? 's' : ''}` : ''}
                    </p>
                    <p className="pet-breed">{pet.breed || 'Unknown'}</p>
                    {pet.status && <p className="pet-status">Status: {pet.status}</p>}
                    {pet.temperament && <p className="pet-temperament">Temperament: {pet.temperament}</p>}
                    {pet.description && <p className="pet-description">{pet.description}</p>}
                    {pet.vaccinationStatus && pet.vaccinationStatus.length > 0 && (
                      <p className="pet-vaccines">Vaccines: {pet.vaccinationStatus.join(', ')}</p>
                    )}
                    </div>
                </Link>

                </div>
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
