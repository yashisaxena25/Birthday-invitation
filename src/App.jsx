import React, { useCallback, useEffect, useRef, useState } from 'react';

const PHASES = ['BOOT', 'LEVEL 01', 'LEVEL 02', 'INVITE', 'GUESTS', 'PARTY'];
const LOGS = [
  'INITIALIZING PARTY OS...', 'LOADING BIRTHDAY PROTOCOL...', 'SCANNING HUMAN INTELLIGENCE...',
  'VERIFYING PARTY-WORTHINESS...', 'WARNING: FUN LEVELS MAY EXCEED SAFE LIMITS.', 'CONNECTION ESTABLISHED.'
];
const guests = [
  { name: 'Suhu', role: 'Chief Food Inspector', stat: 'Snacks secured: 98%', avatar: '🍟', status: 'VERIFIED', color: 'lime' },
  { name: 'Darshit', role: 'Dance Floor Threat', stat: 'Moves pending: 404', avatar: '🕺', status: 'CHAOS DETECTED', color: 'pink' },
  { name: 'Chichi', role: 'Chaos Engineer', stat: 'Vibes per second: 100', avatar: '🪩', status: 'VERIFIED', color: 'purple' },
  { name: 'Akki Bhaiya', role: 'Professional Latecomer', stat: 'ETA accuracy: unknown', avatar: '🕶️', status: 'VIP', color: 'cyan' },
  { name: 'Arnav', role: 'Snack Operations Manager', stat: 'Taste tests: classified', avatar: '🍰', status: 'VERIFIED', color: 'lime' },
];
const flyRoasts = ['YOU REALLY THINK YOU CAN CATCH ME?', 'AIM ISSUE DETECTED.', 'BRO IS CHASING PIXELS.', 'HUMAN INTELLIGENCE: UNDER REVIEW.', 'STOP TRYING.', 'I LIVE HERE NOW.'];
const random = (n) => Math.floor(Math.random() * n);

function PhaseProgress({ phase }) {
  return <nav className="phase-nav" aria-label="Experience progress">{PHASES.map((item, i) => <div className={`phase-step ${i < phase ? 'done' : ''} ${i === phase ? 'active' : ''}`} key={item}><span className="phase-dot">{i < phase ? '✓' : `0${i}`}</span><span className="phase-name">{item}</span></div>)}</nav>;
}

function TerminalText({ lines, onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= lines.length) { const t = setTimeout(onDone, 380); return () => clearTimeout(t); }
    const t = setTimeout(() => setCount(v => v + 1), count === 0 ? 180 : 330);
    return () => clearTimeout(t);
  }, [count, lines.length, onDone]);
  return <div className="terminal-lines" aria-live="polite">{lines.slice(0, count).map((line, i) => <p key={line}><span className="terminal-prompt">{i === lines.length - 1 ? '✓' : '›'}</span> {line}</p>)}<span className="cursor" /></div>;
}

function Confetti({ count = 36 }) {
  return <div className="confetti" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={{ '--x': `${(i * 47 + 3) % 100}%`, '--h': (i * 47) % 360, '--fall-duration': `${3 + (i % 5) * .45}s`, '--fall-delay': `${i * -.19}s`, '--start-rotation': `${i * 29}deg` }} />)}</div>;
}

function BootScreen({ start, secret, showSecret }) {
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);
  return <section className="screen boot-screen">
    <div className="boot-topline"><span><i className="led" /> PARTY OS v2.6.0</span><span>SECURE CONNECTION <b>●</b></span></div>
    <div className="boot-console"><div className="console-head"><span>root@birthday:~</span><span>SESSION: {Math.random().toString(36).slice(2, 8).toUpperCase()}</span></div><TerminalText lines={LOGS} onDone={finish} />
      <button className="skip-link" onClick={() => setReady(true)}>SKIP INTRO ↗</button>
    </div>
    {ready && <div className="boot-hero reveal"><p className="eyebrow"><span className="signal-bars">▂ ▄ ▆</span> AN UNAUTHORIZED CELEBRATION SYSTEM</p>
      <h1 className="glitch" data-text="BIRTHDAY.EXE" onClick={showSecret}>BIRTHDAY<span>.</span>EXE</h1>
      <p className="hero-copy">Some people were born to party.<br /><span>Others need to complete system verification first.</span></p>
      <button className="button button-primary" onClick={start}><span>▶</span> INITIATE PARTY PROTOCOL <span>↗</span></button>
      <button className="button-link" onClick={() => window.alert('Nice try. You are not the birthday admin. ;)')}>I AM NOT HERE FOR THE GAMES</button>
      {secret && <p className="secret-line">// SECRET UNLOCKED: birthday admin is probably eating cake.</p>}
    </div>}
  </section>;
}

