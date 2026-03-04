import AppLayout from "../components/AppLayout";

function AdopterAsean() {
  return (
    <AppLayout>

      <main className="main">

        <section className="section asean-info">

          <div className="asean-header">
            <h2>Pet Adoption and Stray Animal Situation in ASEAN</h2>
            <p>
              Stray animal populations remain a major concern across many
              Southeast Asian countries. Limited shelter capacity, lack of
              awareness on responsible pet ownership, and rapid urbanization
              contribute to the growing number of stray cats and dogs in
              cities across the region.
            </p>
          </div>

          {/* Philippines */}
          <div className="asean-block">
            <h3>Philippines</h3>
            <p>
              In the Philippines, animal welfare organizations such as rescue
              shelters and volunteer groups play a major role in reducing the
              number of stray animals. Adoption drives, vaccination programs,
              and spay-and-neuter initiatives help control the stray population.
              However, many shelters operate with limited resources and depend
              heavily on donations and volunteers.
            </p>
          </div>

          {/* Thailand */}
          <div className="asean-block">
            <h3>Thailand</h3>
            <p>
              Thailand has implemented community programs such as
              trap-neuter-return (TNR) to manage stray animals. These programs
              aim to control reproduction while allowing animals to live safely
              within communities.
            </p>
          </div>

          {/* Indonesia */}
          <div className="asean-block">
            <h3>Indonesia</h3>
            <p>
              Indonesia faces similar challenges in urban areas where stray
              animal populations continue to grow. Local animal welfare
              organizations advocate for stronger animal protection policies,
              improved veterinary care, and increased public awareness.
            </p>
          </div>

          {/* ASEAN Cooperation */}
          <div className="asean-block">
            <h3>Regional Efforts</h3>
            <p>
              Across ASEAN countries, collaboration between governments,
              animal welfare organizations, and communities is essential.
              Adoption platforms and digital systems can help connect animals
              with potential adopters while improving transparency and
              coordination among shelters.
            </p>
          </div>

          {/* Optional visual block */}
          <div className="asean-visual">
            <img src="/images/asean-pets.jpg" alt="ASEAN stray animals" />
          </div>

        </section>

      </main>

    </AppLayout>
  );
}

export default AdopterAsean;