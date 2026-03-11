import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function OrganizationDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/organizations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.debug("Organization fetched", data);
        setOrg(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, API]);

  if (loading)
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );

  if (!org)
    return (
      <AppLayout>
        <div>Organization not found.</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="org-profile">

        {/* Organization Photo */}
        <div className="org-profile-photo">
          <img
            src="/images/organization-placeholder.svg"
            alt={org.name}
          />
        </div>

        {/* Organization Details */}
        <div className="org-profile-box">
          <h2>{org.name}</h2>

          <p><strong>Type:</strong> {org.organizationType}</p>

          <p>
            <strong>Location:</strong>{" "}
            {org.city}, {org.province?.name || "Unknown"}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {org.address || "Not specified"}
          </p>

          <p>
            <strong>Year Established:</strong>{" "}
            {org.yearEstablished
              ? new Date(org.yearEstablished).getFullYear()
              : "Unknown"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {org.status || "Unknown"}
          </p>

          <p>
            <strong>Animals Currently Sheltered:</strong>{" "}
            {org.numberOfAnimals ?? "Unknown"}
          </p>

          {org.description && (
            <>
              <p><strong>About the Organization</strong></p>
              <p className="org-profile-desc">{org.description}</p>
            </>
          )}

          <p><strong>Contact Information</strong></p>

          <p><strong>Email:</strong> {org.email}</p>
          <p><strong>Phone:</strong> {org.contactNumber}</p>

          {org.contactPerson && (
            <p>
              <strong>Contact Person:</strong>{" "}
              {org.contactPerson} {org.contactPersonRole && `(${org.contactPersonRole})`}
            </p>
          )}

          {org.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a href={org.website} target="_blank" rel="noreferrer">
                {org.website}
              </a>
            </p>
          )}

          {org.socialMediaLinks?.length > 0 && (
            <>
              <p><strong>Social Media</strong></p>
              <ul>
                {org.socialMediaLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {org.registrationNumber && (
            <p>
              <strong>Registration Number:</strong>{" "}
              {org.registrationNumber}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default OrganizationDetail;