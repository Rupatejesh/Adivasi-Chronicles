import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
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
  const reports=[]
  for (const width of [1440,768,390]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
    await go('/heroes/birsa-munda')
    const introShot = await send('Page.captureScreenshot', {format:'png'})
    await writeFile('qa/phase08h-intro-'+width+'.png', Buffer.from(introShot.data,'base64'))
    await check('voiceCalls.length===0','Silent before activation')
    await check('document.documentElement.scrollWidth <= innerWidth','Intro overflow')
    await check("document.querySelectorAll('.generations__silhouette').length === 3", 'Three symbolic fallbacks')
    await evaluate("document.querySelector('.voice-guide summary').click()")
    await evaluate("document.querySelector('.voice-guide details').open = true")
  await click('Enable Voice Guide'); await delay(850)
    await check('voiceCalls.length===1','Explicit activation speaks')
    await click('Mute'); await check('cancelCalls>0','Mute cancels')
    await click('Unmute'); await click('Replay current section')
    await check('voiceCalls.length===2','Replay speaks')
    await click('Stop Voice'); await delay(800)
    await check('voiceCalls.length===2','Stop prevents further speech')
    await click('Skip Intro'); await delay(800)
    await check("location.pathname==='/heroes/birsa-munda'",'Route preservation')
    await check("document.querySelector('h1').textContent==='Birsa Munda'",'Biography detail')
    await check("!document.querySelector('blockquote')",'No unverified quote')
    await check('document.documentElement.scrollWidth <= innerWidth','Detail overflow')
    for (const path of ['/','/heroes','/tribal-history','/books','/constitution','/rights','/itda','/schemes','/music','/gallery','/my-journey']) {
      await go(path); await click('Skip Intro'); await delay(150)
      await check('document.documentElement.scrollWidth <= innerWidth',`${path} overflow at ${width}`)
      await check("!!document.querySelector('nav') && !!document.querySelector('footer')", 'Navigation/footer preserved')
      await check("[...document.images].every(i=>!i.complete || i.naturalWidth>0 || getComputedStyle(i).opacity==='0')", 'No visible broken image')
    }
    const screenshot = await send('Page.captureScreenshot', {format:'png'})
    await writeFile('qa/phase08h-'+width+'.png', Buffer.from(screenshot.data,'base64'))
    reports.push(`Responsive route sweep passed at ${width}px`)
  }
  await go('/heroes'); await click('Skip Intro'); await delay(800)
  await evaluate("document.querySelector('.voice-guide details').open = true")
  await click('Enable Voice Guide'); await delay(850)
  await evaluate("document.getElementById('featured-biographies-title').scrollIntoView()")
  await delay(1000)
  const spoken = await evaluate('voiceCalls.length')
  await evaluate('window.scrollBy(0,10)'); await delay(800)
  await check(`voiceCalls.length===${spoken}`, 'Small scroll does not repeat narration')
  await evaluate("document.querySelector('a[href=\"/heroes/birsa-munda\"]').click()")
  await delay(800)
  await evaluate('history.back()'); await delay(800)
  await check("location.pathname==='/heroes'", 'Browser Back')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await go('/')
  await check("document.querySelector('.ghats-intro--dawn')!==null",'Reduced motion dawn')
  await check("getComputedStyle(document.querySelector('.ghats-intro__mist')).animationName==='none'",'Reduced motion no animation')
  await evaluate("document.querySelector('.ghats-intro__skip').focus()")
  await send('Input.dispatchKeyEvent',{type:'keyDown',text:'\r',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  await delay(500)
  await check("!document.querySelector('.ghats-intro')",'Keyboard Skip')
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true})"})
  await go('/books')
  await check("document.querySelector('.voice-guide').textContent.includes('unavailable')",'Unsupported speech fallback')
  await click('Skip Intro')
  assert.equal(errors.length,0, 'No uncaught browser exceptions')
  reports.push('Speech controls, silence, no repeat, route preservation, browser Back, keyboard Skip, reduced motion and unsupported speech passed. Speech mocked; audible OS voice quality requires manual QA.')
  await mkdir('qa', {recursive:true}); await writeFile('qa/phase08h-results.json',JSON.stringify(reports,null,2))
  console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }
