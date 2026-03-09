import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterAdopt() {

    const [organizations, setOrganizations] = useState([]);
    const [pets, setPets] = useState([]);

    const [filters, setFilters] = useState({
        location: "",
        age_min: "",
        age_max: ""
    });

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {

        /* ===============================
           DATABASE FETCH (DISABLED TEMP)
        ===============================

        fetch(`${API}/api/organizations`)
        .then(res => res.json())
        .then(data => setOrganizations(data))
        .catch(err => console.error(err));

        fetch(`${API}/api/cats`)
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error(err));
        */

        // HARDCODED ORGANIZATIONS

        setOrganizations([
            { _id: "1", name: "Paws Rescue" },
            { _id: "2", name: "Hope Shelter" },
            { _id: "3", name: "Happy Tails" },
            { _id: "4", name: "Stray Haven" }
        ]);

        // HARDCODED PETS

        setPets([
            {
                _id: "1",
                name: "Milo",
                breed: "Shih Tzu",
                image: "/images/pets/dog.jpg",
                tags: [{ label: "Male" }, { label: "2 yrs old" }]
            },
            {
                _id: "2",
                name: "Luna",
                breed: "Persian",
                image: "/images/pets/cat1.jpg",
                tags: [{ label: "Female" }, { label: "1 yr old" }]
            },
            {
                _id: "3",
                name: "Rocky",
                breed: "Aspin",
                image: "/images/pets/dog.jpg",
                tags: [{ label: "Male" }, { label: "3 yrs old" }]
            },
            {
                _id: "4",
                name: "Snow",
                breed: "British Shorthair",
                image: "/images/pets/cat2.jpg",
                tags: [{ label: "Female" }, { label: "2 yrs old" }]
            },
            {
                _id: "5",
                name: "Brownie",
                breed: "Mixed Breed",
                image: "/images/pets/dog.jpg",
                tags: [{ label: "Male" }, { label: "Puppy" }]
            }
        ]);

    }, []);

    function handleChange(e) {
        setFilters({
        ...filters,
        [e.target.name]: e.target.value
        });
    }

    function handleFilterSubmit(e) {
        e.preventDefault();
        console.log("FILTER VALUES:", filters);
    }

    return (
        <AppLayout>
        <div className="has-filter">

        <main className="main">

            {/* Organizations */}
            <section className="section organizations">
            <div className="org-carousel">

                {organizations.map(org => (
                <div key={org._id} className="org-icon">
                    {org.name}
                </div>
                ))}

            </div>
            </section>

            {/* Pets */}
            <section className="section adopt-grid">

            {pets.map(pet => (
                <Link key={pet._id} to={`/adopt/${pet._id}`} style={{ textDecoration: "none" }}>
                <div className="adopt-card">

                <div className="adopt-pet-photo">
                    <img src={pet.image} alt={pet.name} />
                </div>

                <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p>{pet.breed}</p>

                    <div className="tags">
                    {pet.tags?.map((tag, index) => (
                        <span key={index} className={`tag ${tag.dark ? "dark" : ""}`}>
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

            <div className="filter-group">
                <label>Location</label>
                <input
                type="text"
                name="location"
                placeholder="Enter city"
                value={filters.location}
                onChange={handleChange}
                />
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