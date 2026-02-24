import { useEffect, useState } from 'react';

export default function AdopterAdopt() {
  const [cats, setCats] = useState([]);
  const [filters, setFilters] = useState({
    age_min: '',
    age_max: '',
    gender: '',
    temperament: '',
    vaccine: ''
  });

  // Fetch cats from backend
  const fetchCats = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`http://localhost:5000/api/cats?${query}`);
    const data = await res.json();
    setCats(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCats();
  };

  return (
    <>
      <main className="main">
        <section className="section adopt-grid">
          {cats.length === 0 && <p>No cats found.</p>}
          {cats.map(cat => (
            <div className="adopt-card" key={cat._id}>
              <div className="pet-photo">
                <img src={cat.image || '/placeholder.png'} alt={cat.name} width="100%" />
              </div>
              <div className="pet-info">
                <h3>{cat.name}</h3>
                <p>{cat.breed}</p>
                <p>Age: {cat.age}</p>
                <p>Gender: {cat.gender}</p>
                <p>Temperament: {cat.temperament}</p>
                <div className="tags">
                  {cat.vaccinationStatus?.map(v => (
                    <span className="tag" key={v}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <aside className="filter-bar">
        <h3>FILTER</h3>
        <form className="filter-form" onSubmit={handleSubmit}>
          <div className="filter-group">
            <label>Age Range</label>
            <input
              type="number"
              name="age_min"
              placeholder="Min"
              value={filters.age_min}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="age_max"
              placeholder="Max"
              value={filters.age_max}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Temperament</label>
            <select name="temperament" value={filters.temperament} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Energetic">Energetic</option>
              <option value="Calm">Calm</option>
              <option value="Shy">Shy</option>
              <option value="Friendly">Friendly</option>
              <option value="Independent">Independent</option>
              <option value="Affectionate">Affectionate</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Vaccination</label>
            <select name="vaccine" value={filters.vaccine} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Spayed/Neutered">Spayed/Neutered</option>
              <option value="ARV(Anti-Rabies)">ARV(Anti-Rabies)</option>
              <option value="4-in-1 Vaccine">4-in-1 Vaccine</option>
              <option value="Deworm">Deworm</option>
            </select>
          </div>

          <button type="submit" className="filter-btn">Apply Filters</button>
        </form>
      </aside>
    </>
  );
}