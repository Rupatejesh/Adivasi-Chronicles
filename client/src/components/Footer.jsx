import { Link } from 'react-router-dom'
import './Footer.css'

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Tribal History', to: '/tribal-history' },
      { label: 'Heroes', to: '/heroes' },
      { label: 'Books', to: '/books' },
      { label: 'Gallery', to: '/gallery' },
    ],
  },
  {
    title: 'Rights & Development',
    links: [
      { label: 'Constitution', to: '/constitution' },
      { label: 'Rights', to: '/rights' },
      { label: 'ITDA', to: '/itda' },
      { label: 'Schemes', to: '/schemes' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'My Journey', to: '/my-journey' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__intro">
          <Link className="site-footer__brand" to="/">
            Adivasi Chronicles
          </Link>
          <p className="site-footer__tagline">
            Roots <span aria-hidden="true">•</span> History <span aria-hidden="true">•</span>{' '}
            Rights <span aria-hidden="true">•</span> Ideas <span aria-hidden="true">•</span>{' '}
            Future
          </p>
          <p className="site-footer__description">
            A digital space for history, rights, ideas, culture, development, personal learning
            and storytelling.
          </p>
        </div>

        <nav className="site-footer__navigation" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div className="site-footer__group" key={group.title}>
              <h2 className="site-footer__heading">{group.title}</h2>
              <ul className="site-footer__links">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Adivasi Chronicles. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