function FlyGame({ onWin }) {
  const arenaRef = useRef(null), startRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 48 }), [elapsed, setElapsed] = useState(0), [escapes, setEscapes] = useState(0), [roast, setRoast] = useState('YOU REALLY THINK YOU CAN CATCH ME?');
  const moveFly = useCallback((force = false) => {
    const now = Date.now(); if (!startRef.current) return;
    const secs = (now - startRef.current) / 1000;
    // The fly dodges during the challenge, then stays still so the catch is fair.
    if (!force || secs >= 30) return;
    const next = { x: 8 + Math.random() * 82, y: 12 + Math.random() * 72 };
    setPos(next); setEscapes(v => v + 1); if (Math.random() > .45) setRoast(flyRoasts[random(flyRoasts.length)]);
  }, []);
  useEffect(() => {
    const id = setInterval(() => { if (startRef.current) setElapsed((Date.now() - startRef.current) / 1000); }, 80);
    return () => clearInterval(id);
  }, []);
  const begin = () => { if (!startRef.current) startRef.current = Date.now(); moveFly(true); };
  const dodge = (event) => {
    if (!startRef.current) return;
    const box = arenaRef.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width * 100, py = (event.clientY - box.top) / box.height * 100;
    const dx = px - pos.x, dy = py - pos.y;
    if (Math.hypot(dx, dy) < (elapsed < 30 ? 19 : 12)) moveFly(true);
  };
  const catchFly = () => { const seconds = startRef.current ? (Date.now() - startRef.current) / 1000 : elapsed; if (seconds >= 30) onWin(); else { setRoast('NICE TRY. 30 SECONDS FIRST.'); moveFly(true); } };
  const left = Math.max(0, 30 - elapsed);
  return <section className="screen game-screen">
    <GameHeader label="LEVEL 01 / CATCH THE FLY" number="01" />
    <h2>Catch the <span className="pink-text">fly.</span></h2><p className="section-copy">A tiny insect has breached party security. Resolve the situation.</p>
    <div className="game-instructions"><b>HOW TO CLEAR THIS LEVEL</b><span><i>01</i> Tap anywhere in the arena to start.</span><span><i>02</i> Chase the fly with your pointer or finger.</span><span><i>03</i> Catch it after the 30-second timer runs out.</span></div>
    <div className="game-hud"><div><small>ELAPSED TIME</small><strong>{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{Math.floor(elapsed % 60).toString().padStart(2, '0')}<span className="hud-sub">{left > 0 ? `${Math.ceil(left)}s UNTIL IT STOPS` : 'READY TO CATCH'}</span></strong></div><div><small>ESCAPE COUNT</small><strong>{escapes.toString().padStart(2, '0')}<span className="hud-sub">FLY IS JUDGING YOU</span></strong></div><div className="intel"><small>FLY INTELLIGENCE</small><strong>{Math.min(99, 65 + Math.floor(elapsed / 3))}%</strong><div className="meter"><i style={{ width: `${Math.min(99, 65 + elapsed / 3)}%` }} /></div></div></div>
    <div className="fly-arena" ref={arenaRef} onPointerMove={dodge} onPointerDown={begin} onTouchStart={begin}>
      <div className="arena-corner tl"/><div className="arena-corner tr"/><div className="arena-corner bl"/><div className="arena-corner br"/>
      <span className="arena-label">LIVE CAPTURE FEED <b>●</b></span><span className="arena-coords">X: {Math.round(pos.x * 10)} Y: {Math.round(pos.y * 10)}</span>
      <div className="crosshair" aria-hidden="true">⌖</div>
      <button className={`fly-target ${elapsed >= 30 ? 'capture-ready' : ''}`} style={{ left: `${pos.x}%`, top: `${pos.y}%` }} onPointerEnter={() => moveFly(true)} onClick={catchFly} aria-label="Catch the fly">🪰</button>
      <div className="fly-taunt">{roast}</div>
      {!startRef.current && <span className="arena-start">TAP THE ARENA TO BEGIN</span>}
    </div>
    <p className="game-hint">{!startRef.current ? 'Tap the arena to start your timer.' : left > 0 ? 'Keep chasing. The fly can only be caught when the timer reaches 00:30.' : 'The fly has stopped. Tap its glowing target anywhere inside the circle to catch it.'}</p>
    {elapsed >= 30 && <div className="fly-grace" role="status"><div><strong>It’s okay if you couldn’t catch the fly.</strong><span>I still want you at my party!</span></div><button className="button button-secondary" onClick={onWin}>CONTINUE TO LEVEL 02 <span>→</span></button></div>}
  </section>;
}

function GameHeader({ label, number }) { return <div className="game-title-row"><span>{label}</span><span className="game-badge">{number} / 02</span></div>; }

function ReactionGame({ onDone }) {
  const [state, setState] = useState('ready'), [reaction, setReaction] = useState(null), [early, setEarly] = useState(''), [round, setRound] = useState(1), [attempts, setAttempts] = useState(0);
  const goAt = useRef(0), timer = useRef(null), alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; clearTimeout(timer.current); };
  }, []);
  const start = () => { clearTimeout(timer.current); setEarly(''); setReaction(null); setState('waiting'); const delay = 1500 + Math.random() * 3500; timer.current = setTimeout(() => { if (alive.current) { goAt.current = performance.now(); setState('go'); } }, delay); };
  const click = () => { if (state === 'ready') { start(); return; } if (state === 'waiting') { clearTimeout(timer.current); setState('ready'); setEarly('TOO EARLY. THE BUTTON WAS LITERALLY RED.'); setAttempts(v => v + 1); return; } if (state === 'go') { const ms = Math.round(performance.now() - goAt.current); setReaction(ms); setState('result'); } };
  const message = reaction < 200 ? 'ARE YOU EVEN HUMAN?' : reaction <= 350 ? 'DECENT REFLEXES. YOU MAY LIVE.' : reaction <= 600 ? 'REACTION TIME DETECTED. WINDOWS UPDATE ENERGY.' : 'THE PARTY STARTED AND YOU’RE STILL PROCESSING.';
  return <section className="screen game-screen">
    <GameHeader label="LEVEL 02 / REACTION TEST" number="02" />
    <h2>Prove your <span className="lime-text">reflexes.</span></h2><p className="section-copy">Wait for green. Click as fast as your very human brain allows.</p>
    <div className={`reaction-panel ${state}`}><div className="reaction-inner">
      <span className="reaction-signal"><i/> {state === 'go' ? 'SIGNAL DETECTED' : state === 'waiting' ? 'AWAITING SIGNAL' : 'REACTION LAB'}</span>
      {state === 'ready' && <><div className="reaction-icon">◉</div><h3>READY WHEN YOU ARE.</h3><p>Wait for the screen to turn GREEN.<br/>DO NOT CLICK EARLY.</p><button className="button button-primary" onClick={click}>START ROUND <span>→</span></button>{early && <p className="early-message" role="status">{early}</p>}</>}
      {state === 'waiting' && <button className="reaction-hit" onClick={click} aria-label="Wait for green, do not click yet"><span className="waiting-orb"/><strong>WAIT FOR IT…</strong><small>STAY CALM. THIS IS A TEST.</small></button>}
      {state === 'go' && <button className="reaction-hit go-hit" onClick={click}><span className="go-flash"/><strong>CLICK NOW!</strong><small>GO GO GO</small></button>}
      {state === 'result' && <><div className="reaction-number">{reaction}<small>ms</small></div><h3>{message}</h3><p>That is your official party readiness score.</p>{attempts < 2 && <button className="button button-secondary" onClick={() => { setRound(v => v + 1); start(); }}>TRY AGAIN <span>↻</span></button>}<button className="button button-primary" onClick={onDone}>UNLOCK INVITATION <span>↗</span></button></>}
    </div></div><div className="reaction-foot"><span>ROUND {round.toString().padStart(2, '0')}</span><span>FALSE STARTS: {attempts}</span><span>NO PRESSURE (THERE IS PRESSURE)</span></div>
  </section>;
}

function Reveal({ onDone }) { return <section className="screen reveal-screen"><Confetti count={42}/><div className="reveal-log"><TerminalText lines={['ACCESS GRANTED.', 'YOU HAVE SURVIVED THE TESTS.', 'ONE IMPORTANT EVENT HAS BEEN DETECTED.']} onDone={onDone}/></div><div className="reveal-stamp">AUTHORIZED GUEST</div></section>; }

function InvitationCard({ onAccept, onBonus }) { return <section className="screen invitation-screen"><Confetti count={28}/>
  <div className="invite-kicker"><span>TRANSMISSION INCOMING</span><span>MSG_ID: 08-30-BDAY</span></div>
  <article className="invite-card"><div className="invite-edge"><span>✳</span><span>✳</span></div><div className="invite-orbit">🎂</div><p className="eyebrow">YOU HAVE BEEN PERSONALLY SUMMONED</p><h2>YOU’RE<br/><em>INVITED.</em></h2><p className="invite-title">BIRTHDAY PARTY</p>
    <div className="invite-rule"><span>✦</span></div>
    <div className="invite-details"><div><span className="detail-icon">◷</span><div><small>TIME</small><strong>TONIGHT <b>—</b> 8:30 PM</strong></div></div><div><span className="detail-icon">⌖</span><div><small>VENUE</small><strong>CROSSING REPUBLIC<br/>INDIAN ZAIKA</strong></div></div></div>
    <div className="dress-code"><span>DRESS CODE</span><p>Come looking good.<br/><i>Leave with questionable memories.</i></p></div>
    <div className="invite-status"><i/> PARTY IS OFFICIALLY HAPPENING.</div>
    <button className="button button-primary invite-button" onClick={onAccept}>ACCEPT THE CHAOS <span>↗</span></button>
    <div className="invite-seal">B’DAY<br/>OPS</div>
  </article>
  <button className="button-link bonus-link" onClick={onBonus}>⊞ OPTIONAL ARCADE // WHACK A GUEST</button>
  <div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="sparkle s3">✦</div>
  </section>; }

function GuestRoster({ onDone }) { return <section className="screen roster-screen"><div className="game-title-row"><span>PHASE 02 / ROLL CALL</span><span className="game-badge">CLASSIFIED</span></div><p className="eyebrow">THE SUSPECTS HAVE BEEN IDENTIFIED.</p><h2>PARTY CREW<br/><span className="purple-text">DATABASE.</span></h2><p className="section-copy">Five known agents. Zero known chill.</p>
  <div className="guest-grid">{guests.map((g, i) => <article className={`guest-card ${g.color}`} key={g.name} style={{ '--delay': `${i * 75}ms` }}><div className="guest-card-top"><span>AGENT_0{i + 1}</span><span className="guest-status">{g.status}</span></div><div className="guest-avatar">{g.avatar}</div><h3>{g.name}</h3><p className="guest-role">{g.role}</p><div className="guest-stat"><span>KNOWN DATA</span><b>{g.stat}</b></div></article>)}</div>
  <div className="roster-footer"><span><i className="led"/> ALL PARTY PERSONNEL HAVE BEEN IDENTIFIED.</span><button className="button button-primary" onClick={onDone}>PROCEED TO PARTY MODE <span>↗</span></button></div>
  </section>; }

function FinalParty({ confirmed, setConfirmed, restart, sound, setSound, motion, setMotion, toast }) {
  return <section className="screen final-screen"><Confetti count={52}/><div className="disco disco-a"/><div className="disco disco-b"/><div className="final-top"><span><i className="led"/> PARTY MODE: ACTIVE</span><span>SERVER LOAD <b>OVER 9000</b></span></div>
    <div className="final-content"><span className="final-eyebrow">★ END OF LINE // BEGINNING OF PARTY ★</span><div className="cake-bounce">🎂</div><h2>MISSION<br/><span>COMPLETE.</span></h2><p className="final-sub">NOW STOP PLAYING<br/>AND COME PARTY.</p><div className="final-details"><div><span>◷</span><p><small>WHEN</small><strong>TONIGHT — 8:30 PM</strong></p></div><div><span>⌖</span><p><small>WHERE</small><strong>CROSSING REPUBLIC — INDIAN ZAIKA</strong></p></div></div>
      <div className="final-guests"><span>YOUR PARTY SQUAD</span>{guests.map(g => <b key={g.name}>{g.name}</b>)}</div>
      {confirmed ? <div className="attendance-confirmed" role="status"><span>✓</span><p>ATTENDANCE CONFIRMED.<br/><small>WE EXPECT YOU ON THE DANCE FLOOR.</small></p></div> : <button className="button button-primary confirm-button" onClick={() => setConfirmed(true)}>I’M COMING <span>🎉</span></button>}
      <a className="button button-secondary maps-button" href="https://www.google.com/maps/search/?api=1&query=Crossing+Republic+Indian+Zaika" target="_blank" rel="noreferrer">SHOW LOCATION <span>📍</span></a>
      <div className="party-controls"><button onClick={() => setSound(v => !v)} aria-pressed={sound}>♫ SOUND: {sound ? 'ON' : 'OFF'}</button><button onClick={() => setMotion(v => !v)} aria-pressed={motion}>✧ ANIMATION: {motion ? 'ON' : 'OFF'}</button></div>
      <button className="button-link replay-link" onClick={restart}>↻ REPLAY THE EXPERIENCE</button>
    </div><div className="final-signature">BIRTHDAY.EXE <span>— THANKS FOR PLAYING</span></div>
  </section>;
}

function BonusArcade({ close }) {
  const [time, setTime] = useState(20), [score, setScore] = useState(0), [playing, setPlaying] = useState(false), [tile, setTile] = useState(random(5));
  const high = useRef(0);
  useEffect(() => { if (!playing) return; const timer = setInterval(() => setTime(v => { if (v <= 1) { setPlaying(false); return 0; } return v - 1; }), 1000); return () => clearInterval(timer); }, [playing]);
  useEffect(() => { if (score > high.current) high.current = score; }, [score]);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Whack a guest bonus game"><div className="bonus-modal"><button className="modal-close" onClick={close} aria-label="Close bonus arcade">×</button><span className="eyebrow">BONUS ROUND // OPTIONAL</span><h2>WHACK A GUEST</h2><p>They pop up. You tap. No grudges, please.</p><div className="bonus-stats"><span>TIME <b>00:{time.toString().padStart(2, '0')}</b></span><span>SCORE <b>{score}</b></span><span>BEST <b>{high.current}</b></span></div>
    {playing ? <div className="whack-grid">{Array.from({ length: 9 }, (_, i) => <button key={i} className={i === tile ? 'whack active' : 'whack'} onClick={() => { if (i === tile) { setScore(v => v + 1); setTile(random(9)); } }} aria-label={i === tile ? 'Whack guest' : 'Empty spot'}>{i === tile ? guests[random(guests.length)].avatar : ''}</button>)}</div> : <div className="bonus-end"><div>🕹️</div><strong>{time === 0 ? score >= 12 ? 'LEGENDARY BUTTON MASHER.' : score >= 5 ? 'THE GUESTS FEAR YOU.' : 'YOU HAVE TOO MUCH FREE TIME.' : 'READY TO CAUSE MILD CHAOS?'}</strong><button className="button button-primary" onClick={() => { setScore(0); setTime(20); setPlaying(true); setTile(random(9)); }}>{time === 0 ? 'PLAY AGAIN' : 'START 20 SECOND ROUND'}</button></div>}
    <button className="button-link" onClick={close}>BACK TO THE INVITATION</button></div></div>;
}

