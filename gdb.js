// ── GDB Burger Restaurant ─────────────────────────────────────────────────────

const GDB_X = 12, GDB_Z = -30;

// ── Building ──────────────────────────────────────────────────────────────────
(function buildGDB() {
  const g = new THREE.Group();

  // Main body — classic fast-food red & yellow
  const wallMat  = new THREE.MeshLambertMaterial({ color: 0xdd1a00 });
  const accentMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
  const roofMat  = new THREE.MeshLambertMaterial({ color: 0xffcc00 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 9), wallMat);
  body.position.y = 3; body.castShadow = true; body.receiveShadow = true; g.add(body);

  // Flat roof with raised parapet edge
  const roof = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.35, 9.4), roofMat);
  roof.position.y = 6.18; g.add(roof);
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.7, 9.6), accentMat);
  parapet.position.y = 6.7; g.add(parapet);

  // Yellow stripe band
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(10.1, 0.6, 9.1), accentMat);
  stripe.position.y = 5.3; g.add(stripe);

  // Windows
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.8 });
  [[-3, 3.2, 4.52], [0, 3.2, 4.52], [3, 3.2, 4.52]].forEach(([wx, wy, wz]) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.6), glassMat);
    win.position.set(wx, wy, wz); g.add(win);
  });

  // Door frame + door
  const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.4, 0.2), doorFrameMat);
  doorFrame.position.set(0, 1.7, 4.6); g.add(doorFrame);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0xaa1100 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.1, 0.12), doorMat);
  door.position.set(0, 1.55, 4.68); g.add(door);

  // Drive-through window on the side
  const dtWin = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), glassMat);
  dtWin.rotation.y = -Math.PI / 2; dtWin.position.set(5.02, 2.8, 0); g.add(dtWin);
  const dtFrame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 1.6), accentMat);
  dtFrame.position.set(5.08, 2.8, 0); g.add(dtFrame);

  // Outdoor menu board on a pole
  const menuMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.1), menuMat);
  menuBoard.position.set(-3.5, 2.8, 6.5); g.add(menuBoard);
  const menuPole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 5),
    new THREE.MeshLambertMaterial({ color: 0x555555 }));
  menuPole.position.set(-3.5, 1.4, 6.5); g.add(menuPole);
  // Menu text texture
  const mc = document.createElement('canvas'); mc.width = 256; mc.height = 180;
  const mctx = mc.getContext('2d');
  mctx.fillStyle = '#111'; mctx.fillRect(0,0,256,180);
  mctx.fillStyle = '#ffcc00'; mctx.font = 'bold 28px Arial'; mctx.textAlign = 'center';
  mctx.fillText('🍔 MENU', 128, 38);
  mctx.fillStyle = '#fff'; mctx.font = '18px Arial';
  mctx.fillText('GDB Burger  🍔', 128, 72);
  mctx.fillText('Crispy Fries  🍟', 128, 100);
  mctx.fillText('Mega Combo  💥', 128, 128);
  mctx.fillStyle = '#ffcc00'; mctx.font = 'bold 16px Arial';
  mctx.fillText('Best in Snoopy\'s World!', 128, 162);
  const menuTex = new THREE.CanvasTexture(mc); menuTex.encoding = THREE.sRGBEncoding;
  const menuFace = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.4),
    new THREE.MeshBasicMaterial({ map: menuTex }));
  menuFace.position.set(-3.5, 2.8, 6.56); g.add(menuFace);

  // Outdoor tables
  const tableMat2 = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
  const chairMat2 = new THREE.MeshLambertMaterial({ color: 0xdd1a00 });
  [[4.5, 7.5], [-4.5, 7.5]].forEach(([tx, tz]) => {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.09, 8), tableMat2);
    table.position.set(tx, 0.76, tz); g.add(table);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.76,5),
      new THREE.MeshLambertMaterial({ color: 0x888888 }));
    leg.position.set(tx, 0.38, tz); g.add(leg);
    [[0.85,0],[-0.85,0],[0,0.85],[0,-0.85]].forEach(([cx,cz]) => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.07,0.42), chairMat2);
      seat.position.set(tx+cx, 0.56, tz+cz); g.add(seat);
      const cl = new THREE.Mesh(new THREE.BoxGeometry(0.07,0.56,0.07), chairMat2);
      cl.position.set(tx+cx, 0.28, tz+cz); g.add(cl);
    });
  });

  g.position.set(GDB_X, 0, GDB_Z);
  scene.add(g);
  colliders.push({ x: GDB_X, z: GDB_Z, radius: 6 });
})();

