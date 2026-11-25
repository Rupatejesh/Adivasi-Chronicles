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
  const reports=[]
  for (const width of [1440,768,390]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
    await go('/heroes')
    await check('voiceCalls.length===0','Silent initially')
    for (const stage of ['district','community','launch']) {
      await waitFor(`!!document.querySelector('.ghats-intro--${stage}')`,'Missing '+stage,22000)
      await delay(stage === 'launch' ? 3000 : 600)
      const selector = stage === 'launch' ? '.ghats-intro__artwork' : '.intro-artwork__image'
      await check(`(()=>{const i=document.querySelector('${selector}');return i.naturalWidth>0 && getComputedStyle(i).objectFit==='contain' && getComputedStyle(i).objectPosition==='50% 50%'})()`,'Centered complete artwork')
      await check('document.documentElement.scrollWidth<=innerWidth','No horizontal overflow')
      await shot(`asset-update-${stage}-${width}`)
    }
    await check("document.querySelectorAll('.ghats-intro__enter').length===1",'One real Enter button')
    await check('voiceCalls.length===0','No autoplay speech')
    await click('ENTER THE ARCHIVE →'); await delay(800)
    await check("!document.querySelector('.ghats-intro') && location.pathname==='/heroes'",'Enter route preserved')
    await go('/itda'); await click('Skip Intro')
    await check("!document.querySelector('.ghats-intro') && location.pathname==='/itda'",'Skip route preserved')
    reports.push(`Complete contained district/new/final artwork, no overflow, silent default, Enter/Skip passed at ${width}px`)
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await go('/')
  await check("getComputedStyle(document.querySelector('.ghats-intro__roots-image')).animationName==='none'",'No reduced-motion zoom')
  await waitFor("!!document.querySelector('.ghats-intro--community')",'New scene reduced motion',22000)
  await evaluate("document.querySelector('.voice-guide summary').click()")
  await click('Enable Voice Guide'); await delay(150)
  await check('voiceCalls.length>0','Opt-in voice')
  await waitFor("!!document.querySelector('.ghats-intro--launch')",'Final reduced motion')
  await check("!document.querySelector('.launch-effects')",'No reduced-motion particles')
  await click('Skip Intro')
  assert.equal(errors.length,0,'No uncaught exceptions')
  reports.push('Opt-in voice and reduced motion passed; speech mocked. Fine artwork text still requires zoom on phones.')
  await writeFile('qa/asset-update-results.json',JSON.stringify(reports,null,2));console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }