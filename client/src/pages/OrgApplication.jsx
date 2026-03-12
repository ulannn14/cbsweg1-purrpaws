import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";

function OrgApplication() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("PENDING");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetch(`${API}/api/applications/${id}`)
      .then(res => res.json())
      .then(data => {
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

  async function updateStatus(newStatus) {

    await fetch(`${API}/api/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });

    setStatus(newStatus);
    navigate("/org");
  }

  async function approveApplication() {

    await fetch(`${API}/api/applications/${id}/approve`, {
      method: "PUT"
    });

    setStatus("APPROVED");

  }

  return (
    <OrgAppLayout>

      <main className="org-main">

        <section className="section org-application">

          {/* STATUS */}
          <div className={`status-pill ${status.toLowerCase()}`}>
            {status}
          </div>

          {/* APPLICANT HEADER */}
          <div className="org-app-top">

            <div className="applicant-header">
              <h2>Applicant Details</h2>
            </div>

            <div className="applicant-photo">
              <img
                src={applicant?.userImage || "/images/profile-placeholder.png"}
                alt="Applicant"
              />
            </div>

          </div>

          {/* APPLICANT INFO */}
          <div className="application-section">

            <p><strong>Name:</strong> {application.applicantFirstName} {application.applicantLastName}</p>
            <p><strong>Email:</strong> {application.applicantEmail}</p>
            <p><strong>Phone:</strong> {application.applicantPhoneNumber}</p>
            <p><strong>Address:</strong> {application.applicantAddress}</p>

            <p>
              <strong>Age:</strong>{" "}
              {application.applicantBirthdate
                ? getAge(application.applicantBirthdate)
                : "Unknown"}
            </p>

            <p><strong>Occupation:</strong> {application.applicantOccupation}</p>
            <p><strong>Company:</strong> {application.applicantCompany}</p>
            <p><strong>Civil Status:</strong> {application.applicantCivilStatus}</p>

          </div>

          {/* PET APPLIED */}
          <div className="applied-pet-section">

            <h3>Pet Applied</h3>

            <div className="adopt-card applied-pet-card">

              <div className="adopt-pet-photo">
                <img
                  src={
                    pet?.petImage
                      ? `${API}/images/${pet.petImage}`
                      : `/temp-photos/pets/pet-main-${app.pet?.id}.jpg`
                  }
                  alt={pet?.name}
                />
              </div>

              <div className="pet-info">

                <div className="pet-text">

                  <h3>{pet?.name}</h3>
                  <p>{pet?.breed?.name}</p>

                  <div className="pet-tags">
                    {pet?.age && <span className="tag">{pet.age} yrs</span>}
                    {pet?.isSpayedOrNeutered && (
                      <span className="tag dark">Neutered</span>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* QUESTIONNAIRE */}
          <div className="application-section">

            <h3>Adoption Questionnaire</h3>

            <p><strong>Why do you want to adopt?</strong></p>
            <p>{application.response1}</p>

            <p><strong>Have you owned pets before?</strong></p>
            <p>{application.response2 ? "Yes" : "No"}</p>

            <p><strong>Where will the pet stay?</strong></p>
            <p>{application.response3}</p>

            <p><strong>Who will be responsible for the pet?</strong></p>
            <p>{application.response4}</p>

            <p><strong>Can you afford vet care?</strong></p>
            <p>{application.response5 ? "Yes" : "No"}</p>

            <p><strong>What will you do if the pet gets sick?</strong></p>
            <p>{application.response6}</p>

            <p><strong>How many hours will the pet be alone?</strong></p>
            <p>{application.response7}</p>

            <p><strong>What will happen if you move?</strong></p>
            <p>{application.response8}</p>

            <p><strong>Have you surrendered a pet before?</strong></p>
            <p>{application.response9}</p>

            <p><strong>How will you discipline the pet?</strong></p>
            <p>{application.response10}</p>

          </div>

          {/* ACTION BUTTONS */}
          <div className="org-app-actions">

            <button
              className="decline-btn"
              disabled={status === "REJECTED" || status === "APPROVED"}
              onClick={() => updateStatus("REJECTED")}
            >
              Reject
            </button>

            <button
              className="action-btn"
              disabled={status === "REJECTED" || status === "APPROVED"}
              onClick={() => {

                if (status === "PENDING") {
                  updateStatus("ASSESSMENT");
                }

                else if (status === "ASSESSMENT") {
                  approveApplication();
                }

              }}
            >

              {status === "PENDING" && "Move to Assessment"}
              {status === "ASSESSMENT" && "Approve"}
              {status === "APPROVED" && "Approved"}
              {status === "REJECTED" && "Rejected"}

            </button>

          </div>

        </section>

      </main>

    </OrgAppLayout>
  );
}

export default OrgApplication;