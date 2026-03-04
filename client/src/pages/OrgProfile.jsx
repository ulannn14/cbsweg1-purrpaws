import { useState } from "react";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgProfile() {

  const [org] = useState({
    email: "pawsrescue@email.com",
    password: "********",
    name: "Paws Rescue Organization",
    birthdate: "Founded 2018",
    address: "Quezon City, Philippines"
  });

  return (
    <OrgAppLayout>

      <main className="org-main">

        <section className="org-profile-section">

          <div className="org-profile-box">

            <a href="/">
            <button className="edit-btn">EDIT</button>
            </a>

            {/* PROFILE IMAGE */}

            <div className="org-profile-image">
              <div className="org-avatar"></div>
            </div>

            {/* PROFILE INFO */}

            <div className="profile-grid">

              <label>Email</label>
              <div className="profile-field">{org.email}</div>

              <label>Password</label>
              <div className="profile-field">{org.password}</div>

              <label>Name</label>
              <div className="profile-field">{org.name}</div>

              <label>Date Established</label>
              <div className="profile-field">{org.birthdate}</div>

              <label>Address</label>
              <div className="profile-field">{org.address}</div>

            </div>

          </div>

        </section>

      </main>

    </OrgAppLayout>
  );
}

export default OrgProfile;