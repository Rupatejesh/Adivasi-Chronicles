import './CivicCategoryExplorer.css'

function CivicCategoryExplorer({ categories, variant }) {
  return (
    <div className={`civic-explorer civic-explorer--${variant}`}>
      <nav className="civic-explorer__index" aria-label={`${variant} learning categories`}>
        {categories.map((category) => (
          <a
            className="civic-explorer__index-link"
            href={`#${category.id}`}
            key={category.id}
          >
            <span>{category.number}</span>
            <span>{category.label}</span>
          </a>
        ))}
      </nav>

      <div className="civic-explorer__entries">
        {categories.map((category) => (
          <article
            className="civic-explorer__entry"
            id={category.id}
            aria-labelledby={`${category.id}-title`}
            key={category.id}
          >
            <span className="civic-explorer__entry-number" aria-hidden="true">
              {category.number}
            </span>
            <div className="civic-explorer__entry-copy">
              <p className="civic-explorer__entry-label">{category.label}</p>
              <h3 id={`${category.id}-title`}>{category.title}</h3>
              <p>{category.description}</p>
            </div>
            <span className="civic-explorer__entry-mark" aria-hidden="true" />
          </article>
        ))}
      </div>
    </div>
  )
}

export default CivicCategoryExplorer
