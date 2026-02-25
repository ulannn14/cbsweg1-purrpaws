import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPet, setFeaturedPet] = useState(null);

    // Fetch Campaigns + Pet Data
    useEffect(() => {

        fetch("http://localhost:5000/api/campaigns")
        .then(res => res.json())
        .then(data => setCampaigns(data))
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

                <a href="/adopt">
                <button className="arrow-btn">❯</button>
                </a>
            </div>

            {featuredPet && (
                <div className="adopt-card">

                <div className="pet-photo">
                    <img
                    src={featuredPet.photoUrl}
                    alt={featuredPet.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                    />
                </div>

                <div className="pet-info">
                    <h3>{featuredPet.name}</h3>
                    <p>{featuredPet.breed}</p>

                    <div className="tags">
                    {featuredPet.tags?.map((tag, index) => (
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
            )}

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