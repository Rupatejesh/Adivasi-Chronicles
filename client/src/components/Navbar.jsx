import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Navbar.css'

const dropdownGroups = [
  {
    label: 'Explore',
    links: [
      { label: 'Tribal History', to: '/tribal-history' },
      { label: 'Heroes', to: '/heroes' },
    ],
  },
  {
    label: 'Knowledge',
    links: [
      { label: 'Books', to: '/books' },
      { label: 'Constitution', to: '/constitution' },
      { label: 'Rights', to: '/rights' },
    ],
  },
  {
    label: 'Development',
    links: [
      { label: 'ITDA', to: '/itda' },
      { label: 'Schemes', to: '/schemes' },
    ],
  },
  {
    label: 'Media',
    links: [
      { label: 'Music', to: '/music' },
      { label: 'Gallery', to: '/gallery' },
    ],
  },
]

const directLinks = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'My Journey', to: '/my-journey' },
  { label: 'About', to: '/about' },
]

function isRouteActive(pathname, to) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isPrivileged, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  function toggleDropdown(label) {
    setOpenDropdown((current) => (current === label ? null : label))
  }

  function closeNavigation() {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <div className="navbar__inner">
          <Link className="navbar__brand" to="/" onClick={closeNavigation}>
            <span className="navbar__brand-name">Adivasi Chronicles</span>
            <span className="navbar__brand-tagline">
              Roots <span aria-hidden="true">•</span> History <span aria-hidden="true">•</span>{' '}
              Rights <span aria-hidden="true">•</span> Ideas <span aria-hidden="true">•</span>{' '}
              Future
            </span>
          </Link>

          <button
            className="navbar__menu-button"
            type="button"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <div
            className={`navbar__navigation${isMobileMenuOpen ? ' navbar__navigation--open' : ''}`}
            id="primary-navigation"
          >
            <div className="navbar__primary-links">
              {directLinks.map((link) => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                  end={link.to === '/'}
                  to={link.to}
                  onClick={closeNavigation}
                >
                  {link.label}
                </NavLink>
              ))}

              {dropdownGroups.map((group) => {
                const dropdownId = `navbar-dropdown-${group.label.toLowerCase()}`
                const isOpen = openDropdown === group.label
                const isActive = group.links.some((link) => isRouteActive(pathname, link.to))

                return (
                  <div className="navbar__dropdown" key={group.label}>
                    <button
                      className={`navbar__dropdown-button${
                        isActive ? ' navbar__link--active' : ''
                      }`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={dropdownId}
                      onClick={() => toggleDropdown(group.label)}
                    >
                      {group.label}
                      <span className="navbar__chevron" aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <div
                      className={`navbar__dropdown-menu${isOpen ? ' navbar__dropdown-menu--open' : ''}`}
                      id={dropdownId}
                      hidden={!isOpen}
                    >
                      {group.links.map((link) => (
                        <NavLink
                          key={link.to}
                          className={({ isActive: linkIsActive }) =>
                            `navbar__dropdown-link${
                              linkIsActive ? ' navbar__dropdown-link--active' : ''
                            }`
                          }
                          to={link.to}
                          onClick={closeNavigation}
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="navbar__utility-links">
              <NavLink
                className={({ isActive }) =>
                  `navbar__utility-link${isActive ? ' navbar__utility-link--active' : ''}`
                }
                to="/search"
                onClick={closeNavigation}
              >
                Search
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `navbar__utility-link${isActive ? ' navbar__utility-link--active' : ''}`
                }
                to="/contact"
                onClick={closeNavigation}
              >
                Contact
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    className={({ isActive }) =>
                      `navbar__utility-link navbar__utility-link--account${
                        isActive ? ' navbar__utility-link--active' : ''
                      }`
                    }
                    to="/admin"
                    onClick={closeNavigation}
                  >
                    {isPrivileged ? 'Admin' : user?.name?.split(' ')[0] || 'Account'}
                  </NavLink>
                  <button
                    type="button"
                    className="navbar__utility-link navbar__utility-link--logout"
                    onClick={() => {
                      logout()
                      closeNavigation()
                      navigate('/')
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    `navbar__utility-link navbar__utility-link--login${
                      isActive ? ' navbar__utility-link--active' : ''
                    }`
                  }
                  to="/login"
                  onClick={closeNavigation}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
