import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);

    const API = import.meta.env.VITE_API_URL;

    // Fetch Campaigns + Pet Data
    useEffect(() => {
        /*
        fetch(`${API}/api/campaigns`)
        .then(res => res.json())
        .then(data => setCampaigns(data))
        .catch(err => console.error(err));
        */
        fetch(`${API}/api/cats`)
        .then(res => res.json())
        .then(data => {
            console.debug('Fetched pets:', data?.length ?? 'no-data', data);
            setFeaturedPets(data);
        })
        .catch(err => console.error(err));

        fetch(`${API}/api/featured-pet`)
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

            {/* <h2>CAMPAIGNS</h2> */}

            <div className="carousel-wrapper">

                {/* <button className="carousel-btn prev">❮</button> */}

                <div className="carousel">

                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                    <div key={campaign._id} className="campaign-card">
                        {campaign.title}
                    </div>
                    ))
                ) : (
                    <>
                    <div className="campaign-card">
                    <img src="/images/campaign.jpg" alt="Campaign 1" />
                    </div>
                    </>
                )}

                </div>

                {/* <button className="carousel-btn next">❯</button> */}

            </div>

            <div className="carousel-dots"></div>

            </section>

            {/* ========================= */}
            {/* Adopt Section */}
            {/* ========================= */}

            <section className="section adopt">

            <div className="section-header">
                <h2>ADOPT HERE</h2>

                <a href="/adopt">
                <button className="arrow-btn">❯</button>
                </a>
            </div>

            <div className="adopt-grid">
            {featuredPets.map(pet => (
                <Link key={pet._id} to={`/adopt/${pet._id}`} style={{ textDecoration: "none" }}>
                <div className="adopt-card">

                <div className="pet-photo">
                    <img
                    //src={pet.image ? `http://localhost:5000${pet.image}` : '/images/placeholder-cat.svg'}
                    src={pet.image ? `${API}/images/${pet.image}` : '/images/placeholder-cat.svg'}
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
            </div>

            </section>

            {/* ========================= */}
            {/* More Info Section */}
            {/* ========================= */}

            <section className="section more-info">

            <div className="section-header">
                <h2>MORE INFO</h2>

                <a href="/asean-info">
                <button className="arrow-btn">❯</button>
                </a>
            </div>
            
            <div className="asean-header">
                <h2>Pet Adoption and Stray Animal Situation in ASEAN</h2>
                <p>
                Stray animal populations remain a major concern across many
                Southeast Asian countries. Limited shelter capacity, lack of
                awareness on responsible pet ownership, and rapid urbanization
                contribute to the growing number of stray cats and dogs in
                cities across the region.
                </p>
            </div>

            </section>

        </main>
        </AppLayout>
    );
}

export default AdopterLanding;