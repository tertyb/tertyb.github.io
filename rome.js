// ── Rome / Roma ───────────────────────────────────────────────────────────────
// Far north of the main town — only reachable by plane!
// Center: (0, 0, 1800)

const ROME_CX = 0, ROME_CZ = 1800;

// ── Ground ────────────────────────────────────────────────────────────────────
(function buildRomeGround() {
  // Large stone plaza
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 320),
    new THREE.MeshLambertMaterial({ color: 0xd4c5a9 })); // warm sandstone
  ground.rotation.x = -Math.PI/2;
  ground.position.set(ROME_CX, 0.0, ROME_CZ);
  scene.add(ground);

  // Cobblestone grid lines
  const lineMat = new THREE.MeshLambertMaterial({ color: 0xb0a090 });
  for (let i = -150; i <= 150; i += 6) {
    const lx = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 300), lineMat);
    lx.rotation.x = -Math.PI/2; lx.position.set(ROME_CX + i, 0.005, ROME_CZ); scene.add(lx);
    const lz = new THREE.Mesh(new THREE.PlaneGeometry(300, 0.15), lineMat);
    lz.rotation.x = -Math.PI/2; lz.position.set(ROME_CX, 0.005, ROME_CZ + i); scene.add(lz);
  }

  // Subtle warm accent — global scene lights already illuminate Rome
  const sunLight = new THREE.PointLight(0xffd090, 0.4, 500);
  sunLight.position.set(ROME_CX, 80, ROME_CZ); scene.add(sunLight);
})();

// ── Landing Strip ─────────────────────────────────────────────────────────────
const ROME_RUNWAY_Z = ROME_CZ - 80;
(function buildRomeRunway() {
  // Asphalt
  const rw = new THREE.Mesh(new THREE.PlaneGeometry(8, 70),
    new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
  rw.rotation.x = -Math.PI/2;
  rw.position.set(ROME_CX, 0.03, ROME_RUNWAY_Z); scene.add(rw);

  // Center dashes
  const wm = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = -30; i <= 30; i += 6) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 3), wm);
    d.rotation.x = -Math.PI/2; d.position.set(ROME_CX, 0.04, ROME_RUNWAY_Z + i); scene.add(d);
  }

  // Edge lights
  const lm = new THREE.MeshLambertMaterial({ color: 0xffee44 });
  for (let i = -30; i <= 30; i += 5) {
    [-4.2, 4.2].forEach(lx => {
      const l = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 5), lm);
      l.position.set(ROME_CX + lx, 0.15, ROME_RUNWAY_Z + i); scene.add(l);
    });
  }

  // "ROMA" runway threshold text
  const rtC = document.createElement('canvas'); rtC.width = 256; rtC.height = 64;
  const rctx = rtC.getContext('2d');
  rctx.fillStyle = '#2a2a2a'; rctx.fillRect(0, 0, 256, 64);
  rctx.fillStyle = '#ffffff'; rctx.font = 'bold 44px Arial'; rctx.textAlign = 'center';
  rctx.fillText('ROMA', 128, 48);
  const rtMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(rtC), transparent: true }));
  rtMesh.rotation.x = -Math.PI/2;
  rtMesh.position.set(ROME_CX, 0.05, ROME_RUNWAY_Z - 32); scene.add(rtMesh);
})();

// ── Welcome Arch (City Gate) ──────────────────────────────────────────────────
(function buildCityGate() {
  const stone = new THREE.MeshLambertMaterial({ color: 0xe8c878 });
  const dark  = new THREE.MeshLambertMaterial({ color: 0x8a5c20 });

  // Two main pillars
  [-8, 8].forEach(ox => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 3.5), stone);
    pillar.position.set(ROME_CX + ox, 6, ROME_CZ - 52); scene.add(pillar);
    colliders.push({ x: ROME_CX + ox, z: ROME_CZ - 52, radius: 3 });
  });
  // Top beam
  const beam = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 3.5), stone);
  beam.position.set(ROME_CX, 13.5, ROME_CZ - 52); scene.add(beam);
  // Attic section
  const attic = new THREE.Mesh(new THREE.BoxGeometry(22, 4.5, 3), stone);
  attic.position.set(ROME_CX, 17.2, ROME_CZ - 52); scene.add(attic);
  // Arch cutout (decorative dark panel)
  const archPanel = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 0.6), dark);
  archPanel.position.set(ROME_CX, 9, ROME_CZ - 51.8); scene.add(archPanel);
  // Top decorative blocks
  [-8, -3, 3, 8].forEach(ox => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.5, 3.5), stone);
    block.position.set(ROME_CX + ox, 20, ROME_CZ - 52); scene.add(block);
  });

  // "S P Q R" inscription on arch
  const insC = document.createElement('canvas'); insC.width = 256; insC.height = 64;
  const ictx = insC.getContext('2d');
  ictx.fillStyle = '#c8b490'; ictx.fillRect(0, 0, 256, 64);
  ictx.fillStyle = '#3a2800'; ictx.font = 'bold 36px Georgia,serif'; ictx.textAlign = 'center';
  ictx.fillText('S · P · Q · R', 128, 46);
  const insMesh = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(insC), transparent: true }));
  insMesh.position.set(ROME_CX, 17.5, ROME_CZ - 51.5); scene.add(insMesh);
})();

// ── Colosseum ─────────────────────────────────────────────────────────────────
(function buildColosseum() {
  const CX = ROME_CX - 55, CZ = ROME_CZ + 10;
  const stone = new THREE.MeshLambertMaterial({ color: 0xf0a040 });
  const dark  = new THREE.MeshLambertMaterial({ color: 0x7a3a10 });
  const innerMat = new THREE.MeshLambertMaterial({ color: 0x5a3010 });

  const NUM_PIERS = 24;
  const R1 = 22, R2 = 16;

  for (let tier = 0; tier < 3; tier++) {
    const y = tier * 4.5;
    const r = R1 - tier * 0.5;

    for (let i = 0; i < NUM_PIERS; i++) {
      const a = (i / NUM_PIERS) * Math.PI * 2;
      const an = ((i + 1) / NUM_PIERS) * Math.PI * 2;

      // Outer arch pillar
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4, 1.8), stone);
      pillar.position.set(CX + Math.cos(a) * r, y + 2, CZ + Math.sin(a) * r);
      scene.add(pillar);

      // Connecting wall segment between pillars
      const mx = (Math.cos(a) + Math.cos(an)) / 2 * r;
      const mz = (Math.sin(a) + Math.sin(an)) / 2 * r;
      const segLen = 2 * r * Math.sin(Math.PI / NUM_PIERS);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(segLen * 0.65, 3.2, 0.8), stone);
      wall.position.set(CX + mx, y + 1.6, CZ + mz);
      wall.rotation.y = a + Math.PI / 2;
      scene.add(wall);

      // Arch opening (dark panel)
      if (tier < 2) {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(segLen * 0.45, 2.4, 0.6), dark);
        arch.position.set(CX + mx, y + 1.2, CZ + mz);
        arch.rotation.y = a + Math.PI / 2;
        scene.add(arch);
      }

      if (tier === 0) colliders.push({ x: CX + Math.cos(a) * r, z: CZ + Math.sin(a) * r, radius: 2 });
    }

    // Top rim band
    for (let i = 0; i < NUM_PIERS; i++) {
      const a = (i / NUM_PIERS) * Math.PI * 2;
      const rim = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), stone);
      rim.position.set(CX + Math.cos(a) * r, y + 4.3, CZ + Math.sin(a) * r);
      scene.add(rim);
    }
  }

  // Inner floor (arena sand)
  const arena = new THREE.Mesh(new THREE.CylinderGeometry(R2 - 2, R2 - 2, 0.3, 24),
    new THREE.MeshLambertMaterial({ color: 0xe8c87a }));
  arena.position.set(CX, 0.15, CZ); scene.add(arena);

  // Inner wall ring
  const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(R2, R2, 5, 24, 1, true),
    innerMat);
  innerWall.position.set(CX, 2.5, CZ); scene.add(innerWall);

  // "Colosseo" sign
  const colC = document.createElement('canvas'); colC.width = 256; colC.height = 64;
  const cctx = colC.getContext('2d');
  cctx.fillStyle = '#d4b896'; cctx.fillRect(0, 0, 256, 64);
  cctx.fillStyle = '#3a2800'; cctx.font = 'bold 34px Georgia,serif'; cctx.textAlign = 'center';
  cctx.fillText('🏟 Colosseo', 128, 44);
  const colSign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(colC), transparent: true }));
  colSign.position.set(CX, 14.5, CZ + R1 + 1); scene.add(colSign);
})();

// ── Snoopy — inside the Colosseum ─────────────────────────────────────────────
const GEORGE_X = ROME_CX - 55, GEORGE_Z = ROME_CZ + 10;
window._snoopyRomePos = { x: GEORGE_X, z: GEORGE_Z };
(function buildGeorge() {
  const g = new THREE.Group();
  const furM  = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Snoopy white
  const darkM = new THREE.MeshLambertMaterial({ color: 0x111111 }); // black ears
  const noseM = new THREE.MeshLambertMaterial({ color: 0x1a0800 });
  const eyeM  = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.85), furM);
  body.position.y = 0.42; g.add(body);
  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.42, 0.42), furM);
  head.position.set(0, 0.72, 0.42); g.add(head);
  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.22), furM);
  snout.position.set(0, 0.66, 0.62); g.add(snout);
  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 4), noseM);
  nose.position.set(0, 0.73, 0.73); g.add(nose);
  // Eyes
  [-0.13, 0.13].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), eyeM);
    eye.position.set(ex, 0.8, 0.62); g.add(eye);
  });
  // Floppy ears
  [-0.26, 0.26].forEach(ex => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.08), darkM);
    ear.position.set(ex, 0.62, 0.36); g.add(ear);
  });
  // Tail (wagging)
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.38, 6), furM);
  tail.rotation.z = Math.PI / 4;
  tail.position.set(0, 0.7, -0.46);
  g.add(tail);
  g.userData.tail = tail;
  // Legs
  [[-0.2, 0, 0.28],[0.2, 0, 0.28],[-0.2, 0, -0.22],[0.2, 0, -0.22]].forEach(([lx,,lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.14), furM);
    leg.position.set(lx, 0.19, lz); g.add(leg);
  });

  g.position.set(GEORGE_X, 0, GEORGE_Z);
  scene.add(g);
  window._georgeMesh = g;

  const hintEl = document.createElement('div');
  hintEl.className = 'bubble-hint'; hintEl.style.display = 'none';
  hintEl.textContent = '[E] Talk';
  document.getElementById('bubble-container').appendChild(hintEl);

  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'speech-bubble'; bubbleEl.style.display = 'none';
  document.getElementById('bubble-container').appendChild(bubbleEl);

  npcs.push({
    mesh: g, name: 'סנופ',
    homePos: { x: GEORGE_X, z: GEORGE_Z },
    walkTarget: null, walkWait: 99, talkVisible: false, dialogueIdx: 0,
    dialogues: [
      '🐾 זה אני סנופ,<br>אני אוהב אותך הכי בעולם 💕',
    ],
    hintEl,
    bubbleEl,
  });
})();

// ── Fireworks system ──────────────────────────────────────────────────────────
const fireworks = [];
let fireworksActive = false;
let fireworksTimer = 0;
let fireworksSpawnTimer = 0;

function spawnFirework() {
  const colors = [0xff2244, 0xffcc00, 0x44eeff, 0xff88ff, 0x88ff44, 0xff6600, 0xffffff, 0xff99ff, 0x00ffcc];
  // Spawn 3 simultaneous bursts per call for a dense show
  for (let b = 0; b < 3; b++) {
    const fx = GEORGE_X + (Math.random() - 0.5) * 90;
    const fz = GEORGE_Z + (Math.random() - 0.5) * 90;
    const fy = 40 + Math.random() * 35;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const mat = new THREE.MeshBasicMaterial({ color });
    const particles = [];
    const numP = 40 + Math.floor(Math.random() * 20);
    const pSize = 0.28 + Math.random() * 0.2;
    for (let i = 0; i < numP; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(pSize, 4, 3), mat);
      p.position.set(fx, fy, fz);
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.random() * Math.PI;
      const spd = 7 + Math.random() * 14;
      p.userData.vel = new THREE.Vector3(
        Math.sin(φ) * Math.cos(θ) * spd,
        Math.cos(φ) * spd * 0.7,
        Math.sin(φ) * Math.sin(θ) * spd
      );
      scene.add(p);
      particles.push(p);
    }
    fireworks.push({ particles, life: 2.2 });
  }
}

// E near Snoopy — fireworks always; game complete when all perfumes collected
window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  const dx = player.position.x - GEORGE_X, dz = player.position.z - GEORGE_Z;
  if (Math.sqrt(dx*dx + dz*dz) < 5) {
    fireworksActive = true;
    fireworksTimer = 30.0;
    fireworksSpawnTimer = 0;
    if (score >= 10) {
      setTimeout(() => window._showGameComplete && window._showGameComplete(), 2800);
    }
  }
});

// ── Pantheon ──────────────────────────────────────────────────────────────────
(function buildPantheon() {
  const PX = ROME_CX + 55, PZ = ROME_CZ;
  const stone = new THREE.MeshLambertMaterial({ color: 0xf5d078 });
  const domeM = new THREE.MeshLambertMaterial({ color: 0xd0a050 });
  const dark  = new THREE.MeshLambertMaterial({ color: 0x7a4010 });

  // Rotunda body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 10, 20, 1, true), stone);
  body.position.set(PX, 5, PZ); scene.add(body);

  // Floor disk
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.3, 20), stone);
  floor.position.set(PX, 0.15, PZ); scene.add(floor);

  // Dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(13, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), domeM);
  dome.position.set(PX, 10, PZ); scene.add(dome);

  // Oculus (opening at dome top)
  const oculus = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.5, 12),
    new THREE.MeshBasicMaterial({ color: 0x88bbff, transparent: true, opacity: 0.6 }));
  oculus.position.set(PX, 22.5, PZ); scene.add(oculus);

  // Portico (front porch) columns — 8 columns
  for (let i = 0; i < 8; i++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 9, 10), stone);
    col.position.set(PX - 10 + i * 2.8, 4.5, PZ - 14);
    scene.add(col);
    // Capital (top of column)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.8), stone);
    cap.position.set(PX - 10 + i * 2.8, 9.3, PZ - 14); scene.add(cap);
  }
  // Portico entablature
  const entab = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 2.5), stone);
  entab.position.set(PX - 0.5, 9.9, PZ - 14); scene.add(entab);
  // Triangular pediment
  const pedC = document.createElement('canvas'); pedC.width = 512; pedC.height = 128;
  const pctx = pedC.getContext('2d');
  pctx.fillStyle = '#c8b490'; pctx.fillRect(0, 0, 512, 128);
  pctx.fillStyle = '#3a2800'; pctx.font = 'bold 28px Georgia,serif'; pctx.textAlign = 'center';
  pctx.fillText('M · AGRIPPA · L · F · COS · III · FECIT', 256, 80);
  const pedSign = new THREE.Mesh(new THREE.PlaneGeometry(20, 2.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pedC), transparent: true }));
  pedSign.position.set(PX - 0.5, 10.5, PZ - 13); scene.add(pedSign);

  // Pantheon door
  const door = new THREE.Mesh(new THREE.BoxGeometry(3.5, 7, 0.6), dark);
  door.position.set(PX, 3.5, PZ - 13.2); scene.add(door);

  // Interior light
  const pLight = new THREE.PointLight(0xfff5e0, 2.0, 30);
  pLight.position.set(PX, 18, PZ); scene.add(pLight);

  // Colliders
  colliders.push({ x: PX, z: PZ, radius: 14 });
})();

// ── Roman Forum Columns ───────────────────────────────────────────────────────
(function buildForum() {
  const stone = new THREE.MeshLambertMaterial({ color: 0xf0d898 });
  const base  = new THREE.MeshLambertMaterial({ color: 0xd09848 });

  // Two rows of columns along the main road
  const colPositions = [];
  for (let i = 0; i < 6; i++) {
    colPositions.push([-20, ROME_CZ - 30 + i * 12]);
    colPositions.push([ 20, ROME_CZ - 30 + i * 12]);
  }
  colPositions.forEach(([cx, cz]) => {
    // Base pedestal
    const ped = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.2), base);
    ped.position.set(ROME_CX + cx, 0.6, cz); scene.add(ped);
    // Column shaft
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 9, 10), stone);
    col.position.set(ROME_CX + cx, 5.7, cz); scene.add(col);
    // Capital
    const cap = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 2.0), stone);
    cap.position.set(ROME_CX + cx, 10.5, cz); scene.add(cap);

    colliders.push({ x: ROME_CX + cx, z: cz, radius: 1.5 });
  });
})();

// ── Central Fountain ──────────────────────────────────────────────────────────
(function buildFountain() {
  const FX = ROME_CX, FZ = ROME_CZ + 30;
  const stone = new THREE.MeshLambertMaterial({ color: 0xe8b860 });
  const water = new THREE.MeshLambertMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.8 });

  // Basin
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 0.9, 20), stone);
  basin.position.set(FX, 0.45, FZ); scene.add(basin);
  // Water surface
  const wSurf = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.1, 20), water);
  wSurf.position.set(FX, 0.85, FZ); scene.add(wSurf);
  // Center pillar
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.5, 10), stone);
  pillar.position.set(FX, 1.75, FZ); scene.add(pillar);
  // Top bowl
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.0, 0.5, 14), stone);
  bowl.position.set(FX, 3.7, FZ); scene.add(bowl);
  // Water light
  const wLight = new THREE.PointLight(0x88ddff, 1.2, 14);
  wLight.position.set(FX, 2.5, FZ); scene.add(wLight);
  colliders.push({ x: FX, z: FZ, radius: 5 });
})();

// ── Roman Buildings (houses/temples) ─────────────────────────────────────────
(function buildRomanBuildings() {
  const stone = new THREE.MeshLambertMaterial({ color: 0xe87840 }); // warm terracotta orange — clearly visible
  const roof  = new THREE.MeshLambertMaterial({ color: 0xaa2200 }); // deep red roof
  const door  = new THREE.MeshLambertMaterial({ color: 0x3a1800 });

  const buildings = [
    { x: -35, z: ROME_CZ - 30, w: 16, h: 7, d: 12 },
    { x:  40, z: ROME_CZ - 35, w: 14, h: 8, d: 12 },
    { x: -60, z: ROME_CZ + 40, w: 18, h: 6, d: 14 },
    { x:  60, z: ROME_CZ + 45, w: 15, h: 7, d: 12 },
    { x:  -5, z: ROME_CZ + 65, w: 20, h: 9, d: 16 },
    { x:  30, z: ROME_CZ + 70, w: 12, h: 6, d: 10 },
    { x: -40, z: ROME_CZ + 70, w: 14, h: 7, d: 12 },
  ];

  buildings.forEach(({ x, z, w, h, d }) => {
    const bx = ROME_CX + x;
    // Walls
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stone);
    wall.position.set(bx, h / 2, z); scene.add(wall);
    // Terracotta roof (hip roof using 2 wedges)
    const rw = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 1.5, d + 0.5), roof);
    rw.position.set(bx, h + 0.75, z); scene.add(rw);
    // Door
    const dMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 0.3), door);
    dMesh.position.set(bx, 1.25, z - d / 2); scene.add(dMesh);
    // Windows
    [-w/4, w/4].forEach(wx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.3),
        new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.7 }));
      win.position.set(bx + wx, h * 0.55, z - d / 2); scene.add(win);
    });
    colliders.push({ x: bx, z, radius: Math.max(w, d) / 2 + 1 });
  });
})();

