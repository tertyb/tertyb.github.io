// ── Golden Jewelry Store ───────────────────────────────────────────────────────
// Located directly north of Super-Pharm
// Building: 44 wide (z), 40 deep (x), 11 tall
// Center: (148, 0, 62) — north of SP (which ends at z=+27)

const JW_CX = 148, JW_CZ = 62;
const JW_HW = 22;   // half-width  (z: 40 to 84)
const JW_HD = 20;   // half-depth  (x: 128 to 168)
const JW_H  = 11;   // height

// ── Materials ─────────────────────────────────────────────────────────────────
const _jwGold    = new THREE.MeshLambertMaterial({ color: 0xffd700 });
const _jwPurple  = new THREE.MeshLambertMaterial({ color: 0x7b1fa2 });
const _jwWall    = new THREE.MeshLambertMaterial({ color: 0x7b1fa2 });   // vivid purple walls
const _jwShelf   = new THREE.MeshLambertMaterial({ color: 0x6b3a2a });   // warm brown display cases
const _jwPad     = new THREE.MeshLambertMaterial({ color: 0xfffde7 });   // bright cream velvet
const _jwGlass   = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent:true, opacity:0.35 });
const _jwTile    = new THREE.MeshLambertMaterial({ color: 0xb3e5fc });   // light blue tile
const _jwTileGld = new THREE.MeshLambertMaterial({ color: 0x81d4fa });   // slightly darker light blue

// ── Extend road north to reach entrance ───────────────────────────────────────
makeRoad(SP_CX - SP_HD, SP_CZ + SP_HW + (JW_CZ - SP_CZ - SP_HW)/2, 6,
  JW_CZ - SP_CZ - SP_HW, true, 0.02);  // short north connector

