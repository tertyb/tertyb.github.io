// ── Super-Pharm (East Wing) ───────────────────────────────────────────────────
// Building: 54 wide (z), 40 deep (x), 11 tall
// Center: (148, 0) — east end of extended main road
// Entrance faces WEST (at x=128)

const SP_CX = 148, SP_CZ = 0;
const SP_HW = 27;   // half-width  (z: -27 to +27)
const SP_HD = 20;   // half-depth  (x: 128 to 168)
const SP_H  = 11;   // height

// Extend main road east to reach entrance
makeRoad(96, 0, 6, 64, false, 0.02);   // x=64 → x=128

// ── Materials ─────────────────────────────────────────────────────────────────
const _spGreen   = new THREE.MeshLambertMaterial({ color: 0x009944 });
const _spWhite   = new THREE.MeshLambertMaterial({ color: 0xf8f8f8 });
const _spGray    = new THREE.MeshLambertMaterial({ color: 0xd0d0d0 });
const _spGlass   = new THREE.MeshBasicMaterial({ color: 0xc0eaff, transparent:true, opacity:0.5 });
const _spShelf   = new THREE.MeshLambertMaterial({ color: 0x5d3a1a });   // dark walnut brown
const _spShelfDk = new THREE.MeshLambertMaterial({ color: 0xf5deb3 });   // wheat/cream boards (high contrast)
const _spTile    = new THREE.MeshLambertMaterial({ color: 0xffffff });   // bright white
const _spTileGrn = new THREE.MeshLambertMaterial({ color: 0x4dd0e1 });   // cyan-teal
const _spCounter = new THREE.MeshLambertMaterial({ color: 0x006633 });   // deep green counter

// ── Exterior ──────────────────────────────────────────────────────────────────
(function buildExterior() {
  // Main walls — warm peach/cream, clearly not white
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xf5c89a });

  // North wall
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(SP_HD*2, SP_H, 0.5), wallMat);
  northWall.position.set(SP_CX, SP_H/2, SP_CZ + SP_HW); northWall.castShadow=true; scene.add(northWall);
  // South wall
  const southWall = new THREE.Mesh(new THREE.BoxGeometry(SP_HD*2, SP_H, 0.5), wallMat);
  southWall.position.set(SP_CX, SP_H/2, SP_CZ - SP_HW); southWall.castShadow=true; scene.add(southWall);
  // East wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, SP_H, SP_HW*2), wallMat);
  eastWall.position.set(SP_CX + SP_HD, SP_H/2, SP_CZ); eastWall.castShadow=true; scene.add(eastWall);
  // West wall — two halves with 8-wide entrance gap
  const westWallN = new THREE.Mesh(new THREE.BoxGeometry(0.5, SP_H, SP_HW - 4), wallMat);
  westWallN.position.set(SP_CX - SP_HD, SP_H/2, SP_CZ + (SP_HW + 4)/2); scene.add(westWallN);
  const westWallS = new THREE.Mesh(new THREE.BoxGeometry(0.5, SP_H, SP_HW - 4), wallMat);
  westWallS.position.set(SP_CX - SP_HD, SP_H/2, SP_CZ - (SP_HW + 4)/2); scene.add(westWallS);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(SP_HD*2+1, 0.5, SP_HW*2+1),
    new THREE.MeshLambertMaterial({color:0x009944}));
  roof.position.set(SP_CX, SP_H+0.25, SP_CZ); scene.add(roof);

  // Green facade band (west face, above entrance)
  const facadeTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, SP_HW*2+1), _spGreen);
  facadeTop.position.set(SP_CX - SP_HD, SP_H - 1.5, SP_CZ); scene.add(facadeTop);

  // Big SUPER-PHARM sign
  const signC = document.createElement('canvas'); signC.width=1024; signC.height=200;
  const sctx = signC.getContext('2d');
  sctx.fillStyle='#009944'; sctx.fillRect(0,0,1024,200);
  sctx.fillStyle='#ffffff'; sctx.font='bold 130px Arial'; sctx.textAlign='center';
  sctx.fillText('Super-Pharm', 512, 148);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(SP_HW*2, 3),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(signC),transparent:true})
  );
  signMesh.position.set(SP_CX - SP_HD - 0.35, SP_H - 1.5, SP_CZ);
  signMesh.rotation.y = Math.PI/2; scene.add(signMesh);

  // ── Big rooftop sign — moved forward (west), red & white ──
  const _spRed = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
  const roofSignBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 6, SP_HW * 2 - 2),
    _spRed
  );
  roofSignBack.position.set(SP_CX - SP_HD - 4, SP_H + 3.5, SP_CZ);
  scene.add(roofSignBack);

  // Support pillars
  [-20, 0, 20].forEach(oz => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), _spRed);
    pillar.position.set(SP_CX - SP_HD - 4, SP_H + 0.6, SP_CZ + oz);
    scene.add(pillar);
  });

  // Canvas sign — red background, white text
  const bigC = document.createElement('canvas'); bigC.width = 2048; bigC.height = 512;
  const bctx = bigC.getContext('2d');
  bctx.fillStyle = '#cc0000'; bctx.fillRect(0, 0, 2048, 512);
  // White pharmacy cross on the left
  bctx.fillStyle = '#ffffff';
  bctx.fillRect(60, 160, 160, 60);   // horizontal bar
  bctx.fillRect(110, 110, 60, 160);  // vertical bar
  // Main text white
  bctx.font = 'bold 220px Arial'; bctx.textAlign = 'left'; bctx.fillStyle = '#ffffff';
  bctx.fillText('Super-Pharm', 280, 350);
  // White heart accent
  bctx.font = '180px Arial'; bctx.textAlign = 'right';
  bctx.fillText('🤍', 2020, 360);

  const bigSignMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(SP_HW * 2 - 2, 6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bigC), transparent: true, side: THREE.DoubleSide })
  );
  bigSignMesh.position.set(SP_CX - SP_HD - 4.61, SP_H + 3.5, SP_CZ);
  bigSignMesh.rotation.y = -Math.PI / 2; // face west
  scene.add(bigSignMesh);

  // Front windows (large glass panels either side of door)
  [SP_CZ - 15, SP_CZ + 15].forEach(wz => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 10), _spGlass);
    win.position.set(SP_CX - SP_HD, 4, wz); scene.add(win);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.2, 10.3), _spGreen);
    frame.position.set(SP_CX - SP_HD - 0.05, 4, wz); scene.add(frame);
  });

  // Glass entrance doors (2)
  [-2, 2].forEach(dz => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.5, 3.5), _spGlass);
    door.position.set(SP_CX - SP_HD, 1.9, SP_CZ + dz); scene.add(door);
  });
  // Door frame
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.0, 8.2), _spGreen);
  doorFrame.position.set(SP_CX - SP_HD, 2.1, SP_CZ); scene.add(doorFrame);

  // Entrance awning
  const awning = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 10), _spGreen);
  awning.position.set(SP_CX - SP_HD - 1.5, 4.2, SP_CZ); scene.add(awning);

  // Entrance mat
  const mat = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 6),
    new THREE.MeshLambertMaterial({color:0x006633}));
  mat.position.set(SP_CX - SP_HD - 1.5, 0.03, SP_CZ); scene.add(mat);

  // Exterior signpost with arrow
  const postMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,3,6),
    new THREE.MeshLambertMaterial({color:0x009944}));
  postMesh.position.set(SP_CX - SP_HD - 5, 1.5, SP_CZ); scene.add(postMesh);
  const arrowC = document.createElement('canvas'); arrowC.width=256; arrowC.height=80;
  const actx2 = arrowC.getContext('2d');
  actx2.fillStyle='#009944'; actx2.fillRect(0,0,256,80);
  actx2.fillStyle='#fff'; actx2.font='bold 22px Arial'; actx2.textAlign='center';
  actx2.fillText('Super-Pharm →', 128, 50);
  const arrowSign = new THREE.Mesh(new THREE.PlaneGeometry(2.5,0.8),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(arrowC),transparent:true}));
  arrowSign.position.set(SP_CX - SP_HD - 5, 3.2, SP_CZ); scene.add(arrowSign);

  // Colliders — thin wall segments (r=2) spaced every 4 units along each wall
  const _wR = 2;
  // North wall (z=+27), full width x: 128→168
  for (let wx = SP_CX - SP_HD + 2; wx <= SP_CX + SP_HD; wx += 4)
    colliders.push({x: wx, z: SP_CZ + SP_HW, radius: _wR});
  // South wall (z=-27), full width
  for (let wx = SP_CX - SP_HD + 2; wx <= SP_CX + SP_HD; wx += 4)
    colliders.push({x: wx, z: SP_CZ - SP_HW, radius: _wR});
  // East wall (x=168), full depth z: -27→+27
  for (let wz = SP_CZ - SP_HW + 2; wz <= SP_CZ + SP_HW; wz += 4)
    colliders.push({x: SP_CX + SP_HD, z: wz, radius: _wR});
  // West wall north half (z=4→27) — leaves entrance gap at z=-4 to +4
  for (let wz = SP_CZ + 5; wz <= SP_CZ + SP_HW; wz += 4)
    colliders.push({x: SP_CX - SP_HD, z: wz, radius: _wR});
  // West wall south half (z=-27→-4)
  for (let wz = SP_CZ - SP_HW; wz <= SP_CZ - 5; wz += 4)
    colliders.push({x: SP_CX - SP_HD, z: wz, radius: _wR});
})();

// ── Interior floor ────────────────────────────────────────────────────────────
(function buildFloor() {
  for (let ix = 0; ix < 5; ix++) {
    for (let iz = 0; iz < 9; iz++) {
      const isGreen = (ix + iz) % 2 === 0;
      const tile = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 5.8),
        isGreen ? _spTileGrn : _spTile);
      tile.rotation.x = -Math.PI/2;
      tile.position.set(SP_CX - SP_HD + 4 + ix*8, 0.02, SP_CZ - SP_HW + 3 + iz*6);
      scene.add(tile);
    }
  }
  // Ceiling lights
  for (let ix = 0; ix < 4; ix++) {
    for (let iz = 0; iz < 5; iz++) {
      const pl = new THREE.PointLight(0xfff5e8, 0.7, 25);
      pl.position.set(SP_CX - SP_HD + 8 + ix*10, SP_H - 0.5, SP_CZ - SP_HW + 10 + iz*10);
      scene.add(pl);
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.5),
        new THREE.MeshBasicMaterial({color:0xffffdd}));
      fixture.position.set(SP_CX - SP_HD + 8 + ix*10, SP_H - 0.3, SP_CZ - SP_HW + 10 + iz*10);
      scene.add(fixture);
    }
  }
})();

// ── Shelf builder ─────────────────────────────────────────────────────────────
function buildShelfUnit(wx, wz, len, label, facingDir) {
  // facingDir: 'z+' or 'z-' or 'x+' or 'x-'
  const isZ = facingDir === 'z+' || facingDir === 'z-';
  const g = new THREE.Group();
  // Back panel
  const bpW = isZ ? len : 0.3;
  const bpD = isZ ? 0.3 : len;
  const bp = new THREE.Mesh(new THREE.BoxGeometry(bpW, 2.8, bpD), _spShelf);
  bp.position.y = 1.4; g.add(bp);
  // Shelf boards
  [0.6, 1.2, 1.85].forEach(sy => {
    const boardW = isZ ? len : 0.65;
    const boardD = isZ ? 0.65 : len;
    const board = new THREE.Mesh(new THREE.BoxGeometry(boardW, 0.07, boardD), _spShelfDk);
    board.position.y = sy; g.add(board);
  });
  // Side panels
  const numSides = Math.round(len / 6);
  for (let si = 0; si <= numSides; si++) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(
      isZ ? 0.12 : 0.65, 2.8, isZ ? 0.65 : 0.12), _spShelf);
    const offset = -len/2 + si * (len/numSides);
    side.position.set(isZ ? offset : 0, 1.4, isZ ? 0 : offset);
    g.add(side);
  }
  // Aisle label sign
  const lc = document.createElement('canvas'); lc.width=256; lc.height=64;
  const lctx = lc.getContext('2d');
  lctx.fillStyle='#009944'; lctx.fillRect(0,0,256,64);
  lctx.fillStyle='#ffffff'; lctx.font='bold 24px Arial'; lctx.textAlign='center';
  lctx.fillText(label, 128, 44);
  const lsign = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lc),transparent:true}));
  lsign.position.y = 3.1;
  if (facingDir==='z+') lsign.rotation.y = Math.PI;
  else if (facingDir==='x-') lsign.rotation.y = -Math.PI/2;
  else if (facingDir==='x+') lsign.rotation.y = Math.PI/2;
  g.add(lsign);

  g.position.set(wx, 0, wz); scene.add(g);
}

// 5 double-sided aisle rows (each row has shelf on both sides)
// Aisles run EAST-WEST (z direction), spaced in x
const AISLE_XS   = [SP_CX-14, SP_CX-5, SP_CX+4, SP_CX+13, SP_CX+22];
const AISLE_LBLS = ['💄 Makeup','🧴 Skincare','💇 Hair Care','🌸 Perfumes','🛁 Body Care'];

AISLE_XS.forEach((ax, ai) => {
  // North-facing shelf (products face south into aisle)
  buildShelfUnit(ax, SP_CZ + 12, SP_HW*1.5, AISLE_LBLS[ai], 'z-');
  // South-facing shelf (products face north into aisle)
  buildShelfUnit(ax, SP_CZ - 12, SP_HW*1.5, AISLE_LBLS[ai], 'z+');
});

// Back wall shelf (east wall)
buildShelfUnit(SP_CX + SP_HD - 1.5, SP_CZ, SP_HW*2 - 2, '✨ Special Offers', 'x-');

// ── Products ──────────────────────────────────────────────────────────────────
const SP_BEAUTY = [
  // Makeup aisle (ax index 0)
  {name:'Maybelline Lipstick',    price:45,  color:0xff2266, aisle:0, row:0, slot:0},
  {name:'MAC Foundation',         price:89,  color:0xddaa88, aisle:0, row:0, slot:1},
  {name:'Rimmel Mascara',         price:35,  color:0x111133, aisle:0, row:0, slot:2},
  {name:'NYX Eyeshadow Palette',  price:62,  color:0x8844cc, aisle:0, row:0, slot:3},
  {name:'Revlon Blush',           price:38,  color:0xff88aa, aisle:0, row:1, slot:0},
  {name:'Essence Nail Polish',    price:18,  color:0xff4488, aisle:0, row:1, slot:1},
  {name:'L\'Oréal Concealer',    price:52,  color:0xffcc99, aisle:0, row:1, slot:2},
  {name:'Bourjois Rouge',         price:48,  color:0xcc2244, aisle:0, row:1, slot:3},
  // Skincare aisle (ax index 1)
  {name:'Neutrogena Face Cream',  price:48,  color:0xffeeaa, aisle:1, row:0, slot:0},
  {name:'La Roche-Posay Serum',   price:95,  color:0x4488ff, aisle:1, row:0, slot:1},
  {name:'Vichy Mineral Toner',    price:42,  color:0x88ccff, aisle:1, row:0, slot:2},
  {name:'Olay Total Moisturizer', price:55,  color:0xffcc88, aisle:1, row:0, slot:3},
  {name:'CeraVe Eye Cream',       price:68,  color:0xffffff, aisle:1, row:1, slot:0},
  {name:'Garnier SPF 50',         price:38,  color:0xffff88, aisle:1, row:1, slot:1},
  {name:'Bioderma Cleansing',     price:72,  color:0xffe0cc, aisle:1, row:1, slot:2},
  {name:'Avène Sunscreen',        price:65,  color:0xcceeaa, aisle:1, row:1, slot:3},
  // Hair Care aisle (ax index 2)
  {name:'L\'Oréal Elvive Oil',   price:44,  color:0xffaa00, aisle:2, row:0, slot:0},
  {name:'Pantene Shampoo',        price:28,  color:0x4466cc, aisle:2, row:0, slot:1},
  {name:'TRESemmé Hair Mask',     price:38,  color:0x882288, aisle:2, row:0, slot:2},
  {name:'Schwarzkopf BC Cream',   price:55,  color:0xff6600, aisle:2, row:0, slot:3},
  {name:'Redken All Soft',        price:68,  color:0xcc2222, aisle:2, row:1, slot:0},
  {name:'Wella Professionals',    price:75,  color:0x222288, aisle:2, row:1, slot:1},
  {name:'Head & Shoulders',       price:24,  color:0x2244aa, aisle:2, row:1, slot:2},
  {name:'Garnier Fructis',        price:22,  color:0x44aa22, aisle:2, row:1, slot:3},
  // Perfumes aisle (ax index 3)
  {name:'Chanel No.5',            price:280, color:0xffd700, aisle:3, row:0, slot:0},
  {name:'Dior Miss Dior',         price:320, color:0xffb6c1, aisle:3, row:0, slot:1},
  {name:'YSL Black Opium',        price:295, color:0x111111, aisle:3, row:0, slot:2},
  {name:'Burberry Her',           price:245, color:0xcc4444, aisle:3, row:1, slot:0},
  {name:'Armani Sì',              price:265, color:0xff8899, aisle:3, row:1, slot:1},
  {name:'Gucci Bloom',            price:275, color:0xffaacc, aisle:3, row:1, slot:2},
  // Body Care aisle (ax index 4)
  {name:'Nivea Body Lotion',      price:22,  color:0x003399, aisle:4, row:0, slot:0},
  {name:'Dove Body Scrub',        price:35,  color:0xfff0c8, aisle:4, row:0, slot:1},
  {name:'Aveeno Daily Lotion',    price:48,  color:0xd4a850, aisle:4, row:0, slot:2},
  {name:'The Body Shop Butter',   price:65,  color:0x44aa44, aisle:4, row:0, slot:3},
  {name:'Lush Shower Gel',        price:52,  color:0x8844ff, aisle:4, row:1, slot:0},
  {name:'Soap & Glory',           price:44,  color:0xff88cc, aisle:4, row:1, slot:1},
  {name:'Vaseline Healing',       price:18,  color:0xaaddff, aisle:4, row:1, slot:2},
  {name:'Palmer\'s Cocoa Butter', price:28,  color:0xd4a040, aisle:4, row:1, slot:3},
];

