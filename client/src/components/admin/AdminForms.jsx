import { useCallback, useEffect, useState } from 'react';
import {
  biographiesApi,
  booksApi,
  categoriesApi,
  galleryApi,
  getApiErrorMessage,
  journeyApi,
  knowledgeApi,
  postsApi,
  schemesApi,
  songsApi,
} from '../../services/api.js';

const RESOURCE_CONFIGS = {
  posts: {
    label: 'Blog Articles',
    listKey: 'posts',
    itemKey: 'post',
    api: postsApi,
    initial: () => ({
      title: '', slug: '', excerpt: '', content: '', coverImage: '',
      category: '', tags: '', status: 'draft', isFeatured: false,
      sourceTitle: '', sourceUrl: '',
    }),
    toForm: (item) => ({
      title: item.title || '',
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      category: item.category?._id || item.category || '',
      tags: (item.tags || []).join(', '),
      status: item.status || 'draft',
      isFeatured: Boolean(item.isFeatured),
      sourceTitle: item.sources?.[0]?.title || '',
      sourceUrl: item.sources?.[0]?.url || '',
    }),
    toPayload: (f) => ({
      title: f.title,
      slug: f.slug || undefined,
      excerpt: f.excerpt,
      content: f.content,
      coverImage: f.coverImage,
      category: f.category,
      tags: f.tags,
      status: f.status,
      isFeatured: f.isFeatured,
      sources: f.sourceTitle || f.sourceUrl ? [{ title: f.sourceTitle, url: f.sourceUrl }] : [],
    }),
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Slug (optional)' },
      { name: 'category', label: 'Category', type: 'categorySelect', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'] },
      { name: 'excerpt', label: 'Excerpt / Summary', type: 'textarea' },
      { name: 'content', label: 'Article Content', type: 'textarea', required: true },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'coverImage', label: 'Cover Image Path or URL' },
      { name: 'sourceTitle', label: 'Reference / Source Title' },
      { name: 'sourceUrl', label: 'Reference URL' },
      { name: 'isFeatured', label: 'Feature this article', type: 'checkbox' },
    ],
    getTitle: (item) => item.title,
    getBadges: (item) => [item.status, item.category?.name].filter(Boolean),
  },

  categories: {
    label: 'Categories',
    listKey: 'categories',
    itemKey: 'category',
    api: categoriesApi,
    listParams: { includeInactive: 'true' },
    initial: () => ({ name: '', slug: '', description: '', type: 'blog', isActive: true }),
    toForm: (item) => ({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      type: item.type || 'blog',
      isActive: item.isActive !== false,
    }),
    toPayload: (f) => ({ ...f }),
    fields: [
      { name: 'name', label: 'Category Name', required: true },
      { name: 'slug', label: 'Slug (optional)' },
      {
        name: 'type',
        label: 'Section Type',
        type: 'select',
        options: ['blog', 'history', 'biography', 'books', 'constitution', 'rights', 'itda', 'schemes', 'music', 'gallery', 'journey', 'general'],
      },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    getTitle: (item) => item.name,
    getBadges: (item) => [item.type, item.isActive ? 'active' : 'inactive'],
  },

  biographies: {
    label: 'Biographies (Heroes)',
    listKey: 'biographies',
    itemKey: 'biography',
    api: biographiesApi,
    initial: () => ({
      name: '', slug: '', summary: '', biography: '', region: '', community: '',
      portrait: '', keyContributions: '', verificationStatus: 'pending',
      isFeatured: false, isPublished: false, sourceTitle: '', sourceUrl: '',
    }),
    toForm: (item) => ({
      name: item.name || '',
      slug: item.slug || '',
      summary: item.summary || '',
      biography: item.biography || '',
      region: item.region || '',
      community: item.community || '',
      portrait: item.portrait || '',
      keyContributions: (item.keyContributions || []).join(', '),
      verificationStatus: item.verificationStatus || 'pending',
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
      sourceTitle: item.sources?.[0]?.title || '',
      sourceUrl: item.sources?.[0]?.url || '',
    }),
    toPayload: (f) => ({
      name: f.name,
      slug: f.slug || undefined,
      summary: f.summary,
      biography: f.biography,
      region: f.region,
      community: f.community,
      portrait: f.portrait,
      keyContributions: f.keyContributions,
      verificationStatus: f.verificationStatus,
      isFeatured: f.isFeatured,
      isPublished: f.isPublished,
      sources: f.sourceTitle || f.sourceUrl ? [{ title: f.sourceTitle, url: f.sourceUrl }] : [],
    }),
    fields: [
      { name: 'name', label: 'Person Name', required: true },
      { name: 'slug', label: 'Slug (optional)' },
      { name: 'region', label: 'Region' },
      { name: 'community', label: 'Community' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'biography', label: 'Full Biography', type: 'textarea' },
      { name: 'keyContributions', label: 'Key Contributions (comma separated)' },
      { name: 'portrait', label: 'Verified Portrait Path' },
      { name: 'verificationStatus', label: 'Verification Status', type: 'select', options: ['pending', 'reviewed', 'verified'] },
      { name: 'sourceTitle', label: 'Source Citation Title' },
      { name: 'sourceUrl', label: 'Source URL' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => item.name,
    getBadges: (item) => [item.isPublished ? 'published' : 'draft', item.verificationStatus],
  },

  books: {
    label: 'Books & Ideas',
    listKey: 'books',
    itemKey: 'book',
    api: booksApi,
    initial: () => ({
      title: '', slug: '', author: '', category: 'Social Thought', publicationContext: '',
      overview: '', historicalContext: '', themes: '', personalNotes: '',
      sourceTitle: '', sourceUrl: '', isFeatured: false, isPublished: false,
    }),
    toForm: (item) => ({
      title: item.title || '',
      slug: item.slug || '',
      author: item.author || '',
      category: item.category || 'Social Thought',
      publicationContext: item.publicationContext || '',
      overview: item.overview || '',
      historicalContext: item.historicalContext || '',
      themes: (item.themes || []).join(', '),
      personalNotes: item.personalNotes || '',
      sourceTitle: item.sources?.[0]?.title || '',
      sourceUrl: item.sources?.[0]?.url || '',
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
    }),
    toPayload: (f) => ({
      ...f,
      slug: f.slug || undefined,
      sources: f.sourceTitle || f.sourceUrl ? [{ title: f.sourceTitle, url: f.sourceUrl }] : [],
    }),
    fields: [
      { name: 'title', label: 'Book Title', required: true },
      { name: 'author', label: 'Author', required: true },
      { name: 'slug', label: 'Slug (optional)' },
      { name: 'category', label: 'Category' },
      { name: 'publicationContext', label: 'Publication Context' },
      { name: 'overview', label: 'Overview', type: 'textarea', required: true },
      { name: 'historicalContext', label: 'Historical Context', type: 'textarea' },
      { name: 'themes', label: 'Important Themes (comma separated)' },
      { name: 'personalNotes', label: 'Personal Notes', type: 'textarea' },
      { name: 'sourceTitle', label: 'Reference Title' },
      { name: 'sourceUrl', label: 'Reference URL' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => `${item.title} — ${item.author}`,
    getBadges: (item) => [item.isPublished ? 'published' : 'draft', item.category],
  },

  knowledge: {
    label: 'Knowledge Hub (History / Constitution / Rights / ITDA)',
    listKey: 'articles',
    itemKey: 'article',
    api: knowledgeApi,
    initial: () => ({
      title: '', slug: '', section: 'tribal-history', category: '', summary: '',
      provisionOrArticle: '', plainExplanation: '', historicalContext: '', content: '',
      location: '', officialSource: '', officialSourceUrl: '', relevantYear: '',
      verificationStatus: 'pending', isFeatured: false, isPublished: false,
    }),
    toForm: (item) => ({
      title: item.title || '',
      slug: item.slug || '',
      section: item.section || 'tribal-history',
      category: item.category || '',
      summary: item.summary || '',
      provisionOrArticle: item.provisionOrArticle || '',
      plainExplanation: item.plainExplanation || '',
      historicalContext: item.historicalContext || '',
      content: item.content || '',
      location: item.location || '',
      officialSource: item.officialSource || '',
      officialSourceUrl: item.officialSourceUrl || '',
      relevantYear: item.relevantYear || '',
      verificationStatus: item.verificationStatus || 'pending',
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
    }),
    toPayload: (f) => ({ ...f, slug: f.slug || undefined }),
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'section', label: 'Hub Section', type: 'select', options: ['tribal-history', 'constitution', 'rights', 'itda'] },
      { name: 'slug', label: 'Slug (optional)' },
      { name: 'category', label: 'Topic / Category' },
      { name: 'provisionOrArticle', label: 'Provision / Article (optional)' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'plainExplanation', label: 'Plain-Language Explanation', type: 'textarea' },
      { name: 'historicalContext', label: 'Historical Context', type: 'textarea' },
      { name: 'content', label: 'Full Article Content', type: 'textarea' },
      { name: 'location', label: 'Location / District' },
      { name: 'officialSource', label: 'Official Source' },
      { name: 'officialSourceUrl', label: 'Official Source URL' },
      { name: 'relevantYear', label: 'Relevant Year' },
      { name: 'verificationStatus', label: 'Verification Status', type: 'select', options: ['pending', 'reviewed', 'verified'] },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => item.title,
    getBadges: (item) => [item.section, item.isPublished ? 'published' : 'draft', item.verificationStatus],
  },

  schemes: {
    label: 'Schemes & Funds',
    listKey: 'schemes',
    itemKey: 'scheme',
    api: schemesApi,
    initial: () => ({
      name: '', slug: '', department: '', category: 'education', purpose: '',
      eligibility: '', benefits: '', applicationInfo: '', officialSource: '',
      officialSourceUrl: '', relevantYear: '', isFeatured: false, isPublished: false,
    }),
    toForm: (item) => ({
      name: item.name || '',
      slug: item.slug || '',
      department: item.department || '',
      category: item.category || 'education',
      purpose: item.purpose || '',
      eligibility: item.eligibility || '',
      benefits: item.benefits || '',
      applicationInfo: item.applicationInfo || '',
      officialSource: item.officialSource || '',
      officialSourceUrl: item.officialSourceUrl || '',
      relevantYear: item.relevantYear || '',
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
    }),
    toPayload: (f) => ({ ...f, slug: f.slug || undefined }),
    fields: [
      { name: 'name', label: 'Scheme Name', required: true },
      { name: 'department', label: 'Department', required: true },
      { name: 'slug', label: 'Slug (optional)' },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: ['education', 'health', 'livelihoods', 'agriculture-forest', 'housing-infrastructure', 'women-community', 'financial-support', 'tricor', 'other'],
      },
      { name: 'purpose', label: 'Purpose', type: 'textarea', required: true },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
      { name: 'benefits', label: 'Benefits', type: 'textarea' },
      { name: 'applicationInfo', label: 'Application Information', type: 'textarea' },
      { name: 'officialSource', label: 'Official Source' },
      { name: 'officialSourceUrl', label: 'Official Source URL' },
      { name: 'relevantYear', label: 'Relevant Financial Year' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => item.name,
    getBadges: (item) => [item.category, item.isPublished ? 'published' : 'draft'],
  },

  songs: {
    label: 'Music Library',
    listKey: 'songs',
    itemKey: 'song',
    api: songsApi,
    initial: () => ({
      title: '', artist: '', category: 'tribal-folk', language: '',
      sourceType: 'metadata-only', audioUrl: '', externalUrl: '', artwork: '',
      duration: '', tags: '', isFeatured: false, isActive: true,
    }),
    toForm: (item) => ({
      title: item.title || '',
      artist: item.artist || '',
      category: item.category || 'tribal-folk',
      language: item.language || '',
      sourceType: item.sourceType || 'metadata-only',
      audioUrl: item.audioUrl || '',
      externalUrl: item.externalUrl || '',
      artwork: item.artwork || '',
      duration: item.duration ?? '',
      tags: (item.tags || []).join(', '),
      isFeatured: Boolean(item.isFeatured),
      isActive: item.isActive !== false,
    }),
    toPayload: (f) => ({ ...f }),
    fields: [
      { name: 'title', label: 'Song Title', required: true },
      { name: 'artist', label: 'Artist / Composer', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['ambedkar', 'tribal-folk', 'kesari', 'prabhas', 'allu-arjun', 'other'] },
      { name: 'language', label: 'Language' },
      { name: 'sourceType', label: 'Source Type (Copyright Policy)', type: 'select', options: ['metadata-only', 'external', 'owned', 'licensed'] },
      { name: 'audioUrl', label: 'Direct Audio URL (owned/licensed only)' },
      { name: 'externalUrl', label: 'Lawful External Listening Link' },
      { name: 'artwork', label: 'Artwork Path or URL' },
      { name: 'duration', label: 'Duration (seconds)', type: 'number' },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => `${item.title} — ${item.artist}`,
    getBadges: (item) => [item.category, item.sourceType],
  },

  gallery: {
    label: 'Gallery',
    listKey: 'items',
    itemKey: 'item',
    api: galleryApi,
    initial: () => ({
      title: '', category: 'landscapes', imageUrl: '', caption: '', description: '',
      location: '', photographerCredit: '', tags: '', isFeatured: false, isActive: true,
    }),
    toForm: (item) => ({
      title: item.title || '',
      category: item.category || 'landscapes',
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
      description: item.description || '',
      location: item.location || '',
      photographerCredit: item.photographerCredit || '',
      tags: (item.tags || []).join(', '),
      isFeatured: Boolean(item.isFeatured),
      isActive: item.isActive !== false,
    }),
    toPayload: (f) => ({ ...f }),
    fields: [
      { name: 'title', label: 'Title', required: true },
      {
        name: 'category',
        label: 'Collection',
        type: 'select',
        options: ['tribal-culture', 'landscapes', 'eastern-ghats', 'personal-photography', 'historical-places', 'events', 'social-activities'],
      },
      { name: 'imageUrl', label: 'Image Path or URL', required: true },
      { name: 'caption', label: 'Caption' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'location', label: 'Location' },
      { name: 'photographerCredit', label: 'Photographer Credit' },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
    getTitle: (item) => item.title,
    getBadges: (item) => [item.category, item.location].filter(Boolean),
  },

  journey: {
    label: 'My Journey & Interests',
    listKey: 'entries',
    itemKey: 'entry',
    api: journeyApi,
    initial: () => ({
      title: '', slug: '', interest: 'horses', summary: '', content: '',
      location: '', entryDate: '', coverImage: '', tags: '', isPublished: false,
    }),
    toForm: (item) => ({
      title: item.title || '',
      slug: item.slug || '',
      interest: item.interest || 'horses',
      summary: item.summary || '',
      content: item.content || '',
      location: item.location || '',
      entryDate: item.entryDate ? String(item.entryDate).slice(0, 10) : '',
      coverImage: item.coverImage || '',
      tags: (item.tags || []).join(', '),
      isPublished: Boolean(item.isPublished),
    }),
    toPayload: (f) => ({ ...f, slug: f.slug || undefined, entryDate: f.entryDate || null }),
    fields: [
      { name: 'title', label: 'Entry Title', required: true },
      { name: 'interest', label: 'Interest Area', type: 'select', options: ['horses', 'football', 'archery', 'learning', 'writing', 'photography', 'general'] },
      { name: 'slug', label: 'Slug (optional)' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'content', label: 'Detailed Reflection', type: 'textarea' },
      { name: 'location', label: 'Location' },
      { name: 'entryDate', label: 'Entry Date', type: 'date' },
      { name: 'coverImage', label: 'Cover Image Path or URL' },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
    ],
    getTitle: (item) => item.title,
    getBadges: (item) => [item.interest, item.isPublished ? 'published' : 'draft'],
  },
};

export default function ResourceManager({ resourceKey, isAdmin, onChanged }) {
  const cfg = RESOURCE_CONFIGS[resourceKey];
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(() => cfg.initial());
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const data = await cfg.api.list({ all: 'true', ...(cfg.listParams || {}) });
      setItems(data[cfg.listKey] || []);
    } catch {
      setItems([]);
    }
  }, [cfg]);

  useEffect(() => {
    setForm(cfg.initial());
    setEditingId(null);
    setStatus({ type: '', text: '' });
    loadItems();
    if (resourceKey === 'posts') {
      categoriesApi.list().then((d) => setCategories(d.categories || [])).catch(() => {});
    }
  }, [cfg, loadItems, resourceKey]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', text: '' });
    try {
      const payload = cfg.toPayload(form);
      if (editingId) {
        await cfg.api.update(editingId, payload);
        setStatus({ type: 'success', text: `${cfg.label} entry updated.` });
      } else {
        await cfg.api.create(payload);
        setStatus({ type: 'success', text: `${cfg.label} entry created.` });
      }
      setForm(cfg.initial());
      setEditingId(null);
      await loadItems();
      onChanged?.();
    } catch (error) {
      setStatus({ type: 'error', text: getApiErrorMessage(error, 'Unable to save entry.') });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await cfg.api.remove(id);
      setStatus({ type: 'success', text: 'Entry deleted.' });
      if (editingId === id) {
        setEditingId(null);
        setForm(cfg.initial());
      }
      await loadItems();
      onChanged?.();
    } catch (error) {
      setStatus({ type: 'error', text: getApiErrorMessage(error, 'Unable to delete entry.') });
    }
  }

  return (
    <div className="admin-workspace">
      <section className="admin-card">
        <h2>{editingId ? `Edit ${cfg.label}` : `Add ${cfg.label}`}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          {cfg.fields.map((field) => {
            if (field.type === 'checkbox') {
              return (
                <label key={field.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                  />
                  <span>{field.label}</span>
                </label>
              );
            }
            if (field.type === 'select') {
              return (
                <label key={field.name}>
                  {field.label}
                  <select
                    className="ac-select"
                    value={form[field.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  >
                    {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
              );
            }
            if (field.type === 'categorySelect') {
              return (
                <label key={field.name}>
                  {field.label}
                  <select
                    className="ac-select"
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  >
                    <option value="">Select a category…</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name} ({cat.type})</option>
                    ))}
                  </select>
                </label>
              );
            }
            if (field.type === 'textarea') {
              return (
                <label key={field.name}>
                  {field.label}
                  <textarea
                    className="ac-textarea"
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  />
                </label>
              );
            }
            return (
              <label key={field.name}>
                {field.label}
                <input
                  className="ac-input"
                  type={field.type || 'text'}
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                />
              </label>
            );
          })}

          <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
            <button type="submit" className="ac-btn" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Entry'}
            </button>
            {editingId && (
              <button
                type="button"
                className="ac-btn ac-btn--secondary"
                onClick={() => { setEditingId(null); setForm(cfg.initial()); }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          {status.text && (
            <p className={`ac-status${status.type === 'error' ? ' ac-status--error' : ''}`} role="status">
              {status.text}
            </p>
          )}
        </form>
      </section>

      <section className="admin-card">
        <h2>Existing {cfg.label} ({items.length})</h2>
        {items.length === 0 ? (
          <p className="ac-meta">No entries created yet in this collection.</p>
        ) : (
          <div className="admin-list">
            {items.map((item) => (
              <article key={item._id} className="admin-list-item">
                <div className="ac-badge-row">
                  {cfg.getBadges(item).map((badge) => (
                    <span key={badge} className="ac-badge">{badge}</span>
                  ))}
                </div>
                <strong>{cfg.getTitle(item)}</strong>
                <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                  <button
                    type="button"
                    className="ac-btn ac-btn--secondary"
                    onClick={() => {
                      setEditingId(item._id);
                      setForm(cfg.toForm(item));
                      setStatus({ type: '', text: '' });
                    }}
                  >
                    Edit
                  </button>
                  {(isAdmin || resourceKey === 'posts') && (
                    <button
                      type="button"
                      className="ac-btn ac-btn--danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