// ── Exterior ──────────────────────────────────────────────────────────────────
(function buildJWExterior() {
  // Walls — vivid purple exterior
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(JW_HD*2, JW_H, 0.5), _jwWall);
  northWall.position.set(JW_CX, JW_H/2, JW_CZ + JW_HW); scene.add(northWall);
  const southWall = new THREE.Mesh(new THREE.BoxGeometry(JW_HD*2, JW_H, 0.5), _jwWall);
  southWall.position.set(JW_CX, JW_H/2, JW_CZ - JW_HW); scene.add(southWall);
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, JW_H, JW_HW*2), _jwWall);
  eastWall.position.set(JW_CX + JW_HD, JW_H/2, JW_CZ); scene.add(eastWall);
  // West wall with 8-unit entrance gap
  const westWallN = new THREE.Mesh(new THREE.BoxGeometry(0.5, JW_H, JW_HW - 4), _jwWall);
  westWallN.position.set(JW_CX - JW_HD, JW_H/2, JW_CZ + (JW_HW + 4)/2); scene.add(westWallN);
  const westWallS = new THREE.Mesh(new THREE.BoxGeometry(0.5, JW_H, JW_HW - 4), _jwWall);
  westWallS.position.set(JW_CX - JW_HD, JW_H/2, JW_CZ - (JW_HW + 4)/2); scene.add(westWallS);

  // Gold roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(JW_HD*2+1, 0.6, JW_HW*2+1), _jwGold);
  roof.position.set(JW_CX, JW_H + 0.3, JW_CZ); scene.add(roof);

  // Gold facade band above entrance
  const facade = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.5, JW_HW*2+1), _jwGold);
  facade.position.set(JW_CX - JW_HD, JW_H - 1.75, JW_CZ); scene.add(facade);

  // ── BIG "FREE JEWELRY" sign on top of roof ────────────────────────────────
  const freeC = document.createElement('canvas'); freeC.width=1024; freeC.height=256;
  const fctx = freeC.getContext('2d');
  fctx.fillStyle='#ffd700'; fctx.fillRect(0,0,1024,256);
  fctx.strokeStyle='#2d0a4e'; fctx.lineWidth=8; fctx.strokeRect(8,8,1008,240);
  fctx.fillStyle='#2d0a4e'; fctx.font='bold 96px Arial'; fctx.textAlign='center';
  fctx.fillText('FREE JEWELRY! 💍', 512, 105);
  fctx.font='bold 56px Arial';
  fctx.fillText('תכשיטים חינם!', 512, 200);
  const freeSign = new THREE.Mesh(
    new THREE.PlaneGeometry(JW_HW*2, 4.5),
    new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(freeC), transparent:true})
  );
  freeSign.position.set(JW_CX, JW_H + 2.5, JW_CZ);
  freeSign.rotation.x = -0.15;
  scene.add(freeSign);
  // Also face south so player sees it approaching
  const freeSign2 = freeSign.clone();
  freeSign2.rotation.y = Math.PI; freeSign2.rotation.x = 0.15;
  scene.add(freeSign2);

  // Main shop sign on west facade
  const signC = document.createElement('canvas'); signC.width=1024; signC.height=200;
  const sctx = signC.getContext('2d');
  sctx.fillStyle='#2d0a4e'; sctx.fillRect(0,0,1024,200);
  sctx.fillStyle='#ffd700'; sctx.font='bold 80px Arial'; sctx.textAlign='center';
  sctx.fillText('💍 Golden Jewelry 💍', 512, 100);
  sctx.font='bold 44px Arial';
  sctx.fillText('תכשיטים זהב', 512, 165);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(JW_HW*2, 3.5),
    new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(signC), transparent:true})
  );
  signMesh.position.set(JW_CX - JW_HD - 0.35, JW_H - 1.75, JW_CZ);
  signMesh.rotation.y = Math.PI/2; scene.add(signMesh);

  // Gold-tinted glass windows either side of entrance
  [JW_CZ - 13, JW_CZ + 13].forEach(wz => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 8), _jwGlass);
    win.position.set(JW_CX - JW_HD, 4, wz); scene.add(win);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 7.2, 8.3), _jwGold);
    frame.position.set(JW_CX - JW_HD - 0.06, 4, wz); scene.add(frame);
  });

  // Entrance doors
  [-2, 2].forEach(dz => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.5, 3.5), _jwGlass);
    door.position.set(JW_CX - JW_HD, 1.9, JW_CZ + dz); scene.add(door);
  });
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.0, 8.2), _jwGold);
  doorFrame.position.set(JW_CX - JW_HD, 2.1, JW_CZ); scene.add(doorFrame);

  // Awning
  const awning = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 10), _jwGold);
  awning.position.set(JW_CX - JW_HD - 1.75, 4.5, JW_CZ); scene.add(awning);

  // Entrance mat (purple velvet)
  const mat = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 6),
    new THREE.MeshLambertMaterial({color:0x4a0080}));
  mat.position.set(JW_CX - JW_HD - 1.5, 0.03, JW_CZ); scene.add(mat);

  // Signpost
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,3,6), _jwGold);
  post.position.set(JW_CX - JW_HD - 5, 1.5, JW_CZ); scene.add(post);
  const pC = document.createElement('canvas'); pC.width=256; pC.height=80;
  const pctx = pC.getContext('2d');
  pctx.fillStyle='#2d0a4e'; pctx.fillRect(0,0,256,80);
  pctx.fillStyle='#ffd700'; pctx.font='bold 22px Arial'; pctx.textAlign='center';
  pctx.fillText('💍 Free Jewelry ↑', 128, 50);
  const pSign = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.9),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pC),transparent:true}));
  pSign.position.set(JW_CX - JW_HD - 5, 3.3, JW_CZ); scene.add(pSign);

  // Colliders — thin segments every 4 units
  const R = 2;
  for (let wx = JW_CX - JW_HD + 2; wx <= JW_CX + JW_HD; wx += 4) {
    colliders.push({x: wx, z: JW_CZ + JW_HW, radius: R});
    colliders.push({x: wx, z: JW_CZ - JW_HW, radius: R});
  }
  for (let wz = JW_CZ - JW_HW + 2; wz <= JW_CZ + JW_HW; wz += 4)
    colliders.push({x: JW_CX + JW_HD, z: wz, radius: R});
  for (let wz = JW_CZ + 5; wz <= JW_CZ + JW_HW; wz += 4)
    colliders.push({x: JW_CX - JW_HD, z: wz, radius: R});
  for (let wz = JW_CZ - JW_HW; wz <= JW_CZ - 5; wz += 4)
    colliders.push({x: JW_CX - JW_HD, z: wz, radius: R});
})();

