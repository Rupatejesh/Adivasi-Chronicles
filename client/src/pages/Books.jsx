import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import { booksApi } from '../services/api.js'
import './Books.css'
import './MernDynamic.css'

const archiveGroups = [
  {
    id: 'social-thought',
    number: '01',
    label: 'Social Thought',
    title: 'Questions About Society & Equality',
    description: 'A reading space for works placed under social thought.',
    books: [
      {
        title: 'Gulamgiri',
        category: 'Social Thought',
        slug: 'gulamgiri',
        initials: 'G',
        cover: '/images/books/gulamgiri.jpg',
        featured: true,
      },
      {
        title: 'Why I Am an Atheist',
        category: 'Social Thought',
        slug: 'why-i-am-an-atheist',
        initials: 'W A A',
        cover: '/images/books/why-i-am-an-atheist.jpg',
      },
      {
        title: 'Basavanna — historical/social thought',
        category: 'Social Thought',
        slug: 'basavanna',
        initials: 'B',
        cover: '/images/books/basavanna.jpg',
      },
    ],
  },
  {
    id: 'history-memory',
    number: '02',
    label: 'History & Memory',
    title: 'Reading the Past Through Text',
    description: 'A place for reading material gathered under history and memory.',
    books: [
      {
        title: 'Girijana Vidhvamsam',
        category: 'History & Memory',
        slug: 'girijana-vidhvamsam',
        initials: 'G V',
        cover: '/images/books/girijana-vidhvamsam.jpg',
      },
    ],
  },
  {
    id: 'rights-public-ideas',
    number: '03',
    label: 'Rights & Public Ideas',
    title: 'Ideas About Justice & Citizenship',
    description: 'A reading area for titles grouped under rights and public ideas.',
    books: [
      {
        title: 'Annihilation of Caste',
        category: 'Rights & Public Ideas',
        slug: 'annihilation-of-caste',
        initials: 'A C',
        cover: '/images/books/annihilation-of-caste.jpg',
      },
    ],
  },
  {
    id: 'tribal-policy-development',
    number: '04',
    label: 'Tribal Policy & Development',
    title: 'Reading Policy, Community & Change',
    description: 'A space for reading topics connected with tribal policy and development.',
    books: [
      {
        title: "Nehru's Tribal Panchsheel / tribal policy",
        category: 'Tribal Policy & Development',
        slug: 'tribal-panchsheel',
        initials: 'N T P',
        cover: '/images/books/tribal-panchsheel.jpg',
      },
    ],
  },
]

function BookPreview({ book }) {
  return (
    <article
      className={`reading-entry${book.featured ? ' reading-entry--featured' : ''}`}
      data-cover-path={book.cover}
    >
      <Link
        className="reading-entry__link"
        to={`/books/${book.slug}`}
        aria-label={`Open reading archive placeholder: ${book.title}`}
      >
        <div className="reading-entry__cover" aria-hidden="true">
          <span className="reading-entry__cover-initials">{book.initials}</span>
          <span className="reading-entry__cover-rule" />
        </div>
        <div className="reading-entry__copy">
          <p className="reading-entry__category">{book.category}</p>
          <h4>{book.title}</h4>
          <p className="reading-entry__note">
            Reading notes and referenced material will be added as the archive develops.
          </p>
        </div>
      </Link>
    </article>
  )
}

function ArchiveGroup({ group }) {
  return (
    <section className="reading-group" id={group.id} aria-labelledby={`${group.id}-title`}>
      <header className="reading-group__heading">
        <p className="reading-group__number">{group.number}</p>
        <div>
          <p className="reading-group__eyebrow">{group.label}</p>
          <h3 id={`${group.id}-title`}>{group.title}</h3>
          <p className="reading-group__description">{group.description}</p>
        </div>
      </header>
      <div className={`reading-group__entries reading-group__entries--${group.id}`}>
        {group.books.map((book) => (
          <BookPreview book={book} key={book.slug} />
        ))}
      </div>
    </section>
  )
}

function Books() {
  const [publishedBooks, setPublishedBooks] = useState([])

  useEffect(() => {
    let cancelled = false
    booksApi.list()
      .then((data) => {
        if (!cancelled) setPublishedBooks(data.books || [])
      })
      .catch(() => {
        if (!cancelled) setPublishedBooks([])
      })
    return () => { cancelled = true }
  }, [])

  return (
    <main className="books-page">
      <PageBreadcrumb items={[{ label: 'Books' }]} />

      <InnerPageHero
        eyebrow="Books & Ideas"
        title={
          <>
            Words, Ideas &
            <br />
            Questions That Endure
          </>
        }
        description="An evolving reading archive for books, essays and ideas connected with society, equality, history and public thought."
        metadata="ADIVASI CHRONICLES  •  READING ARCHIVE"
        variant="reading-room"
      />

      <EditorialSection
        id="reading-room-introduction"
        eyebrow="Reading & Reflection"
        title={
          <>
            Books Open More
            <br />
            Than Pages
          </>
        }
        description="This space is designed for reading notes, contextual introductions and referenced explorations of important books and ideas."
        variant="paper"
      >
        <nav className="reading-index" aria-label="Reading archive categories">
          {archiveGroups.map((group) => (
            <a className="reading-index__item" href={`#${group.id}`} key={group.id}>
              <span>{group.number}</span>
              <span>{group.label}</span>
            </a>
          ))}
        </nav>

        <div className="reading-archive">
          {archiveGroups.map((group) => (
            <ArchiveGroup group={group} key={group.id} />
          ))}
        </div>
      </EditorialSection>

      {publishedBooks.length > 0 && (
        <EditorialSection
          id="published-books"
          eyebrow="Published Reading Notes"
          title="Books & Ideas in the Database"
          description="Published book overviews, themes and study notes from the archive."
          variant="mist"
        >
          <div className="ac-grid">
            {publishedBooks.map((book) => (
              <article key={book._id} className={`ac-card${book.isFeatured ? ' ac-card--featured' : ''}`}>
                <div className="ac-badge-row">
                  <span className="ac-badge">{book.category || 'Books & Ideas'}</span>
                </div>
                <h3>{book.title}</h3>
                <p className="ac-meta">By {book.author}</p>
                <p>{book.overview}</p>
                <Link className="ac-btn ac-btn--secondary" to={`/books/${book.slug}`}>
                  Read Notes →
                </Link>
              </article>
            ))}
          </div>
        </EditorialSection>
      )}

      <ReferenceBlock description="References for reading notes and detailed articles will appear here as material is researched and verified." />

      <nav className="books-page__cross-navigation" aria-label="Explore related archives">
        <EditorialCTA to="/heroes" variant="earth">
          Explore Heroes
        </EditorialCTA>
        <EditorialCTA to="/constitution" variant="earth">
          Explore Constitution
        </EditorialCTA>
      </nav>
    </main>
  )
}

export default Books
