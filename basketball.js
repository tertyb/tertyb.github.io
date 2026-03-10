// ── Basketball Court ──────────────────────────────────────────────────────────

const BBALL_X = 50, BBALL_Z = 20;
let basketballScore = 0;

(function buildCourt() {
  // Court floor
  const courtTex = (() => {
    const c = document.createElement('canvas'); c.width=512; c.height=512;
    const ctx = c.getContext('2d');
    ctx.fillStyle='#c8732a'; ctx.fillRect(0,0,512,512);
    // Court lines
    ctx.strokeStyle='#fff'; ctx.lineWidth=6;
    ctx.strokeRect(20,20,472,472);
    // Half-court line
    ctx.beginPath(); ctx.moveTo(20,256); ctx.lineTo(492,256); ctx.stroke();
    // Center circle
    ctx.beginPath(); ctx.arc(256,256,60,0,Math.PI*2); ctx.stroke();
    // Key boxes
    [[20,160],[332,160]].forEach(([kx,kw])=>{
      ctx.strokeRect(kx,176,kw,160);
      ctx.beginPath(); ctx.arc(kx+kw/2,256,60,0,Math.PI*2); ctx.stroke();
    });
    // Three-point arcs
    ctx.beginPath(); ctx.arc(150,256,200,Math.PI*0.6,Math.PI*1.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(362,256,200,Math.PI*1.6,Math.PI*0.4); ctx.stroke();
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  })();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(28,16),
    new THREE.MeshLambertMaterial({ map: courtTex })
  );
  floor.rotation.x = -Math.PI/2;
  floor.position.set(BBALL_X, 0.03, BBALL_Z);
  floor.receiveShadow = true;
  scene.add(floor);

  // Boundary lines (white strips)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [[28.4,0.08,0.3,0],[0.3,0.08,16.4,0],[28.4,0.08,0.3,0],[0.3,0.08,16.4,0]].forEach(()=>{});

  // Make a hoop+backboard
  function makeHoop(side) {
    const hg = new THREE.Group();
    const poleMat   = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const boardMat  = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent:true, opacity:0.7 });
    const rimMat    = new THREE.MeshLambertMaterial({ color: 0xff4400 });
    const netMat    = new THREE.MeshLambertMaterial({ color: 0xeeeeee, wireframe:true });

    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,4.5,8), poleMat);
    pole.position.set(0,2.25,0); hg.add(pole);

    // Backboard
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.8,1.2,0.1), boardMat);
    board.position.set(0,4.5,0); hg.add(board);
    // Red square on board
    const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.5),
      new THREE.MeshBasicMaterial({ color:0xff2200 }));
    sq.position.set(0,4.45,0.06); hg.add(sq);

    // Arm extending to rim
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.9), poleMat);
    arm.position.set(0,4.2, side*0.45); hg.add(arm);

    // Rim (torus)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23,0.025,8,18), rimMat);
    rim.rotation.x = Math.PI/2;
    rim.position.set(0, 3.95, side*0.9);
    hg.add(rim);
    // Store rim world position on userData for scoring
    hg.userData.rimLocalZ = side*0.9;
    hg.userData.rimY = 3.95;

    // Net (simplified cone)
    const net = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.1,0.45,10,1,true), netMat);
    net.position.set(0, 3.7, side*0.9); hg.add(net);

    return hg;
  }

  const hoopL = makeHoop(-1);
  hoopL.position.set(BBALL_X - 13, 0, BBALL_Z);
  scene.add(hoopL);

  const hoopR = makeHoop(1);
  hoopR.position.set(BBALL_X + 13, 0, BBALL_Z);
  scene.add(hoopR);

  // Store hoop world positions for scoring check
  window._hoops = [
    { x: BBALL_X-13, y: 3.95, z: BBALL_Z - 0.9 },
    { x: BBALL_X+13, y: 3.95, z: BBALL_Z + 0.9 },
  ];

  // Bleachers (benches along sideline)
  const benchMat = new THREE.MeshLambertMaterial({ color: 0x8b5e3c });
  const metalMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
  [-1,1].forEach(side => {
    for (let r=0; r<3; r++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(14,0.18,0.5), benchMat);
      plank.position.set(BBALL_X, 0.4+r*0.55, BBALL_Z + side*(10+r*0.6));
      scene.add(plank);
    }
    // Support legs
    [-5,0,5].forEach(ox=>{
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12,1.4,0.8), metalMat);
      leg.position.set(BBALL_X+ox, 0.7, BBALL_Z + side*10.4);
      scene.add(leg);
    });
  });

  // Court lights (4 tall poles)
  const lightPoleMat = new THREE.MeshLambertMaterial({ color: 0x999999 });
  [[-12,-7],[12,-7],[-12,7],[12,7]].forEach(([lx,lz])=>{
    const lp = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,9,6), lightPoleMat);
    lp.position.set(BBALL_X+lx, 4.5, BBALL_Z+lz); scene.add(lp);
    const lb = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.2,1.0),
      new THREE.MeshLambertMaterial({ color:0xffffcc }));
    lb.position.set(BBALL_X+lx, 9.1, BBALL_Z+lz); scene.add(lb);
  });
})();

// ── Basketball ────────────────────────────────────────────────────────────────
const ballMat = new THREE.MeshLambertMaterial({ color: 0xe05500 });
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), ballMat);
ball.castShadow = true;
ball.position.set(BBALL_X, 0.25, BBALL_Z);
scene.add(ball);

