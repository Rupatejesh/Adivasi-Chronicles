import { useState } from 'react'
import { introCharacters } from '../../data/introMedia.js'

function SymbolicFigure({ character }) {
  const [state, setState] = useState('loading')
  const canLoad = character.approved && character.src.startsWith('/images/intro/') && state !== 'failed'
  return (
    <div className={`generations__figure generations__figure--${character.id}`}>
      <div className="generations__art">
        {state !== 'loaded' && <span className="generations__silhouette" aria-hidden="true" />}
        {canLoad && <img src={character.src} alt={character.alt} className={state === 'loaded' ? 'is-loaded' : ''}
          onLoad={() => setState('loaded')} onError={() => setState('failed')} />}
      </div>
      <span className="generations__label">{character.role}<small>{character.label}</small></span>
    </div>
  )
}

export default function ThreeGenerations() {
  return (
    <figure className="generations" aria-label="Memory, present and future">
      <div className="generations__figures">
        {introCharacters.map(character => <SymbolicFigure key={character.id} character={character} />)}
      </div>
      <figcaption>Symbolic figures · not portraits of real people</figcaption>
    </figure>
  )
}
