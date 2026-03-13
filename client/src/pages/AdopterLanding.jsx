import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const API = import.meta.env.VITE_API_URL;

    // Hardcoded campaign images
    const campaignImages = [
        "/images/campaign/campaign1.jpg",
        "/images/campaign/campaign2.jpg",
        "/images/campaign/campaign3.jpg"
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % campaignImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? campaignImages.length - 1 : prev - 1
        );
    };

    useEffect(() => {

        fetch('${API}/api/pets?status=AVAILABLE&limit=4')
        .then(res => res.json())
        .then(data => {
            console.debug("Fetched pets:", data);
            setFeaturedPets(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % campaignImages.length);
        }, 3000);

        return () => clearInterval(timer);

    }, []);

    return (
        <AppLayout>

        <main className="main">

            {/* ========================= */}
            {/* Campaigns Section */}
            {/* ========================= */}

            <section className="section campaigns">

            <div className="carousel-wrapper">

                <button className="carousel-btn prev" onClick={prevSlide}>
                    ❮
                </button>

                <div className="carousel">
                    <div className="campaign-card">
                        <img src={campaignImages[currentSlide]} alt="Campaign"/>
                    </div>
                </div>

                <button className="carousel-btn next" onClick={nextSlide}>
                    ❯
                </button>

            </div>

            {/* Dots */}
            <div className="carousel-dots">
                {campaignImages.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentSlide ? "dot active" : "dot"}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>

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

             {loading && <p className="pets-message">Loading pets...</p>}

            {!loading && featuredPets.length === 0 && (
                <p className="pets-message">Failed to load.</p>
            )}


            {!loading && featuredPets.slice(0, 4).map(pet => (

                <Link
                key={pet.id}
                to={`/adopt/${pet.id}`}
                style={{ textDecoration: "none" }}
                >

                <div className="adopt-card">

                    <div className="adopt-pet-photo">
                    <img
                        src={`/temp-photos/pets/pet-main-${pet.id}.jpg`}
                        alt={pet.name}
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                        }}
                    />
                    </div>

                    <div className="pet-info">
                        <div className="pet-text">
                            <h3>{pet.name}</h3>
                            <p>{pet.breed?.name}</p>

                            <div className="pet-tags">
                            {pet.age && <span className="tag">{pet.age} yrs</span>}
                            {pet.isSpayedOrNeutered && <span className="tag dark">Neutered</span>}
                            </div>
                        </div>

                        {/* SPECIES INDICATOR */}
                        <div
                            className={`pet-type ${
                            pet.isMale === true
                                ? "male"
                                : pet.isMale === false
                                ? "female"
                                : ""
                            }`}
                        >
                            <img
                            src={
                                pet.breed?.isCat
                                ? "/images/flags/cat.jpg"
                                : "/images/flags/dog.jpg"
                            }
                            alt={pet.breed?.isCat ? "Cat" : "Dog"}
                            />
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
