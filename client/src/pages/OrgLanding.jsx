import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgLanding() {

  const [activeTab, setActiveTab] = useState("PENDING");
  const [applications, setApplications] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const org = JSON.parse(localStorage.getItem("org"));

  useEffect(() => {

    if (!org) return;

    fetch(`${API}/api/applications/org/${org.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Org Applications:", data);
        setApplications(data);
      })
      .catch(err => console.error(err));

  }, [API, org]);

  const filteredApps = applications.filter(
    app => app.status === activeTab
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
            className={activeTab === "APPROVED" ? "active" : ""}
            onClick={() => setActiveTab("APPROVED")}
          >
            ACCEPTED
          </button>

          <button
            className={activeTab === "ADOPTED" ? "active" : ""}
            onClick={() => setActiveTab("ADOPTED")}
          >
            ADOPTED
          </button>

          <button
            className={activeTab === "REJECTED" ? "active" : ""}
            onClick={() => setActiveTab("REJECTED")}
          >
            DECLINED
          </button>

        </div>

        {/* Application Cards */}

        <div className="application-list">

          {filteredApps.map(app => (

            <div key={app.id} className="application-card">

              <div className="application-info">
                <h3>{app.user?.firstName} {app.user?.lastName}</h3>
                <p>{app.pet?.name}</p>
              </div>

              <Link to={`/org/applications/${app.id}`}>
                <button className="view-btn">
                  VIEW
                </button>
              </Link>

            </div>

          ))}

        </div>

      </main>

    </OrgAppLayout>
  );
}

export default OrgLanding;