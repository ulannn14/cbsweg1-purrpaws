import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgLanding() {

  const [activeTab, setActiveTab] = useState("PENDING");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  const org = JSON.parse(localStorage.getItem("org"));
  const orgId = org?.id;

  // Fetch applications
  const fetchApplications = async () => {
    try {

      const res = await fetch(`${API}/api/applications/org/${orgId}`);
      const data = await res.json();

      setApplications(data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {

    if (!orgId) return;

    fetchApplications();

  }, [orgId]);

  const filteredApps = applications.filter(
    app => app?.status === activeTab
  );

  return (
    <OrgAppLayout>

      <main className="org-main">

        <h1 className="org-title">{org?.name}</h1>

        {/* Tabs */}

        <div className="org-tabs">

          <button
            className={activeTab === "PENDING" ? "active" : ""}
            onClick={() => setActiveTab("PENDING")}
          >
            PENDING
          </button>

          <button
            className={activeTab === "ASSESSMENT" ? "active" : ""}
            onClick={() => setActiveTab("ASSESSMENT")}
          >
            FOR ASSESSMENT
          </button>

          <button
            className={activeTab === "APPROVED" ? "active" : ""}
            onClick={() => setActiveTab("APPROVED")}
          >
            APPROVED
          </button>

          <button
            className={activeTab === "REJECTED" ? "active" : ""}
            onClick={() => setActiveTab("REJECTED")}
          >
            REJECTED
          </button>

        </div>

        {/* Application Cards */}

        <div className="application-list">

          {loading ? (
            <p className="loading-text">Loading applications...</p>
          ) : filteredApps.length === 0 ? (
            <p className="empty-text">No applications in this status.</p>
          ) : (

            filteredApps.map(app => (

              <div key={app.id} className="application-card">

                {/* Applicant Picture */}
                <div className="applicant-pic">
                  <img
                    src={app.user?.userImage || `/temp-photos/users/user-profile-${app.user?.id}.jpg`}
                    alt="applicant"
                  />
                </div>

                {/* Applicant Info */}
                <div className="application-info">
                  <h3>{app.user?.firstName} {app.user?.lastName}</h3>
                  <p>{app.user?.email}</p>
                </div>

                {/* Pet Card */}
                <div className="adopt-card applied-pet-card">

                  <div className="adopt-pet-photo">
                    <img
                      src={
                        app.pet?.petImage
                          ? `${API}/images/${app.pet.petImage}`
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
                        {app.pet?.age && (
                          <span className="tag">{app.pet.age} yrs</span>
                        )}
                        {app.pet?.isSpayedOrNeutered && (
                          <span className="tag dark">Neutered</span>
                        )}
                      </div>
                    </div>

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
                          app.pet?.breed?.isCat
                            ? "/images/flags/cat.jpg"
                            : "/images/flags/dog.jpg"
                        }
                        alt="species"
                      />
                    </div>

                  </div>

                </div>

                {/* View Button */}
                <Link to={`/org/applications/${app.id}`}>
                  <button className="view-btn">
                    VIEW
                  </button>
                </Link>

              </div>

            ))
          )}

        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgLanding;