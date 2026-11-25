import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../hooks/useFavourite.js';
import { booksApi } from '../services/api.js';
import './MernDynamic.css';

export default function BookDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle: toggleFavourite } = useFavourites('book');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    booksApi.getBySlug(slug)
      .then((data) => { if (!cancelled) setBook(data.book || null); })
      .catch(() => { if (!cancelled) setBook(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  async function handleFavourite() {
    if (!isAuthenticated || !book) {
      setStatusMsg('Please login to save books to your favourites.');
      return;
    }
    const saved = await toggleFavourite('book', book._id);
    setStatusMsg(saved ? 'Saved to your favourites.' : 'Removed from your favourites.');
  }

  return (
    <main className="personal-archive-page">
      <PageBreadcrumb items={[{ label: 'Books & Ideas', to: '/books' }, { label: book?.title || slug }]} />
      <div className="ac-article-detail">
        <h1>{book?.title || `Book Archive: ${slug}`}</h1>
        {loading && <p className="ac-status">Loading reading entry…</p>}
        {!loading && book ? (
          <>
            <div className="ac-badge-row">
              <span className="ac-badge">{book.category || 'Books & Ideas'}</span>
              <span className="ac-badge ac-badge--gold">By {book.author}</span>
            </div>
            {book.publicationContext && <p className="ac-meta">{book.publicationContext}</p>}
            <p style={{ fontSize: '1.08rem', fontWeight: 500 }}>{book.overview}</p>
            {book.historicalContext && (
              <section>
                <h2>Historical Context</h2>
                <p className="ac-article-body">{book.historicalContext}</p>
              </section>
            )}
            {book.themes?.length > 0 && (
              <div className="ac-badge-row">
                {book.themes.map((theme) => <span key={theme} className="ac-badge ac-badge--earth">{theme}</span>)}
              </div>
            )}
            {book.personalNotes && (
              <section className="ac-panel" style={{ width: '100%', margin: 0 }}>
                <h2>Personal Reading Notes</h2>
                <p className="ac-article-body">{book.personalNotes}</p>
              </section>
            )}
            {book.sources?.length > 0 && (
              <aside className="ac-sources-box" aria-label="References">
                <p className="editorial-page__eyebrow">References</p>
                <ul>
                  {book.sources.map((src, idx) => (
                    <li key={idx}>
                      <strong>{src.title || src.publisher || 'Reference'}</strong>
                      {src.url && <> (<a href={src.url} target="_blank" rel="noreferrer">Source ↗</a>)</>}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
            <div className="ac-toolbar" style={{ justifyContent: 'flex-start' }}>
              <button type="button" className="ac-btn ac-btn--secondary" onClick={handleFavourite}>
                {isSaved(book._id) ? '★ Saved in Favourites' : '☆ Save Favourite'}
              </button>
              <Link className="ac-btn ac-btn--secondary" to="/books">← Back to Books &amp; Ideas</Link>
            </div>
            {statusMsg && <p className="ac-status" role="status">{statusMsg}</p>}
          </>
        ) : !loading ? (
          <>
            <p className="ac-status">Reading notes and verified historical references for “{slug}” are pending review and can be published via the Admin Dashboard.</p>
            <Link className="ac-btn ac-btn--secondary" to="/books">← Back to Books &amp; Ideas</Link>
          </>
        ) : null}
      </div>
    </main>
  );
}
