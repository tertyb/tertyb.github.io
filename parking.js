// ── Parking Lot ────────────────────────────────────────────────────────────────
// South edge of the map
// Center: (0, -245), Size: 80 wide, 44 deep

const PK_CX = 0, PK_CZ = -245;
const PK_W  = 80,  PK_D  = 44;

// ── Asphalt surface ────────────────────────────────────────────────────────────
const pkAsphalt = new THREE.Mesh(
  new THREE.PlaneGeometry(PK_W, PK_D),
  new THREE.MeshLambertMaterial({ color: 0x2a2a2a })
);
pkAsphalt.rotation.x = -Math.PI/2;
pkAsphalt.position.set(PK_CX, 0.01, PK_CZ);
scene.add(pkAsphalt);

// Curb border
[[PK_W,0.18,0.4,0,0],[PK_W,0.18,0.4,0,PK_D],
 [0.4,0.18,PK_D,PK_W/2,0],[0.4,0.18,PK_D,-PK_W/2,0]].forEach(([w,h,d,ox,oz]) => {});
// Simple curb lines on edges
[
  [PK_W+0.4, 0.14, 0.5,  0,          -PK_D/2],  // south edge
  [PK_W+0.4, 0.14, 0.5,  0,           PK_D/2],  // north edge
  [0.5,      0.14, PK_D, -PK_W/2,     0],        // west edge
  [0.5,      0.14, PK_D,  PK_W/2,     0],        // east edge
].forEach(([w,h,d,ox,oz]) => {
  const curb = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color: 0x555555 }));
  curb.position.set(PK_CX + ox, 0.07, PK_CZ + oz);
  scene.add(curb);
});

// ── Parking space lines ────────────────────────────────────────────────────────
// Two rows of spots: north row (z=-58) and south row (z=-86)
// Each spot is 5 wide, lines are 0.2 wide
const LINE_MAT = new THREE.MeshLambertMaterial({ color: 0xffffff });

function drawParkingLine(x, z, horizontal) {
  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(horizontal ? 0.2 : 5, horizontal ? 8 : 0.2),
    LINE_MAT
  );
  line.rotation.x = -Math.PI/2;
  line.position.set(x, 0.02, z);
  scene.add(line);
}

// North row (cars face south), 12 spots
const NORTH_Z = PK_CZ + 14;
for (let i = 0; i <= 12; i++) {
  drawParkingLine(PK_CX - PK_W/2 + 4 + i * 6, NORTH_Z, true);
}

// South row (cars face north), 12 spots
const SOUTH_Z = PK_CZ - 14;
for (let i = 0; i <= 12; i++) {
  drawParkingLine(PK_CX - PK_W/2 + 4 + i * 6, SOUTH_Z, true);
}

// Driving lane divider (center line between rows)
const laneDiv = new THREE.Mesh(new THREE.PlaneGeometry(PK_W - 6, 0.3),
  new THREE.MeshLambertMaterial({ color: 0xffdd00 }));
laneDiv.rotation.x = -Math.PI/2;
laneDiv.position.set(PK_CX, 0.02, PK_CZ);
scene.add(laneDiv);


// ── Big "חצי חינם" sign ─────────────────────────────────────────────────────────
// Sign post
const pkPost = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6, 8),
  new THREE.MeshLambertMaterial({ color: 0x888888 }));
pkPost.position.set(PK_CX, 3, PK_CZ - PK_D/2 + 3);
scene.add(pkPost);

// Sign board
const pkSignBoard = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 0.4),
  new THREE.MeshLambertMaterial({ color: 0x003399 }));
pkSignBoard.position.set(PK_CX, 7.5, PK_CZ - PK_D/2 + 3);
scene.add(pkSignBoard);

// Sign canvas
const pkC = document.createElement('canvas'); pkC.width = 512; pkC.height = 160;
const pctx = pkC.getContext('2d');
pctx.fillStyle = '#003399'; pctx.fillRect(0, 0, 512, 160);
pctx.strokeStyle = '#ffffff'; pctx.lineWidth = 6; pctx.strokeRect(6, 6, 500, 148);
pctx.fillStyle = '#ffdd00'; pctx.font = 'bold 72px Arial'; pctx.textAlign = 'center';
pctx.fillText('🅿️ חצי חינם!', 256, 112);
const pkSignFace = new THREE.Mesh(
  new THREE.PlaneGeometry(17.5, 4.7),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pkC), transparent: true })
);
pkSignFace.position.set(PK_CX, 7.5, PK_CZ - PK_D/2 + 3.25);
scene.add(pkSignFace);

// Sign also visible from south
const pkSignFace2 = pkSignFace.clone();
pkSignFace2.rotation.y = Math.PI;
pkSignFace2.position.z -= 0.5;
scene.add(pkSignFace2);

// Small "Parking" subtext sign
const pkSmC = document.createElement('canvas'); pkSmC.width = 256; pkSmC.height = 64;
const psc = pkSmC.getContext('2d');
psc.fillStyle = '#003399'; psc.fillRect(0, 0, 256, 64);
psc.fillStyle = '#ffffff'; psc.font = 'bold 28px Arial'; psc.textAlign = 'center';
psc.fillText('🅿️ חניון', 128, 44);
const pkSubSign = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.1),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pkSmC), transparent: true }));
pkSubSign.position.set(PK_CX, 5.5, PK_CZ - PK_D/2 + 3.25);
scene.add(pkSubSign);

