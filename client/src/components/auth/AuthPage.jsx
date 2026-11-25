import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApiErrorMessage } from '../../services/api.js';
import './AuthPage.css';

const categories = ['Fifth Schedule', 'PESA', 'Forest Rights', 'Land Protections', 'SC/ST Legal Protections', 'Gram Sabha'];

function PasswordField({ id, label, onChange, error, minLength }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-password">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={id === 'login-password' ? 'current-password' : 'new-password'}
          onChange={onChange}
          aria-invalid={error || undefined}
          aria-describedby={error ? 'auth-match-error' : undefined}
        />
        <button
          type="button"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage({ register = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function checkMatch(form) {
    const confirmation = form.elements.namedItem('confirm-password');
    const password = form.elements.namedItem('register-password');
    if (!confirmation || !password) return;
    const mismatch = confirmation.value !== password.value;
    confirmation.setCustomValidity(mismatch ? 'Passwords must match.' : '');
    setMatchError(mismatch && confirmation.value.length > 0);
  }

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const email = form.elements.namedItem('email').value.trim();
    const password = form.elements.namedItem(register ? 'register-password' : 'login-password').value;

    setSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      let user;
      if (register) {
        const name = form.elements.namedItem('name').value.trim();
        user = await registerUser({ name, email, password });
      } else {
        user = await login({ email, password });
      }
      const fallbackPath = user?.role === 'admin' || user?.role === 'author' ? '/admin' : '/';
      const destination = location.state?.from || fallbackPath;
      navigate(destination, { replace: true });
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, 'Unable to authenticate. Please verify your details.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={`auth-page ${register ? 'auth-page--register' : 'auth-page--login'}`}>
      <section className="auth-story" aria-label={register ? 'People, land and community' : 'Eastern Ghats inspired landscape'}>
        <div className="auth-visual">
          <div className="auth-landscape" aria-hidden="true">
            <i className="auth-sun" />
            <i className="auth-ridge auth-ridge--far" />
            <i className="auth-ridge auth-ridge--middle" />
            <i className="auth-ridge auth-ridge--near" />
            <i className="auth-mist" />
          </div>
          {register && !imageFailed && (
            <img
              className="auth-community"
              src="/images/adivasi-jeevana-vidhvamsam.png"
              alt="Black-and-white portrait of two people wearing necklaces and flowers in their hair, with others behind them."
              onError={() => setImageFailed(true)}
            />
          )}
          <div className="auth-story-shade" aria-hidden="true" />
          <div className="auth-brand">
            <p>ADIVASI CHRONICLES</p>
            <span>Roots • History • Rights • Ideas • Future</span>
          </div>
          <div className="auth-story-copy">
            <p className="auth-eyebrow">{register ? 'People • Land • Culture' : 'Stories from the Eastern Ghats'}</p>
            <h2>{register ? <>Rooted in community.<br />Growing with knowledge.</> : <>A quieter place.<br />A deeper connection.</>}</h2>
            <p>{register ? 'Memory, belonging and a shared future.' : 'Return to the stories, places and ideas that matter.'}</p>
            <span className="auth-art-caption">
              {register && !imageFailed ? 'From the project’s community image collection' : 'Eastern Ghats inspired • Landscape illustration'}
            </span>
          </div>
        </div>
        {register && (
          <aside className="auth-rights" aria-labelledby="auth-rights-title">
            <p className="auth-eyebrow">Constitution • Rights • Community</p>
            <h3 id="auth-rights-title">Rights &amp; Knowledge</h3>
            <ul>{categories.map((category) => <li key={category}>{category}</li>)}</ul>
            <p className="auth-rights-note">Know • Understand • Participate</p>
          </aside>
        )}
      </section>
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel-inner">
          <Link className="auth-back" to="/">← Back to the archive</Link>
          <header>
            <p className="auth-eyebrow">{register ? 'Your next chapter' : 'Stay connected to your roots'}</p>
            <h1 id="auth-title">{register ? 'Create Your Account' : 'Welcome Back'}</h1>
            <p>{register ? 'Join Adivasi Chronicles and explore stories, history, rights and ideas.' : 'Continue your journey through Adivasi Chronicles.'}</p>
          </header>
          <form onSubmit={submit} onChange={() => { if (message) setMessage(''); }}>
            {register && (
              <div className="auth-field">
                <label htmlFor="full-name">Full Name</label>
                <input id="full-name" name="name" autoComplete="name" required pattern=".*\S.*" title="Enter your full name." />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="auth-email">Email</label>
              <input id="auth-email" name="email" type="email" autoComplete="email" required />
            </div>
            <PasswordField
              id={register ? 'register-password' : 'login-password'}
              label="Password"
              minLength={register ? 6 : undefined}
              onChange={register ? (event) => checkMatch(event.target.form) : undefined}
            />
            {register && (
              <>
                <PasswordField
                  id="confirm-password"
                  label="Confirm Password"
                  error={matchError}
                  onChange={(event) => checkMatch(event.target.form)}
                />
                {matchError && <p className="auth-error" id="auth-match-error" role="alert">Passwords must match.</p>}
              </>
            )}
            {register ? (
              <div className="auth-terms">
                <label className="auth-check">
                  <input type="checkbox" name="terms" required aria-describedby="auth-terms-note" />
                  <span>I acknowledge the community reading and discussion guidelines.</span>
                </label>
                <p id="auth-terms-note">Accounts enable liking articles, posting thoughtful comments and saving favourites.</p>
              </div>
            ) : (
              <div className="auth-options">
                <label className="auth-check">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <button
                  className="auth-text-button"
                  type="button"
                  onClick={() => {
                    setIsError(false);
                    setMessage('Password reset is managed by the site administrator. Contact the archive via /contact for assistance.');
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}
            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'PLEASE WAIT…' : register ? 'CREATE ACCOUNT' : 'LOGIN'} <span aria-hidden="true">→</span>
            </button>
            <p className="auth-notice">Secured with JWT authentication &amp; encrypted passwords.</p>
            <p className={isError ? 'auth-error' : 'auth-status'} role="status">{message}</p>
          </form>
          <p className="auth-switch">
            {register ? 'Already have an account?' : 'New to Adivasi Chronicles?'}{' '}
            <Link to={register ? '/login' : '/register'}>{register ? 'Login' : 'Create an account'} →</Link>
          </p>
          <p className="auth-signoff">An independent space for stories &amp; knowledge.</p>
        </div>
      </section>
    </main>
  );
}
