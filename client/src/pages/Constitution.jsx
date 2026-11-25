import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import CivicCategoryExplorer from '../components/innerPage/CivicCategoryExplorer.jsx'
import PublishedKnowledgeSection from '../components/innerPage/PublishedKnowledgeSection.jsx'
import './Constitution.css'

const constitutionCategories = [
  {
    id: 'constitutional-foundations',
    number: '01',
    label: 'Constitutional Foundations',
    title: 'Understanding the Framework',
    description: 'A learning area for foundational ideas and constitutional context.',
  },
  {
    id: 'fundamental-rights',
    number: '02',
    label: 'Fundamental Rights',
    title: 'Rights Within the Constitutional Framework',
    description: 'A place for accessible, referenced learning about rights.',
  },
  {
    id: 'fundamental-duties',
    number: '03',
    label: 'Fundamental Duties',
    title: 'Responsibilities in Civic Life',
    description: 'A learning area for civic responsibilities and related themes.',
  },
  {
    id: 'directive-principles',
    number: '04',
    label: 'Directive Principles',
    title: 'Principles of Governance',
    description: 'A place to organise learning about principles and public life.',
  },
  {
    id: 'scheduled-areas-tribal-governance',
    number: '05',
    label: 'Scheduled Areas & Tribal Governance',
    title: 'Constitutional Space for Tribal Governance',
    description: 'A future reference area for verified learning on this theme.',
  },
  {
    id: 'constitutional-institutions',
    number: '06',
    label: 'Constitutional Institutions',
    title: 'Institutions Within the Democratic Framework',
    description: 'A place for clear, referenced introductions to institutions.',
  },
]

function Constitution() {
  return (
    <main className="constitution-page">
      <PageBreadcrumb items={[{ label: 'Constitution' }]} />

      <InnerPageHero
        eyebrow="Constitution & Democracy"
        title={
          <>
            Understanding the
            <br />
            Constitution
          </>
        }
        description="An evolving learning archive for exploring constitutional ideas, institutions, protections and public responsibilities."
        metadata="ADIVASI CHRONICLES  •  CONSTITUTIONAL ARCHIVE"
        variant="constitutional"
      />

      <EditorialSection
        id="constitutional-introduction"
        eyebrow="Civic Foundations"
        title={
          <>
            A Framework for
            <br />
            Public Life
          </>
        }
        description="This space is designed for clear, referenced learning about the Constitution and related constitutional themes as verified material is added."
        variant="paper"
      >
        <CivicCategoryExplorer categories={constitutionCategories} variant="constitution" />
      </EditorialSection>

      <PublishedKnowledgeSection section="constitution" heading="Published Constitutional Entries" detailPrefix="/constitution" />

      <ReferenceBlock description="References for detailed constitutional articles will appear here as material is researched and verified." />

      <nav className="constitution-page__cross-navigation" aria-label="Explore related knowledge">
        <EditorialCTA to="/rights" variant="earth">
          Explore Rights
        </EditorialCTA>
      </nav>
    </main>
  )
}

export default Constitution
