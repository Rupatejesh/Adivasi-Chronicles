import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import DevelopmentArchiveExplorer from '../components/innerPage/DevelopmentArchiveExplorer.jsx'
import PublishedKnowledgeSection from '../components/innerPage/PublishedKnowledgeSection.jsx'
import '../components/development/DevelopmentPages.css'
import './ITDA.css'

const developmentCategories = [
  {
    id: 'itda-overview',
    number: '01',
    label: 'ITDA Overview',
    title: 'Understanding the Institution',
  },
  {
    id: 'education',
    number: '02',
    label: 'Education',
    title: 'Learning & Educational Development',
  },
  {
    id: 'health',
    number: '03',
    label: 'Health',
    title: 'Public Health & Community Services',
  },
  {
    id: 'livelihoods',
    number: '04',
    label: 'Livelihoods',
    title: 'Livelihoods & Economic Development',
  },
  {
    id: 'infrastructure',
    number: '05',
    label: 'Infrastructure',
    title: 'Connectivity, Services & Development',
  },
  {
    id: 'tribal-development',
    number: '06',
    label: 'Tribal Development',
    title: 'Community-Focused Development',
  },
  {
    id: 'tricor-livelihood-support',
    number: '07',
    label: 'TRICOR & Livelihood Support',
    title: 'Development Finance & Livelihood Context',
  },
  {
    id: 'research-references',
    number: '08',
    label: 'Research & References',
    title: 'Building a Verified Development Archive',
  },
]

function ITDA() {
  return (
    <main className="itda-page">
      <PageBreadcrumb items={[{ label: 'ITDA' }]} />

      {/* Add an image prop only when genuine local photography is available.
          Intended assets: /images/development/itda-development.jpg, education.jpg,
          health.jpg, livelihoods.jpg, infrastructure.jpg and community.jpg. */}
      <InnerPageHero
        eyebrow="ITDA & Development"
        title={
          <>
            Development,
            <br />
            Institutions & Community
          </>
        }
        description="An evolving information archive for understanding institutional development, public programmes and community-focused initiatives."
        metadata="ADIVASI CHRONICLES  •  DEVELOPMENT ARCHIVE"
        variant="development-archive"
      />

      <EditorialSection
        id="development-introduction"
        eyebrow="Understanding Development"
        title={
          <>
            Institutions, Services
            <br />
            & Public Life
          </>
        }
        description="This space is designed to organise referenced information about development institutions, sectors and public initiatives as verified material is added."
        variant="paper"
      >
        <DevelopmentArchiveExplorer
          categories={developmentCategories}
          label="development archive"
          variant="itda"
        />
      </EditorialSection>

      <PublishedKnowledgeSection section="itda" heading="Published ITDA & Development Notes" />

      <aside className="itda-verification-note" aria-label="Information verification note">
        <span className="itda-verification-note__rule" aria-hidden="true" />
        <p>
          Changing public information will include its official source, relevant year and last
          verified date when researched material is added.
        </p>
      </aside>

      <p className="development-site-note">
        ADIVASI CHRONICLES is an independent educational and archive project, not an official
        government portal.
      </p>

      <ReferenceBlock description="References for detailed development information will appear here as material is researched and verified." />

      <nav className="itda-page__cross-navigation" aria-label="Explore related development information">
        <EditorialCTA to="/schemes" variant="earth">
          Explore Schemes
        </EditorialCTA>
      </nav>
    </main>
  )
}

export default ITDA