// ── Welcome Sign ──────────────────────────────────────────────────────────────
(function buildWelcomeSign() {
  // Two posts
  [-3.5, 3.5].forEach(ox => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0x8a6a40 }));
    post.position.set(ROME_CX + ox, 4, ROME_CZ - 62); scene.add(post);
  });
  // Board
  const board = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x8b1a1a }));
  board.position.set(ROME_CX, 7, ROME_CZ - 62); scene.add(board);

  const wC = document.createElement('canvas'); wC.width = 512; wC.height = 192;
  const wctx = wC.getContext('2d');
  wctx.fillStyle = '#8b1a1a'; wctx.fillRect(0, 0, 512, 192);
  wctx.strokeStyle = '#ffd700'; wctx.lineWidth = 7; wctx.strokeRect(6, 6, 500, 180);
  wctx.fillStyle = '#ffd700'; wctx.font = 'bold 68px Georgia,serif'; wctx.textAlign = 'center';
  wctx.fillText('🏛 ROMA 🏛', 256, 80);
  wctx.font = 'bold 30px Arial'; wctx.fillStyle = '#ffeeaa';
  wctx.fillText('Benvenuto! ברוך הבא!', 256, 140);
  const wFace = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 4.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wC), transparent: true }));
  wFace.position.set(ROME_CX, 7, ROME_CZ - 61.7); scene.add(wFace);
  const wBack = wFace.clone(); wBack.rotation.y = Math.PI; wBack.position.z -= 0.6; scene.add(wBack);
})();

// ── NPC Tour Guide ────────────────────────────────────────────────────────────
(function buildRomeGuide() {
  const g = new THREE.Group();
  const toga = new THREE.MeshLambertMaterial({ color: 0xf5f0e0 }); // white toga
  const skin = new THREE.MeshLambertMaterial({ color: 0xd4a47a });
  const hair = new THREE.MeshLambertMaterial({ color: 0x3a2000 });
  const gold = new THREE.MeshLambertMaterial({ color: 0xffd700 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.45), toga);
  torso.position.y = 1.05; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 10, 8), skin);
  head.position.y = 1.9; g.add(head);
  const hairM = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), hair);
  hairM.position.set(0, 1.98, 0); g.add(hairM);
  // Laurel wreath
  for (let i = 0; i < 12; i++) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.08), gold);
    const la = (i / 12) * Math.PI * 2;
    leaf.position.set(Math.cos(la) * 0.36, 1.99, Math.sin(la) * 0.36);
    leaf.rotation.y = la; g.add(leaf);
  }
  // Toga drape
  const drape = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.42), toga);
  drape.position.set(-0.28, 1.0, 0); g.add(drape);
  [[0, 0.5], [0, -0.5]].forEach(([, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), toga);
    leg.position.set(0, 0.45, lz); g.add(leg);
  });

  const guideX = ROME_CX + 8, guideZ = ROME_CZ - 58;
  g.position.set(guideX, 0, guideZ);
  scene.add(g);

  // NPC registration (uses existing NPC system)
  const hintEl = document.createElement('div');
  hintEl.className = 'bubble-hint'; hintEl.style.display = 'none';
  hintEl.textContent = '[E] Talk';
  document.getElementById('bubble-container').appendChild(hintEl);

  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'speech-bubble'; bubbleEl.style.display = 'none';
  document.getElementById('bubble-container').appendChild(bubbleEl);

  const dialogues = [
    '🏛 סנופי היפה הגיע לרומא!<br>מחכה לך משהו נחמד<br>בתוך הקולוסאום... 🏟',
    '⚔️ האימפריה הרומאית שלטה<br>בכל העולם הידוע...<br>ואתה הגעת לכאן במטוס! 🛩️',
    '🐕 כנס לקולוסאום —<br>מישהו מאוד מיוחד מחכה לך שם!',
    '🍕 Pizza, pasta, gelato...<br>ולטירמיסו של פומפי — אל תפספס! 🐾',
    '💛 Roma ti aspetta sempre —<br>רומא תמיד מחכה לך!',
  ];
  let dIdx = 0;
  let talkVisible = false;

  npcs.push({
    mesh: g,
    name: 'מדריך רומאי',
    homePos: { x: guideX, z: guideZ },
    walkTarget: null,
    walkWait: 2,
    talkVisible: false,
    dialogueIdx: 0,
    dialogues,
    hintEl,
    bubbleEl,
  });
})();

// ── Hotel-87 ──────────────────────────────────────────────────────────────────
(function buildHotel87() {
  const HX = ROME_CX + 5, HZ = ROME_CZ + 100;
  const wallM  = new THREE.MeshLambertMaterial({ color: 0xf5ede0 }); // warm cream
  const accentM= new THREE.MeshLambertMaterial({ color: 0x8b1a1a }); // deep red
  const glassM = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.65 });
  const darkM  = new THREE.MeshLambertMaterial({ color: 0x4a3020 });

  // Main tower (tall building)
  const tower = new THREE.Mesh(new THREE.BoxGeometry(18, 20, 14), wallM);
  tower.position.set(HX, 10, HZ); scene.add(tower);

  // Side wing
  const wing = new THREE.Mesh(new THREE.BoxGeometry(10, 12, 14), wallM);
  wing.position.set(HX - 14, 6, HZ); scene.add(wing);

  // Red accent bands (floor dividers)
  [4, 8, 12, 16].forEach(y => {
    const band = new THREE.Mesh(new THREE.BoxGeometry(19, 0.5, 14.2), accentM);
    band.position.set(HX, y, HZ); scene.add(band);
  });
  [4, 8].forEach(y => {
    const band = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.5, 14.2), accentM);
    band.position.set(HX - 14, y, HZ); scene.add(band);
  });

  // Windows grid — main tower
  for (let wy = 3; wy <= 17; wy += 4) {
    for (let wx = -6; wx <= 6; wx += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.5), glassM);
      win.position.set(HX + wx, wy, HZ - 7.1); scene.add(win);
      const winB = win.clone(); winB.rotation.y = Math.PI; winB.position.z += 14.2; scene.add(winB);
    }
  }
  // Windows — wing
  for (let wy = 3; wy <= 9; wy += 4) {
    for (let wx = -4; wx <= 4; wx += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.5), glassM);
      win.position.set(HX - 14 + wx, wy, HZ - 7.1); scene.add(win);
    }
  }

  // Roof parapet
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(19, 1.2, 14.5), accentM);
  parapet.position.set(HX, 20.6, HZ); scene.add(parapet);

  // Entrance canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 3), accentM);
  canopy.position.set(HX, 3.5, HZ - 7.4); scene.add(canopy);
  // Entrance door
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.2, 0.3), darkM);
  door.position.set(HX, 1.6, HZ - 7.1); scene.add(door);

  // "HOTEL-87" sign
  const hC = document.createElement('canvas'); hC.width = 512; hC.height = 128;
  const hctx = hC.getContext('2d');
  hctx.fillStyle = '#8b1a1a'; hctx.fillRect(0, 0, 512, 128);
  hctx.strokeStyle = '#ffd700'; hctx.lineWidth = 5; hctx.strokeRect(4, 4, 504, 120);
  hctx.fillStyle = '#ffd700'; hctx.font = 'bold 64px Georgia,serif'; hctx.textAlign = 'center';
  hctx.fillText('HOTEL-87', 256, 88);
  const hSign = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hC), transparent: true }));
  hSign.position.set(HX, 21.8, HZ - 6.9); scene.add(hSign);

  // Lobby light
  const lobbyLight = new THREE.PointLight(0xfff3cc, 1.5, 18);
  lobbyLight.position.set(HX, 4, HZ - 4); scene.add(lobbyLight);

  // ── Outdoor sign post ──
  [-1.4, 1.4].forEach(ox => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.5, 8),
      new THREE.MeshLambertMaterial({ color: 0x8b1a1a }));
    post.position.set(HX + ox, 2.25, HZ - 10); scene.add(post);
  });
  const outdoorBoard = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 0.18),
    new THREE.MeshLambertMaterial({ color: 0x8b1a1a }));
  outdoorBoard.position.set(HX, 3.7, HZ - 10); scene.add(outdoorBoard);
  const hOC = document.createElement('canvas'); hOC.width = 512; hOC.height = 128;
  const hOctx = hOC.getContext('2d');
  hOctx.fillStyle = '#8b1a1a'; hOctx.fillRect(0, 0, 512, 128);
  hOctx.strokeStyle = '#ffd700'; hOctx.lineWidth = 6; hOctx.strokeRect(4, 4, 504, 120);
  hOctx.fillStyle = '#ffd700'; hOctx.font = 'bold 54px Georgia,serif'; hOctx.textAlign = 'center';
  hOctx.fillText('HOTEL-87', 256, 76);
  hOctx.fillStyle = '#ffeeaa'; hOctx.font = '22px Arial'; hOctx.fillText('★ Roma ★', 256, 110);
  const hOSign = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 1.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hOC), transparent: true, side: THREE.DoubleSide }));
  hOSign.position.set(HX, 3.7, HZ - 9.91); scene.add(hOSign);

  colliders.push({ x: HX, z: HZ, radius: 10 });
  colliders.push({ x: HX - 14, z: HZ, radius: 6 });
})();

// ── Bona Pizza ────────────────────────────────────────────────────────────────
const PIZZA_X = ROME_CX - 28, PIZZA_Z = ROME_CZ + 55;
(function buildBonaPizza() {
  const wallM  = new THREE.MeshLambertMaterial({ color: 0xfff3e0 }); // warm white
  const roofM  = new THREE.MeshLambertMaterial({ color: 0xcc3300 }); // tomato red
  const accentM= new THREE.MeshLambertMaterial({ color: 0x228822 }); // Italian green
  const glassM = new THREE.MeshBasicMaterial({ color: 0xaaeebb, transparent: true, opacity: 0.6 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 10), wallM);
  body.position.set(PIZZA_X, 3.5, PIZZA_Z); scene.add(body);

  // Green stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.8, 10.2), accentM);
  stripe.position.set(PIZZA_X, 6.1, PIZZA_Z); scene.add(stripe);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.5, 10.5), roofM);
  roof.position.set(PIZZA_X, 7.25, PIZZA_Z); scene.add(roof);

  // Windows
  [-3.5, 3.5].forEach(wx => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.2), glassM);
    w.position.set(PIZZA_X + wx, 3.8, PIZZA_Z - 5.1); scene.add(w);
  });
  // Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.5, 0.3),
    new THREE.MeshLambertMaterial({ color: 0x5c2d00 }));
  door.position.set(PIZZA_X, 1.75, PIZZA_Z - 5.1); scene.add(door);

  // "BONA PIZZA" sign
  const pC = document.createElement('canvas'); pC.width = 512; pC.height = 128;
  const pctx = pC.getContext('2d');
  const grad = pctx.createLinearGradient(0,0,512,0);
  grad.addColorStop(0,'#cc3300'); grad.addColorStop(0.5,'#ffffff'); grad.addColorStop(1,'#228822');
  pctx.fillStyle = grad; pctx.fillRect(0,0,512,128);
  pctx.fillStyle = '#1a1a1a'; pctx.font = 'bold 56px Georgia,serif'; pctx.textAlign = 'center';
  pctx.fillText('🍕 BONA PIZZA', 256, 82);
  const pSign = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pC), transparent: true }));
  pSign.position.set(PIZZA_X, 8.2, PIZZA_Z - 4.9); scene.add(pSign);

  // Warm pizza-oven light
  const ovenLight = new THREE.PointLight(0xff8800, 1.2, 14);
  ovenLight.position.set(PIZZA_X, 3, PIZZA_Z + 2); scene.add(ovenLight);

  // ── Outdoor sign post ──
  [-1.6, 1.6].forEach(ox => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
      new THREE.MeshLambertMaterial({ color: 0x228822 }));
    post.position.set(PIZZA_X + ox, 2, PIZZA_Z - 7.5); scene.add(post);
  });
  const pOBoard = new THREE.Mesh(new THREE.BoxGeometry(5, 1.8, 0.18),
    new THREE.MeshLambertMaterial({ color: 0xcc3300 }));
  pOBoard.position.set(PIZZA_X, 3.6, PIZZA_Z - 7.5); scene.add(pOBoard);
  const pOC = document.createElement('canvas'); pOC.width = 512; pOC.height = 128;
  const pOctx = pOC.getContext('2d');
  const pGrad = pOctx.createLinearGradient(0,0,512,0);
  pGrad.addColorStop(0,'#cc3300'); pGrad.addColorStop(0.5,'#fff'); pGrad.addColorStop(1,'#228822');
  pOctx.fillStyle = pGrad; pOctx.fillRect(0,0,512,128);
  pOctx.fillStyle = '#1a1a1a'; pOctx.font = 'bold 50px Georgia,serif'; pOctx.textAlign = 'center';
  pOctx.fillText('🍕 BONA PIZZA', 256, 72);
  pOctx.font = '22px Arial'; pOctx.fillText('Pizza con Burrata', 256, 108);
  const pOSign = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pOC), transparent: true, side: THREE.DoubleSide }));
  pOSign.position.set(PIZZA_X, 3.6, PIZZA_Z - 7.41); scene.add(pOSign);

  colliders.push({ x: PIZZA_X, z: PIZZA_Z, radius: 7 });
})();

