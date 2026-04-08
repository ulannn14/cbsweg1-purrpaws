import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterApplication() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {

  if (!user) return;

  fetch(`${API}/api/applications/user/${user.id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Applications:", data);
      setApplications(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });

  }, [API, user]);

  if (loading) {
    return (
      <AppLayout>
      <div className="page-loading">
        <p>Loading applications...</p>
      </div>
      </AppLayout>
    );
  }

  if (applications.length === 0) {
    return (
      <AppLayout>
      <div className="page-loading">
        <p>No applications yet.</p>
      </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <main className="main">

        <section className="section applications">

          <h2>APPLICATION HISTORY</h2>
          <p>Refer to email sent for application details and status updates.</p>

          <div className="applications-list">

            {applications.map((app) => {
              const pet = app.pet;

              return (
                  <div className="adopter-application-card">
                    <div className="adopt-card">

                       <Link
                        key={app.id}
                        to={pet ? `/adopt/${pet.id}` : "#"}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="adopt-pet-photo">
                          <img
                            src={
                                pet.petImage
                                    ? pet.petImage
                                    : "/images/placeholder.jpg"
                                }
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
                            <h3>{pet?.name}</h3>
                            <p>{pet?.breed?.name}</p>

                            <p className="pet-org-province">
                              <FaMapMarkerAlt className="location-icon" />
                              {pet?.organization?.province?.name ||
                                pet?.organization?.province ||
                                "Unknown province"}
                            </p>

                            <div className="pet-tags">
                              {pet?.age && <span className="tag">{pet.age} yrs</span>}
                              {pet?.isSpayedOrNeutered && (
                                <span className="tag dark">Neutered</span>
                              )}
                            </div>
                          </div>

                          <div className="pet-side-info">
                            <div
                              className={`pet-type ${
                                pet?.isMale === true
                                  ? "male"
                                  : pet?.isMale === false
                                  ? "female"
                                  : ""
                              }`}
                            >
                              <img
                                src={
                                  pet?.breed?.isCat
                                    ? "/images/flags/cat.jpg"
                                    : "/images/flags/dog.jpg"
                                }
                                alt={pet?.breed?.isCat ? "Cat" : "Dog"}
                              />
                            </div>

                            <div className="pet-org-avatar">
                              <img
                                src={
                                  pet.organization?.organizationImage ||
                                  "/images/avatar-placeholder.png"
                                }
                                alt={pet.organization?.name || "Organization"}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="application-info">
                      <h3>{pet?.organization?.name}</h3>
                      <p>
                        Application Date {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className={`status-pill ${app.status?.toLowerCase()}`}>
                      {app.status.replace("_", " ")}
                    </div>
                  </div>
              );
            })}

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterApplication;