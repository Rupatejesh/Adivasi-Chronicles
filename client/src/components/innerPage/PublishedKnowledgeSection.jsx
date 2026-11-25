import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialSection } from './InnerPageFoundation.jsx';
import { knowledgeApi } from '../../services/api.js';
import '../../pages/MernDynamic.css';

export default function PublishedKnowledgeSection({ section, heading, detailPrefix = null }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    knowledgeApi.list({ section })
      .then((data) => {
        if (!cancelled) setArticles(data.articles || []);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [section]);

  if (loading || articles.length === 0) return null;

  return (
    <EditorialSection
      id={`${section}-published-archive`}
      eyebrow="Published Archive Entries"
      title={heading}
      description="Researched entries stored in the database with verification metadata and references."
      variant="mist"
    >
      <div className="ac-grid">
        {articles.map((article) => (
          <article key={article._id} className={`ac-card${article.isFeatured ? ' ac-card--featured' : ''}`}>
            <div className="ac-badge-row">
              {article.provisionOrArticle && <span className="ac-badge">{article.provisionOrArticle}</span>}
              {article.category && <span className="ac-badge ac-badge--earth">{article.category}</span>}
              <span className="ac-badge ac-badge--gold">{article.verificationStatus}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <div className="ac-meta">
              {article.location && <span>{article.location}</span>}
              {article.relevantYear && <span>Year: {article.relevantYear}</span>}
              {article.lastVerifiedAt && <span>Verified: {new Date(article.lastVerifiedAt).toLocaleDateString()}</span>}
            </div>
            {detailPrefix ? (
              <Link className="ac-btn ac-btn--secondary" to={`${detailPrefix}/${article.slug}`}>
                Read Entry →
              </Link>
            ) : article.officialSourceUrl ? (
              <a className="ac-btn ac-btn--secondary" href={article.officialSourceUrl} target="_blank" rel="noreferrer">
                Official Reference ↗
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </EditorialSection>
  );
}