// Pizza NPC (chef)
(function buildPizzaChef() {
  const g = new THREE.Group();
  const whiteM = new THREE.MeshLambertMaterial({ color: 0xf8f8f8 });
  const skinM  = new THREE.MeshLambertMaterial({ color: 0xe8b87a });
  const hairM  = new THREE.MeshLambertMaterial({ color: 0x1a0a00 });
  const redM   = new THREE.MeshLambertMaterial({ color: 0xcc0000 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.42), whiteM);
  torso.position.y = 1.05; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), skinM);
  head.position.y = 1.88; g.add(head);
  // Chef hat
  const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 10), whiteM);
  hatBase.position.y = 2.1; g.add(hatBase);
  const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.5, 10), whiteM);
  hatTop.position.y = 2.45; g.add(hatTop);
  // Mustache
  const must = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.07), hairM);
  must.position.set(0, 1.76, 0.3); g.add(must);
  // Apron (red)
  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.1), redM);
  apron.position.set(0, 0.85, 0.22); g.add(apron);
  [[0, 0.5],[0,-0.5]].forEach(([,lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.88, 0.3), whiteM);
    leg.position.set(0, 0.44, lz); g.add(leg);
  });

  g.position.set(PIZZA_X + 1, 0, PIZZA_Z - 4.5);
  scene.add(g);
  window._pizzaChef = g;

  npcs.push({
    mesh: g, name: 'שף בונה',
    homePos: { x: PIZZA_X + 1, z: PIZZA_Z - 4.5 },
    walkTarget: null, walkWait: 2, talkVisible: false, dialogueIdx: 0,
    dialogues: [
      '🍕 Benvenuto a Bona Pizza!<br>אני מכין את הפיצה הכי טובה ברומא!',
      '🧀 הפיצה שלנו עם <b>בורטה טרייה</b><br>מגיעה מהחווה הטובה ביותר...<br>רק בשבילך סנופי! 🐾',
      '🍕 Ecco la tua pizza!<br>פיצה עם בורטה — הכי טעים בעולם!',
    ],
    hintEl: (() => { const el = document.createElement('div'); el.className='bubble-hint'; el.style.display='none'; el.textContent='[E] Talk'; document.getElementById('bubble-container').appendChild(el); return el; })(),
    bubbleEl: (() => { const el = document.createElement('div'); el.className='speech-bubble'; el.style.display='none'; document.getElementById('bubble-container').appendChild(el); return el; })(),
  });
})();

// Pizza gift interaction
const pizzaGiftEl = document.createElement('div');
pizzaGiftEl.style.cssText = [
  'position:fixed','top:25%','left:50%','transform:translateX(-50%)',
  'background:rgba(180,30,0,0.96)','color:#fff','font-size:20px',
  'padding:28px 40px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Georgia,serif','text-align:center',
  'border:3px solid #ffcc00','max-width:420px','line-height:1.8',
].join(';');
pizzaGiftEl.innerHTML = '🍕<br><br><b>Bona Pizza!</b><br>פיצה עם בורטה טרייה<br><span style="color:#ffcc00;font-size:16px">Il meglio di Roma — הכי טוב ברומא 🐾</span>';
document.body.appendChild(pizzaGiftEl);
let pizzaGiftTimer = 0;

const pizzaHintEl = document.createElement('div');
pizzaHintEl.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:rgba(180,30,0,0.9);color:#fff;font-size:15px;font-weight:bold;padding:6px 18px;border-radius:12px;pointer-events:none;z-index:25;display:none;font-family:Arial,sans-serif;border:1px solid #ffcc00';
pizzaHintEl.textContent = '[E] 🍕 קבל פיצה עם בורטה!';
document.body.appendChild(pizzaHintEl);

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  const dx = player.position.x - PIZZA_X;
  const dz = player.position.z - PIZZA_Z;
  if (Math.sqrt(dx*dx + dz*dz) < 9) {
    pizzaGiftEl.style.display = 'block';
    pizzaGiftTimer = 5.0;
  }
});

// ── Pompi — Tiramisu ──────────────────────────────────────────────────────────
const POMPI_X = ROME_CX + 32, POMPI_Z = ROME_CZ + 55;
(function buildPompi() {
  const wallM  = new THREE.MeshLambertMaterial({ color: 0xfff8f0 }); // cream
  const roofM  = new THREE.MeshLambertMaterial({ color: 0x5c3d1e }); // coffee brown
  const trimM  = new THREE.MeshLambertMaterial({ color: 0xd4a855 }); // gold trim
  const glassM = new THREE.MeshBasicMaterial({ color: 0xffe8cc, transparent: true, opacity: 0.65, side: THREE.DoubleSide });

  // Whole building is in a group — rotation.y = Math.PI flips it 180°
  const pompiGroup = new THREE.Group();
  pompiGroup.position.set(POMPI_X, 0, POMPI_Z);
  pompiGroup.rotation.y = Math.PI;
  scene.add(pompiGroup);

  const body = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 9), wallM);
  body.position.set(0, 3.5, 0); pompiGroup.add(body);

  // Gold trim band
  const trim = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.7, 9.2), trimM);
  trim.position.set(0, 6.1, 0); pompiGroup.add(trim);

  // Coffee-brown roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.5, 9.5), roofM);
  roof.position.set(0, 7.25, 0); pompiGroup.add(roof);

  // Display window (local -Z face = world +Z after group flip)
  const dispWin = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.5), glassM);
  dispWin.position.set(0, 3.2, -4.6); pompiGroup.add(dispWin);
  // Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(2, 3.2, 0.3),
    new THREE.MeshLambertMaterial({ color: 0x3e1a00 }));
  door.position.set(3.2, 1.6, -4.6); pompiGroup.add(door);

  // "POMPI" wall sign — canvas pre-flip to counteract group X-axis mirror
  const tC = document.createElement('canvas'); tC.width = 512; tC.height = 128;
  const tctx = tC.getContext('2d');
  tctx.save(); tctx.translate(512, 0); tctx.scale(-1, 1);
  tctx.fillStyle = '#5c3d1e'; tctx.fillRect(0, 0, 512, 128);
  tctx.strokeStyle = '#d4a855'; tctx.lineWidth = 6; tctx.strokeRect(5, 5, 502, 118);
  tctx.fillStyle = '#ffd700'; tctx.font = 'bold 52px Georgia,serif'; tctx.textAlign = 'center';
  tctx.fillText('☕ POMPI', 256, 58);
  tctx.fillStyle = '#f5deb3'; tctx.font = '26px Georgia,serif';
  tctx.fillText('Tiramisù Autentico', 256, 100);
  tctx.restore();
  const tSign = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.3),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(tC), transparent: true, side: THREE.DoubleSide }));
  tSign.position.set(0, 8.2, -4.4); pompiGroup.add(tSign);

  // Cozy warm light
  const warmLight = new THREE.PointLight(0xff9933, 1.3, 14);
  warmLight.position.set(0, 3.5, 0); pompiGroup.add(warmLight);

  // ── Outdoor sign post — local +Z = world south (toward approaching players) ──
  [-1.4, 1.4].forEach(ox => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
      new THREE.MeshLambertMaterial({ color: 0x5c3d1e }));
    post.position.set(ox, 2, 7); pompiGroup.add(post);
  });
  const tOBoard = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 0.18),
    new THREE.MeshLambertMaterial({ color: 0x5c3d1e }));
  tOBoard.position.set(0, 3.6, 7); pompiGroup.add(tOBoard);
  const tOC = document.createElement('canvas'); tOC.width = 512; tOC.height = 128;
  const tOctx = tOC.getContext('2d');
  // Canvas pre-flip: group's X-mirror + this pre-flip = readable text
  tOctx.save(); tOctx.translate(512, 0); tOctx.scale(-1, 1);
  tOctx.fillStyle = '#5c3d1e'; tOctx.fillRect(0, 0, 512, 128);
  tOctx.strokeStyle = '#d4a855'; tOctx.lineWidth = 5; tOctx.strokeRect(4, 4, 504, 120);
  tOctx.fillStyle = '#ffd700'; tOctx.font = 'bold 54px Georgia,serif'; tOctx.textAlign = 'center';
  tOctx.fillText('☕ POMPI', 256, 70);
  tOctx.fillStyle = '#f5deb3'; tOctx.font = '24px Georgia,serif';
  tOctx.fillText('Tiramisù Autentico', 256, 106);
  tOctx.restore();
  const tOSign = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 1.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(tOC), transparent: true, side: THREE.DoubleSide }));
  // rotation.y = 0: faces +Z local → -Z world after group flip → faces south toward players
  tOSign.position.set(0, 3.6, 6.91); pompiGroup.add(tOSign);

  colliders.push({ x: POMPI_X, z: POMPI_Z, radius: 6.5 });
})();

