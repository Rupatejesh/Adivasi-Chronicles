import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../hooks/useFavourite.js';
import { commentsApi, getApiErrorMessage, postsApi } from '../services/api.js';
import './EditorialPages.css';
import './MernDynamic.css';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isSaved, toggle: toggleFavourite } = useFavourites('post');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadArticle = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postsApi.getBySlug(slug);
      setPost(data.post);
      const commentData = await commentsApi.listByPost(data.post._id);
      setComments(commentData.comments || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Article not found or unavailable.'));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  async function handleLike() {
    if (!isAuthenticated || !post) {
      setStatusMsg('Please login to like this article.');
      return;
    }
    try {
      const res = await postsApi.toggleLike(post._id);
      setPost((prev) => (prev ? { ...prev, likes: res.likes } : prev));
    } catch (err) {
      setStatusMsg(getApiErrorMessage(err));
    }
  }

  async function handleFavourite() {
    if (!isAuthenticated || !post) {
      setStatusMsg('Please login to save articles to your favourites.');
      return;
    }
    try {
      const saved = await toggleFavourite('post', post._id);
      setStatusMsg(saved ? 'Saved to your favourites.' : 'Removed from your favourites.');
    } catch (err) {
      setStatusMsg(getApiErrorMessage(err));
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!commentText.trim() || !post) return;
    setSubmitting(true);
    setStatusMsg('');
    try {
      const res = await commentsApi.create({
        post: post._id,
        content: commentText.trim(),
        parentComment: replyTo?._id || null,
      });
      setComments((prev) => [...prev, res.comment]);
      setCommentText('');
      setReplyTo(null);
    } catch (err) {
      setStatusMsg(getApiErrorMessage(err, 'Unable to post comment.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditSave(commentId) {
    if (!editingText.trim()) return;
    try {
      const res = await commentsApi.update(commentId, { content: editingText.trim() });
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.comment : c)));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setStatusMsg(getApiErrorMessage(err, 'Unable to update comment.'));
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await commentsApi.remove(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId && c.parentComment !== commentId));
    } catch (err) {
      setStatusMsg(getApiErrorMessage(err, 'Unable to delete comment.'));
    }
  }

  if (loading) {
    return (
      <main className="editorial-page">
        <PageBreadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: slug }]} />
        <div className="ac-article-detail"><p className="ac-status">Loading article…</p></div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="editorial-page">
        <PageBreadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: 'Article' }]} />
        <div className="ac-article-detail">
          <h1>Article Unavailable</h1>
          <p className="ac-status ac-status--error">{error || 'This article has not been published yet.'}</p>
          <Link className="ac-btn ac-btn--secondary" to="/blog">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  const userLiked = Boolean(user && post.likes?.some((id) => String(id) === String(user.id)));
  const topComments = comments.filter((c) => !c.parentComment);
  const repliesByParent = comments.reduce((acc, c) => {
    if (c.parentComment) {
      const key = String(c.parentComment);
      acc[key] = acc[key] || [];
      acc[key].push(c);
    }
    return acc;
  }, {});

  return (
    <main className="editorial-page">
      <PageBreadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
      <article className="ac-article-detail">
        <header>
          <div className="ac-badge-row" style={{ marginBottom: '0.75rem' }}>
            <span className="ac-badge">{post.category?.name || 'Journal'}</span>
            {post.status === 'draft' && <span className="ac-badge ac-badge--gold">Draft Preview</span>}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && <p style={{ fontSize: '1.12rem', marginTop: '0.75rem', color: '#395248' }}>{post.excerpt}</p>}
          <div className="ac-meta" style={{ marginTop: '1rem' }}>
            <span>Written by <strong>{post.author?.name || 'Archive Author'}</strong></span>
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            <span>{post.likes?.length || 0} likes</span>
            <span>{comments.length} comments</span>
          </div>
        </header>

        {post.coverImage && (
          <div className="ac-card__media" style={{ aspectRatio: '16 / 9' }}>
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        <div className="ac-article-body">{post.content}</div>

        {post.tags?.length > 0 && (
          <div className="ac-badge-row">
            {post.tags.map((tag) => <span key={tag} className="ac-badge ac-badge--earth">#{tag}</span>)}
          </div>
        )}

        <div className="ac-toolbar" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="ac-btn" onClick={handleLike}>
            {userLiked ? '♥ Liked' : '♡ Like'} ({post.likes?.length || 0})
          </button>
          <button type="button" className="ac-btn ac-btn--secondary" onClick={handleFavourite}>
            {isSaved(post._id) ? '★ Saved in Favourites' : '☆ Save Favourite'}
          </button>
          <Link className="ac-btn ac-btn--secondary" to="/blog">← All Articles</Link>
        </div>

        {statusMsg && <p className="ac-status" role="status">{statusMsg}</p>}

        {post.sources?.length > 0 && (
          <aside className="ac-sources-box" aria-label="Sources and references">
            <p className="editorial-page__eyebrow">Sources &amp; References</p>
            <ul>
              {post.sources.map((src, idx) => (
                <li key={idx}>
                  <strong>{src.title || src.publisher || 'Reference'}</strong>
                  {src.publisher && src.title ? ` — ${src.publisher}` : ''}
                  {src.url && (
                    <>
                      {' '}
                      (<a href={src.url} target="_blank" rel="noreferrer">Source link ↗</a>)
                    </>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <section className="ac-comments" aria-labelledby="comments-heading">
          <h2 id="comments-heading">Discussion ({comments.length})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
              {replyTo && (
                <div className="ac-status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Replying to <strong>{replyTo.author?.name || 'reader'}</strong></span>
                  <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setReplyTo(null)}>Cancel Reply</button>
                </div>
              )}
              <label htmlFor="comment-box">
                Add a thoughtful comment
                <textarea
                  id="comment-box"
                  className="ac-textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={2000}
                  placeholder="Share reflections, questions or additional context…"
                  required
                />
              </label>
              <div>
                <button type="submit" className="ac-btn" disabled={submitting}>
                  {submitting ? 'Posting…' : replyTo ? 'Post Reply' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <p className="ac-status">
              <Link to="/login" state={{ from: `/blog/${slug}` }}>Login</Link> or{' '}
              <Link to="/register">Create an account</Link> to like and comment on this article.
            </p>
          )}

          {comments.length === 0 ? (
            <p className="ac-meta">No comments yet. Be the first to share a note.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {topComments.map((comment) => {
                const canManage = user && (String(comment.author?._id) === String(user.id) || isAdmin);
                const replies = repliesByParent[String(comment._id)] || [];
                return (
                  <div key={comment._id} style={{ display: 'grid', gap: '0.6rem' }}>
                    <div className="ac-comment">
                      <div className="ac-meta">
                        <strong>{comment.author?.name || 'Community Member'}</strong>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        {comment.isEdited && <span>(edited)</span>}
                      </div>
                      {editingId === comment._id ? (
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <textarea
                            className="ac-textarea"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            maxLength={2000}
                          />
                          <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                            <button type="button" className="ac-btn" onClick={() => handleEditSave(comment._id)}>Save</button>
                            <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p>{comment.content}</p>
                      )}
                      <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                        {isAuthenticated && (
                          <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setReplyTo(comment)}>
                            Reply
                          </button>
                        )}
                        {canManage && editingId !== comment._id && (
                          <>
                            <button
                              type="button"
                              className="ac-btn ac-btn--secondary"
                              onClick={() => { setEditingId(comment._id); setEditingText(comment.content); }}
                            >
                              Edit
                            </button>
                            <button type="button" className="ac-btn ac-btn--danger" onClick={() => handleDeleteComment(comment._id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {replies.map((reply) => {
                      const canManageReply = user && (String(reply.author?._id) === String(user.id) || isAdmin);
                      return (
                        <div key={reply._id} className="ac-comment ac-comment--reply">
                          <div className="ac-meta">
                            <strong>{reply.author?.name || 'Community Member'}</strong>
                            <span>{new Date(reply.createdAt).toLocaleString()}</span>
                            {reply.isEdited && <span>(edited)</span>}
                          </div>
                          {editingId === reply._id ? (
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                              <textarea
                                className="ac-textarea"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                maxLength={2000}
                              />
                              <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                                <button type="button" className="ac-btn" onClick={() => handleEditSave(reply._id)}>Save</button>
                                <button type="button" className="ac-btn ac-btn--secondary" onClick={() => setEditingId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <p>{reply.content}</p>
                          )}
                          {canManageReply && editingId !== reply._id && (
                            <div className="ac-toolbar" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
                              <button
                                type="button"
                                className="ac-btn ac-btn--secondary"
                                onClick={() => { setEditingId(reply._id); setEditingText(reply.content); }}
                              >
                                Edit
                              </button>
                              <button type="button" className="ac-btn ac-btn--danger" onClick={() => handleDeleteComment(reply._id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
