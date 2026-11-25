import { useState } from 'react'
import { EditorialCTA } from '../innerPage/InnerPageFoundation.jsx'
import './ArchiveElements.css'

// Use only genuine local assets. Empty or failed sources retain the CSS frame.
export function ArchiveImage({ src, alt, label = 'Photograph to come', tone = 'landscape' }) {
  const [failedSource, setFailedSource] = useState(null)
  const localSource = typeof src === 'string' && src.startsWith('/images/') && !src.includes('..')
  return (
    <div className={`archive-image archive-image--${tone}`}>
      {localSource && alt && failedSource !== src ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailedSource(src)} />
      ) : (
        <><span className="archive-image__geometry" aria-hidden="true" /><span className="archive-image__label">{label}</span></>
      )}
    </div>
  )
}

export function ArchiveFilters({ categories, selected, onSelect, label, controls }) {
  return (
    <div className="archive-filters" role="group" aria-label={label}>
      {categories.map(category => (
        <button key={category} type="button" aria-pressed={selected === category}
          aria-controls={controls} onClick={() => onSelect(category)}>{category}</button>
      ))}
    </div>
  )
}

export function ArchiveRelated({ links }) {
  return (
    <nav className="archive-related" aria-label="Continue exploring">
      <p className="archive-kicker">Continue exploring</p>
      <div>{links.map(link => <EditorialCTA key={link.to} to={link.to} variant="earth">{link.label}</EditorialCTA>)}</div>
    </nav>
  )
}
