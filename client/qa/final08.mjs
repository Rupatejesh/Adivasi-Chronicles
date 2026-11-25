import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], { windowsHide: true, stdio: 'inherit' })
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9333', `--user-data-dir=${process.cwd()}/node_modules/.cache/phase08h-browser`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  for (let n = 0; n < 40; n++) { try { await fetch('http://127.0.0.1:5188'); break } catch { await delay(250) } }
  let tabs
  for (let n = 0; n < 40; n++) { try { tabs = await (await fetch('http://127.0.0.1:9333/json')).json(); break } catch { await delay(250) } }
  assert(tabs, 'Browser started')
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let serial = 0
  const pending = new Map()
  const errors = []
  socket.addEventListener('message', ({data}) => { const result = JSON.parse(data); if (result.id) { const waiter = pending.get(result.id); pending.delete(result.id); if (result.error) waiter.reject(result.error); else waiter.resolve(result.result) } else if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.text) })
  const send = (method, params = {}) => new Promise((resolve,reject) => { const id = ++serial; pending.set(id,{resolve,reject}); socket.send(JSON.stringify({id,method,params})) })
  const evaluate = async expression => { const result = await send('Runtime.evaluate',{expression, returnByValue: true, awaitPromise: true}); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value }
  await send('Page.enable'); await send('Runtime.enable')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.voiceCalls=[]; window.cancelCalls=0; Object.defineProperty(window,'speechSynthesis',{value:{speak(u){window.voiceCalls.push(u.text)},cancel(){window.cancelCalls++}},configurable:true}); window.SpeechSynthesisUtterance=class {constructor(text){this.text=text}};` })
  const go = async path => { await send('Page.navigate',{url:`http://127.0.0.1:5188${path}`}); await delay(700) }
  const click = label => evaluate(`(()=>{ const button=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label') || b.textContent.trim())===${JSON.stringify(label)}); if(!button) throw Error('Missing button: '+document.body.innerText.slice(0,1500)); button.click() })()`)
  const check = async (expression, message) => assert(await evaluate(expression), message)
  const waitFor = async (expression, message, timeout=18000) => {
    const start=Date.now()
    while (Date.now()-start < timeout) { if(await evaluate(expression)) return; await delay(100) }
    throw Error(message)
  }
  const shot = async name => { const capture=await send('Page.captureScreenshot',{format:'png'}); await writeFile(`qa/final08-${name}.png`,Buffer.from(capture.data,'base64')) }
  const visibleImages = "[...document.images].every(i => !i.complete || i.naturalWidth > 0 || getComputedStyle(i).opacity === '0')"
  const reports=[]
  for (const width of [1440,768,390]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
    await go('/blog')
    await check('voiceCalls.length === 0','Default silence')
    await check("document.querySelector('.ghats-intro').getBoundingClientRect().width === innerWidth",'Full viewport intro width')
    await check("Math.abs(document.querySelector('.ghats-intro').getBoundingClientRect().height - innerHeight) < 2",'Full viewport intro height')
    await shot(`roots-${width}`)
    for (const stage of ['journey','alluri','district','itda','launch']) {
      await waitFor(`!!document.querySelector('.ghats-intro--${stage}')`,`${stage} missing`)
      if (stage === 'journey' || stage === 'district') await waitFor("!!document.querySelector('.intro-artwork__image.is-loaded')",'Artwork loads')
      if (stage === 'alluri') await check("document.querySelector('.alluri-moment').textContent.includes('A Legacy of Resistance')",'Alluri caption')
      if (stage === 'itda') await check("document.querySelector('.district-journey').textContent.includes('Community • Education • Health')",'ITDA thematic caption')
      if (stage === 'launch') { await check("!!document.querySelector('.launch-effects')",'Curtain and particles'); await delay(2350) }
      await shot(`${stage}-${width}`)
      await check('document.documentElement.scrollWidth <= innerWidth','Intro overflow')
      await check(visibleImages,'Images load without broken icons')
    }
    await check('voiceCalls.length === 0','Effects and scene changes do not autoplay speech')
    await evaluate("document.querySelector('.voice-guide summary').click()")
    await click('Enable Voice Guide'); await delay(150)
    await check('voiceCalls.length === 1','Opt-in intro narration')
    const cancels=await evaluate('cancelCalls')
    await click('ENTER THE ARCHIVE →'); await delay(800)
    await check("location.pathname === '/blog' && !document.querySelector('.ghats-intro')",'Enter preserves route')
    await check(`cancelCalls > ${cancels}`,'Enter cancels voice')
    for (const path of ['/','/blog','/about','/contact','/heroes','/itda','/blog/future-entry']) {
      await go(path); await click('Skip Intro'); await delay(250)
      await check('document.documentElement.scrollWidth <= innerWidth',`${path} overflow at ${width}`)
      await check("!!document.querySelector('nav') && !!document.querySelector('footer')",'Navbar/Footer intact')
      await check(visibleImages,'Page image fallback')
      if (['/blog','/about','/contact'].includes(path)) await shot(`${path.slice(1)}-${width}`)
      if (path === '/contact') {
        await check("document.querySelector('button[type=submit]').disabled",'Contact cannot send')
        await check("[...document.querySelectorAll('form input, form select, form textarea')].every(e => document.querySelector('label[for='+e.id+']'))",'Form labels')
        await evaluate("document.querySelector('#contact-name').focus()")
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
        await check("document.activeElement.id === 'contact-email' && getComputedStyle(document.activeElement).outlineStyle !== 'none'",'Visible keyboard focus')
      }
      if (path === '/blog/future-entry') await check("document.querySelector('main').textContent.includes('future-entry')",'Dynamic blog route preserved')
    }
    reports.push(`Full sequence, routes, page layouts, image loading, contact preview and overflow passed at ${width}px`)
  }
  // Every stage can be skipped, including while the curtain is moving.
  for (const stage of ['roots','journey','alluri','district','itda','launch']) {
    await go('/heroes')
    await waitFor(`!!document.querySelector('.ghats-intro--${stage}')`,'Skip target stage')
    await evaluate("document.querySelector('.ghats-intro__skip').focus()")
    await send('Input.dispatchKeyEvent',{type:'keyDown',text:'\r',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
    await delay(150)
    await check("!document.querySelector('.ghats-intro') && location.pathname === '/heroes'",'Keyboard Skip during '+stage)
  }
  await evaluate("document.querySelector('a[href=\"/heroes/birsa-munda\"]').click()")
  await delay(200); await evaluate('history.back()'); await delay(200)
  await check("location.pathname === '/heroes'",'Browser Back')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await go('/')
  await check("getComputedStyle(document.querySelector('.ghats-intro__roots-image')).animationName === 'none'",'No reduced-motion zoom')
  await waitFor("!!document.querySelector('.ghats-intro--launch')",'Reduced motion sequence')
  await check("!document.querySelector('.launch-effects') && !!document.querySelector('.ghats-intro__enter')",'Reduced motion no particles')
  await send('Network.enable'); await send('Network.setCacheDisabled',{cacheDisabled:true})
  await send('Network.setBlockedURLs',{urls:['*image2.jpg.png','*image3.jpg.png','*asr-launch.png','*adivasi-jeevana-vidhvamsam.png']})
  await go('/about'); await waitFor("!!document.querySelector('.ghats-intro--journey')",'Failed media sequence')
  await waitFor("!!document.querySelector('.intro-artwork__fallback')",'New art failure fallback')
  await click('Skip Intro'); await delay(500)
  await check("!document.querySelector('.project-artwork img')",'Editorial image failure removes broken image')
  assert.equal(errors.length,0,'No uncaught JavaScript exceptions')
  reports.push('Keyboard Skip at every stage, Back, reduced motion and blocked-image fallbacks passed. Speech mocked; audible quality remains manual QA.')
  await writeFile('qa/final08-results.json',JSON.stringify(reports,null,2)); console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }