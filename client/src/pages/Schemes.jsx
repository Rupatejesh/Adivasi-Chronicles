import { useEffect, useState } from 'react'
import {
  EditorialCTA,
  EditorialSection,
  InnerPageHero,
  PageBreadcrumb,
  ReferenceBlock,
} from '../components/innerPage/InnerPageFoundation.jsx'
import SchemeRecord from '../components/development/SchemeRecord.jsx'
import DevelopmentArchiveExplorer from '../components/innerPage/DevelopmentArchiveExplorer.jsx'
import { schemesApi } from '../services/api.js'
import '../components/development/DevelopmentPages.css'
import './Schemes.css'
import './MernDynamic.css'

const schemeCategories = [
  {
    id: 'education',
    number: '01',
    label: 'Education',
    title: 'Learning & Student Support',
  },
  {
    id: 'health',
    number: '02',
    label: 'Health',
    title: 'Health & Community Support',
  },
  {
    id: 'livelihoods',
    number: '03',
    label: 'Livelihoods',
    title: 'Skills, Work & Livelihood Support',
  },
  {
    id: 'agriculture-forest-livelihoods',
    number: '04',
    label: 'Agriculture & Forest Livelihoods',
    title: 'Community Livelihood Context',
  },
  {
    id: 'housing-infrastructure',
    number: '05',
    label: 'Housing & Infrastructure',
    title: 'Housing, Services & Connectivity',
  },
  {
    id: 'women-community-development',
    number: '06',
    label: 'Women & Community Development',
    title: 'Community Support & Development',
  },
  {
    id: 'financial-livelihood-support',
    number: '07',
    label: 'Financial / Livelihood Support',
    title: 'Public Support & Development Opportunities',
  },
  {
    id: 'other-verified-programmes',
    number: '08',
    label: 'Other Verified Programmes',
    title: 'An Expandable Programme Archive',
  },
]

const schemeRecords = []

function Schemes() {
  const [schemes, setSchemes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    schemesApi.list()
      .then((data) => {
        if (!cancelled) setSchemes(data.schemes || [])
      })
      .catch(() => {
        if (!cancelled) setSchemes([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredSchemes = schemes.filter((s) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      s.name.toLowerCase().includes(q)
      || s.department.toLowerCase().includes(q)
      || s.purpose.toLowerCase().includes(q)
      || (s.category || '').toLowerCase().includes(q)
    )
  })

  return (
    <main className="schemes-page">
      <PageBreadcrumb items={[{ label: 'Schemes' }]} />

      {/* Add an image prop only when genuine local photography is available.
          Intended assets: /images/development/itda-development.jpg, education.jpg,
          health.jpg, livelihoods.jpg, infrastructure.jpg and community.jpg. */}
      <InnerPageHero
        eyebrow="Schemes & Opportunities"
        title={
          <>
            Finding Public
            <br />
            Programmes Clearly
          </>
        }
        description="An evolving library designed to organise verified information about public programmes, support systems and development opportunities."
        metadata="ADIVASI CHRONICLES  •  SCHEMES LIBRARY"
        variant="schemes-library"
      />

      <EditorialSection
        id="schemes-introduction"
        eyebrow="Discover & Understand"
        title={
          <>
            From Information
            <br />
            to Understanding
          </>
        }
        description="This space will organise programme information in a clear format with official references and verification dates as researched content is added."
        variant="paper"
      >
        <DevelopmentArchiveExplorer
          categories={schemeCategories}
          label="scheme discovery"
          variant="schemes"
        />
        {!loading && schemes.length === 0 && schemeRecords.length === 0 && (
          <p>No verified programme records are available yet. Details and official sources will
            be added after research and verification.</p>
        )}
        {schemes.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <div className="ac-toolbar">
              <h3>Verified Programmes ({filteredSchemes.length})</h3>
              <label style={{ minWidth: '15rem' }}>
                <span className="visually-hidden">Search schemes</span>
                <input
                  type="search"
                  className="ac-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scheme, department or purpose…"
                />
              </label>
            </div>
            <div className="ac-grid">
              {filteredSchemes.map((item) => (
                <article key={item._id} className={`ac-card${item.isFeatured ? ' ac-card--featured' : ''}`}>
                  <div className="ac-badge-row">
                    <span className="ac-badge">{item.category}</span>
                    {item.relevantYear && <span className="ac-badge ac-badge--gold">{item.relevantYear}</span>}
                  </div>
                  <h3>{item.name}</h3>
                  <p className="ac-meta">Department: {item.department}</p>
                  <p>{item.purpose}</p>
                  {item.eligibility && <p><strong>Eligibility:</strong> {item.eligibility}</p>}
                  {item.benefits && <p><strong>Benefits:</strong> {item.benefits}</p>}
                  {item.applicationInfo && <p><strong>Application:</strong> {item.applicationInfo}</p>}
                  <div className="ac-meta">
                    {item.officialSource && <span>Source: {item.officialSource}</span>}
                    {item.lastVerifiedAt && <span>Verified: {new Date(item.lastVerifiedAt).toLocaleDateString()}</span>}
                  </div>
                  {item.officialSourceUrl && (
                    <a className="ac-btn ac-btn--secondary" href={item.officialSourceUrl} target="_blank" rel="noreferrer">
                      Official Source ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
        {schemeRecords.map((record) => (
          <SchemeRecord key={record.id} record={record} />
        ))}
      </EditorialSection>

      <aside className="schemes-verification-note" aria-label="Programme verification note">
        <span className="schemes-verification-note__rule" aria-hidden="true" />
        <p>
          Changing programme information will include its official source, relevant year and last
          verified date when researched material is added.
        </p>
      </aside>

      <p className="development-site-note">
        ADIVASI CHRONICLES is an independent educational and archive project, not an official
        government portal.
      </p>

      <ReferenceBlock description="Scheme information will include official references and relevant verification dates as researched material is added." />

      <nav className="schemes-page__cross-navigation" aria-label="Explore related knowledge">
        <EditorialCTA to="/itda" variant="earth">
          Explore ITDA
        </EditorialCTA>
        <EditorialCTA to="/rights" variant="earth">
          Explore Rights
        </EditorialCTA>
      </nav>
    </main>
  )
}

export default Schemes