export default function App() {
  const [phase, setPhase] = useState(0), [game, setGame] = useState('intro'), [secret, setSecret] = useState(false), [confirmed, setConfirmed] = useState(false), [sound, setSound] = useState(false), [motion, setMotion] = useState(true), [bonus, setBonus] = useState(false), [reveal, setReveal] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0), [toast, setToast] = useState('');
  const progress = (next) => setPhase(next);
  const reset = () => { setPhase(0); setGame('intro'); setSecret(false); setConfirmed(false); setBonus(false); setReveal(false); setToast(''); setLogoClicks(0); };
  const nextToReaction = () => { setGame('reaction'); progress(2); };
  const nextToReveal = () => { setReveal(true); progress(3); };
  useEffect(() => { if (!reveal) return; const t = setTimeout(() => setReveal(false), 3200); return () => clearTimeout(t); }, [reveal]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2400); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { const combo = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let index = 0; const key = e => { if (e.key === combo[index] || e.key.toLowerCase() === combo[index]) index++; else index = 0; if (index === combo.length) { setToast('KONAMI MODE: +1 PARTY LIFE'); index = 0; } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, []);
  const beginFly = () => { setGame('fly'); progress(1); };
  const clickLogo = () => { setLogoClicks(v => { if (v >= 3) { setSecret(true); return 0; } return v + 1; }); };
  return <main className={motion ? '' : 'motion-off'}><div className="ambient-grid"/><div className="scanlines"/><div className="app-shell">
    <header className="site-header"><button className="brand" onClick={clickLogo} aria-label="Birthday.exe logo">B<span>.</span>EXE<small>PARTY SYSTEMS</small></button><div className="header-right"><span className="connection"><i/> CONNECTION SECURE</span><button className="restart-mini" onClick={reset}>↻ <span>RESTART</span></button></div></header>
    <PhaseProgress phase={phase}/>
    {phase === 0 && <BootScreen start={beginFly} secret={secret} showSecret={() => setSecret(true)}/>}
    {phase === 1 && (game === 'fly' ? <FlyGame onWin={nextToReaction}/> : <section className="screen win-screen"><Confetti/><div className="win-mark">✹</div><p className="eyebrow">TARGET ACQUIRED // 100 XP</p><h2>FLY <span className="lime-text">CAPTURED.</span></h2><p className="section-copy">30 seconds of your life have been sacrificed.<br/>Your dedication is questionable.</p><button className="button button-primary" onClick={nextToReaction}>CLAIM YOUR NEXT CHALLENGE <span>→</span></button></section>)}
    {phase === 2 && <ReactionGame onDone={nextToReveal}/>}
    {phase === 3 && (reveal ? <Reveal onDone={() => setReveal(false)}/> : <InvitationCard onAccept={() => progress(4)} onBonus={() => setBonus(true)}/>)}
    {phase === 4 && <GuestRoster onDone={() => progress(5)}/>}
    {phase === 5 && <FinalParty confirmed={confirmed} setConfirmed={setConfirmed} restart={reset} sound={sound} setSound={setSound} motion={motion} setMotion={setMotion} toast={toast}/>}
    {phase > 0 && phase < 5 && <button className="hidden-easter" onClick={() => setToast('PARTY SERVER OVERLOADED. TOO MANY GOOD VIBES.')}>SERVER STATUS: <span>STABLE</span></button>}
    {toast && <div className="toast" role="status">⚠ {toast}</div>}
    {bonus && <BonusArcade close={() => setBonus(false)}/>}
    <footer className="site-footer"><span>© BIRTHDAY.EXE <b>///</b> 2026</span><span>MADE OF 99% VIBES <b>●</b></span></footer>
  </div></main>;
}