// ── Interior floor ─────────────────────────────────────────────────────────────
(function buildJWFloor() {
  for (let ix = 0; ix < 5; ix++) {
    for (let iz = 0; iz < 7; iz++) {
      const isGold = (ix + iz) % 2 === 0;
      const tile = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 5.8),
        isGold ? _jwTileGld : _jwTile);
      tile.rotation.x = -Math.PI/2;
      tile.position.set(JW_CX - JW_HD + 4 + ix*8, 0.02, JW_CZ - JW_HW + 3 + iz*6.2);
      scene.add(tile);
    }
  }
  // Ceiling lights — warm gold
  for (let ix = 0; ix < 4; ix++) {
    for (let iz = 0; iz < 4; iz++) {
      const pl = new THREE.PointLight(0xffffff, 1.8, 30);
      pl.position.set(JW_CX - JW_HD + 8 + ix*10, JW_H - 0.5, JW_CZ - JW_HW + 8 + iz*11);
      scene.add(pl);
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 0.5),
        new THREE.MeshBasicMaterial({color:0xffe566}));
      fixture.position.set(JW_CX - JW_HD + 8 + ix*10, JW_H - 0.3, JW_CZ - JW_HW + 8 + iz*11);
      scene.add(fixture);
    }
  }
})();

// ── Display case builder ───────────────────────────────────────────────────────
function buildJWCase(wx, wz, len, label, axis) {
  // axis: 'x' = runs along x, 'z' = runs along z
  const g = new THREE.Group();
  const caseW = axis==='x' ? len : 1.0;
  const caseD = axis==='x' ? 1.0 : len;

  // Base cabinet (dark wood)
  const base = new THREE.Mesh(new THREE.BoxGeometry(caseW, 1.0, caseD), _jwShelf);
  base.position.y = 0.5; g.add(base);

  // Glass top
  const glassTop = new THREE.Mesh(new THREE.BoxGeometry(caseW + 0.05, 0.08, caseD + 0.05),
    new THREE.MeshBasicMaterial({color:0xffe566, transparent:true, opacity:0.4}));
  glassTop.position.y = 1.06; g.add(glassTop);

  // Gold trim around top
  const trim = new THREE.Mesh(new THREE.BoxGeometry(caseW + 0.12, 0.08, caseD + 0.12), _jwGold);
  trim.position.y = 1.02; g.add(trim);

  // Velvet display pad inside
  const pad = new THREE.Mesh(new THREE.BoxGeometry(caseW - 0.1, 0.04, caseD - 0.1), _jwPad);
  pad.position.y = 1.0; g.add(pad);

  // Gold legs
  [[-caseW/2+0.1, -caseD/2+0.1],[caseW/2-0.1,-caseD/2+0.1],
   [-caseW/2+0.1,  caseD/2-0.1],[caseW/2-0.1, caseD/2-0.1]].forEach(([lx,lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.5,6), _jwGold);
    leg.position.set(lx, 0.25, lz); g.add(leg);
  });

  // Label sign
  const lc = document.createElement('canvas'); lc.width=256; lc.height=64;
  const lctx = lc.getContext('2d');
  lctx.fillStyle='#2d0a4e'; lctx.fillRect(0,0,256,64);
  lctx.fillStyle='#ffd700'; lctx.font='bold 22px Arial'; lctx.textAlign='center';
  lctx.fillText(label, 128, 42);
  const lsign = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lc),transparent:true}));
  lsign.position.set(0, 1.6, axis==='x' ? caseD/2 + 0.05 : 0);
  if (axis==='z') lsign.rotation.y = Math.PI/2;
  g.add(lsign);

  g.position.set(wx, 0, wz); scene.add(g);
  return g;
}

