import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ApplicationDetail(){

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(()=>{

    fetch(`${API}/api/applications/${id}`)
      .then(res => res.json())
      .then(data => setApplication(data))
      .catch(err => console.error(err));

  },[id]);

  if(!application) return <p>Loading...</p>;

  return(
    <AppLayout>

      <main className="main">

        <section className="section">

          <h2>Application Details</h2>

          <div className="application-detail">

            <img
              src={
                application.pet?.image
                ? `${API}/images/${application.pet.image}`
                : `/temp-photos/pets/pet-main-${application.pet?.id}.jpg`
              }
              alt={application.pet?.name}
            />

            <h3>{application.pet?.name}</h3>
            <p>Breed: {application.pet?.breed}</p>

            <p>Status: {application.status}</p>

            <p>
              Applied on:
              {" "}
              {new Date(application.createdAt).toLocaleDateString()}
            </p>

          </div>

        </section>

      </main>

    </AppLayout>
  )
}

export default ApplicationDetail