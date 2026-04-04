import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function OrgDetail() {
    const API = import.meta.env.VITE_API_URL;
    const { id } = useParams();

    const [orgInfo, setOrgInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/organizations/${id}`)
            .then(res => res.json())
            .then(data => {
                setOrgInfo(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        if (!id) return;

        setLoadingPets(true);

        fetch(`${API}/api/pets?organizationId=${id}&status=AVAILABLE`)
            .then(res => res.json())
            .then(data => setPets(data))
            .catch(err => console.error(err))
            .finally(() => setLoadingPets(false));
    }, [API, id]);

    if (loading || !orgInfo) {
        return (
            <AppLayout>
                <div className="page-loading">
                    <p>Loading organization...</p>
                </div>
            </AppLayout>
        );
    }

    const STATUS_LABELS = {
        CATS: "Cats",
        DOGS: "Dogs",
        BOTH: "Cats and Dogs"
    };

    return (
        <AppLayout>
          <BackButton />
            <main className="main">
                <section className="section profile-section">

                    <div className="profile-box">

                        {/* HEADER */}
                        <div className="profile-header">
                            <img
                            src={
                                orgInfo.organizationImage ||
                                "/images/org-placeholder.png"
                            }
                            alt="Org Logo"
                            className="profile-avatar"
                            onError={(e) => {
                                e.target.src = "/images/org-placeholder.png";
                            }}
                            />

                            <div>
                                <h1>{orgInfo.name}</h1>
                                <p className="sub-text">
                                    {orgInfo.city}, {orgInfo.province?.name}
                                </p>
                            </div>
                        </div>

                        <h2 className="apply-title">About</h2>
                        <div className="personal-grid">
                            <div className="about-section">
                                <span>
                                    {orgInfo.description || "No description provided."}
                                </span>
                            </div>
                        </div>

                        {/* ORGANIZATION INFO */}
                        <h2 className="apply-title">Organization Information</h2>
                        <div className="apply-box">
                            <div className="personal-grid">

                                <div className="info-row">
                                    <label>Name</label>
                                    <span>{orgInfo.name}</span>
                                </div>

                                <div className="info-row">
                                    <label>Type</label>
                                    <span>{orgInfo.organizationType}</span>
                                </div>

                                <div className="info-row">
                                    <label>Year Established</label>
                                    <span>
                                        {orgInfo.yearEstablished
                                            ? new Date(orgInfo.yearEstablished).getFullYear()
                                            : "N/A"}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* CONTACT */}
                        <h2 className="apply-title">Contact</h2>
                        <div className="apply-box">
                            <div className="personal-grid">

                                <div className="info-row">
                                    <label>Contact Person</label>
                                    <span>{orgInfo.contactPerson || "N/A"}</span>
                                </div>

                                <div className="info-row">
                                    <label>Contact Number</label>
                                    <span>{orgInfo.contactNumber}</span>
                                </div>

                                <div className="info-row">
                                    <label>Website</label>
                                    <span>{orgInfo.website || "N/A"}</span>
                                </div>

                            </div>
                        </div>

                        {/* LOCATION */}
                        <h2 className="apply-title">Location</h2>
                        <div className="apply-box">
                            <div className="personal-grid">

                                <div className="info-row">
                                    <label>City</label>
                                    <span>{orgInfo.city}</span>
                                </div>

                                <div className="info-row">
                                    <label>Address</label>
                                    <span>{orgInfo.address}</span>
                                </div>

                            </div>
                        </div>

                        {/* ADDITIONAL */}
                        <h2 className="apply-title">Additional Info</h2>
                        <div className="apply-box">
                            <div className="personal-grid">

                                <div className="info-row">
                                    <label>Foster Pets</label>
                                    <span>{STATUS_LABELS[orgInfo.status] || "Unknown"}</span>
                                </div>

                                <div className="info-row">
                                    <label>Number of Animals</label>
                                    <span>{orgInfo.numberOfAnimals}</span>
                                </div>

                            </div>
                        </div>

                        {/* PETS UNDER THIS ORG */}
                        <h2 className="apply-title">Pets Available for Adoption</h2>

                        <div className="org-pets-section">

                            {loadingPets && (
                                <p className="pets-loading">Loading pets...</p>
                            )}

                            {!loadingPets && pets.length === 0 && (
                                <p className="pets-loading">No pets available at the moment.</p>
                            )}

                            {!loadingPets && pets.map(pet => (
                                <Link
                                    key={pet.id}
                                    to={`/adopt/${pet.id}`}
                                    style={{ textDecoration: "none" }}
                                >

                                <div className="adopt-card">

                                    <div className="adopt-pet-photo">
                                    <img
                                    src={
                                        pet.petImage
                                        ? pet.petImage
                                        : "/images/placeholder.jpg"
                                    }
                                    alt={pet.name}
                                    onError={(e) => {
                                        e.target.src = "/images/placeholder.jpg";
                                    }}
                                    />
                                    </div>

                                    <div className="pet-info">

                                        <div className="pet-text">
                                            <h3>{pet.name}</h3>
                                            <p>{pet.breed?.name}</p>

                                            <div className="pet-tags">
                                                {pet.age && <span className="tag">{pet.age} yrs</span>}
                                                {pet.isSpayedOrNeutered && (
                                                    <span className="tag dark">Neutered</span>
                                                )}
                                            </div>
                                        </div>

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
                                                    pet.breed?.isCat === false
                                                        ? "/images/flags/dog.jpg"
                                                        : "/images/flags/cat.jpg"
                                                }
                                                alt={pet.breed?.isCat ? "Cat" : "Dog"}
                                            />
                                        </div>

                                    </div>

                                </div>

                                </Link>
                            ))}

                        </div>

                    </div>

                </section>
            </main>
        </AppLayout>
    );
}

export default OrgDetail;