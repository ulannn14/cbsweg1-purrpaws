import { useEffect, useState } from "react";
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

          <div className="applications-list">

            {applications.map(app => (

                <div key={app.id} className="application-card">
                <div className="adopt-card">

                  <div className="adopt-pet-photo">
                    <img
                      src={
                        app.pet?.image
                          ? `${API}/images/${app.pet.image}`
                          : `/temp-photos/pets/pet-main-${app.pet?.id}.jpg`
                      }
                      alt={app.pet?.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>

                  <div className="pet-info">

                    <div className="pet-text">
                      <h3>{app.pet?.name}</h3>
                      <p>{app.pet?.breed?.name}</p>

                      <div className="pet-tags">
                        {app.pet?.age && <span className="tag">{app.pet.age} yrs</span>}
                        {app.pet?.isSpayedOrNeutered && <span className="tag dark">Neutered</span>}
                      </div>
                    </div>

                    {/* SPECIES INDICATOR */}
                    <div
                      className={`pet-type ${
                        app.pet?.isMale === true
                          ? "male"
                          : app.pet?.isMale === false
                          ? "female"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          app.pet?.species === "DOG"
                            ? "/images/flags/dog.jpg"
                            : "/images/flags/cat.jpg"
                        }
                        alt={app.pet?.species}
                      />
                    </div>

                  </div>

                </div>

                  {/* APPLICATION INFO */}
                  <div className="application-info">

                    <h3>{app.pet?.organization?.name}</h3>

                    <p>
                      Application Date{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div className={`status-pill ${app.status?.toLowerCase()}`}>
                    {app.status}
                  </div>

                </div>

            ))}

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterApplication;