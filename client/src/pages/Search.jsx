import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageBreadcrumb, InnerPageHero } from '../components/innerPage/InnerPageFoundation.jsx';
import { getApiErrorMessage, searchApi } from '../services/api.js';
import './MernDynamic.css';

const typeOptions = ['All', 'Blog', 'Tribal History', 'Biography', 'Book & Ideas', 'Constitution', 'Tribal Rights', 'ITDA', 'Scheme', 'Music', 'Gallery', 'My Journey'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedQuery, setSearchedQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get('q')?.trim() || '';
    setQuery(q);
    setSearchedQuery(q);
    if (!q) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    searchApi.search(q)
      .then((data) => {
        if (!cancelled) setResults(data.results || []);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'Unable to search the archive right now.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  }

  const filteredResults = selectedType === 'All'
    ? results
    : results.filter((item) => item.type === selectedType);

  return (
    <main className="personal-archive-page">
      <PageBreadcrumb items={[{ label: 'Search' }]} />
      <InnerPageHero
        eyebrow="GLOBAL ARCHIVE SEARCH"
        title="Search Across Stories, History & Rights"
        description="Find published articles, biographies, books, constitutional entries, tribal rights, ITDA guides, schemes, music and visual records."
        metadata="ADIVASI CHRONICLES • PUBLIC SEARCH"
        variant="editorial"
      />

      <section className="ac-panel" aria-label="Search public content">
        <form className="ac-toolbar" onSubmit={handleSubmit}>
          <label htmlFor="global-search-input" className="visually-hidden">Search query</label>
          <input
            id="global-search-input"
            className="ac-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, topic, person, book or scheme…"
            style={{ flex: '1 1 18rem' }}
          />
          <button className="ac-btn" type="submit">Search Archive</button>
        </form>

        <div className="archive-filters" style={{ marginTop: '1rem' }} role="group" aria-label="Filter results by content type">
          {typeOptions.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={selectedType === type}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {loading && <p className="ac-status" style={{ marginTop: '1.25rem' }}>Searching published archive…</p>}
        {error && <p className="ac-status ac-status--error" role="alert" style={{ marginTop: '1.25rem' }}>{error}</p>}

        {!loading && !error && searchedQuery && (
          <p className="ac-meta" style={{ marginTop: '1.25rem' }}>
            Showing {filteredResults.length} published {filteredResults.length === 1 ? 'result' : 'results'} for “{searchedQuery}”. Unpublished drafts never appear here.
          </p>
        )}

        {!loading && !searchedQuery && (
          <p className="ac-meta" style={{ marginTop: '1.25rem' }}>
            Enter a keyword above to search across all published sections of Adivasi Chronicles.
          </p>
        )}

        {!loading && filteredResults.length > 0 && (
          <div className="ac-grid">
            {filteredResults.map((item) => (
              <article key={`${item.type}-${item.id}`} className="ac-card">
                <div className="ac-badge-row">
                  <span className="ac-badge">{item.type}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className="ac-btn ac-btn--secondary" to={item.link}>
                  Open {item.type} →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
