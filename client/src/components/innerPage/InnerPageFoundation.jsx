import { Link } from 'react-router-dom'
import './InnerPageFoundation.css'

function PageBreadcrumb({ items = [] }) {
  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.to && index !== items.length - 1 ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function EditorialCTA({ to, children, variant = 'light' }) {
  return (
    <Link className={`editorial-cta editorial-cta--${variant}`} to={to}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  )
}

function InnerPageHero({
  eyebrow,
  title,
  description,
  image,
  metadata,
  cta,
  variant = 'default',
}) {
  const heroStyle = image ? { '--inner-hero-image': `url("${image}")` } : undefined

  return (
    <header
      className={`inner-page-hero inner-page-hero--${variant}`}
      style={heroStyle}
      aria-labelledby="inner-page-title"
    >
      <div className="inner-page-hero__content">
        {eyebrow && <p className="inner-page-hero__eyebrow">{eyebrow}</p>}
        <h1 id="inner-page-title">{title}</h1>
        {description && <p className="inner-page-hero__description">{description}</p>}
        {metadata && <p className="inner-page-hero__metadata">{metadata}</p>}
        {cta && <EditorialCTA to={cta.to}>{cta.label}</EditorialCTA>}
      </div>
      <span className="inner-page-hero__signature" aria-hidden="true" />
    </header>
  )
}

function SectionIntro({ eyebrow, title, description, id }) {
  return (
    <header className="section-intro">
      {eyebrow && <p className="section-intro__eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {description && <p className="section-intro__description">{description}</p>}
    </header>
  )
}

function EditorialSection({
  id,
  eyebrow,
  title,
  description,
  variant = 'paper',
  children,
}) {
  const titleId = `${id}-title`

  return (
    <section
      className={`editorial-section editorial-section--${variant}`}
      aria-labelledby={titleId}
      id={id}
    >
      <div className="editorial-section__inner">
        <SectionIntro eyebrow={eyebrow} title={title} description={description} id={titleId} />
        <div className="editorial-section__content">{children}</div>
      </div>
    </section>
  )
}

function ReferenceBlock({ title = 'Sources & References', description, references = [] }) {
  return (
    <aside className="reference-block" aria-labelledby="reference-block-title">
      <div className="reference-block__heading">
        <p className="reference-block__eyebrow">Research practice</p>
        <h2 id="reference-block-title">{title}</h2>
      </div>
      <div className="reference-block__body">
        <p>{description}</p>
        {references.length > 0 && (
          <ul>
            {references.map((reference, index) => (
              <li key={`${reference.label}-${index}`}>
                {reference.to ? (
                  <Link to={reference.to}>{reference.label}</Link>
                ) : (
                  reference.label
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

export { EditorialCTA, EditorialSection, InnerPageHero, PageBreadcrumb, ReferenceBlock, SectionIntro }
