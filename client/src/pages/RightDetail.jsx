import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../hooks/useFavourite.js';
import { knowledgeApi } from '../services/api.js';
import './MernDynamic.css';

export default function RightDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle: toggleFavourite } = useFavourites('article');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    knowledgeApi.getBySlug(slug, 'rights')
      .then((data) => { if (!cancelled) setArticle(data.article || null); })
      .catch(() => { if (!cancelled) setArticle(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  async function handleFavourite() {
    if (!isAuthenticated || !article) {
      setStatusMsg('Please login to save articles to your favourites.');
      return;
    }
    const saved = await toggleFavourite('article', article._id);
    setStatusMsg(saved ? 'Saved to your favourites.' : 'Removed from your favourites.');
  }

  return (
    <main className="personal-archive-page">
      <PageBreadcrumb items={[{ label: 'Tribal Rights', to: '/rights' }, { label: article?.title || slug }]} />
      <div className="ac-article-detail">
        <h1>{article?.title || `Rights Archive: ${slug}`}</h1>
        {loading && <p className="ac-status">Loading rights documentation…</p>}
        {!loading && article ? (
          <>
            <div className="ac-badge-row">
              {article.provisionOrArticle && <span className="ac-badge">{article.provisionOrArticle}</span>}
              <span className="ac-badge ac-badge--gold">Verification: {article.verificationStatus}</span>
              {article.lastVerifiedAt && (
                <span className="ac-badge ac-badge--earth">
                  Verified: {new Date(article.lastVerifiedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p style={{ fontSize: '1.08rem', fontWeight: 500 }}>{article.summary}</p>
            {article.plainExplanation && (
              <section className="ac-panel" style={{ width: '100%', margin: 0 }}>
                <h2>Plain-Language Overview</h2>
                <p className="ac-article-body">{article.plainExplanation}</p>
              </section>
            )}
            {article.historicalContext && (
              <section>
                <h2>Context &amp; Background</h2>
                <p className="ac-article-body">{article.historicalContext}</p>
              </section>
            )}
            {article.content && <div className="ac-article-body">{article.content}</div>}
            {(article.officialSource || article.sources?.length > 0) && (
              <aside className="ac-sources-box" aria-label="Official sources">
                <p className="editorial-page__eyebrow">Official Sources &amp; References</p>
                {article.officialSource && (
                  <p>
                    <strong>{article.officialSource}</strong>
                    {article.officialSourceUrl && <> (<a href={article.officialSourceUrl} target="_blank" rel="noreferrer">Official reference ↗</a>)</>}
                  </p>
                )}
                {article.sources?.length > 0 && (
                  <ul>
                    {article.sources.map((src, idx) => (
                      <li key={idx}>
                        <strong>{src.title || src.publisher || 'Reference'}</strong>
                        {src.url && <> (<a href={src.url} target="_blank" rel="noreferrer">Link ↗</a>)</>}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            )}
            <p className="ac-meta">Educational rights information only — not individual legal advice.</p>
            <div className="ac-toolbar" style={{ justifyContent: 'flex-start' }}>
              <button type="button" className="ac-btn ac-btn--secondary" onClick={handleFavourite}>
                {isSaved(article._id) ? '★ Saved in Favourites' : '☆ Save Favourite'}
              </button>
              <Link className="ac-btn ac-btn--secondary" to="/rights">← Back to Rights</Link>
            </div>
            {statusMsg && <p className="ac-status" role="status">{statusMsg}</p>}
          </>
        ) : !loading ? (
          <>
            <p className="ac-status">Verified legal documentation for “{slug}” is pending review and can be published via the Admin Dashboard.</p>
            <Link className="ac-btn ac-btn--secondary" to="/rights">← Back to Rights</Link>
          </>
        ) : null}
      </div>
    </main>
  );
}
