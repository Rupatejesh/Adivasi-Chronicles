import { Link } from 'react-router-dom'
import { PageBreadcrumb, EditorialCTA } from '../components/innerPage/InnerPageFoundation.jsx'
import ProjectArtwork from '../components/editorial/ProjectArtwork.jsx'
import './EditorialPages.css'
const themes = [
  ['People, Land & Memory', 'A place for cultural context, community memory and responsibly documented stories.', '/tribal-history'],
  ['History & Heroes', 'Biographies and historical writing built around evidence, context and clear references.', '/heroes'],
  ['Constitution & Rights', 'Readable educational material with official sources and clearly stated limits.', '/constitution'],
  ['Books & Ideas', 'Reading, reflection and the ideas that help us ask better questions.', '/books'],
  ['Eastern Ghats & ASR District', 'A home for local landscapes, cultural perspectives and genuine photography.', '/gallery'],
  ['Development & Opportunities', 'An educational guide to development topics, with dates and sources when information is added.', '/itda'],
]
export default function About() {
  return <main className="editorial-page about-page"><PageBreadcrumb items={[{label:'About'}]} />
    <header className="editorial-page__hero"><p className="editorial-page__eyebrow">ABOUT / OUR PURPOSE</p><h1>An archive rooted in place.<br /><em>A conversation open to the future.</em></h1><p>Adivasi Chronicles is an independent educational, cultural and knowledge archive. It is not an official government website.</p></header>
    <section className="about-manifesto" aria-labelledby="project-purpose"><div><p className="editorial-page__eyebrow">Why this project exists</p><h2 id="project-purpose">To make room for<br />memory and inquiry.</h2><p>This project brings history, culture, rights, books and personal learning into one connected editorial space.</p><p>Its purpose is to make thoughtful reading and source-backed exploration easier, while keeping uncertainty visible and respecting the people whose stories are shared.</p></div><ProjectArtwork src="/images/image2.jpg.png" alt="User-supplied project artwork bringing together people, landscape and reading." caption="The project’s visual world · supplied artwork, not documentary evidence." /></section>
    <section className="editorial-page__section" aria-labelledby="about-themes"><p className="editorial-page__eyebrow">One archive, many paths</p><h2 id="about-themes">What belongs here</h2><div className="about-themes">{themes.map(([title,text,to],index) => <article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p><Link to={to}>Explore this subject →</Link></article>)}</div></section>
    <section className="about-principles" aria-labelledby="project-principles"><p className="editorial-page__eyebrow">Our editorial commitments</p><h2 id="project-principles">Care before certainty.</h2><div className="about-principles__grid"><div><h3>Content integrity</h3><p>No invented histories, quotations, personal claims or government figures. Drafts and placeholders remain clearly labelled.</p></div><div><h3>Sources & verification</h3><p>Research needs traceable references. Changing information needs a relevant date. Verified quotations need exact wording and attribution.</p></div><div><h3>Respectful representation</h3><p>Genuine photography and approved artwork have distinct roles. An illustration is never offered as documentary proof.</p></div></div></section>
    <section className="editorial-page__closing"><p className="editorial-page__eyebrow">Future vision</p><h2>A living archive,<br />built with patience.</h2><p>Future work will add researched writing, reviewed references and ways to contribute. The archive grows as its material is ready.</p><EditorialCTA to="/contact" variant="earth">Connect with the project</EditorialCTA></section>
  </main>
}
