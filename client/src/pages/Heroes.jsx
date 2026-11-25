import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import './Heroes.css'
import './MernDynamic.css'
import { biographiesApi } from '../services/api.js'
import { biographyPreviews } from '../data/biographies.js'
import VerifiedQuotation from '../components/VerifiedQuotation.jsx'

const archiveGroups = [
  {
    id: 'tribal-leaders-voices',
    number: '01',
    label: 'Tribal Leaders & Voices',
    title: 'Leadership, Resistance & Community Memory',
    description:
      'A future space for researched biographies of tribal leaders and community figures.',
  },
  {
    id: 'social-reformers',
    number: '02',
    label: 'Social Reformers',
    title: 'Ideas That Challenged Society',
    description:
      'A future space for researched biographies connected with social reform, equality and public thought.',
  },
  {
    id: 'freedom-resistance',
    number: '03',
    label: 'Freedom & Resistance',
    title: 'Stories of Resistance and Change',
    description:
      'A future home for referenced biographies connected with resistance and historical movements.',
  },
  {
    id: 'thinkers-public-ideas',
    number: '04',
    label: 'Thinkers & Public Ideas',
    title: 'People Behind Transformative Ideas',
    description: 'A future space for documented lives, writings and ideas in public thought.',
  },
]


function ArchiveGroup({ group }) {
  return (
    <article className="heroes-group" id={group.id}>
      <span className="heroes-group__number">{group.number}</span>
      <div className="heroes-group__copy">
        <p className="heroes-group__eyebrow">{group.label}</p>
        <h3>{group.title}</h3>
        <p>{group.description}</p>
      </div>
      <span className="heroes-group__mark" aria-hidden="true" />
    </article>
  )
}

export function BiographyPreview({ person, featured = false }) {
  const [imageState, setImageState] = useState(
    person.portraitAvailable && person.portraitVerificationStatus === 'verified' && person.portraitSource && person.image.startsWith('/images/heroes/') ? 'loading' : 'missing',
  )

  return (
    <article
      className={`biography-preview${featured ? ' biography-preview--featured' : ''}`}
      aria-label={`Archive preview: ${person.name}`}
    >
      <Link
        className="biography-preview__link"
        to={`/heroes/${person.slug}`}
        aria-label={`Open archive preview for ${person.name}`}
      >
        <div className="biography-preview__portrait" data-image-state={imageState}>
          <div className="biography-preview__portrait-fallback" aria-hidden="true" />
          {imageState !== 'missing' && (
            <img
              className="biography-preview__image"
              src={person.image}
              alt={imageState === 'loaded' ? `Portrait photograph for ${person.name}` : ''}
              loading="lazy"
              onLoad={() => setImageState('loaded')}
              onError={() => setImageState('missing')}
            />
          )}
          <div className="biography-preview__portrait-frame" aria-hidden="true">
            <span className="biography-preview__initials">{person.initials}</span>
            <span className="biography-preview__portrait-index">{person.number}</span>
          </div>
        </div>
        <div className="biography-preview__copy">
          <p className="biography-preview__category">Biography preview</p>
          <h3>{person.name}</h3>
          <p className="biography-preview__description">
            {person.descriptor}
          </p>
          <span className="biography-preview__link-label">
            View archive entry <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
      {person.portraitCredit && imageState === 'loaded' && <p className="portrait-credit">{person.portraitCredit}</p>}
      <VerifiedQuotation person={person} />
    </article>
  )
}

function Heroes() {
  const [publishedBiographies, setPublishedBiographies] = useState([])

  useEffect(() => {
    let cancelled = false
    biographiesApi.list()
      .then((data) => {
        if (!cancelled) setPublishedBiographies(data.biographies || [])
      })
      .catch(() => {
        if (!cancelled) setPublishedBiographies([])
      })
    return () => { cancelled = true }
  }, [])
  const [featuredPerson, ...supportingPeople] = biographyPreviews.map((person, index) => ({
    ...person,
    number: String(index + 1).padStart(2, '0'),
    initials: person.name
      .split(/\s+/)
      .filter((part) => part.replace(/\W/g, '').length > 0)
      .slice(0, 2)
      .map((part) => part.replace(/\W/g, '').charAt(0))
      .join('')
      .toUpperCase(),
  }))

  return (
    <main className="heroes-page">
      <PageBreadcrumb items={[{ label: 'Heroes' }]} />

      <InnerPageHero
        eyebrow="Heroes & Voices"
        title={
          <>
            Lives That Continue
            <br />
            to Inspire Generations
          </>
        }
        description="An evolving biographical archive exploring people, leadership, resistance, reform, ideas and public memory."
        metadata="ADIVASI CHRONICLES  •  BIOGRAPHICAL ARCHIVE"
        image="/images/heroes/heroes-archive-hero.jpg"
        variant="biographical"
      />

      <EditorialSection
        id="heroes-introduction"
        eyebrow="People & Memory"
        title={
          <>
            Every Life Opens
            <br />
            Another Chapter
          </>
        }
        description="This archive is designed to bring together researched biographies, historical context, ideas and references as verified material is added over time."
        variant="paper"
      >
        <nav className="heroes-category-index" aria-label="Biography archive categories">
          {archiveGroups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              <span>{group.number}</span>
              {group.label}
            </a>
          ))}
        </nav>

        <div className="heroes-groups">
          {archiveGroups.map((group) => (
            <ArchiveGroup group={group} key={group.id} />
          ))}
        </div>
      </EditorialSection>

      <EditorialSection
        id="featured-biographies"
        eyebrow="Archive previews"
        title="Names in the Archive"
        description="These entries are placeholders for future researched and referenced biographies. No biographical details are presented here."
        variant="mist"
      >
        <div className="biography-archive">
          <BiographyPreview featured person={featuredPerson} />
          <div className="biography-archive__supporting">
            {supportingPeople.map((person) => (
              <BiographyPreview key={person.slug} person={person} />
            ))}
          </div>
        </div>
      </EditorialSection>

      {publishedBiographies.length > 0 && (
        <EditorialSection
          id="published-biographies"
          eyebrow="Published Biographies"
          title="Researched Entries in the Database"
          description="Published biographical records with verification status and cited references."
          variant="paper"
        >
          <div className="ac-grid">
            {publishedBiographies.map((bio) => (
              <article key={bio._id} className={`ac-card${bio.isFeatured ? ' ac-card--featured' : ''}`}>
                <div className="ac-badge-row">
                  <span className="ac-badge">{bio.verificationStatus}</span>
                  {bio.region && <span className="ac-badge ac-badge--earth">{bio.region}</span>}
                </div>
                <h3>{bio.name}</h3>
                <p>{bio.summary}</p>
                <Link className="ac-btn ac-btn--secondary" to={`/heroes/${bio.slug}`}>
                  Read Biography →
                </Link>
              </article>
            ))}
          </div>
        </EditorialSection>
      )}

      <aside className="heroes-integrity-note" aria-label="Biographical archive research note">
        <span className="heroes-integrity-note__rule" aria-hidden="true" />
        <p>
          Biographical articles will include references as researched and verified material is
          added to the archive.
        </p>
      </aside>

      <ReferenceBlock description="References for biographical articles will appear here as sources are researched and verified." />

      <div className="heroes-page__cross-navigation">
        <EditorialCTA to="/tribal-history" variant="earth">
          Explore Tribal History
        </EditorialCTA>
      </div>
    </main>
  )
}

export default Heroes
