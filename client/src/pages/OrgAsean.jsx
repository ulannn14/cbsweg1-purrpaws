import OrgAppLayout from "../components/OrgAppLayout";
import BackButton from "../components/BackButton";

function OrgAsean() {
  return (
    <OrgAppLayout>
      <BackButton />

      <main className="org-main">
        <section className="section asean-info">
          <div className="asean-header">
            <h2>Why Adoption Isn’t Happening: The Hidden Barriers Across ASEAN</h2>
            <p>
              Animal welfare organizations across ASEAN operate within diverse
              regulatory environments and fragmented systems, which make
              coordination and large-scale impact difficult. Addressing these
              structural gaps is important in building a more unified,
              efficient, and sustainable adoption ecosystem.
            </p>
          </div>

          <div className="asean-block">
            <h3>Policy Differences Across ASEAN</h3>
            <p>
              Animal welfare laws vary significantly across ASEAN member states.
              Some countries have more established legal frameworks, while
              others have limited or less enforced regulations. Because there is
              no unified ASEAN-wide policy on animal welfare, protection
              standards and progress remain inconsistent across the region.
            </p>
          </div>

          <div className="asean-block">
            <h3>Enforcement and Governance Challenges</h3>
            <p>
              Even when laws exist, enforcement is still a major issue.
              Organizations often face limited government funding, weak
              monitoring and compliance systems, and low prioritization of
              animal welfare compared to other public concerns. This means that
              many policies exist in theory, but have limited real-world impact.
            </p>
          </div>

          <div className="asean-block">
            <h3>Data Fragmentation</h3>
            <p>
              Many organizations manage information independently through social
              media, Google Forms, spreadsheets, or internal tracking methods.
              This creates poor visibility of adoptable animals, possible
              duplicate or lost records, and inefficient coordination across
              shelters and groups. At present, there is no centralized
              ASEAN-wide database for adoption or animal tracking.
            </p>
          </div>

          <div className="asean-block">
            <h3>Cross-Country Regulatory Differences</h3>
            <p>
              Animal movement across ASEAN is also complicated by differences in
              import and export regulations, quarantine requirements, and
              documentation standards. These barriers make cross-border rescue,
              relocation, and adoption harder, even when opportunities or demand
              exist.
            </p>
          </div>

          <div className="asean-block">
            <h3>Background Checking in Adoption</h3>
            <p>
              Adoption screening processes also vary widely between
              organizations. Some groups conduct stricter screening, such as
              home checks and interviews, while others rely on more basic or
              informal evaluation methods. This inconsistency can increase the
              risk of unsafe placements, neglect, or return cases, which shows
              the need for more standardized adoption practices.
            </p>
          </div>

          <div className="asean-block">
            <h3>Gaps in Coordination and Digital Systems</h3>
            <p>
              Across the region, there is still no shared platform that connects
              shelters, adopters, and organizations in one system. Limited
              interoperability and continued reliance on manual, disconnected
              processes reduce efficiency, weaken reach, and make data-driven
              decision-making harder for organizations.
            </p>
          </div>

          <div className="asean-block">
            <h3>Best Practices in Adoption and Shelter Management</h3>
            <p>
              Research and observed organization practices suggest that better
              outcomes are supported by structured adoption workflows, detailed
              animal profiles, post-adoption monitoring, and integration with
              veterinary services. These practices can improve adoption success
              rates and welfare outcomes, but they are not yet widely
              standardized across ASEAN organizations.
            </p>
          </div>

          <div className="asean-block">
            <h3>Opportunities for ASEAN Collaboration</h3>
            <p>
              ASEAN organizations can benefit from stronger knowledge sharing,
              cross-country capacity building, collaborative advocacy campaigns,
              and more aligned adoption processes. A more connected regional
              approach can help organizations move from isolated local efforts
              toward stronger and more sustainable collective impact.
            </p>
          </div>

          <div className="asean-block">
            <h3>Centralized Digital Systems</h3>
            <p>
              There is strong potential for centralized digital platforms that
              can connect animals, adopters, and organizations in one place.
              Systems like PurrPaws can help address data fragmentation,
              increase visibility for adoptable animals, and improve overall
              coordination, tracking, and reporting across groups.
            </p>
          </div>

          <div className="asean-block">
            <h3>Toward a Unified Vision</h3>
            <p>
              For long-term impact, animal welfare systems across ASEAN need to
              move toward greater standardization, integration, and
              collaboration. By aligning policies, processes, and platforms,
              organizations can shift from fragmented responses to more
              coordinated regional solutions.
            </p>
          </div>

          <div className="asean-visual">
            <img src="/images/asean-pets.jpg" alt="ASEAN animal welfare organizations" />
          </div>
        </section>
      </main>
    </OrgAppLayout>
  );
}

export default OrgAsean;