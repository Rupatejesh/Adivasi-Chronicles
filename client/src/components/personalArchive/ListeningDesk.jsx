import { useEffect, useRef, useState } from 'react';
import { ArchiveImage } from './ArchiveElements.jsx';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function ListeningDesk({
  track = null,
  playlist = [],
  onSelectTrack,
  isFavourite = false,
  onToggleFavourite,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [playerNotice, setPlayerNotice] = useState('');

  const canPlayDirect = Boolean(
    track && track.audioUrl && ['owned', 'licensed'].includes(track.sourceType),
  );

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(track?.duration || 0);
    setPlayerNotice('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  async function handlePlayPause() {
    if (!canPlayDirect || !audioRef.current) return;
    setPlayerNotice('');
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setPlayerNotice('Unable to start playback for this audio source.');
        setIsPlaying(false);
      }
    }
  }

  function handleStep(direction) {
    if (!playlist.length || !track || !onSelectTrack) return;
    const currentIndex = playlist.findIndex((item) => item._id === track._id);
    if (currentIndex === -1) {
      onSelectTrack(playlist[0]);
      return;
    }
    const nextIndex = (currentIndex + direction + playlist.length) % playlist.length;
    onSelectTrack(playlist[nextIndex]);
  }

  function handleSeek(event) {
    const nextTime = Number(event.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  }

  return (
    <section className="listening-desk" aria-labelledby="listening-desk-title">
      <div className="listening-desk__art">
        {track?.artwork ? (
          <ArchiveImage src={track.artwork} alt={`${track.title} artwork`} label="Artwork not available" />
        ) : (
          <div className="listening-record" aria-hidden="true" />
        )}
        <p>
          {track
            ? (canPlayDirect ? 'Authorised direct audio' : 'Metadata & external link only')
            : 'Artwork reserved for authorised material'}
        </p>
      </div>

      <div className="listening-desk__body">
        <p className="archive-kicker">Listening interface</p>
        <h2 id="listening-desk-title">Now Playing</h2>
        <p className="listening-desk__title">{track?.title || 'No recording selected'}</p>
        <dl className="listening-desk__metadata">
          <div><dt>Artist</dt><dd>{track?.artist || 'Not yet added'}</dd></div>
          <div><dt>Category</dt><dd>{track?.category || 'Not yet selected'}</dd></div>
          {track?.language && <div><dt>Language</dt><dd>{track.language}</dd></div>}
        </dl>

        {canPlayDirect && (
          <audio
            ref={audioRef}
            src={track.audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || track?.duration || 0)}
            onEnded={() => handleStep(1)}
            onError={() => {
              setIsPlaying(false);
              setPlayerNotice('Audio stream could not be loaded.');
            }}
          />
        )}

        {!track && (
          <p id="listening-unavailable">Select a recording from the library below to preview controls or open an authorised listening link.</p>
        )}

        {track && !canPlayDirect && (
          <p id="listening-unavailable">
            Commercial or metadata-only entry: direct audio is not hosted here.
            {track.externalUrl && (
              <>
                {' '}
                <a href={track.externalUrl} target="_blank" rel="noreferrer">
                  Listen on official external platform ↗
                </a>
              </>
            )}
          </p>
        )}

        <fieldset aria-describedby="listening-unavailable">
          <legend>Playback controls</legend>
          <div className="listening-desk__transport">
            <button type="button" disabled={!playlist.length} onClick={() => handleStep(-1)}>Previous</button>
            <button type="button" disabled={!canPlayDirect} onClick={handlePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button type="button" disabled={!playlist.length} onClick={() => handleStep(1)}>Next</button>
          </div>
          <label>
            Progress ({formatTime(currentTime)} / {formatTime(duration)})
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={canPlayDirect ? currentTime : 0}
              disabled={!canPlayDirect}
              onChange={handleSeek}
            />
          </label>
          <label>
            Volume ({Math.round(volume * 100)}%)
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </label>
          <div className="listening-desk__transport">
            <button
              type="button"
              disabled={!track || !onToggleFavourite}
              onClick={() => track && onToggleFavourite?.(track)}
            >
              {isFavourite ? '★ Favourited' : '☆ Favourite'}
            </button>
          </div>
        </fieldset>

        {playerNotice && <p className="ac-status ac-status--error" role="status">{playerNotice}</p>}
        <p className="listening-desk__playlist">
          Playlist · {playlist.length} {playlist.length === 1 ? 'recording' : 'recordings'} available
        </p>
      </div>
    </section>
  );
}