const spProductMeshes = [];

SP_BEAUTY.forEach((p, pi) => {
  const ax = AISLE_XS[p.aisle];
  const shelfZ = p.row === 0 ? SP_CZ + 12 : SP_CZ - 12;
  const shelfY  = [0.65, 1.28, 1.95][pi % 3];
  const slotOff = (p.slot - 1.5) * 4.5;
  const faceDirZ = p.row === 0 ? 0.55 : -0.55;

  const g = new THREE.Group();
  // Bottle / jar shape
  const useJar = p.name.includes('Cream') || p.name.includes('Mask') || p.name.includes('Butter');
  let bottle;
  if (useJar) {
    bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.28,10),
      new THREE.MeshLambertMaterial({color:p.color}));
    bottle.position.y = 0.17;
  } else if (p.name.includes('Oil') || p.name.includes('Serum') || p.name.includes('Shampoo') ||
             p.name.includes('Lotion') || p.name.includes('Gel') || p.name.includes('Toner')) {
    bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,0.45,9),
      new THREE.MeshLambertMaterial({color:p.color}));
    bottle.position.y = 0.24;
  } else if (p.name.includes('Lipstick') || p.name.includes('Mascara') || p.name.includes('Polish')) {
    bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.38,7),
      new THREE.MeshLambertMaterial({color:p.color}));
    bottle.position.y = 0.21;
  } else {
    bottle = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.35,0.12),
      new THREE.MeshLambertMaterial({color:p.color}));
    bottle.position.y = 0.2;
  }
  bottle.castShadow = true; g.add(bottle);

  // Product label
  const lc = document.createElement('canvas'); lc.width=128; lc.height=72;
  const lctx = lc.getContext('2d');
  const hex = '#' + p.color.toString(16).padStart(6,'0');
  lctx.fillStyle = hex; lctx.fillRect(0,0,128,72);
  lctx.fillStyle = p.color > 0x888888 ? '#222222' : '#ffffff';
  lctx.font = 'bold 11px Arial'; lctx.textAlign='center';
  const words = p.name.split(' ');
  words.forEach((w, wi) => lctx.fillText(w, 64, 16 + wi*14));
  lctx.font = '11px Arial';
  lctx.fillText('₪' + p.price, 64, 65);
  const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.18),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lc),transparent:true}));
  labelMesh.position.set(0, bottle.position.y, 0.14); g.add(labelMesh);

  g.position.set(ax + (Math.random()-0.5)*0.3, shelfY, shelfZ + faceDirZ + slotOff);
  scene.add(g);
  spProductMeshes.push({ group:g, data:p, inCart:false, worldX:g.position.x, worldZ:g.position.z });
});