// ── Jewelry pieces ────────────────────────────────────────────────────────────
const JW_ITEMS = [
  // Rings row
  {name:'Diamond Ring',     price:0, shape:'ring',      color:0xffd700, cx:JW_CX-12, cz:JW_CZ-15},
  {name:'Ruby Ring',        price:0, shape:'ring',      color:0xffd700, cx:JW_CX-6,  cz:JW_CZ-15},
  {name:'Sapphire Ring',    price:0, shape:'ring',      color:0xffd700, cx:JW_CX,    cz:JW_CZ-15},
  {name:'Emerald Ring',     price:0, shape:'ring',      color:0xffd700, cx:JW_CX+6,  cz:JW_CZ-15},
  {name:'Gold Band',        price:0, shape:'ring',      color:0xffc107, cx:JW_CX+12, cz:JW_CZ-15},
  // Necklaces
  {name:'Pearl Necklace',   price:0, shape:'necklace',  color:0xffd700, cx:JW_CX-12, cz:JW_CZ-4},
  {name:'Gold Chain',       price:0, shape:'necklace',  color:0xffc107, cx:JW_CX-6,  cz:JW_CZ-4},
  {name:'Diamond Pendant',  price:0, shape:'necklace',  color:0xffd700, cx:JW_CX,    cz:JW_CZ-4},
  {name:'Heart Locket',     price:0, shape:'necklace',  color:0xffb300, cx:JW_CX+6,  cz:JW_CZ-4},
  {name:'Star Pendant',     price:0, shape:'necklace',  color:0xffd700, cx:JW_CX+12, cz:JW_CZ-4},
  // Bracelets
  {name:'Gold Bracelet',    price:0, shape:'bracelet',  color:0xffd700, cx:JW_CX-12, cz:JW_CZ+8},
  {name:'Charm Bracelet',   price:0, shape:'bracelet',  color:0xffc107, cx:JW_CX-6,  cz:JW_CZ+8},
  {name:'Bangle',           price:0, shape:'bracelet',  color:0xffb300, cx:JW_CX,    cz:JW_CZ+8},
  {name:'Tennis Bracelet',  price:0, shape:'bracelet',  color:0xffd700, cx:JW_CX+6,  cz:JW_CZ+8},
  {name:'Cuff Bracelet',    price:0, shape:'bracelet',  color:0xffc107, cx:JW_CX+12, cz:JW_CZ+8},
  // Earrings
  {name:'Stud Earrings',    price:0, shape:'earring',   color:0xffd700, cx:JW_CX-12, cz:JW_CZ+19},
  {name:'Hoop Earrings',    price:0, shape:'earring',   color:0xffc107, cx:JW_CX-6,  cz:JW_CZ+19},
  {name:'Drop Earrings',    price:0, shape:'earring',   color:0xffd700, cx:JW_CX,    cz:JW_CZ+19},
  {name:'Chandelier Earrings', price:0, shape:'earring',color:0xffb300, cx:JW_CX+6, cz:JW_CZ+19},
  {name:'Pearl Earrings',   price:0, shape:'earring',   color:0xffd700, cx:JW_CX+12, cz:JW_CZ+19},
];

// Display cases for each row
buildJWCase(JW_CX, JW_CZ - 15, 34, '💍 Rings',      'x');
buildJWCase(JW_CX, JW_CZ - 4,  34, '📿 Necklaces',  'x');
buildJWCase(JW_CX, JW_CZ + 8,  34, '💛 Bracelets',  'x');
buildJWCase(JW_CX, JW_CZ + 19, 34, '✨ Earrings',   'x');

// Back wall display case
buildJWCase(JW_CX + JW_HD - 2, JW_CZ, JW_HW*2 - 4, '👑 Premium', 'z');

const jwItemMeshes = [];

function makeJewelryMesh(shape, color) {
  const mat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.6 });
  const goldMat = new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0xffcc00, emissiveIntensity: 0.5 });
  const g = new THREE.Group();

  if (shape === 'ring') {
    // Torus ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 16), mat);
    ring.rotation.x = Math.PI/2; ring.position.y = 0.06; g.add(ring);
    // Gem on top
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), goldMat);
    gem.position.set(0, 0.2, 0); g.add(gem);
  } else if (shape === 'necklace') {
    // Chain arc + pendant
    for (let i = 0; i < 7; i++) {
      const a = (i/6 - 0.5) * Math.PI * 0.8;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 4), mat);
      bead.position.set(Math.sin(a)*0.18, 0.08 + Math.cos(a)*0.04, 0); g.add(bead);
    }
    const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), goldMat);
    pendant.position.set(0, 0.06, 0); g.add(pendant);
  } else if (shape === 'bracelet') {
    // Small torus
    const brac = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 6, 14), mat);
    brac.rotation.x = Math.PI/2; brac.position.y = 0.05; g.add(brac);
    // Charm
    const charm = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), goldMat);
    charm.position.set(0.18, 0.06, 0); g.add(charm);
  } else if (shape === 'earring') {
    // Two small drops
    [-0.1, 0.1].forEach(ox => {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), mat);
      stud.position.set(ox, 0.1, 0); g.add(stud);
      const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.12, 6), goldMat);
      drop.position.set(ox, 0.0, 0); g.add(drop);
    });
  }
  return g;
}

JW_ITEMS.forEach(item => {
  const g = makeJewelryMesh(item.shape, item.color);
  g.scale.set(2.5, 2.5, 2.5);           // 2.5× bigger — clearly visible
  g.position.set(item.cx, 1.1, item.cz); // sit on top of display case
  const spark = new THREE.PointLight(0xffd700, 1.5, 7);
  spark.position.set(item.cx, 1.9, item.cz); scene.add(spark);
  scene.add(g);
  jwItemMeshes.push({ group:g, data:item, taken:false, worldX:item.cx, worldZ:item.cz });
});

// ── Cashier counter ────────────────────────────────────────────────────────────
(function buildJWCashier() {
  // L-shaped counter
  const ctr = new THREE.Mesh(new THREE.BoxGeometry(10, 1.1, 1.8), _jwShelf);
  ctr.position.set(JW_CX - JW_HD + 7, 0.55, JW_CZ); scene.add(ctr);
  const ctrTop = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.1, 2.0), _jwGold);
  ctrTop.position.set(JW_CX - JW_HD + 7, 1.15, JW_CZ); scene.add(ctrTop);

  // Screen
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.05),
    new THREE.MeshBasicMaterial({color:0x110022}));
  screen.position.set(JW_CX - JW_HD + 5, 1.55, JW_CZ); screen.rotation.y = 0.3; scene.add(screen);
  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.36),
    new THREE.MeshBasicMaterial({color:0xffdd00}));
  screenGlow.position.set(JW_CX - JW_HD + 5.04, 1.55, JW_CZ); screenGlow.rotation.y=0.3; scene.add(screenGlow);

  // Cashier NPC
  const fig = new THREE.Group();
  const skinM = new THREE.MeshLambertMaterial({color:0xffe4b5});
  const uniM  = new THREE.MeshLambertMaterial({color:0x7b1fa2});
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28,8,6), skinM);
  head.position.y = 1.45; fig.add(head);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.22,0.7,8), uniM);
  body.position.y = 0.8; fig.add(body);
  [-0.12, 0.12].forEach(lx => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.08,0.5,6), uniM);
    leg.position.set(lx, 0.25, 0); fig.add(leg);
  });
  // Gold bow-tie
  const bow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.04), _jwGold);
  bow.position.set(0, 1.1, 0.27); fig.add(bow);
  // Crown hat
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.22, 5), _jwGold);
  crown.position.y = 1.82; fig.add(crown);
  const crownBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.06,5), _jwGold);
  crownBrim.position.y = 1.72; fig.add(crownBrim);

  fig.position.set(JW_CX - JW_HD + 5.5, 0, JW_CZ - 2.0);
  fig.rotation.y = Math.PI/2;
  scene.add(fig);

  // Cashier sign
  const cc = document.createElement('canvas'); cc.width=512; cc.height=100;
  const cctx = cc.getContext('2d');
  cctx.fillStyle='#2d0a4e'; cctx.fillRect(0,0,512,100);
  cctx.strokeStyle='#ffd700'; cctx.lineWidth=4; cctx.strokeRect(4,4,504,92);
  cctx.fillStyle='#ffd700'; cctx.font='bold 38px Arial'; cctx.textAlign='center';
  cctx.fillText('[E] קופה — הכל חינם! 💍', 256, 65);
  const cashSign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 1.08),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cc),transparent:true})
  );
  cashSign.position.set(JW_CX - JW_HD + 7, 2.9, JW_CZ); scene.add(cashSign);
})();

// ── Decorative pillars ────────────────────────────────────────────────────────
[JW_CZ - 18, JW_CZ + 18].forEach(pz => {
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, JW_H, 8), _jwWall);
  pillar.position.set(JW_CX - JW_HD + 1, JW_H/2, pz); scene.add(pillar);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.4, 8), _jwGold);
  cap.position.set(JW_CX - JW_HD + 1, JW_H, pz); scene.add(cap);
});

