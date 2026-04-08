import AppLayout from "../components/AppLayout";
import BackButton from "../components/BackButton";

function AdopterAsean() {
  return (
    <AppLayout>
      <BackButton />

      <main className="main">
        <section className="section asean-info">
          <div className="asean-header">
            <h2>What Stops People from Adopting?</h2>
            <p>
              Stray animal overpopulation across ASEAN is not only an animal
              welfare issue, but also a public health, social, and systemic
              challenge. Despite existing policies and local initiatives, the
              problem continues to grow because of gaps in governance, behavior,
              and awareness.
            </p>
          </div>

          <div className="asean-block">
            <h3>Governance Gaps</h3>
            <p>
              Weak enforcement of animal welfare laws remains a major issue
              across ASEAN countries. While some policies already exist,
              implementation is often inconsistent because of limited resources,
              poor monitoring systems, and the low prioritization of animal
              welfare. This results in little accountability for abandonment and
              neglect.
            </p>
          </div>

          <div className="asean-block">
            <h3>Irresponsible Breeding and Pet Trade</h3>
            <p>
              Unregulated backyard breeding and informal pet selling contribute
              heavily to overpopulation. Online pet trade often operates with
              little oversight, breeding is sometimes focused more on profit
              than welfare, and unsold animals may end up abandoned. These
              practices continue adding more animals into already crowded
              shelters and streets.
            </p>
          </div>

          <div className="asean-block">
            <h3>Low Public Awareness</h3>
            <p>
              Many people still lack awareness about spaying and neutering,
              proper adoption processes, and the long-term responsibilities of
              pet ownership. Because of this, impulsive pet ownership,
              uncontrolled reproduction, and abandonment continue to happen,
              especially in growing urban areas.
            </p>
          </div>

          <div className="asean-block">
            <h3>Urbanization and Overpopulation</h3>
            <p>
              Rapid urban growth across ASEAN also affects pet ownership.
              Smaller living spaces, rental restrictions, relocation, and
              lifestyle changes can make it harder for some people to keep pets.
              When animals are seen as inconvenient, they are more likely to be
              abandoned, increasing stray populations in densely populated
              cities.
            </p>
          </div>

          <div className="asean-block">
            <h3>Religious and Cultural Influences</h3>
            <p>
              Beliefs and cultural norms also shape how animals are treated. In
              some cases, pets are viewed more as functional animals rather than
              companions, while in others there is a stronger preference for
              buying certain breeds instead of adopting. These perspectives can
              influence adoption behavior, long-term care, and overall attitudes
              toward rescued animals.
            </p>
          </div>

          <div className="asean-block">
            <h3>Why Adoption Matters</h3>
            <p>
              Adoption is one of the most effective ways to reduce stray animal
              populations. It helps reduce overcrowding in shelters, discourages
              further breeding from commercial sources, promotes responsible pet
              ownership, and gives rescued animals a second chance at a better
              life. Choosing to adopt instead of buy can directly help break the
              cycle of overbreeding and abandonment.
            </p>
          </div>

          <div className="asean-block">
            <h3>Effects of the Crisis</h3>
            <p>
              Unmanaged stray animal populations affect communities in many
              ways. These include public health risks, sanitation concerns,
              safety issues such as bites and road accidents, and added pressure
              on shelters and local resources. The issue is not only ethical,
              but also social, economic, and community-based.
            </p>
          </div>

          <div className="asean-block">
            <h3>What You Can Do</h3>
            <p>
              You can help by adopting instead of buying, supporting spay and
              neuter programs, sharing awareness about responsible pet
              ownership, supporting local shelters and rescue organizations, and
              committing to lifelong care if you choose to own a pet. Small
              individual actions can help create a much bigger impact across the
              region.
            </p>
          </div>

          <div className="asean-block">
            <h3>Moving Forward</h3>
            <p>
              Addressing stray animal overpopulation in ASEAN requires a
              combined effort through stronger policy enforcement, better public
              education, cultural and behavioral shifts, and more accessible
              adoption systems. Platforms like PurrPaws aim to help bridge these
              gaps by connecting adopters, shelters, and organizations in one
              place.
            </p>
          </div>

          <div className="asean-visual">
            <img src="/images/asean-pets.jpg" alt="ASEAN pet adoption awareness" />
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default AdopterAsean;