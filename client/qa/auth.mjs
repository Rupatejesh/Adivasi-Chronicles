import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], { windowsHide: true, stdio: 'inherit' })
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9333', `--user-data-dir=${process.cwd()}/node_modules/.cache/auth-browser`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
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
  const shot = async name => { const capture=await send('Page.captureScreenshot',{format:'png'}); await writeFile(`qa/auth-${name}.png`,Buffer.from(capture.data,'base64')) }
  const reports=[]
  const fill = (id,value) => evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  for (const width of [1440,768,390]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false})
    await go('/login'); await click('Skip Intro'); await delay(200)
    await check("!!document.querySelector('.auth-page--login')",'Login route')
    await check('document.documentElement.scrollWidth<=innerWidth','Login overflow')
    await check("!document.querySelector('form').checkValidity()",'Required login fields')
    await fill('auth-email','reader@example.com'); await fill('login-password','example-password')
    await click('Show password'); await check("document.querySelector('#login-password').type==='text'",'Show password')
    await click('Hide password'); await check("document.querySelector('#login-password').type==='password'",'Hide password')
    await evaluate("document.querySelector('.auth-check input').click()")
    await check("document.querySelector('.auth-check input').checked",'Remember UI')
    await click('Forgot password?'); await check("document.querySelector('.auth-status').textContent.includes('Password recovery')",'Recovery placeholder')
    await evaluate("document.querySelector('form').requestSubmit()")
    await check("location.pathname==='/login' && document.querySelector('.auth-status').textContent.includes('upcoming backend phase')",'Honest login submission')
    await evaluate("document.querySelector('#auth-email').focus()")
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9}); await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
    await check("document.activeElement.id==='login-password' && getComputedStyle(document.activeElement).outlineStyle==='solid'",'Keyboard focus visible')
    await evaluate("document.querySelector('.auth-page').scrollIntoView()")
    await shot(`login-${width}`)
    await evaluate("document.querySelector('.auth-switch a').click()"); await delay(150)
    await check("location.pathname==='/register'",'Login to Register')
    await check('document.documentElement.scrollWidth<=innerWidth','Register overflow')
    await check("document.querySelectorAll('.auth-rights li').length===6",'Rights categories')
    await check("document.querySelector('.auth-community').naturalWidth>0",'Approved image loads')
    await check("[...document.querySelectorAll('.auth-page input')].every(i=>i.labels.length>0)",'Labels')
    await check("!document.querySelector('form').checkValidity()",'Required registration fields')
    await fill('full-name','Example Reader'); await fill('auth-email','invalid')
    await check("!document.querySelector('#auth-email').validity.valid",'Email validation')
    await fill('auth-email','reader@example.com'); await fill('register-password','example-password'); await fill('confirm-password','different')
    await check("!document.querySelector('#confirm-password').checkValidity() && !!document.querySelector('#auth-match-error')",'Password mismatch')
    await fill('confirm-password','example-password')
    await check("!document.querySelector('#auth-match-error') && !document.querySelector('form').checkValidity()",'Terms required')
    await evaluate("document.querySelector('[name=terms]').click()")
    await check("document.querySelector('form').checkValidity()",'Valid registration')
    await fill('register-password','changed-password')
    await check("!document.querySelector('#confirm-password').checkValidity()",'Changing original password revalidates')
    await fill('confirm-password','changed-password')
    await click('Show confirm password'); await check("document.querySelector('#confirm-password').type==='text'",'Confirmation visibility'); await click('Hide confirm password')
    await evaluate("document.querySelector('form').requestSubmit()")
    await check("location.pathname==='/register' && document.querySelector('.auth-status').textContent.includes('upcoming backend phase')",'Honest register submission')
    await evaluate("document.querySelector('.auth-page').scrollIntoView()")
    await shot(`register-${width}`)
    await evaluate("document.querySelector('.auth-switch a').click()"); await delay(150)
    await check("location.pathname==='/login'",'Register to Login')
    await evaluate('history.back()'); await delay(150)
    await check("location.pathname==='/register'",'Browser Back')
    reports.push(`${width}px: routes, Back, fields, password visibility/match, terms, preview submit, keyboard focus, image and overflow passed`)
  }
  await send('Network.enable'); await send('Network.setBlockedURLs',{urls:['*adivasi-jeevana-vidhvamsam.png*']})
  await go('/register'); await click('Skip Intro'); await delay(200)
  await check("!document.querySelector('.auth-community') && document.querySelector('.auth-art-caption').textContent.includes('illustration')",'Image failure fallback')
  await check("[...document.querySelectorAll('.auth-page img')].every(i=>i.complete&&i.naturalWidth>0)",'No broken auth images')
  await shot('register-fallback-390')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await evaluate("document.querySelector('.auth-switch a').click()"); await delay(150)
  await check("getComputedStyle(document.querySelector('.auth-mist')).animationName==='none'",'Reduced motion')
  assert.equal(errors.length,0,'No uncaught exceptions')
  reports.push('Image failure fallback, reduced motion, no uncaught JavaScript exceptions passed. Screen-reader and other-browser QA remain manual.')
  await writeFile('qa/auth-results.json',JSON.stringify(reports,null,2)); console.log(reports.join('\n'))
} finally { socket?.close(); browser.kill(); server.kill() }
