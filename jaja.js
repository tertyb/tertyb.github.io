// ── Jaja Restaurant ───────────────────────────────────────────────────────────

// ── Building ──────────────────────────────────────────────────────────────────
const JAJA_X = -5, JAJA_Z = -30;

(function buildJaja() {
  const g = new THREE.Group();

  // Main building body — warm cream/terracotta
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xf2d4a0 });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0xcc3300 });
  const trimMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(9, 7, 8), wallMat);
  body.position.y = 3.5; body.castShadow = true; body.receiveShadow = true; g.add(body);

  // Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3, 4), roofMat);
  roof.rotation.y = Math.PI / 4; roof.position.y = 8.5; roof.castShadow = true; g.add(roof);

  // Decorative trim strip
  const trim = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.3, 8.1), trimMat);
  trim.position.y = 7.0; g.add(trim);

  // Windows
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xffeeaa, transparent: true, opacity: 0.85 });
  const winPositions = [[-2.8, 4.5, 4.02], [2.8, 4.5, 4.02], [-2.8, 2.2, 4.02], [2.8, 2.2, 4.02]];
  winPositions.forEach(([wx, wy, wz]) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), glassMat);
    win.position.set(wx, wy, wz); g.add(win);
  });

  // Door frame
  const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0x5c3310 });
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.2, 0.22), doorFrameMat);
  doorFrame.position.set(0, 1.6, 4.12); g.add(doorFrame);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x8b2500 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 0.15), doorMat);
  door.position.set(0, 1.5, 4.2); g.add(door);

  // Awning above door
  const awningMat = new THREE.MeshLambertMaterial({ color: 0xee2200 });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 1.4), awningMat);
  awning.position.set(0, 3.3, 4.7); awning.castShadow = true; g.add(awning);
  // Awning fringe poles
  [-1.6, 1.6].forEach(px => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 5), trimMat);
    pole.position.set(px, 2.98, 5.3); g.add(pole);
  });

  // Outdoor seating — 2 tables
  const tableMat = new THREE.MeshLambertMaterial({ color: 0xf5deb3 });
  const chairMat = new THREE.MeshLambertMaterial({ color: 0xcc6622 });
  [[-3.5, 5.8], [3.5, 5.8]].forEach(([tx, tz]) => {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 8), tableMat);
    table.position.set(tx, 0.75, tz); g.add(table);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 5), trimMat);
    leg.position.set(tx, 0.38, tz); g.add(leg);
    // Chairs around table
    [[0.8,0],[-0.8,0],[0,0.8],[0,-0.8]].forEach(([cx,cz]) => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.06,0.4), chairMat);
      seat.position.set(tx+cx, 0.55, tz+cz); g.add(seat);
      const cleg = new THREE.Mesh(new THREE.BoxGeometry(0.06,0.55,0.06), chairMat);
      cleg.position.set(tx+cx, 0.27, tz+cz); g.add(cleg);
    });
  });

  g.position.set(JAJA_X, 0, JAJA_Z);
  scene.add(g);

  // Collider
  colliders.push({ x: JAJA_X, z: JAJA_Z, radius: 5.5 });
})();

// ── Big JAJA Sign ─────────────────────────────────────────────────────────────
(function makeJajaSign() {
  // Canvas texture for sign face
  const c = document.createElement('canvas');
  c.width = 512; c.height = 192;
  const ctx = c.getContext('2d');

  // Background — deep red
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(0, 0, 512, 192);

  // Yellow border
  ctx.strokeStyle = '#ffdd00';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 500, 180);

  // Inner border dots
  ctx.fillStyle = '#ffdd00';
  for (let i = 30; i < 512; i += 30) {
    ctx.beginPath(); ctx.arc(i, 20, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(i, 172, 5, 0, Math.PI*2); ctx.fill();
  }

  // "JAJA" text
  ctx.font = 'bold 130px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffdd00';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 5;
  ctx.fillText('JAJA', 256, 96);

  // Small subtitle
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.shadowBlur = 4; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
  ctx.fillText('🍝  Finest Pasta  🍝', 256, 165);

  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;

  // Sign board
  const signGroup = new THREE.Group();
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(6.0, 2.3, 0.18),
    new THREE.MeshLambertMaterial({ map: tex })
  );
  board.position.set(0, 0, 0); signGroup.add(board);

  // Glow border frame
  const frameMat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
  const frameH = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.22, 0.22), frameMat);
  [0.95, -0.95].forEach(fy => { const f = frameH.clone(); f.position.y = fy; signGroup.add(f); });
  const frameV = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.52, 0.22), frameMat);
  [-2.95, 2.95].forEach(fx => { const f = frameV.clone(); f.position.x = fx; signGroup.add(f); });

  // Two support poles
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  [-2.0, 2.0].forEach(px => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 6), poleMat);
    pole.position.set(px, -3.2, 0); signGroup.add(pole);
  });

  // Position: in front of restaurant, elevated
  signGroup.position.set(JAJA_X, 12.0, JAJA_Z + 7.5);
  scene.add(signGroup);

  // Animate gentle rotation/bob stored on object
  signGroup.userData.isJajaSign = true;
  window._jajaSign = signGroup;
})();

