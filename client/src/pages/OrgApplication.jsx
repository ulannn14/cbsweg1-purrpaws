import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function OrgApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/applications/${id}`)
      .then(res => res.json())
      .then(data => {
        setApplication(data);
        setStatus(data.status);
        setAssessmentNotes(data.comment || "");
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
      body: JSON.stringify({
        status: newStatus,
        notes: assessmentNotes
      })
    });

    setStatus(newStatus);
    setPendingAction(null);
    navigate("/org");
  }

  return (
    <OrgAppLayout>
      <BackButton />

      <main className="org-main">
        <section className="section org-application">

          {/* STATUS */}
          <div className={`status-pill ${status.toLowerCase()}`}>
            {status === "UNDER_REVIEW" ? "UNDER REVIEW" : status}
          </div>

          <div className="org-app-grid">

            {/* COLUMN 1 — APPLICANT */}
            <div className="column">
              <h2>Applicant Details</h2>

              <div className="applicant-photo">
                <img
                  src={
                    applicant?.userImage ||
                    `/temp-photos/users/user-profile-${applicant?.id}.jpg`
                  }
                  alt="Applicant"
                />
              </div>

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
            </div>

            {/* COLUMN 2 — QUESTIONNAIRE */}
            <div className="column">
              <h2>Adoption Questionnaire</h2>

              <div className="application-section">
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
            </div>

            {/* COLUMN 3 — PET */}
            <div className="column">
              <h2>Pet Applied</h2>

              <Link
                to={pet ? `/edit-pet/${pet.id}` : "#"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="adopt-card applied-pet-card">
                  <div className="adopt-pet-photo">
                    <img
                      src={`https://aiqpzufzjfwgwhmuxjby.supabase.co/storage/v1/object/public/petImages/${encodeURIComponent(pet?.name)}.jpg`}
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
              </Link>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="org-app-actions">

            {/* REJECT */}
            <button
              className={`application-decline-btn ${
                status === "REJECTED" || pendingAction === "REJECTED"
                  ? "selected-reject"
                  : ""
              }`}
              disabled={
                status === "REJECTED" ||
                status === "APPROVED" ||
                pendingAction === "APPROVED" ||
                pendingAction === "UNDER_REVIEW"
              }
              onClick={() => setPendingAction("REJECTED")}
            >
              Reject
            </button>

            {/* APPROVE / MOVE */}
            <button
              className={`application-action-btn ${
                status === "APPROVED" || pendingAction === "APPROVED"
                  ? "selected-approve"
                  : ""
              }`}
              disabled={
                status === "REJECTED" ||
                status === "APPROVED" ||
                pendingAction === "REJECTED"
              }
              onClick={() => {
                if (status === "PENDING") {
                  setPendingAction("UNDER_REVIEW");
                } else if (status === "UNDER_REVIEW") {
                  setPendingAction("APPROVED");
                }
              }}
            >
              {status === "PENDING" && "Move to Review"}
              {status === "UNDER_REVIEW" && "Approve"}
              {status === "APPROVED" && "Approved"}
              {status === "REJECTED" && "Rejected"}
            </button>

          </div>

          {/* NOTES */}
          <div className="assessment-box">
            <label>Assessment Details</label>
            <textarea
              placeholder="Enter reason for approval/rejection..."
              value={assessmentNotes}
              onChange={(e) => setAssessmentNotes(e.target.value)}
              disabled={status === "APPROVED" || status === "REJECTED"}
            />
          </div>

          {/* SUBMIT */}
          {status !== "APPROVED" && status !== "REJECTED" && (
            <button
              className="application-submit-btn"
              disabled={!assessmentNotes || !pendingAction}
              onClick={() => updateStatus(pendingAction)}
            >
              Submit Decision
            </button>
          )}

        </section>
      </main>
    </OrgAppLayout>
  );
}

export default OrgApplication;