// ── GDB Sign ──────────────────────────────────────────────────────────────────
(function makeGDBSign() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 200;
  const ctx = c.getContext('2d');

  // Yellow background
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(0, 0, 512, 200);

  // Red border
  ctx.strokeStyle = '#dd1a00';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 188);

  // Burger emoji row
  ctx.font = '32px serif';
  ctx.textAlign = 'left';
  for (let i = 0; i < 512; i += 52) {
    ctx.fillText('🍔', i, 46);
  }

  // "GDB" text
  ctx.font = 'bold 118px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#dd1a00';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 4;
  ctx.fillText('GDB', 256, 120);

  // Subtitle
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = '#dd1a00';
  ctx.shadowBlur = 3; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
  ctx.fillText('🍟  Best Burgers in Town  🍟', 256, 182);

  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;

  const signGroup = new THREE.Group();
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 2.5, 0.18),
    new THREE.MeshLambertMaterial({ map: tex })
  );
  signGroup.add(board);

  // Red frame
  const frameMat = new THREE.MeshLambertMaterial({ color: 0xdd1a00 });
  const fh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.22, 0.22), frameMat);
  [1.0, -1.0].forEach(fy => { const f = fh.clone(); f.position.y = fy; signGroup.add(f); });
  const fv = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.6, 0.22), frameMat);
  [-3.1, 3.1].forEach(fx => { const f = fv.clone(); f.position.x = fx; signGroup.add(f); });

  // Support poles
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  [-2.2, 2.2].forEach(px => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 6), poleMat);
    pole.position.set(px, -3.1, 0); signGroup.add(pole);
  });

  signGroup.position.set(GDB_X, 3.0, GDB_Z + 7.5);
  scene.add(signGroup);
  window._gdbSign = signGroup;
})();

// ── Food Throw ────────────────────────────────────────────────────────────────
const GDB_DOOR = { x: GDB_X, z: GDB_Z + 4.5 };
let gdbFoodThrown = false;
let gdbFoodActive = false;
let gdbFoodMeshes = [];
let gdbFoodProgress = 0;
let gdbFoodOrigin = null;

// Splat overlay
const gdbSplatEl = document.createElement('div');
gdbSplatEl.style.cssText = [
  'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
  'pointer-events:none', 'z-index:100', 'display:none',
  'background:radial-gradient(ellipse at center, rgba(255,220,50,0.9) 0%, rgba(220,26,0,0.55) 50%, transparent 72%)',
  'transition:opacity 0.4s',
].join(';');
document.body.appendChild(gdbSplatEl);

const gdbSplatText = document.createElement('div');
gdbSplatText.style.cssText = [
  'position:fixed', 'top:38%', 'left:50%', 'transform:translate(-50%,-50%)',
  'font-size:38px', 'font-weight:bold', 'color:#dd1a00',
  'text-shadow:2px 2px 0 #fff, -2px -2px 0 #fff',
  'pointer-events:none', 'z-index:101', 'display:none', 'text-align:center',
  'font-family:Impact,Arial Black,sans-serif', 'letter-spacing:3px',
].join(';');
gdbSplatText.innerHTML = '🍔 GDB! 🍟<br><span style="font-size:22px;letter-spacing:1px">Here\'s your burger and fries, Snoopy!</span>';
document.body.appendChild(gdbSplatText);

function makeBurgerMesh() {
  const g = new THREE.Group();
  const bunMat   = new THREE.MeshLambertMaterial({ color: 0xe8a020 });
  const pattyMat = new THREE.MeshLambertMaterial({ color: 0x5a2800 });
  const lettMat  = new THREE.MeshLambertMaterial({ color: 0x44aa22 });
  const cheeseMat= new THREE.MeshLambertMaterial({ color: 0xffcc00 });
  // Bottom bun
  const bBot = new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.14,10), bunMat);
  bBot.position.y = 0; g.add(bBot);
  // Patty
  const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.12,10), pattyMat);
  patty.position.y = 0.13; g.add(patty);
  // Cheese slice
  const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.04,0.7), cheeseMat);
  cheese.position.y = 0.22; cheese.rotation.y = 0.3; g.add(cheese);
  // Lettuce
  const lett = new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.07,8), lettMat);
  lett.position.y = 0.27; g.add(lett);
  // Top bun (dome)
  const bTop = new THREE.Mesh(new THREE.SphereGeometry(0.38,10,6,0,Math.PI*2,0,Math.PI*0.55), bunMat);
  bTop.position.y = 0.33; g.add(bTop);
  // Sesame seeds
  const seedMat = new THREE.MeshLambertMaterial({ color: 0xf5f0d0 });
  for (let i = 0; i < 5; i++) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.03,4,3), seedMat);
    const a = (i/5)*Math.PI*2;
    seed.position.set(Math.cos(a)*0.2, 0.72, Math.sin(a)*0.2); g.add(seed);
  }
  return g;
}

