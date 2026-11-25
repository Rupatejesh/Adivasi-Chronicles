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
  const reports=[]
  for (const width of [1440,768,390]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
    await go('/itda'); await delay(4000)
    await check("!!document.querySelector('.launch-effects')",'Curtain mounted')
    await check("!document.querySelector('.ghats-intro__enter')",'CTA waits for reveal')
    await check('voiceCalls.length === 0','Effects remain silent')
    await check("getComputedStyle(document.querySelector('.launch-effects')).pointerEvents === 'none'",'Decorations ignore input')
    const shot = await send('Page.captureScreenshot',{format:'png'})
    await writeFile(`qa/launch-effects-${width}.png`,Buffer.from(shot.data,'base64'))
    await check('document.documentElement.scrollWidth <= innerWidth','No overflow')
    await delay(3000)
    await check("!!document.querySelector('.ghats-intro__enter')",'CTA revealed')
    await click('ENTER THE ARCHIVE →'); await delay(800)
    await check("!document.querySelector('.launch-effects') && location.pathname === '/itda'",'Enter removes effects and preserves route')
    await go('/heroes'); await delay(4000)
    await check("!!document.querySelector('.launch-effects')",'Skip during curtain')
    await click('Skip Intro'); await delay(100)
    await check("!document.querySelector('.ghats-intro') && location.pathname === '/heroes'",'Skip immediate and route preserved')
    await delay(2300)
    await check("!document.querySelector('.launch-effects')",'Pending effects cancelled')
    reports.push(`Reveal, delayed CTA, silent effects, Enter and mid-curtain Skip passed at ${width}px`)
  }
  await go('/'); await delay(9000)
  await check("!document.querySelector('.launch-effects')",'Completed effects removed')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await go('/heroes'); await delay(2400)
  await check("!document.querySelector('.launch-effects') && !!document.querySelector('.ghats-intro__enter')",'Reduced motion crossfade without particles')
  await evaluate("document.querySelector('.voice-guide summary').click()")
  await click('Enable Voice Guide'); await delay(200)
  await check('voiceCalls.length > 0','Opt-in speech unchanged')
  await click('Skip Intro')
  await check('cancelCalls > 0','Skip cancels speech')
  assert.equal(errors.length,0,'No uncaught exceptions')
  reports.push('Effect cleanup, reduced-motion crossfade and opt-in speech passed; speech mocked.')
  await writeFile('qa/launch-effects-results.json',JSON.stringify(reports,null,2))
  console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }