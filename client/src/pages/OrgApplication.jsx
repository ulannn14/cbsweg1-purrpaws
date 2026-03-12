import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgApplication() {

  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("PENDING");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetch(`${API}/api/applications/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Application:", data);
        setApplication(data);
        setStatus(data.status);
      })
      .catch(err => console.error(err));

  }, [API, id]);

  if (!application) {
    return (
      <OrgAppLayout>
        <div className="page-loading">Loading application...</div>
      </OrgAppLayout>
    );
  }

  const applicant = application.user;
  const pet = application.pet;

  function getAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

  return (
    <OrgAppLayout>

      <main className="org-main">

        <section className="section org-application">

          {/* STATUS */}
          <div className={`status-pill ${status.toLowerCase()}`}>
            {status}
          </div>

          {/* TOP ROW */}
          <div className="org-app-top">

            <div className="applicant-header">
              <h2>Applicant Details</h2>
            </div>

            {/* APPLICANT PHOTO */}
            <div className="applicant-photo">
              <img
                src="/images/profile-placeholder.png"
                alt="Applicant"
              />
            </div>

          </div>

          {/* DETAILS */}
          <div className="applicant-details">
            <p><strong>Name:</strong>  {applicant?.firstName} {applicant?.lastName}</p>
            <p><strong>Username:</strong> {applicant?.userName}</p>
            <p><strong>Email:</strong> {applicant?.email}</p>
            <p><strong>Contact:</strong> {applicant?.contactNumber}</p>
            <p><strong>Address:</strong> {applicant?.address}</p>
            <p>
            <strong>Age:</strong>{" "}
            {applicant?.birthdate ? getAge(applicant.birthdate) : "Unknown"}
            </p>
            {/* PET APPLIED */}
            <div className="applied-pet-section">

            <h3>Pet Applied</h3>

            <div className="adopt-card applied-pet-card">

                <div className="adopt-pet-photo">
                <img
                    src={
                    pet?.image
                        ? `${API}/images/${pet.image}`
                        : "/images/placeholder-cat.svg"
                    }
                    alt={pet?.name}
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

                    <div className="pet-tags">
                    {pet?.age && <span className="tag">{pet.age} yrs</span>}
                    {pet?.isSpayedOrNeutered && <span className="tag dark">Neutered</span>}
                    </div>
                </div>

                {/* SPECIES + SEX INDICATOR */}
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
                        pet?.species === "DOG"
                        ? "/images/flags/dog.jpg"
                        : "/images/flags/cat.jpg"
                    }
                    alt={pet?.species}
                    />
                </div>

                </div>

            </div>

            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="org-app-actions">

            {/* BUTTON 1 */}
            <button
              className="decline-btn"
              disabled={status === "REJECTED" || status === "APPROVED"}
              onClick={() => setStatus("REJECTED")}
            >
              Reject
            </button>

            {/* BUTTON 2 */}
            <button
              className="action-btn"
              disabled={status === "REJECTED" || status === "APPROVED"}
              onClick={() => {

                if (status === "PENDING") {
                  setStatus("FOR_ASSESSMENT");
                }

                else if (status === "FOR_ASSESSMENT") {
                  setStatus("APPROVED");
                }

              }}
            >
              {status === "PENDING" && "For Assessment"}
              {status === "FOR_ASSESSMENT" && "Approve"}
              {status === "REJECTED" && "For Assessment"}
              {status === "APPROVED" && "Approve"}
            </button>

          </div>

        </section>

      </main>

    </OrgAppLayout>
  );
}

export default OrgApplication;