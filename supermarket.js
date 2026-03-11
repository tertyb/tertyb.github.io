// ── Snoopy Market (Giant Supermarket) ─────────────────────────────────────────
// Located between main town and parking lot
// Building: 70 wide (x), 50 deep (z), 11 tall
// Center: (0, 0, -145)
// Entrance on NORTH face (z = -120), facing toward main town

const SM_CX = 0, SM_CZ = -145;
const SM_HX = 35;   // half-width in x  (x: -35..+35)
const SM_HZ = 25;   // half-depth in z  (z: -170..-120)
const SM_H  = 11;

// ── Materials ─────────────────────────────────────────────────────────────────
const _smWall    = new THREE.MeshLambertMaterial({ color: 0xfffde7 }); // warm cream
const _smAccent  = new THREE.MeshLambertMaterial({ color: 0x1565c0 }); // royal blue stripe
const _smRoof    = new THREE.MeshLambertMaterial({ color: 0x0d47a1 }); // deep blue roof
const _smShelf   = new THREE.MeshLambertMaterial({ color: 0x6d4c41 }); // warm brown shelf
const _smShelfBd = new THREE.MeshLambertMaterial({ color: 0xd7ccc8 }); // light board
const _smFloor   = new THREE.MeshLambertMaterial({ color: 0xe0f2f1 }); // mint floor
const _smTileAlt = new THREE.MeshLambertMaterial({ color: 0xffffff }); // white tile
const _smCounter = new THREE.MeshLambertMaterial({ color: 0x1a237e }); // dark blue counter

// ── Exterior walls ────────────────────────────────────────────────────────────
(function buildSMExterior() {
  const entW = 12; // entrance opening

  // North wall — two halves with centered entrance gap
  const nHalf = (SM_HX * 2 - entW) / 2;
  [-1, 1].forEach(s => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(nHalf, SM_H, 0.5), _smWall);
    w.position.set(SM_CX + s * (nHalf / 2 + entW / 2), SM_H / 2, SM_CZ - SM_HZ);
    scene.add(w);
  });
  // Entrance header (blue strip over door)
  const hdr = new THREE.Mesh(new THREE.BoxGeometry(entW + 1, 2.2, 0.6), _smAccent);
  hdr.position.set(SM_CX, SM_H - 1.1, SM_CZ - SM_HZ);
  scene.add(hdr);

  // South wall
  const sw = new THREE.Mesh(new THREE.BoxGeometry(SM_HX * 2, SM_H, 0.5), _smWall);
  sw.position.set(SM_CX, SM_H / 2, SM_CZ + SM_HZ); scene.add(sw);
  // East wall
  const ew = new THREE.Mesh(new THREE.BoxGeometry(0.5, SM_H, SM_HZ * 2), _smWall);
  ew.position.set(SM_CX + SM_HX, SM_H / 2, SM_CZ); scene.add(ew);
  // West wall
  const ww = new THREE.Mesh(new THREE.BoxGeometry(0.5, SM_H, SM_HZ * 2), _smWall);
  ww.position.set(SM_CX - SM_HX, SM_H / 2, SM_CZ); scene.add(ww);

  // Blue accent stripe around building (mid-height)
  [
    [SM_HX*2+1, 0, SM_CZ - SM_HZ],
    [SM_HX*2+1, 0, SM_CZ + SM_HZ],
  ].forEach(([w2, , z]) => {
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(w2, 0.8, 0.6), _smAccent);
    s2.position.set(SM_CX, SM_H * 0.55, z); scene.add(s2);
  });
  [-SM_HX, SM_HX].forEach(x => {
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, SM_HZ * 2 + 1), _smAccent);
    s2.position.set(x, SM_H * 0.55, SM_CZ); scene.add(s2);
  });

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(SM_HX*2+1, 0.7, SM_HZ*2+1), _smRoof);
  roof.position.set(SM_CX, SM_H + 0.35, SM_CZ); scene.add(roof);

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(SM_HX*2-1, SM_HZ*2-1), _smFloor);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(SM_CX, 0.02, SM_CZ); scene.add(floor);

  // Checkerboard white tiles
  for (let xi = -28; xi <= 28; xi += 7) {
    for (let zi = -22; zi <= 22; zi += 7) {
      if (((Math.round(xi/7+4) + Math.round(zi/7+3)) % 2) === 0) continue;
      const t = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6.5), _smTileAlt);
      t.rotation.x = -Math.PI/2;
      t.position.set(SM_CX + xi, 0.025, SM_CZ + zi); scene.add(t);
    }
  }

  // Interior ceiling lights
  for (let xi = -24; xi <= 24; xi += 16) {
    for (let zi = -18; zi <= 18; zi += 12) {
      const lm = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 1.2),
        new THREE.MeshLambertMaterial({ color: 0xffffcc }));
      lm.position.set(SM_CX + xi, SM_H - 0.1, SM_CZ + zi); scene.add(lm);
      const pl = new THREE.PointLight(0xffffff, 0.9, 28);
      pl.position.set(SM_CX + xi, SM_H - 1, SM_CZ + zi); scene.add(pl);
    }
  }
})();

// ── Big rooftop sign ───────────────────────────────────────────────────────────
(function buildSMSign() {
  // Sign board
  const board = new THREE.Mesh(new THREE.BoxGeometry(40, 5, 0.5), _smAccent);
  board.position.set(SM_CX, SM_H + 3.2, SM_CZ - SM_HZ); scene.add(board);

  // Sign canvas
  const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 128;
  const sctx = sc.getContext('2d');
  sctx.fillStyle = '#0d47a1'; sctx.fillRect(0, 0, 1024, 128);
  sctx.strokeStyle = '#ffcc00'; sctx.lineWidth = 5; sctx.strokeRect(4, 4, 1016, 120);
  sctx.fillStyle = '#ffcc00'; sctx.font = 'bold 72px Arial'; sctx.textAlign = 'center';
  sctx.fillText('🛒  סנופי מרקט  🐾', 512, 92);
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(39.5, 4.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true }));
  signFace.position.set(SM_CX, SM_H + 3.2, SM_CZ - SM_HZ + 0.3); scene.add(signFace);

  // Back side of sign
  const signBack = signFace.clone();
  signBack.rotation.y = Math.PI;
  signBack.position.z -= 0.6; scene.add(signBack);

  // Sign post lights
  [-18, 18].forEach(ox => {
    const pl = new THREE.PointLight(0xffdd44, 1.2, 15);
    pl.position.set(SM_CX + ox, SM_H + 4, SM_CZ - SM_HZ); scene.add(pl);
  });
})();

// ── Aisle shelves ─────────────────────────────────────────────────────────────
// 4 aisle rows, each = two shelf units (north+south sides) running E-W
// Aisle row z positions (absolute):
const SM_AISLES = [-128, -138, -150, -161];

function makeSMShelf(x, z, lenX) {
  // Shelf unit: brown frame, 3 boards
  const frame = new THREE.Mesh(new THREE.BoxGeometry(lenX, 2.2, 0.5), _smShelf);
  frame.position.set(x, 1.1, z); scene.add(frame);
  [0.4, 1.1, 1.8].forEach(by => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(lenX - 0.1, 0.1, 0.55), _smShelfBd);
    board.position.set(x, by, z); scene.add(board);
  });
}

SM_AISLES.forEach(az => {
  makeSMShelf(SM_CX, az - 0.8, SM_HX * 2 - 8);  // south face of aisle
  makeSMShelf(SM_CX, az + 0.8, SM_HX * 2 - 8);  // north face of aisle
});

// Back wall shelves
makeSMShelf(SM_CX, SM_CZ + SM_HZ - 1.5, SM_HX * 2 - 4);

// ── Colliders ─────────────────────────────────────────────────────────────────
(function addSMColliders() {
  // North wall (two halves)
  for (let x = -SM_HX; x <= -7; x += 4)
    colliders.push({ x: SM_CX + x, z: SM_CZ - SM_HZ, radius: 2 });
  for (let x = 7; x <= SM_HX; x += 4)
    colliders.push({ x: SM_CX + x, z: SM_CZ - SM_HZ, radius: 2 });
  // South wall
  for (let x = -SM_HX; x <= SM_HX; x += 4)
    colliders.push({ x: SM_CX + x, z: SM_CZ + SM_HZ, radius: 2 });
  // East / West walls
  for (let z = -SM_HZ; z <= SM_HZ; z += 4) {
    colliders.push({ x: SM_CX + SM_HX, z: SM_CZ + z, radius: 2 });
    colliders.push({ x: SM_CX - SM_HX, z: SM_CZ + z, radius: 2 });
  }
})();

// ── Grocery products ──────────────────────────────────────────────────────────
const smItems = []; // { mesh, name, emoji, hintEl, collected }