// Center chandelier
const chandLight = new THREE.PointLight(0xffffff, 3.0, 55);
chandLight.position.set(JW_CX, JW_H - 1, JW_CZ); scene.add(chandLight);
const chandBase = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), _jwGold);
chandBase.position.set(JW_CX, JW_H - 0.5, JW_CZ); scene.add(chandBase);
for (let i = 0; i < 8; i++) {
  const a = (i/8)*Math.PI*2;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.9,5), _jwGold);
  arm.position.set(JW_CX + Math.cos(a)*0.6, JW_H - 0.9, JW_CZ + Math.sin(a)*0.6);
  arm.rotation.z = Math.PI/2 - 0.4; scene.add(arm);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4),
    new THREE.MeshBasicMaterial({color:0xffffaa}));
  bulb.position.set(JW_CX + Math.cos(a)*1.0, JW_H - 1.2, JW_CZ + Math.sin(a)*1.0);
  scene.add(bulb);
}

// ── UI ────────────────────────────────────────────────────────────────────────
const jwCart = [];
let jwReceiptTimer = 0;

const jwHintEl = document.createElement('div');
jwHintEl.style.cssText = [
  'position:fixed','bottom:88px','left:50%','transform:translateX(-50%)',
  'background:rgba(45,10,78,0.95)','color:#ffd700','font-size:15px','font-weight:bold',
  'padding:7px 22px','border-radius:14px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','text-align:center',
  'border:2px solid #ffd700',
].join(';');
document.body.appendChild(jwHintEl);

const jwReceiptEl = document.createElement('div');
jwReceiptEl.style.cssText = [
  'position:fixed','top:22%','left:50%','transform:translateX(-50%)',
  'background:rgba(20,5,40,0.97)','color:#ffd700','font-size:15px',
  'padding:24px 34px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Arial,sans-serif','text-align:right','direction:rtl',
  'border:3px solid #ffd700','min-width:320px',
].join(';');
document.body.appendChild(jwReceiptEl);

function getJWNearItem() {
  for (const jm of jwItemMeshes) {
    if (jm.taken) continue;
    const dx = player.position.x - jm.worldX;
    const dz = player.position.z - jm.worldZ;
    if (Math.sqrt(dx*dx+dz*dz) < 2.5) return jm;
  }
  return null;
}

function isNearJWCashier() {
  const dx = player.position.x - (JW_CX - JW_HD + 7);
  const dz = player.position.z - JW_CZ;
  return Math.sqrt(dx*dx+dz*dz) < 4.5;
}

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  const nearJ = getJWNearItem();
  if (nearJ) {
    nearJ.taken = true;
    nearJ.group.position.y += 50;  // remove from display
    jwCart.push(nearJ.data);
    jwHintEl.textContent = `💍 נלקח: ${nearJ.data.name} — חינם! ✨`;
    jwHintEl.style.display = 'block';
    return;
  }
  if (isNearJWCashier()) {
    if (jwCart.length === 0) {
      jwHintEl.textContent = 'בחר תכשיטים מהמסכים תחילה 💍';
      jwHintEl.style.display = 'block'; return;
    }
    let lines = jwCart.map(p => `• ${p.name}`).join('<br>');
    jwReceiptEl.innerHTML =
      `<b style="font-size:20px;color:#ffd700">💍 Golden Jewelry — קבלה</b><br><br>` +
      `${lines}<br><br>` +
      `<b style="font-size:17px;color:#ffd700">סה"כ: חינם! 🎁</b><br><br>` +
      `<span style="color:#ffeeaa;font-size:16px">` +
      `את חמודה מידי לשם —<br>הכל חינם בשבילך 💛</span>`;
    jwReceiptEl.style.display = 'block';
    jwCart.length = 0;
    jwReceiptTimer = 6.0;
  }
});

// ── Update ────────────────────────────────────────────────────────────────────
function updateJewelry(dt) {
  if (jwReceiptTimer > 0) {
    jwReceiptTimer -= dt;
    if (jwReceiptTimer <= 0) jwReceiptEl.style.display = 'none';
  }
  const nearJ = getJWNearItem();
  const nearReg = isNearJWCashier();
  if (nearJ) {
    jwHintEl.textContent = `[E] קח 💍 ${nearJ.data.name} — חינם!`;
    jwHintEl.style.display = 'block';
  } else if (nearReg && jwCart.length > 0) {
    jwHintEl.textContent = `[E] שלם — ${jwCart.length} תכשיטים (חינם!) 💍`;
    jwHintEl.style.display = 'block';
  } else if (nearReg) {
    jwHintEl.textContent = '💍 ברוכים הבאים! כל התכשיטים חינם לסנופי!';
    jwHintEl.style.display = 'block';
  } else {
    if (jwReceiptTimer <= 0) jwHintEl.style.display = 'none';
  }
}
