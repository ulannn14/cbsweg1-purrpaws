import { useState } from "react";
import AppLayout from "../components/AppLayout";

function AdopterProfile() {

  // Hardcoded user data
  const [user] = useState({
    email: "leigh@email.com",
    password: "********",
    name: "Leigh Albo",
    birthdate: "April 15, 2003",
    address: "Santa Ana, Manila"
  });

    return (
    <AppLayout>

      <main className="main">

        <section className="section profile-section">

          <div className="profile-box">

            <h2>PROFILE INFORMATION</h2>

            <button className="edit-btn">EDIT</button>

            <div className="profile-grid">

              <label>Email</label>
              <div className="profile-field">{user.email}</div>

              <label>Password</label>
              <div className="profile-field">{user.password}</div>

              <label>Name</label>
              <div className="profile-field">{user.name}</div>

              <label>Birthdate</label>
              <div className="profile-field">{user.birthdate}</div>

              <label>Address</label>
              <div className="profile-field">{user.address}</div>

            </div>

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterProfile;