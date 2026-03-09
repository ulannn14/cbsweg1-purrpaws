import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdopterApply() {

  const { id } = useParams();
  const [pet, setPet] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetch(`${API}/api/pets/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Pet:", data);
        setPet(data);
      })
      .catch(err => console.error(err));

  }, [id]);

  if (!pet) {
    return (
      <AppLayout>
        <div className="main">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  const handleDone = async () => {
    try {

        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            petId: id,
            userId: user.id
        })
        });

    } catch (err) {
        console.error(err);
    }
  };

  return (
    <AppLayout>

      <main className="main">

        <section className="section apply">

          <h2>ADOPTION APPLICATION</h2>

          <div className="application-card">

            {/* PET PREVIEW */}
            <div className="pet-preview">

              <div className="pet-photo">
                <img
                  src={
                    pet.image
                      ? `${API}/images/${pet.image}`
                      : "/images/placeholder-cat.svg"
                  }
                  alt={pet.name}
                />
              </div>

              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>{pet.breed?.name}</p>
              </div>

            </div>

            {/* FORM SECTION */}
            <div className="application-info">

              <p>
                Please complete the adoption form through the Google Form link below.
                Once finished, click the button to confirm your application.
              </p>

              {/* GOOGLE FORM LINK */}
              <a
                href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="apply-btn">
                  Open Adoption Form
                </button>
              </a>

              {/* DONE BUTTON */}
              <Link to="/applications">
                <button
                  style={{
                    marginTop: "15px",
                    padding: "10px 16px"
                  }}
                  onClick={handleDone}
                >
                  I Am Done
                </button>
              </Link>

            </div>

          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterApply;