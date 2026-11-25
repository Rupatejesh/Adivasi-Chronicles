import { useState } from 'react'
import { journeyPlaces } from '../../data/journeyPlaces.js'

function PlaceLabel({ place }) {
  const [imageState, setImageState] = useState('loading')
  const available = place.approved && place.src.startsWith('/images/places/') && imageState !== 'failed'
  return <li className="district-journey__place">
    {available && <img src={place.src} alt={place.alt} className={imageState === 'loaded' ? 'is-loaded' : ''}
      onLoad={() => setImageState('loaded')} onError={() => setImageState('failed')} />}
    <span>{place.name}</span>
  </li>
}

export default function DistrictJourney({ institutional }) {
  return (
    <section className={`district-journey${institutional ? ' district-journey--itda' : ''}`} aria-label="Eastern Ghats district journey">
      <div className="district-journey__landscape" aria-hidden="true"><i /><i /><i /></div>
      <div className="district-journey__copy">
        <p className="district-journey__eyebrow">Eastern Ghats · Land & memory</p>
        {institutional ? <>
          <h2>ITDA PADERU</h2>
          <p>Integrated Tribal Development Agency</p><p>Community • Education • Health • Livelihoods • Development</p>
          <p className="district-journey__independent">Independent educational and cultural project.<br />Not an official government website.</p>
        </> : <>
          <h2>Alluri Sitharama<br />Raju District</h2>
          <p>Mountains • Forests • Valleys • Waterfalls • Communities</p>
          <ul className="district-journey__places" aria-label="Places in the district journey">
            {journeyPlaces.map(place => <PlaceLabel key={place.slug} place={place} />)}
          </ul>
          <small>Landscape illustration · location photography to come</small>
        </>}
      </div>
    </section>
  )
}
