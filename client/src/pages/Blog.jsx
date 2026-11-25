import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageBreadcrumb, EditorialCTA, ReferenceBlock } from '../components/innerPage/InnerPageFoundation.jsx';
import { journalCategories, journalSlots } from '../data/journal.js';
import ProjectArtwork from '../components/editorial/ProjectArtwork.jsx';
import { categoriesApi, postsApi } from '../services/api.js';
import './EditorialPages.css';
import './MernDynamic.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      postsApi.list().catch(() => ({ posts: [] })),
      categoriesApi.list({ type: 'blog' }).catch(() => ({ categories: [] })),
    ]).then(([postsData, catsData]) => {
      if (cancelled) return;
      setPosts(postsData.posts || []);
      setCategories(catsData.categories || []);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCat = !selectedCategory || post.category?._id === selectedCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery = !q
      || post.title.toLowerCase().includes(q)
      || (post.excerpt || '').toLowerCase().includes(q)
      || (post.tags || []).some((tag) => tag.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0] || null;

  return (
    <main className="editorial-page journal-page">
      <PageBreadcrumb items={[{ label: 'Blog' }]} />
      <header className="editorial-page__hero">
        <p className="editorial-page__eyebrow">BLOG / JOURNAL</p>
        <h1>Stories to return to.<br /><em>Ideas to carry forward.</em></h1>
        <p>A journal for researched writing, reading notes and reflections on people, land and memory.</p>
        <span className="editorial-page__edition">
          {posts.length > 0
            ? `${posts.length} published ${posts.length === 1 ? 'article' : 'articles'} in the journal`
            : 'The journal is taking shape · Editorial foundation'}
        </span>
      </header>

      <section className="journal-feature" aria-labelledby="featured-story-title">
        {featuredPost?.coverImage ? (
          <ProjectArtwork src={featuredPost.coverImage} alt={featuredPost.title} caption={featuredPost.category?.name || 'Featured article'} />
        ) : (
          <ProjectArtwork
            src="/images/image2.jpg.png"
            alt="User-selected Adivasi Chronicles project composition with landscape, people and books."
            caption="Project artwork · an editorial illustration, not a source for historical or geographic claims."
          />
        )}
        <div>
          <p className="editorial-page__eyebrow">{featuredPost ? 'Featured article' : 'The opening essay'}</p>
          <h2 id="featured-story-title">{featuredPost ? featuredPost.title : 'A place for the first story.'}</h2>
          <p>
            {featuredPost
              ? (featuredPost.excerpt || 'Read the full essay, explore references and join the discussion.')
              : 'Our featured story will appear here after its writing and references have been reviewed.'}
          </p>
          {featuredPost ? (
            <div style={{ marginTop: '1.25rem' }}>
              <EditorialCTA to={`/blog/${featuredPost.slug}`} variant="earth">Read Featured Story</EditorialCTA>
            </div>
          ) : (
            <p className="editorial-page__note">Publication pending · No article has been published.</p>
          )}
        </div>
      </section>

      <section className="editorial-page__section" aria-labelledby="journal-categories">
        <p className="editorial-page__eyebrow">Follow a thread</p>
        <h2 id="journal-categories">Explore the journal’s subjects</h2>
        <nav className="journal-categories" aria-label="Explore related archives">
          {journalCategories.map(([name, to]) => (
            <Link key={name} to={to}>{name}<span aria-hidden="true"> ↗</span></Link>
          ))}
        </nav>
      </section>

      <section className="editorial-page__section" aria-labelledby="recent-stories">
        <div className="journal-section-heading">
          <div>
            <p className="editorial-page__eyebrow">Recent stories</p>
            <h2 id="recent-stories">{posts.length > 0 ? 'Published Essays & Field Notes' : 'Pages yet to be written'}</h2>
          </div>
          <label className="journal-search">
            Search stories
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, excerpt or tag…"
            />
          </label>
        </div>

        {categories.length > 0 && (
          <div className="archive-filters" style={{ marginBottom: '1.5rem' }} role="group" aria-label="Filter blog by category">
            <button type="button" aria-pressed={selectedCategory === ''} onClick={() => setSelectedCategory('')}>
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                aria-pressed={selectedCategory === cat._id}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="ac-status">Loading journal articles…</p>
        ) : filteredPosts.length > 0 ? (
          <div className="ac-grid">
            {filteredPosts.map((post) => (
              <article className={`ac-card${post.isFeatured ? ' ac-card--featured' : ''}`} key={post._id}>
                {post.coverImage && (
                  <div className="ac-card__media">
                    <img src={post.coverImage} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="ac-badge-row">
                  <span className="ac-badge">{post.category?.name || 'Journal'}</span>
                  {post.isFeatured && <span className="ac-badge ac-badge--gold">Featured</span>}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt || `${post.content.slice(0, 140)}…`}</p>
                <div className="ac-meta">
                  <span>By {post.author?.name || 'Archive Author'}</span>
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  <span>{post.likes?.length || 0} likes</span>
                </div>
                {post.tags?.length > 0 && (
                  <div className="ac-badge-row">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="ac-badge ac-badge--earth">#{tag}</span>
                    ))}
                  </div>
                )}
                <Link className="ac-btn ac-btn--secondary" to={`/blog/${post.slug}`}>
                  Read Article →
                </Link>
              </article>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <p className="ac-status">No published articles match your current filter.</p>
        ) : (
          <div className="journal-grid">
            {journalSlots.map((story, index) => (
              <article className="journal-slot" key={story.id}>
                <span className="journal-slot__index">0{index + 1}</span>
                <p className="editorial-page__eyebrow">{story.topic}</p>
                <h3>Story forthcoming</h3>
                <p>Space reserved for a reviewed article, with context and sources.</p>
                <dl>
                  <div><dt>Author</dt><dd>{story.author || 'To be added'}</dd></div>
                  <div><dt>Published</dt><dd>{story.publishedAt || 'Not published'}</dd></div>
                  <div><dt>References</dt><dd>Pending review</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
        <p className="editorial-page__note" style={{ marginTop: '1.25rem' }}>
          Authors and administrators can compose, save drafts and publish articles from the <Link to="/admin">Admin Dashboard</Link>.
        </p>
      </section>

      <ReferenceBlock description="Every published research article carries its own sources, author and publication date. Corrections and uncertain information are clearly identified." />
      <div className="editorial-page__closing">
        <h2>Begin with the archive.</h2>
        <EditorialCTA to="/tribal-history" variant="earth">Explore Tribal History</EditorialCTA>
      </div>
    </main>
  );
}