// ── Pasta Throw ───────────────────────────────────────────────────────────────
const JAJA_DOOR = { x: JAJA_X, z: JAJA_Z + 4.2 };
let pastaThrown = false;
let pastaActive = false;
let pastaMesh = null;
let pastaProgress = 0;
let pastaOrigin = null;

// Splat overlay
const splatEl = document.createElement('div');
splatEl.style.cssText = [
  'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
  'pointer-events:none', 'z-index:100', 'display:none',
  'background:radial-gradient(ellipse at center, rgba(255,240,180,0.92) 0%, rgba(255,220,100,0.7) 40%, transparent 70%)',
  'transition:opacity 0.4s',
].join(';');
document.body.appendChild(splatEl);

const splatText = document.createElement('div');
splatText.style.cssText = [
  'position:fixed', 'top:38%', 'left:50%', 'transform:translate(-50%,-50%)',
  'font-size:42px', 'font-weight:bold', 'color:#8b2500',
  'text-shadow:2px 2px 0 #fff, -2px -2px 0 #fff',
  'pointer-events:none', 'z-index:101', 'display:none', 'text-align:center',
  'font-family:Impact,Arial Black,sans-serif', 'letter-spacing:4px',
].join(';');
splatText.innerHTML = '🍝 JAJA! 🍝<br><span style="font-size:20px;letter-spacing:1px">Have some pasta!</span>';
document.body.appendChild(splatText);

function makePastaMesh() {
  const g = new THREE.Group();
  // Plate
  const plateMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.4, 0.08, 12), plateMat);
  plate.position.y = 0; g.add(plate);
  // Pasta pile (cream colored noodle blobs)
  const pastaMat = new THREE.MeshLambertMaterial({ color: 0xf5e090 });
  const creamMat = new THREE.MeshLambertMaterial({ color: 0xfffde0 });
  for (let i = 0; i < 6; i++) {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.14 + Math.random()*0.08, 6, 4), pastaMat);
    const ang = (i / 6) * Math.PI * 2;
    blob.position.set(Math.cos(ang)*0.2, 0.1 + Math.random()*0.1, Math.sin(ang)*0.2);
    g.add(blob);
  }
  // Cream splash on top
  const cream = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 5), creamMat);
  cream.scale.y = 0.45; cream.position.y = 0.2; g.add(cream);
  // Small garnish (green herb)
  const herbMat = new THREE.MeshLambertMaterial({ color: 0x44aa22 });
  const herb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), herbMat);
  herb.position.set(0.05, 0.35, 0.05); g.add(herb);
  return g;
}

function throwPasta() {
  if (pastaActive) return;
  pastaActive = true;
  pastaThrown = true;
  pastaProgress = 0;

  pastaMesh = makePastaMesh();
  pastaOrigin = new THREE.Vector3(JAJA_X, 2.5, JAJA_Z + 4.0);
  pastaMesh.position.copy(pastaOrigin);
  scene.add(pastaMesh);
}

function updateJaja(dt) {
  // Gently bob the sign
  if (window._jajaSign) {
    window._jajaSign.rotation.y = Math.sin(Date.now() * 0.0008) * 0.06;
    window._jajaSign.position.y = 12.0 + Math.sin(Date.now() * 0.0012) * 0.18;
  }

  // Proximity check — trigger once per visit
  if (!pastaThrown) {
    const dx = player.position.x - JAJA_DOOR.x;
    const dz = player.position.z - JAJA_DOOR.z;
    if (Math.sqrt(dx*dx + dz*dz) < 3.5) {
      throwPasta();
    }
  }

  // Animate flying pasta
  if (pastaActive && pastaMesh) {
    pastaProgress += dt * 1.4;
    const t = Math.min(pastaProgress, 1.0);

    // Arc from door to player
    const tx = player.position.x;
    const tz = player.position.z;
    pastaMesh.position.x = pastaOrigin.x + (tx - pastaOrigin.x) * t;
    pastaMesh.position.z = pastaOrigin.z + (tz - pastaOrigin.z) * t;
    // Parabolic arc — rises then falls
    pastaMesh.position.y = pastaOrigin.y + Math.sin(t * Math.PI) * 4.0;
    pastaMesh.rotation.x += dt * 4;
    pastaMesh.rotation.z += dt * 3;

    if (t >= 1.0) {
      // Pasta lands on player — splat!
      scene.remove(pastaMesh);
      pastaMesh = null;
      pastaActive = false;

      // Show splat overlay
      splatEl.style.display = 'block';
      splatEl.style.opacity = '1';
      splatText.style.display = 'block';
      setTimeout(() => {
        splatEl.style.opacity = '0';
        setTimeout(() => {
          splatEl.style.display = 'none';
          splatText.style.display = 'none';
          // Allow throw again after 12 seconds
          setTimeout(() => { pastaThrown = false; }, 12000);
        }, 450);
      }, 2200);
    }
  }
}
