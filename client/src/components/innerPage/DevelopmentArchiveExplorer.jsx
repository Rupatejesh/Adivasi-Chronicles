import './DevelopmentArchiveExplorer.css'

function DevelopmentArchiveExplorer({ categories, variant, label }) {
  return (
    <div className={`development-explorer development-explorer--${variant}`}>
      <nav className="development-explorer__index" aria-label={`${label} categories`}>
        {categories.map((category) => (
          <a
            className="development-explorer__index-link"
            href={`#${category.id}`}
            key={category.id}
          >
            <span>{category.number}</span>
            <span>{category.label}</span>
          </a>
        ))}
      </nav>

      <div className="development-explorer__entries">
        {categories.map((category) => (
          <article
            className="development-explorer__entry"
            id={category.id}
            aria-labelledby={`${category.id}-title`}
            key={category.id}
          >
            <span className="development-explorer__entry-number" aria-hidden="true">
              {category.number}
            </span>
            <div className="development-explorer__entry-copy">
              <p className="development-explorer__entry-label">{category.label}</p>
              <h3 id={`${category.id}-title`}>{category.title}</h3>
              <p>{category.description || 'Verified information for this topic will be added after research.'}</p>
            </div>
            <span className="development-explorer__entry-mark" aria-hidden="true" />
          </article>
        ))}
      </div>
    </div>
  )
}

export default DevelopmentArchiveExplorer
