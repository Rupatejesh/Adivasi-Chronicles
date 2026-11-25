import { useState } from 'react';
import { PageBreadcrumb } from '../components/innerPage/InnerPageFoundation.jsx';
import { contactApi, getApiErrorMessage } from '../services/api.js';
import './EditorialPages.css';
import './MernDynamic.css';

const subjects = [
  'General',
  'Historical Information',
  'Corrections',
  'Sources & References',
  'Culture',
  'Photography / Gallery',
  'Technical Feedback',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await contactApi.submit(form);
      setStatus({ type: 'success', text: res.message || 'Your message has been received.' });
      setForm({ name: '', email: '', subject: 'General', message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: getApiErrorMessage(error, 'Unable to send your message right now.') });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="editorial-page contact-page">
      <PageBreadcrumb items={[{ label: 'Contact' }]} />
      <header className="editorial-page__hero">
        <p className="editorial-page__eyebrow">CONTACT / CONNECT</p>
        <h1>Every thoughtful note<br /><em>can open a conversation.</em></h1>
        <p>A space for questions, corrections, sources and ideas for the archive.</p>
      </header>
      <div className="contact-layout">
        <section className="contact-letter" aria-labelledby="contact-form-title">
          <p className="editorial-page__eyebrow">Write to the project</p>
          <h2 id="contact-form-title">Your correspondence</h2>
          <p id="contact-preview" className="contact-preview">
            Messages sent here are stored securely in the archive database for editorial review.
          </p>
          <form aria-describedby="contact-preview" onSubmit={handleSubmit}>
            <div className="contact-name-email">
              <label htmlFor="contact-name">
                Name
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label htmlFor="contact-email">
                Email
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
            </div>
            <label htmlFor="contact-subject">
              Subject
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              >
                {subjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </label>
            <label htmlFor="contact-message">
              Message
              <textarea
                id="contact-message"
                name="message"
                rows={7}
                maxLength={5000}
                placeholder="Share context and references where available."
                required
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </label>
            <button type="submit" className="ac-btn" disabled={submitting} style={{ cursor: submitting ? 'wait' : 'pointer' }}>
              {submitting ? 'Sending Message…' : 'Send Message'}
            </button>
            {status.text && (
              <p className={`ac-status${status.type === 'error' ? ' ac-status--error' : ''}`} role="status">
                {status.text}
              </p>
            )}
          </form>
        </section>
        <aside className="contact-guidance">
          <p className="editorial-page__eyebrow">A note on contributions</p>
          <h2>Context matters.</h2>
          <p>For historical information or corrections, include the source, author, publication and relevant page or link when available.</p>
          <ul>
            <li>Explain what needs correcting and why.</li>
            <li>Distinguish documented facts from recollection or interpretation.</li>
            <li>For photography, include ownership and permission details.</li>
          </ul>
          <p className="editorial-page__note">
            This independent educational and cultural project does not provide an official government contact service.
          </p>
        </aside>
      </div>
    </main>
  );
}
