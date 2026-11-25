import { useEffect, useState } from 'react';
import { EditorialSection, InnerPageHero, PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { ArchiveFilters, ArchiveImage, ArchiveRelated } from '../components/personalArchive/ArchiveElements.jsx';
import JournalTimeline from '../components/personalArchive/JournalTimeline.jsx';
import { journeyApi } from '../services/api.js';
import './MyJourney.css';
import './MernDynamic.css';

const areas = [
  ['Learning & Technology', 'A place for notes on learning, tools and questions worth exploring.'],
  ['Writing & Research', 'Space for reading notes, research questions and writing in progress.'],
  ['Community & Social Interests', 'An area for thoughtful reflections on community and social life.'],
  ['Photography & Documentation', 'A place to connect genuine photographs with careful observation.'],
  ['Sports & Physical Interests', 'Horses / Horse Riding, Football and Archery — interests and future areas to explore, not a record of achievements.'],
  ['Future Explorations', 'Room for new interests, open questions and aspirations still taking shape.'],
];

const interestFilters = [
  { label: 'All Entries', value: 'all' },
  { label: 'Horses / Horse Riding', value: 'horses' },
  { label: 'Football', value: 'football' },
  { label: 'Archery', value: 'archery' },
  { label: 'Learning', value: 'learning' },
  { label: 'Writing', value: 'writing' },
  { label: 'Photography', value: 'photography' },
];

export default function MyJourney() {
  const [selectedInterest, setSelectedInterest] = useState('All Entries');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    journeyApi.list()
      .then((data) => {
        if (!cancelled) setEntries(data.entries || []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => { cancelled = true; };
  }, []);

  const currentFilter = interestFilters.find((item) => item.label === selectedInterest) || interestFilters[0];
  const visibleEntries = entries.filter((entry) =>
    currentFilter.value === 'all' ? true : entry.interest === currentFilter.value,
  );

  return (
    <main className="personal-archive-page journey-page">
      <PageBreadcrumb items={[{ label: 'My Journey' }]} />
      <InnerPageHero
        eyebrow="MY JOURNEY"
        title="Learning, Exploring & Moving Forward"
        description="I want this journal to hold what I learn, the interests I explore and the experiences I choose to document. It is a space for reflection and future aspirations, one page at a time."
        metadata="ADIVASI CHRONICLES • PERSONAL JOURNAL"
        variant="field-journal"
      />
      <EditorialSection
        id="journey-interests"
        eyebrow="An open notebook"
        title="Paths I want to explore"
        description="These are spaces for future reflections and interests. They are not a timeline of achievements or a record of completed experiences."
      >
        <div className="journey-notebook">
          <aside className="journey-notebook__margin" aria-label="Journal photograph placeholder">
            <ArchiveImage tone="personal" label="A personal photograph, when ready" />
            <p>A frame for a future field note.</p>
          </aside>
          <div className="journey-areas">
            {areas.map(([title, description], index) => (
              <article key={title} className="journey-area">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </EditorialSection>
      <EditorialSection id="journey-journal" eyebrow="Notes along the way" title="A journal in the making" variant="mist">
        <div style={{ marginBottom: '1.25rem' }}>
          <ArchiveFilters
            categories={interestFilters.map((f) => f.label)}
            selected={selectedInterest}
            onSelect={setSelectedInterest}
            label="Journey interests"
            controls="journey-entries-list"
          />
        </div>
        <div id="journey-entries-list">
          <JournalTimeline entries={visibleEntries} />
        </div>
      </EditorialSection>
      <ArchiveRelated links={[{ to: '/gallery', label: 'Browse the visual journal' }, { to: '/about', label: 'About Adivasi Chronicles' }]} />
    </main>
  );
}
