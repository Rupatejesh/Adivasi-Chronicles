import { useState } from 'react'
export default function ProjectArtwork({ src, alt, caption }) {
  const [state, setState] = useState('loading')
  return <figure className="project-artwork">
    <div className="project-artwork__frame">
      {state !== 'loaded' && <span>Land · People · Memory</span>}
      {state !== 'failed' && <img src={src} alt={alt} loading="lazy" className={state === 'loaded' ? 'is-loaded' : ''}
        onLoad={() => setState('loaded')} onError={() => setState('failed')} />}
    </div><figcaption>{caption}</figcaption>
  </figure>
}
