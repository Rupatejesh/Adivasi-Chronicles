import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './VoiceGuide.css'

// Language-keyed overrides can later supply reviewed Telugu introductions.
const narrationLanguages = { en: 'en-IN', te: 'te-IN' }
const routes = new Set(['/', '/tribal-history', '/heroes', '/books', '/constitution', '/rights', '/itda', '/schemes', '/music', '/gallery', '/my-journey'])

export default function VoiceGuide({ entrance }) {
  const { pathname } = useLocation()
  const supported = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined'
  // Activation is deliberately not restored across reloads: each document starts silent.
  const [enabled, setEnabled] = useState(false)
  const [muted, setMuted] = useState(() => {
    try { return sessionStorage.getItem('voice-guide-muted') === 'true' } catch { return false }
  })
  const [status, setStatus] = useState('Off')
  const current = useRef(null)
  const seen = useRef(new Set())
  const visible = useRef(new Set())
  const active = useRef(false)
  const quiet = useRef(muted)
  const utterance = useRef(null)

  function cancel() {
    utterance.current = null
    if (supported) window.speechSynthesis.cancel()
  }

  function speak(section) {
    if (!supported || !active.current || quiet.current || !section || document.hidden) return
    cancel()
    const speech = new SpeechSynthesisUtterance(section.text)
    speech.lang = narrationLanguages.en
    speech.rate = 0.9
    utterance.current = speech
    speech.onend = () => { if (utterance.current === speech) setStatus('Ready') }
    speech.onerror = () => { if (utterance.current === speech) setStatus('Voice unavailable. Please read the section text.') }
    try {
      window.speechSynthesis.speak(speech)
      seen.current.add(section.id)
      setStatus(`Speaking: ${section.label}`)
    } catch { setStatus('Voice unavailable. Please read the section text.') }
  }
  const speakRef = useRef(speak)
  useEffect(() => { speakRef.current = speak })

  useEffect(() => {
    current.current = null
    visible.current.clear()
    if (supported) window.speechSynthesis.cancel()
    utterance.current = null
    if (active.current) setStatus(quiet.current ? 'Muted' : 'Ready')
    if (!entrance && !routes.has(pathname) && !pathname.startsWith('/heroes/')) return
    // Observe introductions, never individual cards. Text comes from visible headings.
    const headings = [...document.querySelectorAll('main h1, main .section-intro h2, main section > div > header h2, main [data-voice-heading]')]
    const targets = [...new Set(headings)]
    const records = new Map(targets.map((node, index) => {
      const label = node.innerText.replace(/\s+/g, ' ').trim()
      const description = node.parentElement.querySelector('.inner-page-hero__description, .section-intro__description')?.innerText || ''
      return [node, { id: `${entrance ? 'entrance' : pathname}:${node.id || index}`, label, text: node.dataset.voiceEn || (description && description.length < 400 ? description : label + '.') }]
    }))
    if (!('IntersectionObserver' in window)) {
      current.current = records.get(targets[0]) || null
      return
    }
    let timer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.current.add(entry.target)
        else visible.current.delete(entry.target)
      })
      clearTimeout(timer)
      const candidate = [...visible.current].sort((a, b) => Math.abs(a.getBoundingClientRect().top - innerHeight * 0.3) - Math.abs(b.getBoundingClientRect().top - innerHeight * 0.3))[0]
      current.current = records.get(candidate) || null
      if (current.current && !seen.current.has(current.current.id)) {
        timer = setTimeout(() => {
          if (current.current && !seen.current.has(current.current.id)) speakRef.current(current.current)
        }, 650)
      }
    }, { threshold: 0.6, rootMargin: '0px 0px -15% 0px' })
    targets.forEach(node => observer.observe(node))
    const onHidden = () => {
      if (document.hidden) {
        utterance.current = null
        if (supported) window.speechSynthesis.cancel()
        if (active.current) setStatus(quiet.current ? 'Muted' : 'Ready')
      }
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onHidden)
      utterance.current = null
      if (supported) window.speechSynthesis.cancel()
    }
  }, [pathname, entrance, supported])

  function enable() {
    active.current = true
    setEnabled(true)
    setStatus(muted ? 'Muted' : 'Ready')
    speak(current.current)
  }
  function mute() {
    const next = !muted
    quiet.current = next
    setMuted(next)
    try { sessionStorage.setItem('voice-guide-muted', String(next)) } catch { /* Storage is optional. */ }
    cancel()
    setStatus(next ? 'Muted' : 'Ready ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â replay to listen')
  }
  function stop() {
    active.current = false
    setEnabled(false)
    cancel()
    setStatus('Stopped')
  }

  return (
    <aside className="voice-guide" aria-label="Voice Guide">
      <details className="voice-guide__panel">
        <summary>Voice Guide</summary>
        <div className="voice-guide__controls">
      {!supported ? <p>Voice Guide is unavailable in this browser. All content is available to read.</p> : <>
        {!enabled ? <button onClick={enable}>Enable Voice Guide</button> : <>
          <button onClick={mute} aria-pressed={muted}>{muted ? 'Unmute' : 'Mute'}</button>
          <button onClick={() => speak(current.current)} disabled={muted} aria-label="Replay current section">Replay</button>
          <button onClick={stop} aria-label="Stop Voice">Stop</button>
        </>}
        <span role="status">Voice Guide: {status}</span>
      </>}
        </div>
      </details>
    </aside>
  )
}