// ── Cashier counter ───────────────────────────────────────────────────────────
(function buildCashier() {
  // Main L-shaped counter
  const counter1 = new THREE.Mesh(new THREE.BoxGeometry(12, 1.1, 1.8), _spCounter);
  counter1.position.set(SP_CX - SP_HD + 8, 0.55, SP_CZ); scene.add(counter1);
  const cTop1 = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.1, 2.0), _spWhite);
  cTop1.position.set(SP_CX - SP_HD + 8, 1.15, SP_CZ); scene.add(cTop1);

  // Dividers between 3 checkout lanes
  [-3, 3].forEach(dz => {
    const div = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 0.15),
      new THREE.MeshLambertMaterial({color:0xaaaaaa}));
    div.position.set(SP_CX - SP_HD + 8, 1.35, SP_CZ + dz); scene.add(div);
  });

  // POS screens at each lane
  [-3, 0, 3].forEach(lz => {
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.05),
      new THREE.MeshBasicMaterial({color:0x001122}));
    screen.position.set(SP_CX - SP_HD + 5, 1.55, SP_CZ + lz); screen.rotation.y=0.3; scene.add(screen);
    const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.36),
      new THREE.MeshBasicMaterial({color:0x0088ff}));
    screenGlow.position.set(SP_CX - SP_HD + 5.04, 1.55, SP_CZ + lz); screenGlow.rotation.y=0.3; scene.add(screenGlow);
  });

  // Belt conveyor
  const belt = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.05, 1.2),
    new THREE.MeshLambertMaterial({color:0x333333}));
  belt.position.set(SP_CX - SP_HD + 10, 1.17, SP_CZ); scene.add(belt);

  // Cashier sign
  const cashierC = document.createElement('canvas'); cashierC.width=512; cashierC.height=100;
  const cactx = cashierC.getContext('2d');
  cactx.fillStyle='#009944'; cactx.fillRect(0,0,512,100);
  cactx.fillStyle='#fff'; cactx.font='bold 44px Arial'; cactx.textAlign='center';
  cactx.fillText('[E] קופה — Pay Here 💳', 256, 68);
  const cashierSign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 1.08),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cashierC),transparent:true})
  );
  cashierSign.position.set(SP_CX - SP_HD + 8, 2.8, SP_CZ); scene.add(cashierSign);

  // Cashier NPC (simple figure)
  const cashierFig = new THREE.Group();
  const skinM = new THREE.MeshLambertMaterial({color:0xffe4b5});
  const uniformM = new THREE.MeshLambertMaterial({color:0x009944});
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28,8,6), skinM);
  head.position.y=1.45; cashierFig.add(head);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.22,0.7,8), uniformM);
  body.position.y=0.8; cashierFig.add(body);
  [-0.12,0.12].forEach(lx => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.08,0.5,6), uniformM);
    leg.position.set(lx,0.25,0); cashierFig.add(leg);
  });
  // Name tag
  const tagM = new THREE.MeshLambertMaterial({color:0xffffff});
  const tag = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.1,0.02), tagM);
  tag.position.set(0.1,0.92,0.26); cashierFig.add(tag);
  // Hat
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.1,8), uniformM);
  hat.position.y=1.8; cashierFig.add(hat);

  cashierFig.position.set(SP_CX - SP_HD + 6, 0, SP_CZ - 1.8);
  cashierFig.rotation.y = Math.PI / 2;
  scene.add(cashierFig);

  // Bar-code scanner
  const scanner = new THREE.Mesh(new THREE.BoxGeometry(0.25,0.15,0.15),
    new THREE.MeshLambertMaterial({color:0x222222}));
  scanner.position.set(SP_CX - SP_HD + 6.5, 1.25, SP_CZ); scene.add(scanner);
})();

// ── Product display island at entrance ────────────────────────────────────────
(function buildDisplayIsland() {
  const island = new THREE.Mesh(new THREE.BoxGeometry(4, 1.0, 4),
    new THREE.MeshLambertMaterial({color:0x009944}));
  island.position.set(SP_CX - SP_HD + 6, 0.5, SP_CZ + 14); scene.add(island);
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 4.2), _spWhite);
  islandTop.position.set(SP_CX - SP_HD + 6, 1.06, SP_CZ + 14); scene.add(islandTop);
  // Display sign
  const dc = document.createElement('canvas'); dc.width=256; dc.height=64;
  const dctx = dc.getContext('2d');
  dctx.fillStyle='#ff4400'; dctx.fillRect(0,0,256,64);
  dctx.fillStyle='#fff'; dctx.font='bold 26px Arial'; dctx.textAlign='center';
  dctx.fillText('🔥 SALE! מבצע!', 128, 44);
  const dispSign = new THREE.Mesh(new THREE.PlaneGeometry(2.5,0.6),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(dc),transparent:true}));
  dispSign.position.set(SP_CX - SP_HD + 6, 1.8, SP_CZ + 14); scene.add(dispSign);
  // A few sale items on island
  [[0xff3366,0],[0xffaa00,1],[0x4488cc,2]].forEach(([col,si]) => {
    const item = new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.15,0.4,8),
      new THREE.MeshLambertMaterial({color:col}));
    item.position.set(SP_CX - SP_HD + 5 + si, 1.35, SP_CZ + 14 + (si-1)*1.2); scene.add(item);
  });
})();