function makeFriesMesh() {
  const g = new THREE.Group();
  const boxMat  = new THREE.MeshLambertMaterial({ color: 0xdd1a00 });
  const frieMat = new THREE.MeshLambertMaterial({ color: 0xf5d060 });
  // Red box
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.32), boxMat);
  box.position.y = 0; g.add(box);
  // Fries sticking out top
  const offsets = [[-0.1,0],[-0.04,0.04],[0.04,-0.04],[0.1,0],[0,-0.08]];
  offsets.forEach(([fx,fz]) => {
    const h = 0.28 + Math.random()*0.18;
    const fry = new THREE.Mesh(new THREE.BoxGeometry(0.055, h, 0.055), frieMat);
    fry.position.set(fx, 0.25 + h/2, fz); g.add(fry);
  });
  return g;
}

function throwGDBFood() {
  if (gdbFoodActive) return;
  gdbFoodActive = true;
  gdbFoodThrown = true;
  gdbFoodProgress = 0;
  gdbFoodOrigin = new THREE.Vector3(GDB_X, 2.5, GDB_Z + 4.5);

  const burger = makeBurgerMesh();
  burger.position.copy(gdbFoodOrigin);
  scene.add(burger);

  const fries = makeFriesMesh();
  fries.position.copy(gdbFoodOrigin);
  fries.position.x += 0.6;
  scene.add(fries);

  gdbFoodMeshes = [burger, fries];
}

function updateGDB(dt) {
  // Sign gentle bob
  if (window._gdbSign) {
    window._gdbSign.rotation.y = Math.sin(Date.now() * 0.0009) * 0.06;
    window._gdbSign.position.y = 3.0 + Math.sin(Date.now() * 0.0013) * 0.18;
  }

  // Proximity check
  if (!gdbFoodThrown) {
    const dx = player.position.x - GDB_DOOR.x;
    const dz = player.position.z - GDB_DOOR.z;
    if (Math.sqrt(dx*dx + dz*dz) < 3.5) {
      throwGDBFood();
    }
  }

  // Animate food flying
  if (gdbFoodActive && gdbFoodMeshes.length > 0) {
    gdbFoodProgress += dt * 1.3;
    const t = Math.min(gdbFoodProgress, 1.0);

    gdbFoodMeshes.forEach((mesh, i) => {
      const offset = i * 0.5;
      const tp = Math.min(gdbFoodProgress - offset * 0.15, 1.0);
      if (tp <= 0) return;
      const tt = Math.min(tp, 1.0);
      mesh.position.x = gdbFoodOrigin.x + (player.position.x - gdbFoodOrigin.x) * tt;
      mesh.position.z = gdbFoodOrigin.z + (player.position.z - gdbFoodOrigin.z) * tt;
      mesh.position.y = gdbFoodOrigin.y + Math.sin(tt * Math.PI) * 3.5;
      mesh.rotation.x += dt * 3.5;
      mesh.rotation.z += dt * (i === 0 ? 2.5 : -3.0);
    });

    if (t >= 1.0) {
      gdbFoodMeshes.forEach(m => scene.remove(m));
      gdbFoodMeshes = [];
      gdbFoodActive = false;

      gdbSplatEl.style.display = 'block';
      gdbSplatEl.style.opacity = '1';
      gdbSplatText.style.display = 'block';
      setTimeout(() => {
        gdbSplatEl.style.opacity = '0';
        setTimeout(() => {
          gdbSplatEl.style.display = 'none';
          gdbSplatText.style.display = 'none';
          setTimeout(() => { gdbFoodThrown = false; }, 12000);
        }, 450);
      }, 2200);
    }
  }
}
