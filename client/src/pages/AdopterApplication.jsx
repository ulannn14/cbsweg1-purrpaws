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

  return (
    <AppLayout>

      <main className="main">

        <section className="section applications">

          <h2>APPLICATION HISTORY</h2>

          <div className="applications-list">

            {loading && <p>Loading applications...</p>}

            {!loading && applications.length === 0 && (
              <p>No applications yet.</p>
            )}

            {applications.map(app => (

                <div key={app.id} className="application-card">

                  {/* PET CARD */}
                  <div className="pet-preview">

                    <div className="pet-photo">
                      <img
                        src={
                          app.pet?.image
                          ? `${API}/images/${app.pet.image}`
                          : "/images/placeholder-cat.svg"
                        }
                        alt={app.pet?.name}
                      />
                    </div>

                    <div className="pet-info">
                      <h3>{app.pet?.name}</h3>
                      <p>{app.pet?.breed?.name}</p>
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