import { useState } from 'react'

export default function IntroArtwork({ src, alt }) {
  const [state, setState] = useState('loading')
  return <div className="intro-artwork">
    {state !== 'failed' && <>
      <img className="intro-artwork__extension" src={src} alt="" aria-hidden="true" />
      <img className={`intro-artwork__image ${state === 'loaded' ? 'is-loaded' : ''}`} src={src} alt={alt}
        onLoad={() => setState('loaded')} onError={() => setState('failed')} />
    </>}
    {state !== 'loaded' && <p className="intro-artwork__fallback">Eastern Ghats · Land, people and memory</p>}
  </div>
}
