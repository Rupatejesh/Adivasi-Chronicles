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
    for (const path of ['/','/heroes','/itda']) {
      await go(path)
      await check("document.querySelector('.ghats-intro--roots') !== null", 'Photo first')
      await check("document.querySelector('.ghats-intro__roots-image').naturalWidth > 0", 'Exact opening asset loads')
      await check("!document.querySelector('.generations')", 'No temporary figures')
      await check('voiceCalls.length === 0', 'Silent initially')
      if (path === '/') {
        const roots = await send('Page.captureScreenshot',{format:'png'})
        await writeFile(`qa/user-assets-roots-${width}.png`,Buffer.from(roots.data,'base64'))
      }
      await delay(5400)
      await check("document.querySelector('.ghats-intro--launch') !== null", 'Artwork second')
      await check("document.querySelector('.ghats-intro__artwork').naturalWidth > 0", 'Exact launch asset loads')
      await check('document.documentElement.scrollWidth <= innerWidth', 'Intro no overflow')
      if (path === '/') {
        const launch = await send('Page.captureScreenshot',{format:'png'})
        await writeFile(`qa/user-assets-launch-${width}.png`,Buffer.from(launch.data,'base64'))
      }
      await evaluate("document.querySelector('.voice-guide summary').click()")
      await click('Enable Voice Guide'); await delay(150)
      await check('voiceCalls.length > 0','Opt-in narration')
      const cancellations = await evaluate('cancelCalls')
      if (path === '/heroes') {
        await click('Skip Intro')
        await check("!document.querySelector('.ghats-intro')",'Skip immediate')
      } else {
        await click('ENTER THE ARCHIVE →')
        await delay(800)
        await check("!document.querySelector('.ghats-intro')",'Enter completes')
      }
      await check(`cancelCalls > ${cancellations}`,'Exit cancels intro speech')
      await check(`location.pathname === ${JSON.stringify(path)}`,'Route preserved')
      await check("!!document.querySelector('nav') && !!document.querySelector('footer')",'Navbar/Footer')
      await check('document.documentElement.scrollWidth <= innerWidth','Page no overflow')
    }
    reports.push(`Photo → artwork → Enter/Skip on Home, Heroes and ITDA passed at ${width}px`)
  }
  await evaluate("document.querySelector('a[href=\"/heroes\"]').click()")
  await delay(300); await evaluate('history.back()'); await delay(300)
  await check("location.pathname === '/itda'",'Browser Back')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await go('/heroes')
  await check("getComputedStyle(document.querySelector('.ghats-intro__mist')).animationName === 'none'",'Reduced motion')
  await evaluate("document.querySelector('.ghats-intro__skip').focus()")
  await send('Input.dispatchKeyEvent',{type:'keyDown',text:'\r',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  await delay(200)
  await check("!document.querySelector('.ghats-intro')",'Keyboard Skip')
  await send('Network.enable')
  await send('Network.setBlockedURLs',{urls:['*adivasi-jeevana-vidhvamsam.png','*asr-launch.png']})
  await go('/')
  await delay(2600)
  await check("document.querySelector('.ghats-intro__fallback') !== null",'Failed image fallback')
  await check("!document.querySelector('.ghats-intro img')",'No broken-image elements')
  assert.equal(errors.length,0,'No uncaught browser exceptions')
  reports.push('Keyboard Skip, reduced motion, failed media fallback, Back and speech cancellation passed. Speech mocked; audible quality remains manual QA.')
  await writeFile('qa/user-assets-results.json',JSON.stringify(reports,null,2))
  console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }