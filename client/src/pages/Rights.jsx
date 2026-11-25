import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import CivicCategoryExplorer from '../components/innerPage/CivicCategoryExplorer.jsx'
import PublishedKnowledgeSection from '../components/innerPage/PublishedKnowledgeSection.jsx'
import './Rights.css'

const rightsCategories = [
  {
    id: 'fifth-schedule',
    number: '01',
    label: 'Fifth Schedule',
    title: 'Scheduled Areas & Constitutional Protection',
    description: 'A guided learning area for verified material related to this theme.',
  },
  {
    id: 'pesa',
    number: '02',
    label: 'PESA',
    title: 'Local Governance & Community Participation',
    description: 'A place for accessible explanations and authoritative references.',
  },
  {
    id: 'forest-rights',
    number: '03',
    label: 'Forest Rights',
    title: 'Learning About Forest Rights',
    description: 'A future reference pathway for carefully researched learning material.',
  },
  {
    id: 'land-protections',
    number: '04',
    label: 'Land Protections',
    title: 'Land, Regulation & Community Context',
    description: 'An area to organise verified information and contextual learning.',
  },
  {
    id: 'sc-st-legal-protections',
    number: '05',
    label: 'SC/ST Legal Protections',
    title: 'Understanding Legal Safeguards',
    description: 'A learning pathway for clear and properly sourced material.',
  },
  {
    id: 'gram-sabha-local-governance',
    number: '06',
    label: 'Gram Sabha & Local Governance',
    title: 'Community Institutions & Participation',
    description: 'A place for accessible learning about community institutions.',
  },
]

function Rights() {
  return (
    <main className="rights-page">
      <PageBreadcrumb items={[{ label: 'Rights' }]} />

      <InnerPageHero
        eyebrow="Rights & Protections"
        title={
          <>
            Know the Framework.
            <br />
            Understand Your Rights.
          </>
        }
        description="An evolving learning space for exploring legal protections, community rights and pathways to verified public information."
        metadata="ADIVASI CHRONICLES  •  RIGHTS KNOWLEDGE BASE"
        variant="rights-handbook"
      />

      <EditorialSection
        id="rights-introduction"
        eyebrow="Rights in Context"
        title={
          <>
            From Legal Text
            <br />
            to Public Understanding
          </>
        }
        description="This archive is designed to organise accessible explanations, official references and learning material as content is researched and verified."
        variant="paper"
      >
        <CivicCategoryExplorer categories={rightsCategories} variant="rights" />
      </EditorialSection>

      <PublishedKnowledgeSection section="rights" heading="Published Tribal Rights Guides" detailPrefix="/rights" />

      <ReferenceBlock description="Official and authoritative references will be added alongside detailed rights information as material is researched and verified." />

      <nav className="rights-page__cross-navigation" aria-label="Explore related knowledge">
        <EditorialCTA to="/constitution" variant="earth">
          Explore Constitution
        </EditorialCTA>
        <EditorialCTA to="/books" variant="earth">
          Explore Books & Ideas
        </EditorialCTA>
      </nav>
    </main>
  )
}

export default Rights