function makeGrocery(shape, color, name, emoji, x, z) {
  let geo;
  if (shape === 'sphere')   geo = new THREE.SphereGeometry(0.35, 10, 8);
  else if (shape === 'box') geo = new THREE.BoxGeometry(0.5, 0.65, 0.35);
  else if (shape === 'can') geo = new THREE.CylinderGeometry(0.2, 0.2, 0.65, 10);
  else if (shape === 'tall')geo = new THREE.BoxGeometry(0.32, 0.85, 0.32);
  else                       geo = new THREE.BoxGeometry(0.55, 0.4, 0.55);

  const mesh = new THREE.Mesh(geo,
    new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.18 }));
  mesh.position.set(x, 1.9, z);
  scene.add(mesh);

  // Small sparkle light
  const pl = new THREE.PointLight(color, 0.6, 3.5);
  pl.position.set(x, 2.4, z); scene.add(pl);

  // Hint label
  const hEl = document.createElement('div');
  hEl.style.cssText = [
    'position:fixed','bottom:85px','left:50%','transform:translateX(-50%)',
    'background:rgba(13,71,161,0.94)','color:#ffcc00','font-size:15px','font-weight:bold',
    'padding:8px 22px','border-radius:14px','pointer-events:none','z-index:25',
    'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
    'border:2px solid #ffcc00',
  ].join(';');
  hEl.textContent = `[E] ${emoji} קח ${name}`;
  document.body.appendChild(hEl);

  smItems.push({ mesh, name, emoji, hintEl: hEl, collected: false });
}

// Aisle 1 — Fruits (z = -128)
makeGrocery('sphere', 0xdd2222, 'תפוח',    '🍎', -24, -128);
makeGrocery('sphere', 0xff4400, 'תפוז',    '🍊', -16, -128);
makeGrocery('sphere', 0x22aa22, 'אבטיח',   '🍉', -8,  -128);
makeGrocery('sphere', 0xffcc00, 'לימון',   '🍋',  0,  -128);
makeGrocery('box',    0xffdd44, 'בננה',    '🍌',  8,  -128);
makeGrocery('sphere', 0x8833aa, 'ענבים',   '🍇',  16, -128);
makeGrocery('sphere', 0xff6699, 'אפרסק',   '🍑',  24, -128);

// Aisle 2 — Dairy (z = -138)
makeGrocery('tall',   0xffffff, 'חלב',     '🥛', -24, -138);
makeGrocery('box',    0xffee44, 'גבינה',   '🧀', -16, -138);
makeGrocery('can',    0xffeedd, 'יוגורט',  '🍦',  -8, -138);
makeGrocery('tall',   0xffcc88, 'מיץ תפוזים','🧃', 0,  -138);
makeGrocery('box',    0xffaaaa, 'חמאה',    '🧈',  8,  -138);
makeGrocery('can',    0xeeeeff, 'שמנת',    '🫙',  16, -138);
makeGrocery('box',    0xffffcc, 'ביצים',   '🥚',  24, -138);

// Aisle 3 — Bakery (z = -150)
makeGrocery('box',    0xc8843c, 'לחם',     '🍞', -24, -150);
makeGrocery('box',    0xf5deb3, 'פיתה',    '🫓', -16, -150);
makeGrocery('sphere', 0xffb347, 'קרואסון', '🥐',  -8, -150);
makeGrocery('can',    0xf5c2a0, 'עוגה',    '🎂',   0, -150);
makeGrocery('box',    0xd4a55a, 'חלה',     '🥖',   8, -150);
makeGrocery('box',    0xffc0cb, 'מאפין',   '🧁',  16, -150);
makeGrocery('sphere', 0xaa7733, 'בייגל',   '🥨',  24, -150);

// Aisle 4 — Snacks (z = -161)
makeGrocery('box',    0x3e1a00, 'שוקולד',  '🍫', -24, -161);
makeGrocery('tall',   0xff6600, 'צ\'יפס',  '🥔', -16, -161);
makeGrocery('tall',   0x8bc34a, 'פופקורן', '🍿',  -8, -161);
makeGrocery('box',    0x0077cc, 'סודה',    '🥤',   0, -161);
makeGrocery('can',    0xdd4422, 'קולה',    '🥫',   8, -161);
makeGrocery('box',    0xffaa00, 'ביסקוויט','🍪',  16, -161);
makeGrocery('sphere', 0x884422, 'אגוזים',  '🥜',  24, -161);

