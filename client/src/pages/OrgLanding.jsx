import { useState } from "react";
import OrgLayout from "../components/OrgLayout";

function OrgLanding() {

  const [activeTab, setActiveTab] = useState("pending");

  const applications = [
    {
      id: 1,
      name: "Maria Santos",
      pet: "Orange Cat",
      status: "pending"
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      pet: "Persian Cat",
      status: "accepted"
    },
    {
      id: 3,
      name: "Ana Reyes",
      pet: "Rescue Kitten",
      status: "declined"
    }
  ];

  const filteredApps = applications.filter(
    app => app.status === activeTab
  );

  return (
    <OrgLayout>

      <main className="org-main">

        <h1 className="org-title">ORGANIZATION</h1>

        {/* Tabs */}

        <div className="org-tabs">

          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            PENDING
          </button>

          <button
            className={activeTab === "accepted" ? "active" : ""}
            onClick={() => setActiveTab("accepted")}
          >
            ACCEPTED
          </button>

          <button
            className={activeTab === "adopted" ? "active" : ""}
            onClick={() => setActiveTab("adopted")}
          >
            ADOPTED
          </button>

          <button
            className={activeTab === "declined" ? "active" : ""}
            onClick={() => setActiveTab("declined")}
          >
            DECLINED
          </button>

        </div>

        {/* Application Cards */}

        <div className="application-list">

          {filteredApps.map(app => (

            <div key={app.id} className="application-card">

              <div className="application-info">
                <h3>{app.name}</h3>
                <p>{app.pet}</p>
              </div>

              <button className="view-btn">
                VIEW
              </button>

            </div>

          ))}

        </div>

      </main>

    </OrgLayout>
  );
}

export default OrgLanding;