import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function OrgApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const isEditable = status === "PENDING" || status === "UNDER_REVIEW";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [messageToApplicant, setMessageToApplicant] = useState("");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/applications/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setApplication(data);
        setStatus(data.status);
        setAssessmentNotes(data.comment || "");
      })
      .catch((err) => console.error(err));
  }, [API, id]);

  {/* ! ! ! MIGHT HAVE TO PUT THIS SA BACKEND AND EDIT SO IT CAN RETURN THE CHECKLIST OPTIONS INSTEAD OF CALCULATING IT HERE ! ! ! */}
  const checklistOptions = useMemo(() => {
    if (status === "PENDING" && pendingAction === "UNDER_REVIEW") {
      return [
        "Clear and complete answers.",
        "Shows genuine intent to adopt.",
        "Basic requirements are met.",
      ];
    }

    if (status === "PENDING" && pendingAction === "REJECTED") {
      return [
        "Inconsiderable and low-quality answers.",
        "Incomplete application.",
        "Unreasonable expectations.",
        "Signs of lack of commitment.",
      ];
    }

    if (status === "UNDER_REVIEW" && pendingAction === "APPROVED") {
      return [
        "Financially capable.",
        "Responsible enough.",
        "Has time and availability in caring for a pet.",
        "Pet-friendly living situation.",
        "Has a clear care plan.",
        "Shows long-term commitment.",
        "Good match for the pet.",
      ];
    }

    if (status === "UNDER_REVIEW" && pendingAction === "REJECTED") {
      return [
        "Cannot sustain expenses.",
        "Unsuitable living situation.",
        "Unclear care plan.",
        "Inconsistent answer.",
      ];
    }

    return [];
  }, [status, pendingAction]);

  useEffect(() => {
    const combinedNotes = [];

    if (selectedReasons.length > 0) {
      combinedNotes.push(...selectedReasons);
    }

    if (otherChecked && otherReason.trim()) {
      combinedNotes.push(`Other reason: ${otherReason.trim()}`);
    }

    if (messageToApplicant.trim()) {
      combinedNotes.push(`Message to applicant: ${messageToApplicant.trim()}`);
    }

    setAssessmentNotes(combinedNotes.join("\n"));
  }, [selectedReasons, otherChecked, otherReason, messageToApplicant]);

  const toggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : [...prev, reason]
    );
  };

  const handleOtherToggle = () => {
    setOtherChecked((prev) => {
      const next = !prev;

      if (!next) {
        setOtherReason("");
      }

      return next;
    });
  };

  const clearChecklistState = () => {
    setSelectedReasons([]);
    setOtherChecked(false);
    setOtherReason("");
    setMessageToApplicant("");
    setAssessmentNotes("");
  };

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

  const showSuccessPopup = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  };

  async function updateStatus(newStatus) {
    if (!isEditable || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API}/api/applications/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: assessmentNotes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update application status");
      }

      setStatus(newStatus);
      setPendingAction(null);

      let message = "Application updated successfully!";

      if (newStatus === "REJECTED") {
        message = "Application rejected successfully!";
      } else if (newStatus === "APPROVED") {
        message = "Application approved successfully!";
      } else if (newStatus === "UNDER_REVIEW") {
        message = "Application moved to review successfully!";
      }

      showSuccessPopup(message);

      setTimeout(() => {
        navigate("/org");
      }, 1800);
    } catch (err) {
      console.error(err);
      alert("Failed to update application status");
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleAction = (action) => {
    if (!isEditable) return;

    setPendingAction((prev) => {
      const nextAction = prev === action ? null : action;
      clearChecklistState();
      return nextAction;
    });
  };



  const QUESTIONS = [
    { label: "Residence Type", field: "response1" },
    { label: "Occupation", field: "response2" },
    { label: "Why adopt?", field: "response3" },
    { label: "Experience with pets", field: "response4" },
    { label: "Preparation steps", field: "response5" },
    { label: "Vet clinic", field: "response6" },
    { label: "Planned diet", field: "response7" },
    { label: "Other pets", field: "response8" },
    { label: "Consent status", field: "response9" },
    { label: "Consent understanding", field: "response10" },
    { label: "Pets neutered?", field: "response11" },
    { label: "Plan to neuter?", field: "response12" },
    { label: "Agree to updates?", field: "response13" },
    { label: "Agree emergency updates?", field: "response14" },
    { label: "Share on social?", field: "response15" },
    { label: "Interview time", field: "response16", type: "date" }
  ];

  return (
    <OrgAppLayout>
      <BackButton />

      <main className="org-main">
        <section className="section org-application">
          {successMessage && (
            <div className="success-popup">
              <span className="success-popup-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          <div className={`status-pill ${status.toLowerCase()}`}>
            {status === "UNDER_REVIEW" ? "UNDER REVIEW" : status}
          </div>

          <div className="org-app-grid">
            <div className="column">
              <h2>Applicant Details</h2>

              <div className="applicant-photo">
                <img
                    src={applicant.userImage || "/images/avatar-placeholder.png"}
                    alt="applicant"
                  />
              </div>

              <div className="application-section">
                <p>
                  <strong>Name:</strong> {application.applicantFirstName}{" "}
                  {application.applicantLastName}
                </p>
                <p>
                  <strong>Email:</strong> {application.applicantEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {application.applicantPhoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {application.applicantAddress}
                </p>

                <p>
                  <strong>Age:</strong>{" "}
                  {application.applicantBirthdate
                    ? getAge(application.applicantBirthdate)
                    : "Unknown"}
                </p>

                <p>
                  <strong>Occupation:</strong> {application.applicantOccupation}
                </p>
                <p>
                  <strong>Company:</strong> {application.applicantCompany}
                </p>
                <p>
                  <strong>Civil Status:</strong>{" "}
                  {application.applicantCivilStatus}
                </p>
              </div>
            </div>

            <div className="column">
              <h2>Adoption Questionnaire</h2>

              <div className="application-section">
                {QUESTIONS.map((q) => {
                  let answer = application[q.field];

                  if (q.type === "date" && answer) {
                    answer = new Date(answer).toLocaleString();
                  }

                  return (
                    <div key={q.field}>
                      <p><strong>{q.label}</strong></p>
                      <p>{answer ?? "N/A"}</p>
                    </div>
                  );
              })}
              
              </div>
            </div>

            <div className="column">
              <h2>Pet Applied</h2>

              <Link
                to={pet ? `/edit-pet/${pet.id}` : "#"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="adopt-card applied-pet-card">
                  <div className="adopt-pet-photo">
                  <img
                      src={
                          pet?.petImage
                           ? pet.petImage
                           : "/images/placeholder.jpg"
                          }
                      alt={pet?.name}
                  />
                  </div>

                  <div className="pet-info">
                  <div className="pet-text">
                      <h3>{pet.name}</h3>
                      <p>{pet.breed?.name}</p>

                      <p className="pet-org-province">
                          <FaMapMarkerAlt className="location-icon" />
                          {pet.organization?.province?.name || pet.organization?.province || "Unknown province"}
                      </p>

                      <div className="pet-tags">
                      {pet.age && <span className="tag">{pet.age} yrs</span>}
                      {pet.isSpayedOrNeutered && <span className="tag dark">Neutered</span>}
                      </div>
                  </div>

                  <div className="pet-side-info">
                      <div
                      className={`pet-type ${
                          pet.isMale === true
                          ? "male"
                          : pet.isMale === false
                          ? "female"
                          : ""
                      }`}
                      >
                      <img
                          src={
                          pet.breed?.isCat
                              ? "/images/flags/cat.jpg"
                              : "/images/flags/dog.jpg"
                          }
                          alt={pet.breed?.isCat ? "Cat" : "Dog"}
                      />
                      </div>

                      <div className="pet-org-avatar">
                      <img
                          src={
                          pet.organization?.organizationImage ||
                          "/images/avatar-placeholder.png"
                        }
                        alt={pet.organization?.name || "Organization"}
                      />
                      </div>
                  </div>
                  </div>
              </div>
              </Link>
            </div>
          </div>

          <div className="org-app-actions">
            <button
              className={`application-decline-btn ${
                pendingAction === "REJECTED" ? "selected-reject" : ""
              }`}
              disabled={!isEditable}
              onClick={() => toggleAction("REJECTED")}
            >
              Reject
            </button>

            <button
              className={`application-action-btn ${
                pendingAction === "APPROVED" || pendingAction === "UNDER_REVIEW"
                  ? "selected-approve"
                  : ""
              }`}
              disabled={!isEditable}
              onClick={() => {
                if (!isEditable) return;

                if (status === "PENDING") {
                  toggleAction("UNDER_REVIEW");
                } else if (status === "UNDER_REVIEW") {
                  toggleAction("APPROVED");
                }
              }}
            >
              {status === "PENDING" && "Move to Review"}
              {status === "UNDER_REVIEW" && "Approve"}
              {status === "APPROVED" && "Approved"}
              {status === "REJECTED" && "Rejected"}
            </button>
          </div>

          {status !== "APPROVED" && status !== "REJECTED" && (
            <p className="pending-label">
              {pendingAction
                ? `Selected: ${pendingAction.replace("_", " ")}`
                : "No action selected."}
            </p>
          )}

          <div className="assessment-box">
            <label>Assessment Details</label>

            {pendingAction && checklistOptions.length > 0 && (
              <div className="assessment-checklist">
                {checklistOptions.map((reason) => (
                  <label key={reason} className="assessment-check-item">
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                      disabled={status === "APPROVED" || status === "REJECTED"}
                    />
                    <span>{reason}</span>
                  </label>
                ))}

                <label className="assessment-check-item">
                  <input
                    type="checkbox"
                    checked={otherChecked}
                    onChange={handleOtherToggle}
                    disabled={status === "APPROVED" || status === "REJECTED"}
                  />
                  <span>Other</span>
                </label>
              </div>
            )}

            {otherChecked && (
              <textarea
                placeholder="Enter other reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                disabled={status === "APPROVED" || status === "REJECTED"}
              />
            )}

            <textarea
              placeholder="Message to send to applicant (required)."
              value={messageToApplicant}
              onChange={(e) => setMessageToApplicant(e.target.value)}
              disabled={status === "APPROVED" || status === "REJECTED"}
            />
          </div>

          {status !== "APPROVED" && status !== "REJECTED" && (
            <button
              className="application-submit-btn"
              disabled={!pendingAction || !messageToApplicant.trim() || isSubmitting}
              onClick={() => updateStatus(pendingAction)}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span style={{ marginLeft: "8px" }}>Submitting...</span>
                </>
              ) : (
                "Submit Decision"
              )}
            </button>
          )}
        </section>
      </main>
    </OrgAppLayout>
  );
}

export default OrgApplication;