import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterApplication() {

  const [applications, setApplications] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetch(`${API}/api/applications`)
      .then(res => res.json())
      .then(data => {
        console.log("Applications:", data);
        setApplications(data);
      })
      .catch(err => console.error(err));

  }, []); 

  return (
    <AppLayout>

      <main className="main">

        <section className="section applications">

          <h2>APPLICATION HISTORY</h2>

          <div className="applications-list">

            {applications.map(app => (

              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="application-link"
              >

                <div className="application-card">

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
                      <p>{app.pet?.breed}</p>
                    </div>

                  </div>

                  {/* APPLICATION INFO */}
                  <div className="application-info">

                    <h3>{app.pet?.name}</h3>

                    <p>
                      Application Date:{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div className={`status-pill ${app.status}`}>
                    {app.status}
                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterApplication;