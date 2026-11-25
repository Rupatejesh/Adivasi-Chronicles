import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Home.css'
import './HomeHeritage.css'
import './HomeDiscover.css'
import './HomeJournal.css'
import './HomeKnowledge.css'
import './HomeJourney.css'

const landscapes = [
  {
    name: 'Araku Valley',
    image: '/images/regions/araku-valley.jpg',
    alt: 'Landscape photograph prepared for Araku Valley',
    size: 'featured',
    mood: 'sage',
  },
  {
    name: 'Lambasingi',
    image: '/images/regions/lambasingi.jpg',
    alt: 'Landscape photograph prepared for Lambasingi',
    size: 'medium',
    mood: 'pale',
  },
  {
    name: 'Paderu',
    image: '/images/regions/paderu.jpg',
    alt: 'Landscape photograph prepared for Paderu',
    size: 'small',
    mood: 'moss',
  },
  {
    name: 'Chintapalli',
    image: '/images/regions/chintapalli.jpg',
    alt: 'Landscape photograph prepared for Chintapalli',
    size: 'small',
    mood: 'cool',
  },
  {
    name: 'Dumbriguda',
    image: '/images/regions/dumbriguda.jpg',
    alt: 'Landscape photograph prepared for Dumbriguda',
    size: 'wide',
    mood: 'gold',
  },
  {
    name: 'G. Madugula',
    image: '/images/regions/g-madugula.jpg',
    alt: 'Landscape photograph prepared for G. Madugula',
    size: 'small',
    mood: 'cloud',
  },
  {
    name: 'Koyyuru',
    image: '/images/regions/koyyuru.jpg',
    alt: 'Landscape photograph prepared for Koyyuru',
    size: 'small',
    mood: 'deep',
  },
  {
    name: 'G.K. Veedhi',
    image: '/images/regions/gk-veedhi.jpg',
    alt: 'Landscape photograph prepared for G.K. Veedhi',
    size: 'panorama',
    mood: 'silver',
  },
  {
    name: 'Ananthagiri',
    image: '/images/regions/ananthagiri.jpg',
    alt: 'Landscape photograph prepared for Ananthagiri',
    size: 'small',
    mood: 'sage',
  },
  {
    name: 'Munchingiputtu',
    image: '/images/regions/munchingiputtu.jpg',
    alt: 'Landscape photograph prepared for Munchingiputtu',
    size: 'medium',
    mood: 'warm',
  },
  {
    name: 'Jolaput',
    image: '/images/regions/jolaput.jpg',
    alt: 'Landscape photograph prepared for Jolaput',
    size: 'wide',
    mood: 'blue',
  },
  {
    name: 'Peddabayalu',
    image: '/images/regions/peddabayalu.jpg',
    alt: 'Landscape photograph prepared for Peddabayalu',
    size: 'small',
    mood: 'fern',
  },
  {
    name: 'Hukumpeta',
    image: '/images/regions/hukumpeta.jpg',
    alt: 'Landscape photograph prepared for Hukumpeta',
    size: 'small',
    mood: 'amber',
  },
]

const heritageStories = {
  livingCulture: {
    number: '01',
    title: 'Living Culture',
    description: 'Traditions, community life and cultural expression.',
    image: '/images/heritage/living-culture.jpg',
    alt: 'Living Culture story photograph',
    mood: 'culture',
    size: 'featured',
  },
  oralMemory: {
    number: '02',
    title: 'Oral Memory',
    description: 'Stories and memories carried across generations.',
    image: '/images/heritage/oral-memory.jpg',
    alt: 'Oral Memory story photograph',
    mood: 'memory',
    size: 'supporting',
  },
  tribalHistory: {
    number: '03',
    title: 'Tribal History',
    description: 'Explore documented histories, movements and local narratives.',
    image: '/images/heritage/tribal-history.jpg',
    alt: 'Tribal History archival photograph',
    mood: 'history',
    size: 'supporting',
    to: '/tribal-history',
  },
  peoplePlace: {
    number: '04',
    title: 'People & Place',
    description:
      'The relationship between communities, landscapes and everyday life.',
    image: '/images/heritage/community-life.jpg',
    alt: 'Community life story photograph',
    mood: 'place',
    size: 'wide',
  },
}

const discoverStories = [
  {
    number: '01',
    title: 'Tribal History',
    description:
      'Explore histories, movements, community memory and stories from the Eastern Ghats and beyond.',
    cta: 'Explore History',
    to: '/tribal-history',
    image: '/images/discover/tribal-history.jpg',
    alt: 'Photograph for the Tribal History archive',
    mood: 'archive',
    size: 'featured',
  },
  {
    number: '02',
    title: 'Heroes & Voices',
    description:
      'Discover leaders, reformers, rebels and voices whose lives shaped social and tribal history.',
    cta: 'Meet the Heroes',
    to: '/heroes',
    image: '/images/discover/heroes.jpg',
    alt: 'Photograph for the Heroes and Voices archive',
    mood: 'voices',
    size: 'supporting',
  },
  {
    number: '03',
    title: 'Constitution & Rights',
    description:
      'Understand constitutional protections, Scheduled Tribe rights, self-governance and important legal frameworks.',
    cta: 'Know Your Rights',
    to: '/rights',
    image: '/images/discover/rights.jpg',
    alt: 'Photograph for the Constitution and Rights archive',
    mood: 'rights',
    size: 'supporting',
  },
  {
    number: '04',
    title: 'Books & Ideas',
    description:
      'Explore books, essays and social ideas connected with equality, justice, reform and public thought.',
    cta: 'Explore Ideas',
    to: '/books',
    image: '/images/discover/books.jpg',
    alt: 'Photograph for the Books and Ideas archive',
    mood: 'ideas',
    size: 'wide',
  },
]

const journalStories = [
  {
    id: 'featured-eastern-ghats',
    category: 'Field Notes',
    title: 'Where Memory Lives in the Eastern Ghats',
    description:
      'Stories of landscape, community and cultural memory carried across generations.',
    cta: 'Read the Story',
    to: '/blog',
    image: '/images/home/journal-feature.jpg',
    alt: 'Eastern Ghats landscape photograph for the featured journal story',
    size: 'featured',
    mood: 'hills',
  },
  {
    id: 'stories-from-the-hills',
    number: '01',
    category: 'History',
    title: 'Stories From the Hills',
    description: 'Community histories, movements and memories.',
    to: '/tribal-history',
    image: '/images/home/journal-history.jpg',
    alt: 'Landscape photograph for stories from the hills',
    size: 'supporting',
    mood: 'archive',
  },
  {
    id: 'rights-that-protect-communities',
    number: '02',
    category: 'Rights',
    title: 'Understanding the Rights That Protect Communities',
    description: 'An accessible introduction to rights and protections.',
    to: '/rights',
    image: '/images/home/journal-rights.jpg',
    alt: 'Forest landscape photograph for the rights journal story',
    size: 'supporting',
    mood: 'forest',
  },
  {
    id: 'voices-across-the-eastern-ghats',
    number: '03',
    category: 'People & Place',
    title: 'Voices Across the Eastern Ghats',
    description: 'Reflections on people, place and shared memory.',
    to: '/heroes',
    image: '/images/home/journal-people-place.jpg',
    alt: 'Eastern Ghats landscape photograph for people and place',
    size: 'supporting',
    mood: 'earth',
  },
  {
    id: 'knowledge-across-generations',
    number: '04',
    category: 'Ideas',
    title: 'Knowledge That Travels Across Generations',
    description: 'Ideas and learning shared across generations.',
    to: '/books',
    image: '/images/home/journal-ideas.jpg',
    alt: 'Natural landscape photograph for the ideas journal story',
    size: 'supporting',
    mood: 'archive',
  },
]

const knowledgeStories = [
  {
    number: '01',
    category: 'Heroes',
    title: 'People Who Changed History',
    description:
      'Explore biographies, movements and stories of resistance, leadership and social transformation.',
    cta: 'Explore Heroes',
    to: '/heroes',
    image: '/images/home/knowledge-heroes.jpg',
    alt: 'Landscape photograph prepared for the Heroes archive',
    mood: 'people',
    size: 'featured',
  },
  {
    number: '02',
    category: 'Books & Ideas',
    title: 'Words That Continue to Speak',
    description: 'Explore books, essays and ideas connected with equality, society, history and public thought.',
    cta: 'Explore Books',
    to: '/books',
    image: '/images/home/knowledge-books.jpg',
    alt: 'Editorial photograph prepared for Books and Ideas',
    mood: 'books',
    size: 'standard',
  },
  {
    number: '03',
    category: 'Constitution',
    title: 'Understanding the Constitution',
    description:
      'A gateway to constitutional principles and protections relevant to citizenship and communities.',
    cta: 'Explore Constitution',
    to: '/constitution',
    image: '/images/home/knowledge-constitution.jpg',
    alt: 'Editorial photograph prepared for the Constitution archive',
    mood: 'constitution',
    size: 'standard',
  },
  {
    number: '04',
    category: 'Rights',
    title: 'Know the Rights That Matter',
    description:
      'Discover the legal and institutional frameworks documented within ADIVASI CHRONICLES.',
    cta: 'Explore Rights',
    to: '/rights',
    image: '/images/home/knowledge-rights.jpg',
    alt: 'Forest landscape photograph prepared for the Rights archive',
    mood: 'rights',
    size: 'wide',
  },
]

const journeyInterests = [
  {
    number: '01',
    category: 'Horse Riding',
    title: 'Learning Through Movement',
    description: 'A space for documenting an interest in horses, riding and future experiences.',
    image: '/images/journey/horse-riding.jpg',
    alt: 'Future local image for the horse riding personal-interest preview',
    mood: 'riding',
    size: 'featured',
  },
  {
    number: '02',
    category: 'Football',
    title: 'Lessons From the Field',
    description: 'Teamwork, discipline and the experiences connected with playing the game.',
    image: '/images/journey/football.jpg',
    alt: 'Future local image for the football personal-interest preview',
    mood: 'football',
    size: 'supporting',
  },
  {
    number: '03',
    category: 'Archery',
    title: 'Focus, Patience & Precision',
    description: 'An evolving personal interest in archery, practice and continuous learning.',
    image: '/images/journey/archery.jpg',
    alt: 'Future local image for the archery personal-interest preview',
    mood: 'archery',
    size: 'supporting',
  },
]

function LandscapeCard({ landscape }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <figure className={`region-card region-card--${landscape.size}`}>
      <div
        className={`region-card__visual region-card__visual--${landscape.mood}`}
        data-image-state={imageState}
      >
        <div className="region-card__fallback" aria-hidden="true" />
        <img
          className="region-card__image"
          src={landscape.image}
          alt={landscape.alt}
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('missing')}
        />
      </div>
      <figcaption className="region-card__caption">
        <span className="region-card__name">{landscape.name}</span>
      </figcaption>
    </figure>
  )
}

function JournalStoryCard({ story }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article className={`journal-story journal-story--${story.size}`}>
      <Link className="journal-story__link" to={story.to}>
        <div
          className={`journal-story__visual journal-story__visual--${story.mood}`}
          data-image-state={imageState}
        >
          <div className="journal-story__fallback" aria-hidden="true" />
          <img
            className="journal-story__image"
            src={story.image}
            alt={story.alt}
            loading="lazy"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('missing')}
          />
          <div className="journal-story__overlay" aria-hidden="true" />
          <div className="journal-story__content">
            <div className="journal-story__meta">
              {story.number && (
                <span className="journal-story__number">{story.number}</span>
              )}
              <span className="journal-story__category">{story.category}</span>
            </div>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
            <span className="journal-story__cta">
              {story.cta || 'Read Story'}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function FromTheJournal() {
  const [featuredStory, ...supportingStories] = journalStories

  return (
    <section className="from-journal" aria-labelledby="from-journal-title">
      <div className="from-journal__inner">
        <header className="from-journal__header">
          <div className="from-journal__intro">
            <p className="from-journal__eyebrow">
              <span aria-hidden="true" />
              From the Journal
            </p>
            <h2 data-voice-heading id="from-journal-title">
              Stories, Notes &
              <span>Perspectives</span>
            </h2>
            <p>
              A growing collection of writing on history, culture, rights, places, people and
              personal learning.
            </p>
          </div>
          <Link className="from-journal__all-link" to="/blog">
            View All Stories
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="from-journal__layout">
          <JournalStoryCard story={featuredStory} />
          <div className="from-journal__supporting">
            {supportingStories.map((story) => (
              <JournalStoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function KnowledgeCard({ story }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article className={`knowledge-card knowledge-card--${story.size}`}>
      <Link className="knowledge-card__link" to={story.to}>
        <div
          className={`knowledge-card__visual knowledge-card__visual--${story.mood}`}
          data-image-state={imageState}
        >
          <div className="knowledge-card__fallback" aria-hidden="true" />
          <img
            className="knowledge-card__image"
            src={story.image}
            alt={story.alt}
            loading="lazy"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('missing')}
          />
          <div className="knowledge-card__overlay" aria-hidden="true" />
          <div className="knowledge-card__content">
            <div className="knowledge-card__meta">
              <span className="knowledge-card__number">{story.number}</span>
              <span className="knowledge-card__category">{story.category}</span>
            </div>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
            <span className="knowledge-card__cta">
              {story.cta}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function KnowledgeGateway() {
  return (
    <section className="knowledge-gateway" aria-labelledby="knowledge-gateway-title">
      <div className="knowledge-gateway__inner">
        <header className="knowledge-gateway__header">
          <div className="knowledge-gateway__intro">
            <p className="knowledge-gateway__eyebrow">
              <span aria-hidden="true" />
              Explore the Archive
            </p>
            <h2 data-voice-heading id="knowledge-gateway-title">
              Knowledge That Shapes
              <span>Memory, Rights &amp; Identity</span>
            </h2>
            <p>
              Discover people, books, constitutional ideas and rights that help document the
              histories, struggles and knowledge of communities.
            </p>
          </div>
          <span className="knowledge-gateway__signature" aria-hidden="true">
            Archive <span>·</span> People <span>·</span> Ideas
          </span>
        </header>

        <div className="knowledge-gateway__mosaic">
          {knowledgeStories.map((story) => (
            <KnowledgeCard key={story.number} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}

function JourneyInterestPanel({ interest }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article className={`journey-interest journey-interest--${interest.size}`}>
      <div
        className={`journey-interest__visual journey-interest__visual--${interest.mood}`}
        data-image-state={imageState}
      >
        <div className="journey-interest__fallback" aria-hidden="true" />
        <img
          className="journey-interest__image"
          src={interest.image}
          alt={interest.alt}
          loading="lazy"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('missing')}
        />
        <div className="journey-interest__overlay" aria-hidden="true" />
        <div className="journey-interest__content">
          <div className="journey-interest__meta">
            <span className="journey-interest__number">{interest.number}</span>
            <span className="journey-interest__category">{interest.category}</span>
          </div>
          <h3>{interest.title}</h3>
          <p>{interest.description}</p>
        </div>
      </div>
    </article>
  )
}

function MyJourneyPreview() {
  return (
    <section className="my-journey-preview" aria-labelledby="my-journey-preview-title">
      <div className="my-journey-preview__inner">
        <div className="my-journey-preview__editorial">
          <p className="my-journey-preview__eyebrow">
            <span aria-hidden="true" />
            My Journey
          </p>
          <h2 data-voice-heading id="my-journey-preview-title">
            Learning, Exploring &amp;
            <span>Growing Along the Way</span>
          </h2>
          <p className="my-journey-preview__description">
            Beyond the archive, this is also a space for personal learning, experiences,
            interests and the journey of discovering new paths.
          </p>
          <Link className="my-journey-preview__cta" to="/my-journey">
            Explore My Journey
            <span aria-hidden="true">→</span>
          </Link>
          <span className="my-journey-preview__note" aria-hidden="true">
            A personal path, still unfolding
          </span>
        </div>

        <div className="my-journey-preview__panels">
          {journeyInterests.map((interest) => (
            <JourneyInterestPanel key={interest.number} interest={interest} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DiscoverCard({ story }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article className={`discover-card discover-card--${story.size}`}>
      <Link className="discover-card__link" to={story.to}>
        <div
          className={`discover-card__visual discover-card__visual--${story.mood}`}
          data-image-state={imageState}
        >
          <div className="discover-card__fallback" aria-hidden="true" />
          <img
            className="discover-card__image"
            src={story.image}
            alt={story.alt}
            loading="lazy"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('missing')}
          />
          <div className="discover-card__overlay" aria-hidden="true" />
          <div className="discover-card__content">
            <span className="discover-card__number">{story.number}</span>
            <div className="discover-card__copy">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <span className="discover-card__cta">
                {story.cta}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

function DiscoverArchive() {
  return (
    <section className="discover-archive" aria-labelledby="discover-archive-title">
      <div className="discover-archive__inner">
        <header className="discover-archive__intro">
          <p className="discover-archive__eyebrow">
            <span aria-hidden="true" />
            Discover the Archive
          </p>
          <h2 data-voice-heading id="discover-archive-title">
            History. Rights.
            <span>Ideas That Endure.</span>
          </h2>
          <p>
            Explore histories, people, constitutional protections and ideas that continue to
            shape communities and public life.
          </p>
        </header>

        <div className="discover-archive__grid">
          {discoverStories.map((story) => (
            <DiscoverCard key={story.number} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HeritageStory({ story }) {
  const [imageState, setImageState] = useState('loading')

  return (
    <article
      className={`heritage-story heritage-story--${story.size} heritage-story--${story.mood}`}
      aria-labelledby={`heritage-story-${story.number}`}
    >
      <div className="heritage-story__visual" data-image-state={imageState}>
        <div className="heritage-story__fallback" aria-hidden="true" />
        <img
          className="heritage-story__image"
          src={story.image}
          alt={story.alt}
          loading="lazy"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('missing')}
        />
        <div className="heritage-story__caption">
          <span className="heritage-story__number">{story.number}</span>
          <div className="heritage-story__text">
            <h3 id={`heritage-story-${story.number}`}>
              {story.to ? (
                <Link to={story.to}>
                  {story.title}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                story.title
              )}
            </h3>
            <p>{story.description}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function LivingHeritage() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!section || reducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="living-heritage"
      aria-labelledby="living-heritage-title"
      data-visible={isVisible}
      ref={sectionRef}
    >
      <div className="living-heritage__inner">
        <div className="living-heritage__composition">
          <HeritageStory story={heritageStories.livingCulture} />

          <div className="living-heritage__editorial">
            <header className="living-heritage__intro">
              <p className="living-heritage__eyebrow">
                <span aria-hidden="true" />
                Living Heritage
              </p>
              <h2 data-voice-heading id="living-heritage-title">
                Stories Carried
                <span>Across Generations</span>
              </h2>
              <p>
                Explore living traditions, community memory, cultural expression and histories
                connected with Adivasi life in the Eastern Ghats.
              </p>
            </header>

            <div className="living-heritage__supporting">
              <HeritageStory story={heritageStories.oralMemory} />
              <HeritageStory story={heritageStories.tribalHistory} />
            </div>
          </div>

          <HeritageStory story={heritageStories.peoplePlace} />
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__visual" aria-hidden="true" />
        <div className="home-hero__wash" aria-hidden="true" />

        <div className="home-hero__content">
          <div className="home-hero__eyebrow">
            <span className="home-hero__eyebrow-rule" aria-hidden="true" />
            <span>ADIVASI CHRONICLES</span>
          </div>

          <h1 id="home-hero-title">
            Where the Eastern Ghats
            <span>Remember Their Stories</span>
          </h1>

          <p className="home-hero__description">
            Explore the history, people, rights, landscapes and living heritage of Adivasi
            communities through stories, knowledge and visual journeys.
          </p>

          <div className="home-hero__actions">
            <Link className="home-hero__button home-hero__button--primary" to="/tribal-history">
              Explore Our Stories
              <span aria-hidden="true">→</span>
            </Link>
            <a className="home-hero__button home-hero__button--secondary" href="#explore-region">
              Discover the Region
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="home-hero__signature" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="explore-region" id="explore-region" aria-labelledby="region-title">
        <div className="explore-region__inner">
          <header className="explore-region__intro">
            <p className="explore-region__eyebrow">
              <span aria-hidden="true" />
              Explore the Region
            </p>
            <h2 data-voice-heading id="region-title">Landscapes of the Eastern Ghats</h2>
            <p className="explore-region__description">
              Discover mist-covered hills, forest landscapes, valleys and places that shape the
              natural character of the region.
            </p>
          </header>

          <div className="explore-region__gallery">
            {landscapes.map((landscape) => (
              <LandscapeCard key={landscape.name} landscape={landscape} />
            ))}
          </div>
        </div>
      </section>

      <LivingHeritage />
      <DiscoverArchive />
      <FromTheJournal />
      <KnowledgeGateway />
      <MyJourneyPreview />
    </main>
  )
}

export default Home