// ── Shopping cart builder ──────────────────────────────────────────────────────
function makeShoppingCart(cx, cz, isPlayerCart) {
  const cart = new THREE.Group();
  const metalM = new THREE.MeshLambertMaterial({color: isPlayerCart ? 0x00cc55 : 0xbbbbbb});
  // Basket frame (4 sides)
  // side walls of basket
  [[-0.42,0,0],[0.42,0,0]].forEach(([px]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 1.1), metalM);
    bar.position.set(px, 0.65, 0); cart.add(bar);
  });
  [0,-1,1].forEach(pz => {
    if (pz === 0) return;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.06), metalM);
    bar.position.set(0, 0.65, pz * 0.55); cart.add(bar);
  });
  // Top rim
  const rim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 1.15), metalM);
  rim.position.y = 0.92; cart.add(rim);
  // Bottom basket floor
  const floor2 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.04, 1.08),
    new THREE.MeshLambertMaterial({color:0x999999}));
  floor2.position.y = 0.38; cart.add(floor2);
  // Handle bar
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.06, 0.06),
    new THREE.MeshLambertMaterial({color:0x444444}));
  handle.position.set(0, 1.05, -0.55); cart.add(handle);
  // Wheels
  [[-0.3,-0.42],[0.3,-0.42],[-0.3,0.42],[0.3,0.42]].forEach(([wx,wz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.07,8),
      new THREE.MeshLambertMaterial({color:0x222222}));
    wheel.rotation.x = Math.PI/2; wheel.position.set(wx, 0.1, wz); cart.add(wheel);
  });
  cart.position.set(cx, 0, cz);
  scene.add(cart);
  return cart;
}

// Parked carts near entrance (stack)
[0,1,2].forEach(i => makeShoppingCart(SP_CX - SP_HD + 2, SP_CZ - SP_HW + 4 + i*1.2, false));

// Carts scattered through aisles
makeShoppingCart(AISLE_XS[0] - 1, SP_CZ + 5,  false);
makeShoppingCart(AISLE_XS[1] + 1, SP_CZ - 5,  false);
makeShoppingCart(AISLE_XS[2] - 1, SP_CZ + 8,  false);
makeShoppingCart(AISLE_XS[3] + 1, SP_CZ - 8,  false);
makeShoppingCart(AISLE_XS[4] - 1, SP_CZ + 3,  false);

// Player's active cart (green) — follows player inside store
const spPlayerCart = makeShoppingCart(SP_CX - SP_HD + 5, SP_CZ, true);
const spCartItems = [];  // items placed inside player cart

// ── UI ────────────────────────────────────────────────────────────────────────
const spCart = [];
let spReceiptTimer = 0;

const spHintEl = document.createElement('div');
spHintEl.style.cssText=[
  'position:fixed','bottom:55px','left:50%','transform:translateX(-50%)',
  'background:rgba(0,153,68,0.94)','color:#fff','font-size:15px','font-weight:bold',
  'padding:7px 22px','border-radius:14px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','text-align:center',
].join(';');
document.body.appendChild(spHintEl);

const spReceiptEl = document.createElement('div');
spReceiptEl.style.cssText=[
  'position:fixed','top:22%','left:50%','transform:translateX(-50%)',
  'background:rgba(0,80,30,0.97)','color:#fff','font-size:14px',
  'padding:22px 32px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Arial,sans-serif','text-align:right',
  'border:2px solid #00cc66','min-width:300px','direction:rtl',
].join(';');
document.body.appendChild(spReceiptEl);

const spCartEl = document.createElement('div');
spCartEl.style.cssText=[
  'position:fixed','top:12px','right:12px',
  'background:rgba(0,153,68,0.92)','color:#fff','font-size:13px',
  'padding:8px 14px','border-radius:12px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','min-width:180px',
].join(';');
document.body.appendChild(spCartEl);

function getSPNearProduct() {
  for (const pm of spProductMeshes) {
    if (pm.inCart) continue;
    const dx = player.position.x - pm.worldX;
    const dz = player.position.z - pm.worldZ;
    if (Math.sqrt(dx*dx+dz*dz) < 2.0) return pm;
  }
  return null;
}

function isNearSPCashier() {
  const dx = player.position.x - (SP_CX - SP_HD + 8);
  const dz = player.position.z - SP_CZ;
  return Math.sqrt(dx*dx+dz*dz) < 4.5;
}

