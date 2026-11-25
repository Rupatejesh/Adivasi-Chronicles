import { useEffect, useState } from 'react';
import { EditorialSection, InnerPageHero, PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { ArchiveFilters, ArchiveRelated } from '../components/personalArchive/ArchiveElements.jsx';
import ListeningDesk from '../components/personalArchive/ListeningDesk.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../hooks/useFavourite.js';
import { getApiErrorMessage, songsApi } from '../services/api.js';
import './Music.css';
import './MernDynamic.css';

const categoryTabs = [
  { label: 'All Recordings', value: 'all' },
  { label: 'Ambedkar Telugu Songs', value: 'ambedkar' },
  { label: 'Tribal & Folk', value: 'tribal-folk' },
  { label: 'Kesari', value: 'kesari' },
  { label: 'Prabhas', value: 'prabhas' },
  { label: 'Allu Arjun', value: 'allu-arjun' },
  { label: 'Other / Regional', value: 'other' },
  { label: 'Favourites', value: 'favourites' },
];

export default function Music() {
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle: toggleFavourite } = useFavourites('song');

  const [selected, setSelected] = useState(categoryTabs[0].label);
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    songsApi.list()
      .then((data) => {
        if (cancelled) return;
        const list = data.songs || [];
        setSongs(list);
        if (list.length > 0) setActiveTrack(list[0]);
      })
      .catch(() => {
        if (!cancelled) setSongs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const selectedTab = categoryTabs.find((t) => t.label === selected) || categoryTabs[0];

  const visibleSongs = songs.filter((song) => {
    const matchesCategory = selectedTab.value === 'all'
      ? true
      : selectedTab.value === 'favourites'
        ? isSaved(song._id)
        : song.category === selectedTab.value;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q
      || song.title.toLowerCase().includes(q)
      || song.artist.toLowerCase().includes(q)
      || (song.language || '').toLowerCase().includes(q)
      || (song.tags || []).some((tag) => tag.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  async function handleToggleFavourite(song) {
    if (!isAuthenticated) {
      setStatusMsg('Please login to save favourite songs.');
      return;
    }
    try {
      const saved = await toggleFavourite('song', song._id);
      setStatusMsg(saved ? `Added "${song.title}" to your favourites.` : `Removed "${song.title}" from your favourites.`);
    } catch (error) {
      setStatusMsg(getApiErrorMessage(error));
    }
  }

  return (
    <main className="personal-archive-page music-page">
      <PageBreadcrumb items={[{ label: 'Music' }]} />
      <InnerPageHero
        eyebrow="MUSIC & MEMORY"
        title="Songs That Travel With Memory"
        description="A quiet space for music connected with culture, memory and inspiration, alongside my personal listening interests. A listening archive to build with care, one recording at a time."
        metadata="ADIVASI CHRONICLES • LISTENING ARCHIVE"
        variant="listening-room"
      />
      <EditorialSection
        id="listening-library"
        eyebrow="The listening shelves"
        title="Many ways to listen"
        description="Explore the curated shelves of this library. Authorised recordings play directly; commercial entries link out lawfully."
      >
        <div className="music-library">
          <div className="ac-toolbar" style={{ marginTop: 0 }}>
            <ArchiveFilters
              categories={categoryTabs.map((t) => t.label)}
              selected={selected}
              onSelect={setSelected}
              label="Listening categories"
              controls="music-category"
            />
            <label style={{ minWidth: '15rem', flex: '0 1 18rem' }}>
              <span className="visually-hidden">Search music library</span>
              <input
                type="search"
                className="ac-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search song, artist or tag…"
              />
            </label>
          </div>

          {statusMsg && <p className="ac-status" role="status">{statusMsg}</p>}

          <div className="music-library__entry" id="music-category" aria-live="polite" aria-atomic="true">
            <span className="music-library__rhythm" aria-hidden="true" />
            <p className="archive-kicker">
              {loading ? 'Loading shelf…' : `${visibleSongs.length} ${visibleSongs.length === 1 ? 'recording' : 'recordings'}`}
            </p>
            <h3>{selected}</h3>
            {!loading && visibleSongs.length === 0 && (
              <p>
                {selectedTab.value === 'favourites' && !isAuthenticated
                  ? 'Login to view and manage your favourite recordings.'
                  : 'No recordings have been added to this collection yet. Administrators can add authorised tracks or external links via the Admin Dashboard.'}
              </p>
            )}
          </div>

          {!loading && visibleSongs.length > 0 && (
            <div className="ac-grid">
              {visibleSongs.map((song) => {
                const isSelected = activeTrack?._id === song._id;
                const saved = isSaved(song._id);
                return (
                  <article key={song._id} className={`ac-card${isSelected ? ' ac-card--featured' : ''}`}>
                    <div className="ac-badge-row">
                      <span className="ac-badge">{song.category}</span>
                      <span className="ac-badge ac-badge--gold">{song.sourceType}</span>
                    </div>
                    <h3>{song.title}</h3>
                    <p>{song.artist}{song.language ? ` · ${song.language}` : ''}</p>
                    <div className="ac-toolbar" style={{ marginTop: 'auto', justifyContent: 'flex-start' }}>
                      <button
                        type="button"
                        className="ac-btn"
                        onClick={() => setActiveTrack(song)}
                      >
                        {isSelected ? 'Selected' : 'Load in Player'}
                      </button>
                      <button
                        type="button"
                        className="ac-btn ac-btn--secondary"
                        onClick={() => handleToggleFavourite(song)}
                      >
                        {saved ? '★' : '☆'}
                      </button>
                      {song.externalUrl && (
                        <a
                          className="ac-btn ac-btn--secondary"
                          href={song.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Listen ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </EditorialSection>

      <div className="music-page__desk">
        <ListeningDesk
          track={activeTrack}
          playlist={visibleSongs}
          onSelectTrack={setActiveTrack}
          isFavourite={activeTrack ? isSaved(activeTrack._id) : false}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <aside className="music-page__rights" aria-label="Listening and permissions">
        <p className="archive-kicker">Listening with care</p>
        <p>
          Commercial recordings are listed only with metadata and lawful external listening links. Direct playback is reserved exclusively for audio owned by the project, used with permission, or appropriately licensed.
        </p>
      </aside>
      <ArchiveRelated links={[{ to: '/gallery', label: 'Explore the visual archive' }]} />
    </main>
  );
}
