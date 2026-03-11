// ── Helpers ───────────────────────────────────────────────────────────────────
function getNearestNPC(maxDist) {
  let best=null, bestD=maxDist;
  for (const npc of npcs) {
    const dx=player.position.x-npc.mesh.position.x, dz=player.position.z-npc.mesh.position.z;
    const d=Math.sqrt(dx*dx+dz*dz);
    if (d<bestD) { bestD=d; best=npc; }
  }
  return best;
}

function toScreen(worldPos) {
  const v = worldPos.clone().project(camera);
  return { x:(v.x*.5+.5)*window.innerWidth, y:(-v.y*.5+.5)*window.innerHeight, behind:v.z>1 };
}

// ── Bubble DOM ────────────────────────────────────────────────────────────────
const bubbleContainer = document.getElementById('bubble-container');
npcs.forEach(npc => {
  const div=document.createElement('div'); div.className='speech-bubble'; div.style.display='none';
  div.innerHTML=`<b>${npc.name}</b><br>${npc.dialogues[0].replace(/\n/g,'<br>')}`;
  bubbleContainer.appendChild(div); npc.bubbleEl=div;
  const hint=document.createElement('div'); hint.className='bubble-hint'; hint.style.display='none';
  hint.textContent='[E] Talk'; bubbleContainer.appendChild(hint); npc.hintEl=hint;
});

// ── Perfumes (collectibles) ────────────────────────────────────────────────────
// [x, z, message]  — one near each major location
const perfumeData = [
  [12,   -23,  'אני אוהב שאתה מצחיקה ויפה'],          // GDB — outside front entrance
  [148,    2,  'אני אוהב לקום איתך בבוקר'],            // Superpharm
  [2,   -243,  'אני אוהב לראות איתך סרטים'],           // חצי חינם parking
  [148,   64,  'אני אוהב את הריח שלך'],                // Jewelry store
  [-53,   77,  'אני אוהב את החיבוק שלך'],              // Grandpa & Grandma
  [30,   -99,  'אני אוהב להכין איתך אוכל'],            // Alegra & Leon
  [2,    114,  'אני אוהב לשתות איתך יין'],             // Military base
  [50,    22,  'אני אוהב את הצחוק היפה שלך'],          // Basketball court
  [-10,  -88,  'אני אוהב איך שאת גורמת לי להרגיש'],   // Big Ashdod
  [5,   1805,  'אני אוהב שאת בן אדם טוב'],             // Rome — last
];

const boneMeshes = [];
let score = 0;

// Perfume pickup message popup
const perfumeMsgEl = document.createElement('div');
perfumeMsgEl.style.cssText = [
  'position:fixed','top:28%','left:50%','transform:translate(-50%,-50%)',
  'font-size:26px','font-weight:bold','color:#fff',
  'background:linear-gradient(135deg,#c471ed,#f64f59)',
  'padding:14px 30px','border-radius:20px',
  'box-shadow:0 4px 24px rgba(196,113,237,0.5)',
  'pointer-events:none','z-index:120','display:none',
  'text-align:center','font-family:Arial,sans-serif',
  'border:2px solid #fff',
].join(';');
document.body.appendChild(perfumeMsgEl);

function showPerfumeMsg(msg) {
  perfumeMsgEl.textContent = '🌸 ' + msg;
  perfumeMsgEl.style.display = 'block';
  setTimeout(() => { perfumeMsgEl.style.display = 'none'; }, 3500);
}

// Build perfume bottle meshes
const bottleMat = new THREE.MeshLambertMaterial({ color: 0xe8c4e8 });
const capMat    = new THREE.MeshLambertMaterial({ color: 0xd4a017 });
const liquidMat = new THREE.MeshBasicMaterial({ color: 0xf5a0d0, transparent: true, opacity: 0.7 });

