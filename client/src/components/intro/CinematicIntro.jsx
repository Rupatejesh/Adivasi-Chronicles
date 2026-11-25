import { useEffect, useRef, useState } from 'react'
import './CinematicIntro.css'
import LaunchEffects from './LaunchEffects.jsx'
import DistrictJourney from './DistrictJourney.jsx'
import IntroArtwork from './IntroArtwork.jsx'

const rootsImage = '/images/adivasi-jeevana-vidhvamsam.png'
const launchImage = '/images/asr-launch.png'

export default function CinematicIntro({ onContinue }) {
  const [stage, setStage] = useState('roots')
  const [revealReady, setRevealReady] = useState(false)
  const [effectsFinished, setEffectsFinished] = useState(false)
  const [rootsState, setRootsState] = useState('loading')
  const [launchState, setLaunchState] = useState('loading')
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const exitTimer = useRef(null)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    preference.addEventListener('change', update)
    return () => { preference.removeEventListener('change', update); clearTimeout(exitTimer.current) }
  }, [])
  useEffect(() => {
    if (stage === 'roots' && rootsState === 'loading') return
    const nextStage = { roots: 'journey', journey: 'alluri', alluri: 'district', district: 'itda', itda: 'community', community: 'launch' }[stage]
    if (!nextStage) return
    const duration = stage === 'roots' ? (reduced ? 1600 : 3200) : stage === 'journey' || stage === 'district' || stage === 'community' ? 2500 : 1800
    const timer = setTimeout(() => setStage(nextStage), duration)
    return () => clearTimeout(timer)
  }, [stage, rootsState, reduced])

  useEffect(() => {
    if (stage !== 'launch' || reduced) return
    const readyTimer = setTimeout(() => setRevealReady(true), 2250)
    const effectsTimer = setTimeout(() => setEffectsFinished(true), 4600)
    return () => { clearTimeout(readyTimer); clearTimeout(effectsTimer) }
  }, [stage, reduced])

  function skip() {
    clearTimeout(exitTimer.current)
    window.speechSynthesis?.cancel()
    onContinue()
  }
  function enter() {
    if (stage === 'leaving') return
    window.speechSynthesis?.cancel()
    setStage('leaving')
    exitTimer.current = setTimeout(onContinue, reduced ? 180 : 650)
  }

  return (
    <main className={`ghats-intro ghats-intro--${stage}`} aria-labelledby="entrance-title">
      <div className="ghats-intro__backdrop" aria-hidden="true">
        {launchState !== 'failed' && <img src={launchImage} alt="" />}
      </div>
      <div className="ghats-intro__opening" aria-hidden={stage !== 'roots'}>
        {rootsState !== 'failed' && <img className={`ghats-intro__roots-image ${rootsState === 'loaded' ? 'is-loaded' : ''}`}
          src={rootsImage} alt="User-selected black-and-white group photograph."
          onLoad={() => setRootsState('loaded')} onError={() => setRootsState('failed')} />}
        <div className="ghats-intro__roots-copy">
          <p>Stories carried across generations</p>
          <p>Roots • Memory • People</p>
        </div>
      </div>
      {stage === 'journey' && <IntroArtwork src="/images/image2.jpg.png" alt="User-supplied Eastern Ghats and ASR district composition with people, landscape and place labels." />}
      {stage === 'alluri' && <section className="alluri-moment" aria-label="Alluri Sitarama Raju">
        <p>The Eastern Ghats • Manyam</p><h2>ALLURI<br />SITARAMA RAJU</h2>
        <p>A Legacy of Resistance • Courage • Freedom</p>
      </section>}
      {stage === 'district' && <IntroArtwork src="/images/image3.jpg.png" alt="User-supplied ASR district summary artwork with a central map and embedded 11 Mandals heading; artwork content is not independently verified." />}
      {stage === 'itda' && <DistrictJourney institutional />}
      {stage === 'community' && <IntroArtwork src="/images/image4.jpg.png" alt="User-supplied Adivasi Chronicles artwork with people, a district map, ITDA Paderu and rights-related books and lettering." />}
      <div className="ghats-intro__launch" aria-hidden={stage !== 'launch' && stage !== 'leaving'}>
        {launchState !== 'failed' ? <img className={`ghats-intro__artwork ${launchState === 'loaded' ? 'is-loaded' : ''}`}
          src={launchImage} alt="User-selected Adivasi Chronicles launch artwork combining people, landscape, books and embedded lettering and logos."
          onLoad={() => setLaunchState('loaded')} onError={() => setLaunchState('failed')} /> :
          <div className="ghats-intro__fallback">People · Memory · Land · Future</div>}
        {stage === 'launch' && !reduced && !effectsFinished && <LaunchEffects />}
      </div>
      <div className="ghats-intro__mist" aria-hidden="true" />
      <button className="ghats-intro__skip" onClick={skip}>Skip Intro</button>
      <h1 className="ghats-intro__identity" id="entrance-title" data-voice-en="Welcome to Adivasi Chronicles. This archive brings journeys of land, people, memory, rights and ideas together.">ADIVASI CHRONICLES</h1>
      <div className="ghats-intro__navigation">
        <p>Roots • History • Rights • Ideas • Future</p>
        {(stage === 'launch' || stage === 'leaving') && (revealReady || reduced) && <button className="ghats-intro__enter" onClick={enter} aria-disabled={stage === 'leaving'}>ENTER THE ARCHIVE <span aria-hidden="true">→</span></button>}
        <small>Independent editorial archive</small>
      </div>
      <div className="ghats-intro__exit" aria-hidden="true" />
    </main>
  )
}