// Pompi NPC (barista)
(function buildPompiBarista() {
  const g = new THREE.Group();
  const brownM = new THREE.MeshLambertMaterial({ color: 0x5c3d1e });
  const skinM  = new THREE.MeshLambertMaterial({ color: 0xf0c8a0 });
  const blondM = new THREE.MeshLambertMaterial({ color: 0xd4a030 });
  const goldM  = new THREE.MeshLambertMaterial({ color: 0xd4a855 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.1, 0.42), brownM);
  torso.position.y = 1.05; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 10, 8), skinM);
  head.position.y = 1.86; g.add(head);
  // Hair bun
  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.33, 10, 8), blondM);
  hairBack.position.set(0, 1.96, 0); g.add(hairBack);
  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), blondM);
  bun.position.set(0, 2.22, -0.1); g.add(bun);
  // Gold apron
  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.92, 0.1), goldM);
  apron.position.set(0, 0.86, 0.22); g.add(apron);
  [[0,0.5],[0,-0.5]].forEach(([,lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.88, 0.3), brownM);
    leg.position.set(0, 0.44, lz); g.add(leg);
  });

  g.position.set(POMPI_X - 1, 0, POMPI_Z + 4.2);
  scene.add(g);

  npcs.push({
    mesh: g, name: 'בריסטה פומפו',
    homePos: { x: POMPI_X - 1, z: POMPI_Z + 4.2 },
    walkTarget: null, walkWait: 2, talkVisible: false, dialogueIdx: 0,
    dialogues: [
      '☕ Benvenuto a Pompi!<br>הטירמיסו שלנו — המתכון המקורי<br>מ-1969 מ-Treviso!',
      '😊 סנופי, עשיתי בשבילך<br>טירמיסו עם <b>מסקרפונה</b> אמיתי<br>וביסקוויטי ספוגיארדי... 🐾',
      '☕ Tiramisù di Pompi —<br>il dolce più buono del mondo!<br>הכי מתוק בעולם!',
    ],
    hintEl: (() => { const el = document.createElement('div'); el.className='bubble-hint'; el.style.display='none'; el.textContent='[E] Talk'; document.getElementById('bubble-container').appendChild(el); return el; })(),
    bubbleEl: (() => { const el = document.createElement('div'); el.className='speech-bubble'; el.style.display='none'; document.getElementById('bubble-container').appendChild(el); return el; })(),
  });
})();

// Tiramisu gift interaction
const tiramisuGiftEl = document.createElement('div');
tiramisuGiftEl.style.cssText = [
  'position:fixed','top:25%','left:50%','transform:translateX(-50%)',
  'background:rgba(60,26,0,0.97)','color:#ffd700','font-size:20px',
  'padding:28px 40px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Georgia,serif','text-align:center',
  'border:3px solid #d4a855','max-width:420px','line-height:1.8',
].join(';');
tiramisuGiftEl.innerHTML = '☕🍰<br><br><b>Tiramisù di Pompi!</b><br>טירמיסו עם מסקרפונה אמיתי<br><span style="color:#f5deb3;font-size:16px">Si scioglie in bocca — נמס בפה 🐾</span>';
document.body.appendChild(tiramisuGiftEl);
let tiramisuGiftTimer = 0;

const tiramisuHintEl = document.createElement('div');
tiramisuHintEl.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:rgba(60,26,0,0.9);color:#ffd700;font-size:15px;font-weight:bold;padding:6px 18px;border-radius:12px;pointer-events:none;z-index:25;display:none;font-family:Arial,sans-serif;border:1px solid #d4a855';
tiramisuHintEl.textContent = '[E] ☕ קבל טירמיסו!';
document.body.appendChild(tiramisuHintEl);

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  const dx = player.position.x - POMPI_X;
  const dz = player.position.z - POMPI_Z;
  if (Math.sqrt(dx*dx + dz*dz) < 9) {
    tiramisuGiftEl.style.display = 'block';
    tiramisuGiftTimer = 5.0;
  }
});

// ── Rome arrival detection ─────────────────────────────────────────────────────
const romeArrivalEl = document.createElement('div');
romeArrivalEl.style.cssText = [
  'position:fixed','top:22%','left:50%','transform:translateX(-50%)',
  'background:rgba(139,26,26,0.97)','color:#ffd700','font-size:22px',
  'padding:28px 44px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Georgia,serif','text-align:center',
  'border:3px solid #ffd700','max-width:460px','line-height:1.8',
].join(';');
romeArrivalEl.innerHTML = '🏛️<br><br><b>Benvenuto a Roma!</b><br>ברוך הבא לעיר הנצחית 🐾<br><br><span style="font-size:16px;color:#ffeeaa">לחץ E לצאת מהמטוס</span>';
document.body.appendChild(romeArrivalEl);

let romeArrivalTimer = 0;
let romeArrivalShown = false;

