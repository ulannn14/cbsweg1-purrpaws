import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterLanding() {

    const [campaigns, setCampaigns] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);
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

        /* ===============================
           DATABASE FETCH (DISABLED TEMP)
        ===============================

        fetch(`${API}/api/cats`)
        .then(res => res.json())
        .then(data => {
            console.debug('Fetched pets:', data?.length ?? 'no-data', data);
            setFeaturedPets(data);
        })
        .catch(err => console.error(err));
        */

        // HARDCODED DATA (temporary)

        setFeaturedPets([
            {
                _id: "1",
                name: "Milo",
                breed: "Shih Tzu",
                image: "/images/pets/dog.jpg",
                tags: [
                    { label: "Male" },
                    { label: "2 yrs old" },
                    { label: "Vaccinated", dark: true }
                ]
            },
            {
                _id: "2",
                name: "Luna",
                breed: "Persian Cat",
                image: "/images/pets/cat1.jpg",
                tags: [
                    { label: "Female" },
                    { label: "1 yr old" }
                ]
            },
            {
                _id: "3",
                name: "Rocky",
                breed: "Aspin",
                image: "/images/pets/dog.jpg",
                tags: [
                    { label: "Male" },
                    { label: "3 yrs old" }
                ]
            },
            {
                _id: "4",
                name: "Snow",
                breed: "British Shorthair",
                image: "/images/pets/cat2.jpg",
                tags: [
                    { label: "Female" },
                    { label: "Kitten" }
                ]
            }
        ]);

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % campaignImages.length);
        }, 3000);

        return () => clearInterval(timer);

    }, []);

    return (
        <AppLayout>

        <main className="main">

            {/* Campaigns */}
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

            {/* Adopt Section */}
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

            </div>

            </section>

            {/* More Info */}
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
                Southeast Asian countries.
                </p>
            </div>

            </section>

        </main>
        </AppLayout>
    );
}

export default AdopterLanding;