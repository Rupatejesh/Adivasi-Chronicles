import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminApi, authApi, commentsApi, contactApi, favouritesApi, getApiErrorMessage } from '../../services/api.js';

export function AccountFavouritesPanel() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [favourites, setFavourites] = useState([]);
  const [status, setStatus] = useState('');

  const loadFavourites = useCallback(async () => {
    try {
      const data = await favouritesApi.list();
      setFavourites(data.favourites || []);
    } catch {
      setFavourites([]);
    }
  }, []);

  useEffect(() => {
    setProfile({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
    loadFavourites();
  }, [user, loadFavourites]);

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await authApi.updateMe(profile);
      await refreshUser();
      setStatus('Profile updated.');
    } catch (err) {
      setStatus(getApiErrorMessage(err));
    }
  }

  async function removeFavourite(fav) {
    try {
      await favouritesApi.toggle(fav.itemType, fav.itemId);
      setFavourites((prev) => prev.filter((item) => item._id !== fav._id));
    } catch (err) {
      setStatus(getApiErrorMessage(err));
    }
  }

  return (
    <div className="admin-workspace">
      <section className="admin-card">
        <h2>My Profile</h2>
        <form className="admin-form" onSubmit={saveProfile}>
          <label>
            Full Name
            <input className="ac-input" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label>
            Avatar URL (optional)
            <input className="ac-input" value={profile.avatar} onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))} />
          </label>
          <label>
            Short Bio
            <textarea className="ac-textarea" maxLength={500} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
          </label>
          <button type="submit" className="ac-btn">Update Profile</button>
          {status && <p className="ac-status" role="status">{status}</p>}
        </form>
      </section>

      <section className="admin-card">
        <h2>Saved Favourites ({favourites.length})</h2>
        {favourites.length === 0 ? (
          <p className="ac-meta">You have no saved favourites yet. Save articles, biographies, books or songs while browsing.</p>
        ) : (
          <div className="admin-list">
            {favourites.map((fav) => (
              <article key={fav._id} className="admin-list-item">
                <div className="ac-badge-row">
                  <span className="ac-badge">{fav.itemType}</span>
                </div>
                <strong>{fav.item?.title || 'Saved item'}</strong>
                {fav.item?.subtitle && <p className="ac-meta">{fav.item.subtitle}</p>}
                <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                  {fav.item?.link && <Link className="ac-btn ac-btn--secondary" to={fav.item.link}>Open →</Link>}
                  <button type="button" className="ac-btn ac-btn--danger" onClick={() => removeFavourite(fav)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ModerationAndUsersPanel({ tab }) {
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (tab === 'comments') {
      commentsApi.adminListAll().then((d) => setComments(d.comments || [])).catch(() => {});
    } else if (tab === 'contact') {
      contactApi.list().then((d) => setMessages(d.messages || [])).catch(() => {});
    } else if (tab === 'users') {
      adminApi.listUsers().then((d) => setUsers(d.users || [])).catch(() => {});
    }
  }, [tab]);

  if (tab === 'comments') {
    return (
      <section className="admin-card">
        <h2>Comment Moderation ({comments.length})</h2>
        {status && <p className="ac-status">{status}</p>}
        <div className="admin-list">
          {comments.map((c) => (
            <article key={c._id} className="admin-list-item">
              <div className="ac-meta">
                <strong>{c.author?.name || 'User'}</strong>
                <span>on {c.post?.title || 'Post'}</span>
                <span className="ac-badge">{c.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
              <p>{c.content}</p>
              <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="ac-btn ac-btn--secondary"
                  onClick={async () => {
                    const res = await commentsApi.moderate(c._id, !c.isActive);
                    setComments((prev) => prev.map((x) => (x._id === c._id ? { ...x, isActive: res.comment.isActive } : x)));
                  }}
                >
                  {c.isActive ? 'Hide Comment' : 'Restore Comment'}
                </button>
                <button
                  type="button"
                  className="ac-btn ac-btn--danger"
                  onClick={async () => {
                    await commentsApi.remove(c._id);
                    setComments((prev) => prev.filter((x) => x._id !== c._id));
                    setStatus('Comment deleted.');
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (tab === 'contact') {
    return (
      <section className="admin-card">
        <h2>Contact Correspondence ({messages.length})</h2>
        <div className="admin-list">
          {messages.map((m) => (
            <article key={m._id} className="admin-list-item">
              <div className="ac-meta">
                <strong>{m.name}</strong>
                <span>{m.email}</span>
                <span className="ac-badge">{m.subject}</span>
                <span className="ac-badge ac-badge--gold">{m.status}</span>
              </div>
              <p>{m.message}</p>
              <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                {['new', 'reviewed', 'archived'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className="ac-btn ac-btn--secondary"
                    onClick={async () => {
                      await contactApi.updateStatus(m._id, st);
                      setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, status: st } : x)));
                    }}
                  >
                    Mark {st}
                  </button>
                ))}
                <button
                  type="button"
                  className="ac-btn ac-btn--danger"
                  onClick={async () => {
                    await contactApi.remove(m._id);
                    setMessages((prev) => prev.filter((x) => x._id !== m._id));
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <h2>Users &amp; Roles ({users.length})</h2>
      {status && <p className="ac-status">{status}</p>}
      <div className="admin-list">
        {users.map((u) => (
          <article key={u._id} className="admin-list-item">
            <div className="ac-meta">
              <strong>{u.name}</strong>
              <span>{u.email}</span>
              <span className="ac-badge">{u.role}</span>
              <span className="ac-badge ac-badge--gold">{u.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
              <select
                aria-label={`Role for ${u.name}`}
                className="ac-select"
                style={{ width: 'auto' }}
                value={u.role}
                onChange={async (e) => {
                  try {
                    const res = await adminApi.updateUser(u._id, { role: e.target.value });
                    setUsers((prev) => prev.map((x) => (x._id === u._id ? res.user : x)));
                    setStatus(`Updated role for ${u.name}.`);
                  } catch (err) {
                    setStatus(getApiErrorMessage(err));
                  }
                }}
              >
                <option value="user">user</option>
                <option value="author">author</option>
                <option value="admin">admin</option>
              </select>
              <button
                type="button"
                className="ac-btn ac-btn--secondary"
                onClick={async () => {
                  try {
                    const res = await adminApi.updateUser(u._id, { isActive: !u.isActive });
                    setUsers((prev) => prev.map((x) => (x._id === u._id ? res.user : x)));
                  } catch (err) {
                    setStatus(getApiErrorMessage(err));
                  }
                }}
              >
                {u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