// ── Parked filler cars ─────────────────────────────────────────────────────────
function makeParkedCar(x, z, rotY, color) {
  const g = new THREE.Group();
  const bodyM = new THREE.MeshLambertMaterial({ color });
  const darkM = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const winM  = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 2.0), bodyM);
  body.position.y = 0.5; g.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.85), bodyM);
  cabin.position.set(-0.2, 1.35, 0); g.add(cabin);
  const windF = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.6), winM);
  windF.position.set(1.0, 1.35, 0); g.add(windF);
  const windR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.6), winM);
  windR.position.set(-1.4, 1.35, 0); g.add(windR);
  [[-1.4,-0.75],[-1.4,0.75],[1.4,-0.75],[1.4,0.75]].forEach(([wx,wz]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.22,10), darkM);
    w.rotation.z = Math.PI/2; w.position.set(wx, 0.32, wz); g.add(w);
  });
  g.rotation.y = rotY;
  g.position.set(x, 0, z);
  scene.add(g);
}

// Fill all spots with generic cars
const carColors = [0xcc2222, 0x2244cc, 0x228833, 0x888888, 0xaa6622, 0x334466, 0xcc8800, 0x446688, 0x993366, 0x228888];
let ci = 0;
for (let i = 0; i < 12; i++) {
  if (i === 3) continue; // leave spot 3 in north row for special car
  makeParkedCar(PK_CX - PK_W/2 + 7 + i * 6, NORTH_Z - 3, 0, carColors[ci++ % carColors.length]);
}
for (let i = 0; i < 12; i++) {
  makeParkedCar(PK_CX - PK_W/2 + 7 + i * 6, SOUTH_Z + 3, Math.PI, carColors[ci++ % carColors.length]);
}

// ── Special car — "הנשיקה הראשונה" ────────────────────────────────────────────
const SK_X = PK_CX - PK_W/2 + 7 + 3 * 6;  // spot 3 in north row
const SK_Z = NORTH_Z - 3;

const specialCar = new THREE.Group();
const spBodyM = new THREE.MeshLambertMaterial({ color: 0xff69b4 }); // hot pink
const spDarkM = new THREE.MeshLambertMaterial({ color: 0x111111 });
const spWinM  = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.65 });

const spBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 2.0), spBodyM);
spBody.position.y = 0.5; specialCar.add(spBody);
const spCabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.85), spBodyM);
spCabin.position.set(-0.2, 1.35, 0); specialCar.add(spCabin);
const spWF = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.6), spWinM);
spWF.position.set(1.0, 1.35, 0); specialCar.add(spWF);
const spWR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.6), spWinM);
spWR.position.set(-1.4, 1.35, 0); specialCar.add(spWR);
[[-1.4,-0.75],[-1.4,0.75],[1.4,-0.75],[1.4,0.75]].forEach(([wx,wz]) => {
  const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.22,10), spDarkM);
  w.rotation.z = Math.PI/2; w.position.set(wx, 0.32, wz); specialCar.add(w);
});

// Heart decoration on roof
const heartLight = new THREE.PointLight(0xff69b4, 0.8, 8);
heartLight.position.set(SK_X, 3, SK_Z);
scene.add(heartLight);

// Small heart sign on roof
const hC = document.createElement('canvas'); hC.width = 128; hC.height = 64;
const hctx = hC.getContext('2d');
hctx.fillStyle = '#ff69b4'; hctx.fillRect(0,0,128,64);
hctx.font = 'bold 44px Arial'; hctx.textAlign = 'center';
hctx.fillText('💋', 64, 48);
const hSign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hC), transparent: true }));
hSign.position.set(0, 1.95, 0);
specialCar.add(hSign);

specialCar.position.set(SK_X, 0, SK_Z);
scene.add(specialCar);

// ── UI — kiss message ──────────────────────────────────────────────────────────
const pkHintEl = document.createElement('div');
pkHintEl.style.cssText = [
  'position:fixed','bottom:55px','left:50%','transform:translateX(-50%)',
  'background:rgba(180,0,80,0.93)','color:#fff','font-size:16px','font-weight:bold',
  'padding:9px 26px','border-radius:16px','pointer-events:none','z-index:25',
  'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
  'border:2px solid #ff69b4',
].join(';');
document.body.appendChild(pkHintEl);

const pkMsgEl = document.createElement('div');
pkMsgEl.style.cssText = [
  'position:fixed','top:30%','left:50%','transform:translateX(-50%)',
  'background:rgba(100,0,40,0.97)','color:#fff','font-size:20px',
  'padding:32px 44px','border-radius:20px','pointer-events:none','z-index:40',
  'display:none','font-family:Arial,sans-serif','text-align:center','direction:rtl',
  'border:3px solid #ff69b4','max-width:420px','line-height:1.7',
].join(';');
pkMsgEl.innerHTML = '💋<br><br><b style="font-size:22px">פה הייתה הנשיקה הראשונה של הסנופים</b><br><br>💕';
document.body.appendChild(pkMsgEl);

let pkMsgTimer = 0;

function isNearSpecialCar() {
  const dx = player.position.x - SK_X;
  const dz = player.position.z - SK_Z;
  return Math.sqrt(dx*dx + dz*dz) < 4.0;
}

// ── Update ─────────────────────────────────────────────────────────────────────
function updateParking(dt) {
  if (pkMsgTimer > 0) {
    pkMsgTimer -= dt;
    if (pkMsgTimer <= 0) pkMsgEl.style.display = 'none';
  }

  const near = isNearSpecialCar();
  if (near) {
    pkHintEl.textContent = '[E] 💋 מכונית מיוחדת';
    pkHintEl.style.display = 'block';
  } else {
    pkHintEl.style.display = 'none';
  }
}

window.addEventListener('keydown', e => {
  if (e.code !== 'KeyE') return;
  if (!isNearSpecialCar()) return;
  pkMsgEl.style.display = 'block';
  pkMsgTimer = 5.0;
});
