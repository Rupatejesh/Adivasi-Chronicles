import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { biographyPreviews } from '../data/biographies.js';
import { BiographyPreview } from './Heroes.jsx';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import VerifiedQuotation from '../components/VerifiedQuotation.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../hooks/useFavourite.js';
import { biographiesApi } from '../services/api.js';
import './MernDynamic.css';

export default function HeroDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle: toggleFavourite } = useFavourites('biography');

  const [dbBio, setDbBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favMessage, setFavMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    biographiesApi.getBySlug(slug)
      .then((data) => {
        if (!cancelled) setDbBio(data.biography || null);
      })
      .catch(() => {
        if (!cancelled) setDbBio(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const previewPerson = biographyPreviews.find((entry) => entry.slug === slug);

  async function handleFavourite() {
    if (!isAuthenticated || !dbBio) {
      setFavMessage('Please login to save biographies to your favourites.');
      return;
    }
    const saved = await toggleFavourite('biography', dbBio._id);
    setFavMessage(saved ? 'Saved to your favourites.' : 'Removed from your favourites.');
  }

  return (
    <main className="heroes-page hero-detail">
      <PageBreadcrumb items={[{ label: 'Heroes', to: '/heroes' }, { label: dbBio?.name || previewPerson?.name || 'Archive entry' }]} />
      <div className="ac-article-detail">
        <h1>{dbBio?.name || previewPerson?.name || 'Biography archive entry'}</h1>

        {loading && <p className="ac-status">Checking archive records…</p>}

        {!loading && dbBio ? (
          <>
            <div className="ac-badge-row">
              <span className="ac-badge">Verification: {dbBio.verificationStatus}</span>
              {dbBio.region && <span className="ac-badge ac-badge--earth">{dbBio.region}</span>}
              {dbBio.community && <span className="ac-badge ac-badge--gold">{dbBio.community}</span>}
            </div>

            {dbBio.portrait && (
              <div className="ac-card__media" style={{ maxWidth: '24rem' }}>
                <img src={dbBio.portrait} alt={`Portrait of ${dbBio.name}`} />
              </div>
            )}

            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{dbBio.summary}</p>

            {(dbBio.birthDate || dbBio.deathDate || dbBio.lastVerifiedAt) && (
              <div className="ac-meta">
                {dbBio.birthDate && <span>Born: {new Date(dbBio.birthDate).toLocaleDateString()}</span>}
                {dbBio.deathDate && <span>Died: {new Date(dbBio.deathDate).toLocaleDateString()}</span>}
                {dbBio.lastVerifiedAt && <span>Last verified: {new Date(dbBio.lastVerifiedAt).toLocaleDateString()}</span>}
              </div>
            )}

            {dbBio.biography && <div className="ac-article-body">{dbBio.biography}</div>}

            {dbBio.keyContributions?.length > 0 && (
              <section className="ac-panel" style={{ width: '100%', margin: 0 }}>
                <h2>Key Contributions &amp; Historical Context</h2>
                <ul>
                  {dbBio.keyContributions.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </section>
            )}

            {dbBio.quotations?.length > 0 && (
              <section style={{ display: 'grid', gap: '1rem' }}>
                <h2>Documented Quotations</h2>
                {dbBio.quotations.map((quote, idx) => (
                  <VerifiedQuotation
                    key={idx}
                    quoteText={quote.text}
                    quoteAuthor={dbBio.name}
                    quoteSource={quote.sourceTitle}
                    quoteSourceUrl={quote.sourceUrl}
                    verificationStatus={quote.verified ? 'verified' : 'pending'}
                  />
                ))}
              </section>
            )}

            {dbBio.sources?.length > 0 && (
              <aside className="ac-sources-box" aria-label="Sources and references">
                <p className="editorial-page__eyebrow">Sources &amp; References</p>
                <ul>
                  {dbBio.sources.map((src, idx) => (
                    <li key={idx}>
                      <strong>{src.title || src.publisher || 'Reference'}</strong>
                      {src.publisher && src.title ? ` — ${src.publisher}` : ''}
                      {src.url && <> (<a href={src.url} target="_blank" rel="noreferrer">Source ↗</a>)</>}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="ac-toolbar" style={{ justifyContent: 'flex-start' }}>
              <button type="button" className="ac-btn ac-btn--secondary" onClick={handleFavourite}>
                {isSaved(dbBio._id) ? '★ Saved in Favourites' : '☆ Save Favourite'}
              </button>
              <Link className="ac-btn ac-btn--secondary" to="/heroes">← Back to Heroes</Link>
            </div>
            {favMessage && <p className="ac-status" role="status">{favMessage}</p>}
          </>
        ) : !loading && previewPerson ? (
          <>
            <BiographyPreview key={slug} person={previewPerson} featured />
            <Link className="ac-btn ac-btn--secondary" to="/heroes">← Back to Heroes</Link>
          </>
        ) : !loading ? (
          <>
            <p>Researched biography and references are pending for this archive entry.</p>
            <Link className="ac-btn ac-btn--secondary" to="/heroes">← Back to Heroes</Link>
          </>
        ) : null}
      </div>
    </main>
  );
}