perfumeData.forEach(([x, z, msg]) => {
  const g = new THREE.Group();

  // Bottle body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.16), bottleMat);
  body.position.y = 0.24; g.add(body);

  // Liquid fill
  const liquid = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.36, 0.14), liquidMat);
  liquid.position.y = 0.20; g.add(liquid);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.14, 8), bottleMat);
  neck.position.y = 0.55; g.add(neck);

  // Cap
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 8), capMat);
  cap.position.y = 0.67; g.add(cap);

  // Nozzle
  const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), capMat);
  nozzle.position.set(0.08, 0.72, 0); g.add(nozzle);

  g.position.set(x, 0.3, z);
  g.userData.collected = false;
  g.userData.message = msg;
  scene.add(g);
  boneMeshes.push(g);
});

// ── Perfume guide compass ──────────────────────────────────────────────────────
const perfumeGuideEl = document.createElement('div');
perfumeGuideEl.style.cssText = [
  'position:fixed','bottom:28px','left:50%','transform:translateX(-50%)',
  'display:flex','flex-direction:column','align-items:center','gap:5px',
  'pointer-events:none','z-index:30',
].join(';');
perfumeGuideEl.innerHTML = `
  <div id="perfume-dist" style="font-size:13px;color:#fff;background:rgba(0,0,0,0.65);
    padding:3px 12px;border-radius:10px;font-family:Arial,sans-serif;font-weight:bold;
    border:1px solid #d4a0d4;"></div>
  <div style="width:52px;height:52px;background:rgba(0,0,0,0.6);border-radius:50%;
    border:2px solid #d4a0d4;display:flex;align-items:center;justify-content:center;overflow:hidden;">
    <div id="perfume-arrow" style="font-size:30px;line-height:1;display:block;
      transform-origin:center center;">⬆</div>
  </div>
  <div id="perfume-guide-label" style="font-size:12px;color:#e8b4e8;font-family:Arial,sans-serif;
    text-shadow:0 1px 3px #000;">🌸 הבושם הבא</div>
`;
document.body.appendChild(perfumeGuideEl);

// ── Win screen ─────────────────────────────────────────────────────────────────
const winStyle = document.createElement('style');
winStyle.textContent = `
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
  }
  @keyframes winBounce {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
`;
document.head.appendChild(winStyle);

const winScreenEl = document.createElement('div');
winScreenEl.style.cssText = [
  'position:fixed','top:0','left:0','width:100%','height:100%',
  'background:linear-gradient(135deg,rgba(0,0,0,0.93),rgba(40,0,70,0.96))',
  'display:none','flex-direction:column',
  'align-items:center','justify-content:center',
  'z-index:200','font-family:Arial,sans-serif',
  'animation:winBounce 2.5s infinite',
].join(';');
winScreenEl.innerHTML = `
  <div style="font-size:90px;margin-bottom:14px;">🎉</div>
  <div style="font-size:44px;color:#ffd700;font-weight:bold;text-align:center;
    margin-bottom:14px;text-shadow:0 0 24px #ffd700;">המשחק הסתיים!</div>
  <div style="font-size:28px;color:#fff;text-align:center;line-height:1.8;
    margin-bottom:28px;max-width:520px;padding:0 24px;">
    זה אני סנופ,<br>אני אוהב אותך הכי בעולם 💕
  </div>
  <div style="font-size:54px;letter-spacing:8px;">🌸💕🎆💕🌸</div>
`;
document.body.appendChild(winScreenEl);

function showGameComplete() {
  // Confetti burst
  const cols = ['#ff6b6b','#ffd700','#a0e4ff','#ff9ff3','#54a0ff','#ff9f43','#00d2d3','#ffffff'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div');
    const sz = 8 + Math.random() * 14;
    c.style.cssText = [
      'position:fixed',
      `left:${Math.random() * 100}%`,
      `top:${-10 - Math.random() * 80}px`,
      `width:${sz}px`,
      `height:${sz * (0.4 + Math.random() * 0.6)}px`,
      `background:${cols[Math.floor(Math.random() * cols.length)]}`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '3px'}`,
      `animation:confettiFall ${2.5 + Math.random() * 3}s ${Math.random() * 2.5}s linear forwards`,
      'z-index:201','pointer-events:none',
    ].join(';');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 8000);
  }
  winScreenEl.style.display = 'flex';
  setTimeout(() => { winScreenEl.style.display = 'none'; }, 10000);
}
window._showGameComplete = showGameComplete;


