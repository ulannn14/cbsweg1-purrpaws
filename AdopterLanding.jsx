import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPet, setFeaturedPet] = useState(null);
    const [pets, setPets] = useState([]);

    // Fetch Campaigns + Pet Data
    useEffect(() => {

        fetch("http://localhost:5000/api/campaigns")
        .then(res => res.json())
        .then(data => setCampaigns(data))
        .catch(err => console.error(err));

        fetch("http://localhost:5000/api/cats")
        .then(res => res.json())
        .then(data => {
            console.debug('Fetched pets:', data?.length ?? 'no-data', data);
            setPets(data);
        })
        .catch(err => console.error(err));

        fetch("http://localhost:5000/api/featured-pet")
        .then(res => res.json())
        .then(data => setFeaturedPet(data))
        .catch(err => console.error(err));

    }, []);

    return (
        <AppLayout>

        <main className="main">

            {/* ========================= */}
            {/* Campaigns Section */}
            {/* ========================= */}

            <section className="section campaigns">

            <h2>CAMPAIGNS</h2>

            <div className="carousel-wrapper">

                <button className="carousel-btn prev">❮</button>

                <div className="carousel">

                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                    <div key={campaign._id} className="campaign-card">
                        {campaign.title}
                    </div>
                    ))
                ) : (
                    <>
                    <div className="campaign-card">Campaign 1</div>
                    <div className="campaign-card">Campaign 2</div>
                    <div className="campaign-card">Campaign 3</div>
                    </>
                )}

                </div>

                <button className="carousel-btn next">❯</button>

            </div>

            <div className="carousel-dots"></div>

            </section>

            {/* ========================= */}
            {/* Adopt Section */}
            {/* ========================= */}

            <section className="section adopt">

                        <div className="section-header">
                                <h2>ADOPT HERE</h2>

                                <Link to="/adopt">
                                <button className="arrow-btn">❯</button>
                                </Link>
                        </div>

                        <div className="pet-wheel">
                            {pets.length > 0 ? (
                                pets.map(pet => (
                                    <Link key={pet._id} to={`/pets/${pet._id}`} className="pet-tile">
                                        <div className="pet-thumb">
                                            <img src={pet.image 
                                                ? `http://localhost:5000/images/${pet.image}` 
                                                : '/images/placeholder-cat.svg'} 
                                                alt={pet.name} 
                                            />
                                        </div>
                                        <div className="pet-tile-meta">
                                            <div className="pt-name">{pet.name}</div>
                                            <div className="pt-sub">{pet.age ? pet.age + ' yrs' : 'Age N/A'} • {pet.gender || 'Unknown'}</div>
                                            <div className="pt-breed">{pet.breed || 'Unknown'}</div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="pet-tile empty">No pets available</div>
                            )}
                        </div>

            </section>

            {/* ========================= */}
            {/* More Info Section */}
            {/* ========================= */}

            <section className="section more-info">

            <div className="section-header">
                <h2>MORE INFO</h2>
            </div>

            <div className="asean-text"></div>

            </section>

        </main>
        </AppLayout>
    );
}

export default AdopterLanding;