import { Link } from 'react-router-dom';
import { ArchiveImage } from './ArchiveElements.jsx';

export default function JournalTimeline({ entries = [] }) {
  if (!entries.length) {
    return (
      <div className="journey-empty">
        <span aria-hidden="true" className="journey-empty__trail" />
        <h3>The next page is still open</h3>
        <p>No dated journal entries have been published yet. Reflections, places and photographs will be added as the journey is documented.</p>
      </div>
    );
  }

  return (
    <ol className="journey-timeline">
      {entries.map((entry) => (
        <li key={entry._id || entry.id}>
          <article className="ac-card" style={{ marginBottom: '1rem' }}>
            <div className="ac-badge-row">
              {(entry.interest || entry.category) && (
                <span className="ac-badge">{entry.interest || entry.category}</span>
              )}
              {(entry.entryDate || entry.date) && (
                <span className="ac-badge ac-badge--gold">
                  {entry.entryDate ? new Date(entry.entryDate).toLocaleDateString() : entry.date}
                </span>
              )}
            </div>
            <h3>{entry.title}</h3>
            {entry.location && <p className="ac-meta">{entry.location}</p>}
            <p>{entry.summary || entry.reflection}</p>
            {entry.content && <p className="ac-article-body">{entry.content}</p>}
            {(entry.coverImage || entry.image) && (
              <ArchiveImage src={entry.coverImage || entry.image} alt={entry.title} tone="personal" />
            )}
            {entry.relatedLink?.to?.startsWith('/') && !entry.relatedLink.to.startsWith('//') && (
              <Link to={entry.relatedLink.to}>{entry.relatedLink.label || 'Read related entry'}</Link>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