// ── Shopping cart for player ───────────────────────────────────────────────────
const smPlayerCart = new THREE.Group();
(function buildSMCart() {
  const fm = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const wm = new THREE.MeshLambertMaterial({ color: 0x333333 });
  // basket
  const basket = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.7), fm);
  basket.position.y = 0.8; smPlayerCart.add(basket);
  // handle
  const handle = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.08), fm);
  handle.position.set(0, 1.3, -0.3); smPlayerCart.add(handle);
  // legs
  [[-0.5,-0.3],[0.5,-0.3],[-0.5,0.3],[0.5,0.3]].forEach(([lx,lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.06), fm);
    leg.position.set(lx, 0.3, lz); smPlayerCart.add(leg);
  });
  // wheels
  [[-0.5,-0.35],[0.5,-0.35],[-0.5,0.35],[0.5,0.35]].forEach(([wx,wz]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.08,8), wm);
    w.rotation.x = Math.PI/2; w.position.set(wx,0.1,wz); smPlayerCart.add(w);
  });
  smPlayerCart.visible = false;
  smPlayerCart.position.set(SM_CX, 0, SM_CZ - SM_HZ + 4);
  scene.add(smPlayerCart);
})();

// Stacked picked items in cart
const smCartStack = [];

// ── Cashier NPC ───────────────────────────────────────────────────────────────
(function buildSMCashier() {
  const g = new THREE.Group();
  const bm = new THREE.MeshLambertMaterial({ color: 0x1565c0 }); // blue uniform
  const sm2 = new THREE.MeshLambertMaterial({ color: 0xffccaa });  // skin
  const hm = new THREE.MeshLambertMaterial({ color: 0x333333 });   // hair

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7,1.0,0.4), bm);
  torso.position.y = 1.0; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32,10,8), sm2);
  head.position.y = 1.85; g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.34,10,8), hm);
  hair.position.set(0,1.95,0); g.add(hair);
  // Legs
  [[-0.18,0],[0.18,0]].forEach(([lx]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.85,0.3), bm);
    leg.position.set(lx,0.42,0); g.add(leg);
  });
  // Name tag
  const ntC = document.createElement('canvas'); ntC.width=128; ntC.height=48;
  const ntx = ntC.getContext('2d');
  ntx.fillStyle='#fff'; ntx.fillRect(0,0,128,48);
  ntx.fillStyle='#0d47a1'; ntx.font='bold 24px Arial'; ntx.textAlign='center';
  ntx.fillText('קופה 1', 64, 34);
  const nt = new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.19),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ntC), transparent:true }));
  nt.position.set(0,1.08,0.21); g.add(nt);

  g.position.set(SM_CX + 15, 0, SM_CZ - SM_HZ + 4);
  scene.add(g);

  // Cashier counter
  const counter = new THREE.Mesh(new THREE.BoxGeometry(5, 1.1, 1.5), _smCounter);
  counter.position.set(SM_CX + 15, 0.55, SM_CZ - SM_HZ + 3);
  scene.add(counter);
  colliders.push({ x: SM_CX + 15, z: SM_CZ - SM_HZ + 3, radius: 3 });

  // Register
  const reg = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.7,0.7),
    new THREE.MeshLambertMaterial({ color: 0x444444 }));
  reg.position.set(SM_CX + 15, 1.45, SM_CZ - SM_HZ + 3);
  scene.add(reg);
})();

// ── Cashier talk UI ────────────────────────────────────────────────────────────
const smCashierHintEl = document.createElement('div');
smCashierHintEl.style.cssText = [
  'position:fixed','bottom:55px','left:50%','transform:translateX(-50%)',
  'background:rgba(13,71,161,0.94)','color:#ffcc00','font-size:15px','font-weight:bold',
  'padding:8px 22px','border-radius:14px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
  'border:2px solid #ffcc00',
].join(';');
smCashierHintEl.textContent = '[E] 💬 קופה';
document.body.appendChild(smCashierHintEl);

const smMsgEl = document.createElement('div');
smMsgEl.style.cssText = [
  'position:fixed','top:28%','left:50%','transform:translateX(-50%)',
  'background:rgba(13,71,161,0.97)','color:#fff','font-size:20px',
  'padding:30px 44px','border-radius:18px','pointer-events:none','z-index:40',
  'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
  'border:3px solid #ffcc00','max-width:440px','line-height:1.8',
].join(';');
document.body.appendChild(smMsgEl);

let smMsgTimer = 0;
let smItemsCollected = 0;

