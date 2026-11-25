import { ArchiveImage } from './ArchiveElements.jsx'

// Only supplied, verified metadata is displayed. No example captions or credits.
export default function PhotoStory({ story, featured = false }) {
  return (
    <figure className={`photo-story${featured ? ' photo-story--featured' : ''}`}>
      <ArchiveImage src={story.image} alt={story.imageDescription} tone={story.tone} label="Awaiting genuine photography" />
      <figcaption>
        <p className="archive-kicker">{featured ? 'Featured visual story · space reserved' : 'Future collection'}</p>
        <h3>{story.title}</h3>
        <p>{story.caption || 'Photographs and verified captions will be added with care.'}</p>
        {(story.location || story.date || story.credit) && <dl className="photo-story__metadata">
          {story.location && <div><dt>Location</dt><dd>{story.location}</dd></div>}
          {story.date && <div><dt>Date / year</dt><dd>{story.date}</dd></div>}
          {story.credit && <div><dt>Photographer / credit</dt><dd>{story.credit}</dd></div>}
        </dl>}
        {story.description && <p>{story.description}</p>}
      </figcaption>
    </figure>
  )
}