function updateSpCartUI() {
  if (spCart.length === 0) { spCartEl.style.display='none'; return; }
  spCartEl.style.display='block';
  const total = spCart.reduce((s,p)=>s+p.price,0);
  spCartEl.innerHTML = `🛒 סל קניות: ${spCart.length} פריטים<br>סה"כ: ₪${total}`;
}

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  const nearP = getSPNearProduct();
  if (nearP) {
    nearP.inCart = true;
    // Move item into the player cart visually
    const slotIdx = spCartItems.length;
    const row = Math.floor(slotIdx / 3);
    const col = slotIdx % 3;
    nearP.group.position.set(
      spPlayerCart.position.x + (col - 1) * 0.25,
      0.55 + row * 0.28,
      spPlayerCart.position.z
    );
    nearP.group.rotation.set(0, 0, 0);
    nearP.group.scale.set(0.7, 0.7, 0.7);
    spCartItems.push(nearP.group);
    spCart.push(nearP.data);
    updateSpCartUI();
    spHintEl.textContent = `✅ נוסף לעגלה 🛒  ${nearP.data.name} — ₪${nearP.data.price}`;
    spHintEl.style.display='block';
    return;
  }
  if (isNearSPCashier()) {
    if (spCart.length === 0) {
      spHintEl.textContent = 'הסל ריק — קח מוצרים מהמדפים תחילה 🛒';
      spHintEl.style.display='block'; return;
    }
    const total = spCart.reduce((s,p)=>s+p.price,0);
    let lines = spCart.map(p=>`• ${p.name} — ₪${p.price}`).join('<br>');
    spReceiptEl.innerHTML =
      `<b style="font-size:18px">🧾 Super-Pharm — קבלה</b><br><br>${lines}<br><br>` +
      `<b style="font-size:16px">סה"כ: ₪${total}</b><br><br>` +
      `<span style="color:#88ffaa">תודה סנופי! קניה נעימה 💚</span>`;
    spReceiptEl.style.display='block';
    // Clear items from cart visually
    spCartItems.forEach(g => { g.position.y += 50; });
    spCartItems.length = 0;
    spCart.length=0;
    updateSpCartUI();
    spReceiptTimer=5.0;
  }
});

// ── Update ────────────────────────────────────────────────────────────────────
function updateSuperPharm(dt) {
  // Player cart follows player at a small offset behind them
  const insideSP = player.position.x > SP_CX - SP_HD - 2 && player.position.x < SP_CX + SP_HD &&
                   player.position.z > SP_CZ - SP_HW && player.position.z < SP_CZ + SP_HW;
  if (insideSP) {
    const behindX = player.position.x - Math.sin(player.rotation.y) * 1.6;
    const behindZ = player.position.z - Math.cos(player.rotation.y) * 1.6;
    spPlayerCart.position.x += (behindX - spPlayerCart.position.x) * Math.min(1, dt * 5);
    spPlayerCart.position.z += (behindZ - spPlayerCart.position.z) * Math.min(1, dt * 5);
    spPlayerCart.rotation.y = player.rotation.y;
    // Update items sitting inside cart
    spCartItems.forEach((g, i) => {
      const row = Math.floor(i / 3), col = i % 3;
      g.position.set(
        spPlayerCart.position.x + (col - 1) * 0.25,
        0.55 + row * 0.28,
        spPlayerCart.position.z
      );
    });
  }

  if (spReceiptTimer > 0) {
    spReceiptTimer -= dt;
    if (spReceiptTimer <= 0) spReceiptEl.style.display='none';
  }

  const nearP = getSPNearProduct();
  const nearReg = isNearSPCashier();
  if (nearP) {
    spHintEl.textContent=`[E] הוסף לסל 🛒  ${nearP.data.name} — ₪${nearP.data.price}`;
    spHintEl.style.display='block';
  } else if (nearReg && spCart.length > 0) {
    const t2=spCart.reduce((s,p)=>s+p.price,0);
    spHintEl.textContent=`[E] שלם קופה — ₪${t2}  (${spCart.length} פריטים) 💳`;
    spHintEl.style.display='block';
  } else if (nearReg) {
    spHintEl.textContent='💊 ברוכים הבאים ל-Super-Pharm! קח מוצרים מהמדפים';
    spHintEl.style.display='block';
  } else {
    if (spReceiptTimer<=0) spHintEl.style.display='none';
  }
}