// ── Pickup notification ────────────────────────────────────────────────────────
const smPickupEl = document.createElement('div');
smPickupEl.style.cssText = [
  'position:fixed','top:18%','left:50%','transform:translateX(-50%)',
  'background:rgba(21,101,192,0.95)','color:#ffcc00','font-size:17px','font-weight:bold',
  'padding:10px 28px','border-radius:14px','pointer-events:none','z-index:35',
  'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
  'border:2px solid #ffcc00',
].join(';');
document.body.appendChild(smPickupEl);
let smPickupTimer = 0;

// ── Helpers ────────────────────────────────────────────────────────────────────
function isInsideSM() {
  return (
    player.position.x > SM_CX - SM_HX + 1 && player.position.x < SM_CX + SM_HX - 1 &&
    player.position.z > SM_CZ - SM_HZ + 1 && player.position.z < SM_CZ + SM_HZ - 1
  );
}

function nearSMCashier() {
  const dx = player.position.x - (SM_CX + 15);
  const dz = player.position.z - (SM_CZ - SM_HZ + 4);
  return Math.sqrt(dx*dx + dz*dz) < 4.5;
}

// ── E-key handler ─────────────────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;

  // Cashier interaction
  if (nearSMCashier()) {
    const count = smItemsCollected;
    smMsgEl.innerHTML = count === 0
      ? `🛒<br><br><b>ברוך הבא לסנופי מרקט!</b><br>לקח פריטים מהמדפים<br>ולחץ E ליד הקופה לתשלום 🐾`
      : `✅<br><br><b>תודה סנופי!</b><br>לקחת ${count} פריטים<br><b style="color:#ffcc00;font-size:18px">הכל חינם בשבילך! 🐾💛</b>`;
    smMsgEl.style.display = 'block';
    smMsgTimer = 5.0;
    return;
  }

  // Item pickup
  for (const item of smItems) {
    if (item.collected) continue;
    const dx = player.position.x - item.mesh.position.x;
    const dz = player.position.z - item.mesh.position.z;
    if (Math.sqrt(dx*dx + dz*dz) < 2.8) {
      item.collected = true;
      scene.remove(item.mesh);
      item.hintEl.style.display = 'none';
      smItemsCollected++;

      // Stack in cart
      const stackItem = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.28, 0.28),
        new THREE.MeshLambertMaterial({ color: item.mesh.material.color.getHex(), emissive: item.mesh.material.color.getHex(), emissiveIntensity: 0.2 })
      );
      stackItem.position.set(
        (smCartStack.length % 3) * 0.32 - 0.32,
        1.1 + Math.floor(smCartStack.length / 3) * 0.3,
        0
      );
      smPlayerCart.add(stackItem);
      smCartStack.push(stackItem);

      // Pickup flash
      smPickupEl.textContent = `${item.emoji} ${item.name} נוסף לעגלה!`;
      smPickupEl.style.display = 'block';
      smPickupTimer = 2.0;
      break;
    }
  }
});

// ── Update ─────────────────────────────────────────────────────────────────────
function updateSupermarket(dt) {
  const inside = isInsideSM();
  smPlayerCart.visible = inside;

  if (inside) {
    // Cart follows player
    smPlayerCart.position.x += (player.position.x - Math.sin(player.rotation.y) * 1.8 - smPlayerCart.position.x) * Math.min(1, dt * 6);
    smPlayerCart.position.z += (player.position.z + Math.cos(player.rotation.y) * 1.8 - smPlayerCart.position.z) * Math.min(1, dt * 6);
    smPlayerCart.rotation.y = player.rotation.y;
  }

  // Item hint
  let shownHint = false;
  for (const item of smItems) {
    if (item.collected) { item.hintEl.style.display = 'none'; continue; }
    const dx = player.position.x - item.mesh.position.x;
    const dz = player.position.z - item.mesh.position.z;
    const near = Math.sqrt(dx*dx + dz*dz) < 2.8;
    item.hintEl.style.display = (near && !shownHint) ? 'block' : 'none';
    if (near) shownHint = true;

    // Gentle float animation
    item.mesh.position.y = 1.9 + Math.sin(Date.now() * 0.001 + item.mesh.position.x) * 0.06;
    item.mesh.rotation.y += dt * 0.8;
  }

  // Cashier hint
  smCashierHintEl.style.display = (nearSMCashier() && !shownHint) ? 'block' : 'none';

  // Message timer
  if (smMsgTimer > 0) {
    smMsgTimer -= dt;
    if (smMsgTimer <= 0) smMsgEl.style.display = 'none';
  }

  // Pickup notification timer
  if (smPickupTimer > 0) {
    smPickupTimer -= dt;
    if (smPickupTimer <= 0) smPickupEl.style.display = 'none';
  }
}
