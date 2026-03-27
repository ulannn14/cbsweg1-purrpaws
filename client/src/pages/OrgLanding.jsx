import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgLanding() {

  const [activeTab, setActiveTab] = useState("PENDING");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            className={activeTab === "UNDER_REVIEW" ? "active" : ""}
            onClick={() => setActiveTab("UNDER_REVIEW")}
          >
            UNDER REVIEW
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
              <div
                key={app.id}
                className="org-application-card"
                onClick={() => navigate(`/org/applications/${app.id}`)}
              >

                {/* CONTENT */}
                <div className="app-content">

                  {/* Applicant */}
                  <div className="applicant-section">

                    <div className="applicant-pic">
                      <img
                      src={
                        app.user?.userName
                          ? `https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/userImages/${encodeURIComponent(app.user.userName)}.jpg`
                          : "/images/avatar-placeholder.png"
                      }
                        alt="applicant"
                      />
                    </div>

                    <div className="application-info">
                      <h3>{app.user?.firstName} {app.user?.lastName}</h3>
                      <p><strong>Email:</strong> {app.user?.email}</p>
                      <p><strong>Phone:</strong> {app.applicantPhoneNumber}</p>
                      <p><strong>Address:</strong> {app.applicantAddress}</p>
                    </div>

                  </div>

                  {/* Pet */}
                  <Link
                    to={`/edit-pet/${app.pet?.id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="org-pet-card">

                      <div className="org-adopt-pet-photo">
                        <img
                          src={`https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/petImages/${encodeURIComponent(app.pet?.name)}.jpg`}                          alt={app.pet?.name}
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
                  </Link>

                </div>

                {/* RIGHT SIDE */}
                <div className="app-right">
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/org/applications/${app.id}`);
                    }}
                  >
                    VIEW
                  </button>
                </div>

              </div>
            ))

          )}

        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgLanding;
