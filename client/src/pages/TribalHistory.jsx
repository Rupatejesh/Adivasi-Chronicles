import { useState } from 'react'
import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import PublishedKnowledgeSection from '../components/innerPage/PublishedKnowledgeSection.jsx'
import './TribalHistory.css'

const historySections = [
  {
    number: '01',
    eyebrow: 'Origins & Memory',
    title: 'Stories Before the Archive',
    description:
      'A future space for community histories, oral memory and historical context, gathered with care and accompanied by references.',
    image: '/images/history/origins-memory.jpg',
    alt: 'Landscape image prepared for the Origins and Memory archive',
    mood: 'origins',
    layout: 'feature',
    status: 'Oral history — future',
  },
  {
    number: '02',
    eyebrow: 'People & Place',
    title: 'Communities Across the Landscape',
    description:
      'A future exploration of relationships between communities, places and landscapes through documented material and community memory.',
    image: '/images/history/people-place.jpg',
    alt: 'Landscape image prepared for the People and Place archive',
    mood: 'place',
    layout: 'reverse',
    status: 'Research in progress',
  },
  {
    number: '03',
    eyebrow: 'Movements & Resistance',
    title: 'Histories of Collective Action',
    description:
      'Future referenced articles will provide space to explore movements, resistance and collective action with context and sources.',
    image: '/images/history/movements.jpg',
    alt: 'Landscape image prepared for the Movements and Resistance archive',
    mood: 'movement',
    layout: 'standard',
    status: 'Reference-ready',
  },
  {
    number: '04',
    eyebrow: 'Leaders & Voices',
    title: 'People Remembered Across Generations',
    description:
      'A future gateway to biographies and documented historical figures, with clear distinction between source material and interpretation.',
    image: '/images/history/leaders-voices.jpg',
    alt: 'Archival image area prepared for Leaders and Voices',
    mood: 'voices',
    layout: 'reverse',
    status: 'Research in progress',
    to: '/heroes',
    cta: 'Explore Heroes',
  },
  {
    number: '05',
    eyebrow: 'Culture & Continuity',
    title: 'Living Knowledge Across Generations',
    description:
      'A respectful future space for language, traditions, cultural memory and continuity, shaped with attention to community context.',
    image: '/images/history/culture-continuity.jpg',
    alt: 'Landscape image prepared for the Culture and Continuity archive',
    mood: 'continuity',
    layout: 'standard',
    status: 'Oral history — future',
  },
  {
    number: '06',
    eyebrow: 'Archive & Sources',
    title: 'Building a Referenced Record',
    description:
      'Detailed historical material will distinguish documented sources, oral histories, interpretation and material still requiring verification.',
    image: '/images/history/archive-sources.jpg',
    alt: 'Archive image area prepared for sources and references',
    mood: 'archive',
    layout: 'wide',
    status: 'Research in progress',
  },
]

function HistoryArchiveEntry({ entry }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article
      className={`history-entry history-entry--${entry.layout}`}
      aria-labelledby={`history-entry-${entry.number}`}
    >
      <div
        className={`history-entry__visual history-entry__visual--${entry.mood}`}
        data-image-state={imageState}
      >
        <div className="history-entry__fallback" aria-hidden="true" />
        <img
          className="history-entry__image"
          src={entry.image}
          alt={entry.alt}
          loading="lazy"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('missing')}
        />
        <span className="history-entry__visual-number" aria-hidden="true">
          {entry.number}
        </span>
      </div>
      <div className="history-entry__copy">
        <div className="history-entry__meta">
          <span className="history-entry__number">{entry.number}</span>
          <span className="history-entry__rule" aria-hidden="true" />
          <p className="history-entry__eyebrow">{entry.eyebrow}</p>
        </div>
        <h3 id={`history-entry-${entry.number}`}>{entry.title}</h3>
        <p className="history-entry__description">{entry.description}</p>
        <span className="history-entry__status">{entry.status}</span>
        {entry.to && (
          <EditorialCTA to={entry.to} variant="earth">
            {entry.cta}
          </EditorialCTA>
        )}
      </div>
    </article>
  )
}

function TribalHistory() {
  return (
    <main className="tribal-history-page">
      <PageBreadcrumb items={[{ label: 'Tribal History' }]} />

      <InnerPageHero
        eyebrow="Tribal History"
        title={
          <>
            Histories Carried
            <br />
            Across Generations
          </>
        }
        description="An evolving archive for exploring community histories, movements, memory and the relationship between people and place."
        metadata="ADIVASI CHRONICLES  •  HISTORY ARCHIVE"
        image="/images/history/tribal-history-hero.jpg"
        variant="history"
      />

      <EditorialSection
        id="history-editorial-foundation"
        eyebrow="An evolving collection"
        title="A Place for History, Memory & Context"
        description="This evolving archive will bring together documented history, community memory, people, movements and place. Each future entry will make its context and sources clear."
        variant="paper"
      >
        <div className="history-archive">
          {historySections.map((entry) => (
            <HistoryArchiveEntry entry={entry} key={entry.number} />
          ))}
        </div>
      </EditorialSection>

      <PublishedKnowledgeSection section="tribal-history" heading="Published Historical Articles" />

      <aside className="history-integrity-note" aria-label="Editorial research note">
        <span className="history-integrity-note__rule" aria-hidden="true" />
        <p>
          Historical articles in this archive are intended to include sources and references as
          research is added and verified.
        </p>
      </aside>

      <ReferenceBlock description="References for detailed articles will appear here as content is researched and verified." />

      <div className="tribal-history-page__return">
        <EditorialCTA to="/">Return to the Home Page</EditorialCTA>
      </div>
    </main>
  )
}

export default TribalHistory
