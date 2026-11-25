import { useEffect, useState } from 'react';
import { EditorialSection, InnerPageHero, PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { ArchiveFilters, ArchiveRelated } from '../components/personalArchive/ArchiveElements.jsx';
import PhotoStory from '../components/personalArchive/PhotoStory.jsx';
import { galleryApi } from '../services/api.js';
import './Gallery.css';
import './MernDynamic.css';

const placeholderCollections = [
  { title: 'Tribal Culture', slug: 'tribal-culture', tone: 'culture' },
  { title: 'Landscapes', slug: 'landscapes', tone: 'landscape' },
  { title: 'Eastern Ghats', slug: 'eastern-ghats', tone: 'landscape' },
  { title: 'Personal Photography', slug: 'personal-photography', tone: 'personal' },
  { title: 'Historical Places', slug: 'historical-places', tone: 'culture' },
  { title: 'Events', slug: 'events', tone: 'personal' },
  { title: 'Social Activities', slug: 'social-activities', tone: 'culture' },
];

export default function Gallery() {
  const [selected, setSelected] = useState('All collections');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    galleryApi.list()
      .then((data) => {
        if (!cancelled) setItems(data.items || []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const selectedMeta = placeholderCollections.find((c) => c.title === selected);
  const visibleItems = items.filter((item) => selected === 'All collections' || item.category === selectedMeta?.slug);
  const visiblePlaceholders = placeholderCollections.filter((item) => selected === 'All collections' || item.title === selected);

  return (
    <main className="personal-archive-page gallery-page">
      <PageBreadcrumb items={[{ label: 'Gallery' }]} />
      <InnerPageHero
        eyebrow="GALLERY & VISUAL STORIES"
        title="Landscapes, People & Moments"
        description="A visual journal for landscapes, cultural documentation, historical places, events and personal ways of seeing. Genuine photographs and the stories around them find a home here."
        metadata="ADIVASI CHRONICLES • VISUAL ARCHIVE"
        variant="photo-journal"
      />
      <EditorialSection
        id="gallery-stories"
        eyebrow="A place for the photograph"
        title="Stories, held in a frame"
        description="Explore curated photography by collection, with captions, location details and photographer credits."
      >
        {items.length === 0 && (
          <PhotoStory
            featured
            story={{
              title: 'A visual story to come',
              tone: 'landscape',
              caption: 'This space is reserved for a genuine photograph and its documented context.',
            }}
          />
        )}

        <ArchiveFilters
          categories={['All collections', ...placeholderCollections.map((item) => item.title)]}
          selected={selected}
          onSelect={setSelected}
          label="Gallery collections"
          controls="gallery-collections"
        />

        <p className="gallery-page__status" role="status">
          {loading
            ? 'Loading visual archive…'
            : items.length > 0
              ? `${selected} · ${visibleItems.length} ${visibleItems.length === 1 ? 'photograph' : 'photographs'}`
              : `${selected} · ${visiblePlaceholders.length} planned ${visiblePlaceholders.length === 1 ? 'collection' : 'collections'} · photographs pending`}
        </p>

        {!loading && items.length > 0 ? (
          <div className="ac-grid" id="gallery-collections">
            {visibleItems.map((item) => (
              <article key={item._id} className="ac-card">
                <div className="ac-card__media">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                </div>
                <div className="ac-badge-row">
                  <span className="ac-badge">{item.category}</span>
                  {item.location && <span className="ac-badge ac-badge--earth">{item.location}</span>}
                </div>
                <h3>{item.title}</h3>
                {item.caption && <p>{item.caption}</p>}
                <div className="ac-meta">
                  {item.photographerCredit && <span>Credit: {item.photographerCredit}</span>}
                  {item.capturedDate && <span>{new Date(item.capturedDate).toLocaleDateString()}</span>}
                </div>
                <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setLightboxItem(item)}>
                  View Details
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="gallery-grid" id="gallery-collections">
            {visiblePlaceholders.map((story) => <PhotoStory key={story.title} story={story} />)}
          </div>
        )}
      </EditorialSection>

      {lightboxItem && (
        <div
          className="ac-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxItem(null); }}
        >
          <div className="ac-lightbox">
            <div className="ac-toolbar" style={{ marginTop: 0 }}>
              <h2 id="lightbox-title">{lightboxItem.title}</h2>
              <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setLightboxItem(null)}>
                Close ✕
              </button>
            </div>
            <img src={lightboxItem.imageUrl} alt={lightboxItem.title} />
            <div className="ac-badge-row">
              <span className="ac-badge">{lightboxItem.category}</span>
              {lightboxItem.location && <span className="ac-badge ac-badge--earth">{lightboxItem.location}</span>}
            </div>
            {lightboxItem.caption && <p><strong>{lightboxItem.caption}</strong></p>}
            {lightboxItem.description && <p>{lightboxItem.description}</p>}
            <div className="ac-meta">
              {lightboxItem.photographerCredit && <span>Photographer: {lightboxItem.photographerCredit}</span>}
              {lightboxItem.capturedDate && <span>Date: {new Date(lightboxItem.capturedDate).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      )}

      <ArchiveRelated links={[{ to: '/music', label: 'Visit the listening archive' }, { to: '/my-journey', label: 'Follow the personal journal' }]} />
    </main>
  );
}