// Seam lines on ball
const seamMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
[0, Math.PI/2].forEach(ry => {
  const seam = new THREE.Mesh(new THREE.TorusGeometry(0.24,0.012,4,20), seamMat);
  seam.rotation.y = ry; ball.add(seam);
});

// Score UI
const bballScoreEl = document.createElement('div');
bballScoreEl.style.cssText = [
  'position:fixed','top:16px','left:50%','transform:translateX(-50%)',
  'background:rgba(0,0,0,0.75)','color:#fff','font-size:18px','font-weight:bold',
  'padding:6px 20px','border-radius:20px','pointer-events:none','z-index:20',
  'display:none','font-family:Arial,sans-serif','border:2px solid #e05500',
].join(';');
bballScoreEl.textContent = '🏀 Basket: 0';
document.body.appendChild(bballScoreEl);

const bballHintEl = document.createElement('div');
bballHintEl.style.cssText = [
  'position:fixed','bottom:80px','left:50%','transform:translateX(-50%)',
  'background:rgba(0,0,0,0.7)','color:#fff','font-size:15px',
  'padding:5px 16px','border-radius:12px','pointer-events:none','z-index:20',
  'display:none','font-family:Arial,sans-serif',
].join(';');
bballHintEl.textContent = '[E] Shoot!';
document.body.appendChild(bballHintEl);

const swishEl = document.createElement('div');
swishEl.style.cssText = [
  'position:fixed','top:30%','left:50%','transform:translate(-50%,-50%)',
  'font-size:54px','font-weight:bold','color:#ff8800',
  'text-shadow:3px 3px 0 #fff,-3px -3px 0 #fff',
  'pointer-events:none','z-index:102','display:none','text-align:center',
  'font-family:Impact,Arial Black,sans-serif',
].join(';');
document.body.appendChild(swishEl);

// Ball state
let ballShot = false;
let ballProgress = 0;
let ballOrigin = null;
let ballTarget = null;
let ballOnGround = true;
let ballReturnTimer = 0;

function getNearestHoop() {
  let best = null, bestD = Infinity;
  for (const h of window._hoops) {
    const dx = player.position.x - h.x, dz = player.position.z - h.z;
    const d = Math.sqrt(dx*dx+dz*dz);
    if (d < bestD) { bestD=d; best=h; }
  }
  return best;
}

function shootBall() {
  if (ballShot) return;
  ballShot = true;
  ballOnGround = false;
  ballProgress = 0;
  ballOrigin = ball.position.clone();
  ballTarget = getNearestHoop();
}

// Listen for E key near ball
window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  if (ballOnGround) {
    const dx = player.position.x - ball.position.x;
    const dz = player.position.z - ball.position.z;
    if (Math.sqrt(dx*dx+dz*dz) < 3.0) shootBall();
  }
});

function updateBasketball(dt) {
  const onCourt = Math.abs(player.position.x - BBALL_X) < 18 &&
                  Math.abs(player.position.z - BBALL_Z) < 12;
  bballScoreEl.style.display = onCourt ? 'block' : 'none';

  // Bounce ball on ground
  if (ballOnGround) {
    ball.position.y = 0.25 + Math.abs(Math.sin(Date.now()*0.003))*0.12;
    ball.rotation.y += dt * 0.8;

    const dx = player.position.x - ball.position.x;
    const dz = player.position.z - ball.position.z;
    bballHintEl.style.display = (Math.sqrt(dx*dx+dz*dz) < 3.0) ? 'block' : 'none';
    return;
  }
  bballHintEl.style.display = 'none';

  // Fly toward hoop
  if (ballShot && ballTarget) {
    ballProgress += dt * 1.6;
    const t = Math.min(ballProgress, 1.0);
    ball.position.x = ballOrigin.x + (ballTarget.x - ballOrigin.x) * t;
    ball.position.z = ballOrigin.z + (ballTarget.z - ballOrigin.z) * t;
    ball.position.y = ballOrigin.y + Math.sin(t * Math.PI) * 5.0 + ballTarget.y * t;
    ball.rotation.x += dt * 8;

    if (t >= 1.0) {
      ballShot = false;
      // Check if scored (ball reached hoop)
      const dx = ball.position.x - ballTarget.x;
      const dz = ball.position.z - ballTarget.z;
      const scored = Math.sqrt(dx*dx+dz*dz) < 0.35;
      if (scored) {
        basketballScore++;
        bballScoreEl.textContent = `🏀 Basket: ${basketballScore}`;
        swishEl.innerHTML = basketballScore % 5 === 0
          ? `🔥 ON FIRE! ${basketballScore} pts!`
          : '🏀 SWISH!';
        swishEl.style.display = 'block';
        setTimeout(() => { swishEl.style.display = 'none'; }, 1500);
      }
      // Ball drops, then returns to court center after 2s
      ballReturnTimer = 2.0;
      ballOnGround = false;
    }
  }

  // Ball falling after hoop
  if (!ballShot && !ballOnGround) {
    ball.position.y = Math.max(0.25, ball.position.y - dt * 6);
    ballReturnTimer -= dt;
    if (ballReturnTimer <= 0) {
      ball.position.set(BBALL_X, 0.25, BBALL_Z);
      ballOnGround = true;
    }
  }
}
