import { Link } from 'react-router-dom';

export default function HomePage({ campaigns = [], pets = [] }) {
  return (
    <div className="app-layout">

      <main className="main">

        <section className="section campaigns">
          <h2>CAMPAIGNS</h2>

          <div className="carousel-wrapper">

            <button className="carousel-btn prev">❮</button>

            <div className="carousel">
              {/* Access campaign banners from DB */}
              {campaigns.length === 0 && <p>No campaigns found.</p>}
              {campaigns.map((campaign, index) => (
                <div className="campaign-card" key={index}>
                  {campaign.title}
                </div>
              ))}
            </div>

            <button className="carousel-btn next">❯</button>

          </div>

          <div className="carousel-dots"></div>
        </section>

        {/* Adopt Here Section */}
        <section className="section adopt">
          <div className="section-header">
            <h2>ADOPT HERE</h2>
            <Link to="/adopt">
              <button className="arrow-btn">❯</button>
            </Link>
          </div>

          {pets.length === 0 && <p>No pets available for adoption.</p>}

          {pets.map(cat => (
            <div className="adopt-card" key={cat._id}>
              <div className="pet-photo">
                <img
                  src={cat.image || '/placeholder.png'}
                  alt={cat.name}
                  width="100%"
                />
              </div>
              <div className="pet-info">
                <h3>{cat.name}</h3>
                <p>{cat.breed}</p>
                <div className="tags">
                  {cat.vaccinationStatus?.map((v) => (
                    <span className="tag" key={v}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* More Info / ASEAN Section */}
        <section className="section more-info">
          <div className="section-header">
            <h2>MORE INFO</h2>
          </div>

          <div className="asean-text">
            {/* Insert ASEAN text or dynamic content here */}
          </div>
        </section>

      </main>

    </div>
  );
}