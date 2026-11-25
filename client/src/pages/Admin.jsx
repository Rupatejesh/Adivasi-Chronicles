import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import ResourceManager from '../components/admin/AdminForms.jsx';
import { AccountFavouritesPanel, ModerationAndUsersPanel } from '../components/admin/AdminModeration.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { adminApi } from '../services/api.js';
import './MernDynamic.css';
import './Admin.css';

const ADMIN_TABS = [
  { id: 'posts', label: 'Blog Posts' },
  { id: 'categories', label: 'Categories' },
  { id: 'biographies', label: 'Biographies' },
  { id: 'books', label: 'Books & Ideas' },
  { id: 'knowledge', label: 'Knowledge Hub' },
  { id: 'schemes', label: 'Schemes' },
  { id: 'songs', label: 'Music Library' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'journey', label: 'My Journey' },
  { id: 'comments', label: 'Comments', adminOnly: true },
  { id: 'contact', label: 'Messages', adminOnly: true },
  { id: 'users', label: 'Users', adminOnly: true },
  { id: 'account', label: 'My Account & Favourites' },
];

export default function Admin() {
  const { user, loading, isAuthenticated, isAdmin, isPrivileged } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [stats, setStats] = useState(null);

  const loadStats = useCallback(() => {
    if (!isPrivileged) return;
    adminApi.getStats().then((d) => setStats(d.stats)).catch(() => {});
  }, [isPrivileged]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <main className="admin-page">
        <p className="ac-status">Checking session…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <PageBreadcrumb items={[{ label: 'Account & Admin' }]} />
        <section className="admin-card">
          <h1>Sign In Required</h1>
          <p>Please login to view your saved favourites, profile or editorial dashboard.</p>
          <div className="ac-toolbar" style={{ justifyContent: 'flex-start' }}>
            <Link className="ac-btn" to="/login" state={{ from: '/admin' }}>Login →</Link>
            <Link className="ac-btn ac-btn--secondary" to="/register">Create Account</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!isPrivileged) {
    return (
      <main className="admin-page">
        <PageBreadcrumb items={[{ label: 'My Account' }]} />
        <header className="admin-header">
          <div>
            <p className="editorial-page__eyebrow" style={{ color: '#d6bf8e' }}>REGISTERED READER</p>
            <h1>Welcome, {user.name}</h1>
          </div>
          <span className="ac-badge ac-badge--gold">Role: {user.role}</span>
        </header>
        <p className="ac-status">
          You are signed in as a registered community member. Editorial publishing controls are reserved for Authors and Administrators.
        </p>
        <AccountFavouritesPanel />
      </main>
    );
  }

  const availableTabs = ADMIN_TABS.filter((tab) => !tab.adminOnly || isAdmin);

  return (
    <main className="admin-page">
      <PageBreadcrumb items={[{ label: 'Admin Dashboard' }]} />
      <header className="admin-header">
        <div>
          <p className="editorial-page__eyebrow" style={{ color: '#d6bf8e' }}>ADIVASI CHRONICLES • EDITORIAL CMS</p>
          <h1>Archive &amp; Content Dashboard</h1>
        </div>
        <div className="ac-badge-row">
          <span className="ac-badge ac-badge--gold">{user.name} ({user.role})</span>
        </div>
      </header>

      {stats && (
        <section className="admin-stats" aria-label="Archive statistics">
          <div className="admin-stat"><strong>{stats.publishedPosts}</strong><span>Published Posts</span></div>
          <div className="admin-stat"><strong>{stats.draftPosts}</strong><span>Draft Posts</span></div>
          <div className="admin-stat"><strong>{stats.biographies}</strong><span>Biographies</span></div>
          <div className="admin-stat"><strong>{stats.books}</strong><span>Books &amp; Ideas</span></div>
          <div className="admin-stat"><strong>{stats.knowledgeArticles}</strong><span>Knowledge Entries</span></div>
          <div className="admin-stat"><strong>{stats.schemes}</strong><span>Schemes</span></div>
          <div className="admin-stat"><strong>{stats.songs}</strong><span>Music Tracks</span></div>
          <div className="admin-stat"><strong>{stats.galleryItems}</strong><span>Gallery Items</span></div>
          <div className="admin-stat"><strong>{stats.unreadMessages}</strong><span>Unread Messages</span></div>
        </section>
      )}

      <nav className="admin-tabs" role="tablist" aria-label="Dashboard sections">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'account' ? (
        <AccountFavouritesPanel />
      ) : ['comments', 'contact', 'users'].includes(activeTab) ? (
        <ModerationAndUsersPanel tab={activeTab} />
      ) : (
        <ResourceManager resourceKey={activeTab} isAdmin={isAdmin} onChanged={loadStats} />
      )}
    </main>
  );
}