function updateRome(dt) {
  // George tail wag
  if (window._georgeMesh) {
    const tail = window._georgeMesh.userData.tail;
    if (tail) tail.rotation.z = Math.PI / 4 + Math.sin(Date.now() * 0.008) * 0.5;
  }

  // Fireworks
  if (fireworksActive) {
    fireworksTimer -= dt;
    fireworksSpawnTimer -= dt;
    if (fireworksSpawnTimer <= 0) {
      spawnFirework();
      fireworksSpawnTimer = 0.12 + Math.random() * 0.1;
    }
    if (fireworksTimer <= 0) fireworksActive = false;
  }
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    fw.life -= dt;
    const fade = Math.max(0, fw.life / 1.6);
    fw.particles.forEach(p => {
      p.userData.vel.y -= 6 * dt; // gravity
      p.position.addScaledVector(p.userData.vel, dt);
      p.scale.setScalar(fade);
    });
    if (fw.life <= 0) {
      fw.particles.forEach(p => scene.remove(p));
      fireworks.splice(i, 1);
    }
  }

  // Show arrival message when plane first lands near Rome
  if (!romeArrivalShown && inPlane) {
    const dx = playerPlane.position.x - ROME_CX;
    const dz = playerPlane.position.z - ROME_CZ;
    if (Math.sqrt(dx*dx + dz*dz) < 120 && playerPlane.position.y < 4) {
      romeArrivalShown = true;
      romeArrivalEl.style.display = 'block';
      romeArrivalTimer = 6.0;
    }
  }
  if (romeArrivalTimer > 0) {
    romeArrivalTimer -= dt;
    if (romeArrivalTimer <= 0) romeArrivalEl.style.display = 'none';
  }
  if (pizzaGiftTimer > 0) {
    pizzaGiftTimer -= dt;
    if (pizzaGiftTimer <= 0) pizzaGiftEl.style.display = 'none';
  }
  if (tiramisuGiftTimer > 0) {
    tiramisuGiftTimer -= dt;
    if (tiramisuGiftTimer <= 0) tiramisuGiftEl.style.display = 'none';
  }

  // Food hints
  if (!inPlane && !inCar) {
    const pdx = player.position.x - PIZZA_X, pdz = player.position.z - PIZZA_Z;
    pizzaHintEl.style.display = (Math.sqrt(pdx*pdx+pdz*pdz) < 9 && pizzaGiftTimer <= 0) ? 'block' : 'none';
    const tdx = player.position.x - POMPI_X, tdz = player.position.z - POMPI_Z;
    tiramisuHintEl.style.display = (Math.sqrt(tdx*tdx+tdz*tdz) < 9 && tiramisuGiftTimer <= 0) ? 'block' : 'none';
  } else {
    pizzaHintEl.style.display = 'none';
    tiramisuHintEl.style.display = 'none';
  }
}

// ── R key — respawn to town when in Rome ──────────────────────────────────────
const romeRespawnEl = document.createElement('div');
romeRespawnEl.style.cssText = [
  'position:fixed','bottom:55px','left:50%','transform:translateX(-50%)',
  'background:rgba(139,26,26,0.9)','color:#ffd700','font-size:14px','font-weight:bold',
  'padding:7px 20px','border-radius:12px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','border:1px solid #ffd700',
].join(';');
romeRespawnEl.textContent = '[R] חזור לעיר הבית';
document.body.appendChild(romeRespawnEl);

function isInRome() {
  return player.position.z > ROME_CZ - 120 ||
         (inPlane && playerPlane.position.z > ROME_CZ - 200);
}

// ── Day / Night transition ────────────────────────────────────────────────────
const _daySky      = new THREE.Color(0xf0a060);
const _nightSky    = new THREE.Color(0x04040f);
const _dayAmb      = new THREE.Color(0xff9944);
const _nightAmb    = new THREE.Color(0x10103a);
const _dayHemiSky  = new THREE.Color(0xffb060);
const _nightHemiSky= new THREE.Color(0x08082a);
const _dayHemiGnd  = new THREE.Color(0x8b5c20);
const _nightHemiGnd= new THREE.Color(0x030308);
const _daySun      = new THREE.Color(0xff8833);
const _nightSun    = new THREE.Color(0x3344bb); // moonlight blue
let _nightFactor   = 0;
const _tmpCol = new THREE.Color();

// Show hint when in Rome (on foot)
const _origUpdateRome = updateRome;
updateRome = function(dt) {
  _origUpdateRome(dt);
  romeRespawnEl.style.display = (!inPlane && !inCar && isInRome()) ? 'block' : 'none';

  // Smoothly transition to night when in Rome, back to day when not
  const targetNight = isInRome() ? 1 : 0;
  _nightFactor += (targetNight - _nightFactor) * Math.min(1, dt * 1.2);
  const n = _nightFactor;

  _tmpCol.copy(_daySky).lerp(_nightSky, n);
  renderer.setClearColor(_tmpCol);
  scene.fog.color.copy(_tmpCol);

  ambientLight.color.copy(_dayAmb).lerp(_nightAmb, n);
  ambientLight.intensity = 0.7 * (1 - n) + 0.25 * n;

  hemiLight.color.copy(_dayHemiSky).lerp(_nightHemiSky, n);
  hemiLight.groundColor.copy(_dayHemiGnd).lerp(_nightHemiGnd, n);
  hemiLight.intensity = 0.6 * (1 - n) + 0.15 * n;

  sun.color.copy(_daySun).lerp(_nightSun, n);
  sun.intensity = 1.6 * (1 - n) + 0.4 * n;
};

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyR') return;
  if (inPlane || inCar) return;
  if (!isInRome()) return;
  player.position.set(0, 0, 0);
  player.visible = true;
});

// ── Teleport to Rome button ────────────────────────────────────────────────────
const teleportRomeBtn = document.createElement('button');
teleportRomeBtn.textContent = '✈️ טוס לרומא';
teleportRomeBtn.style.cssText = [
  'position:fixed','bottom:20px','right:20px',
  'background:rgba(139,26,26,0.92)','color:#ffd700','font-size:15px','font-weight:bold',
  'padding:10px 22px','border-radius:14px','border:2px solid #ffd700',
  'cursor:pointer','z-index:30','font-family:Arial,sans-serif',
  'box-shadow:0 3px 12px rgba(0,0,0,0.5)',
].join(';');
document.body.appendChild(teleportRomeBtn);

teleportRomeBtn.addEventListener('click', () => {
  if (inPlane) {
    // Teleport plane directly to Rome runway
    playerPlane.position.set(ROME_CX, 0.56, ROME_RUNWAY_Z);
    playerPlane.rotation.y = 0;
    planeSpeed = 0; planeVelY = 0;
  } else {
    // Board the plane at the runway and fly there
    playerPlane.position.set(ROME_CX, 0.56, ROME_RUNWAY_Z);
    playerPlane.rotation.y = 0;
    player.position.set(ROME_CX + 3, 0, ROME_RUNWAY_Z);
    player.visible = true;
  }
});
