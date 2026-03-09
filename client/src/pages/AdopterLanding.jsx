import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API}/api/pets`)
        .then(res => res.json())
        .then(data => {
            console.debug("Fetched pets:", data);
            setFeaturedPets(data);
        })
        .catch(err => console.error(err));

    }, []);

    return (
        <AppLayout>

        <main className="main">

            {/* ========================= */}
            {/* Campaigns Section */}
            {/* ========================= */}

            <section className="section campaigns">

            <div className="carousel-wrapper">

                <div className="carousel">

                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                    <div key={campaign.id} className="campaign-card">
                        {campaign.title}
                    </div>
                    ))
                ) : (
                    <div className="campaign-card">
                        <img src="/images/campaign.jpg" alt="Campaign" />
                    </div>
                )}

                </div>

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

            <div className="adopt-grid">

            {featuredPets.map(pet => (

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

            </div>

            </section>

            {/* ========================= */}
            {/* More Info Section */}
            {/* ========================= */}

            <section className="section more-info">

            <div className="section-header">
                <h2>MORE INFO</h2>

                <Link to="/asean-info">
                <button className="arrow-btn">❯</button>
                </Link>
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