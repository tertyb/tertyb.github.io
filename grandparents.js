// ── Grandparents' House ───────────────────────────────────────────────────────
const GRANNY_X = -55, GRANNY_Z = 75;

// Materials
const _gWallMat  = new THREE.MeshLambertMaterial({ color: 0xb8d4e8 }); // powder blue
const _gRoofMat  = new THREE.MeshLambertMaterial({ color: 0x7a3a18 }); // warm brown
const _gWoodMat  = new THREE.MeshLambertMaterial({ color: 0x8b5e2a });
const _gTrimMat  = new THREE.MeshLambertMaterial({ color: 0xffffff });
const _gGlassMat = new THREE.MeshBasicMaterial({ color: 0xa8d8f0, transparent:true, opacity:0.72 });
const _gStoneMat = new THREE.MeshLambertMaterial({ color: 0xc8b898 });
const _gShutMat  = new THREE.MeshLambertMaterial({ color: 0x3a5a3a });
const _gPotMat   = new THREE.MeshLambertMaterial({ color: 0x9b4a1a });
const _gGoldMat  = new THREE.MeshLambertMaterial({ color: 0xd4a000 });

(function buildHouse() {
  const g = new THREE.Group();

  // ── House body
  const body = new THREE.Mesh(new THREE.BoxGeometry(12, 6.5, 10), _gWallMat);
  body.position.y = 3.25; body.castShadow = true; body.receiveShadow = true; g.add(body);

  // ── Hip roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(9.2, 4.5, 4), _gRoofMat);
  roof.rotation.y = Math.PI / 4; roof.position.y = 8.75; roof.castShadow = true; g.add(roof);

  // ── Chimney
  const chim = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.5, 1.4), _gStoneMat);
  chim.position.set(3.5, 9.5, -2); g.add(chim);
  const chimCap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.8),
    new THREE.MeshLambertMaterial({color:0x444444}));
  chimCap.position.set(3.5, 11.3, -2); g.add(chimCap);
  // smoke puff (static, decorative)
  const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 5),
    new THREE.MeshLambertMaterial({color:0xbbbbbb, transparent:true, opacity:0.55}));
  smoke.position.set(3.5, 12.2, -2); g.add(smoke);

  // ── Porch slab
  const porch = new THREE.Mesh(new THREE.BoxGeometry(12, 0.22, 4), _gStoneMat);
  porch.position.set(0, 0.11, 7.11); g.add(porch);
  // Porch columns
  [-4.2, -1.5, 1.5, 4.2].forEach(cx => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.27, 3.6, 10), _gTrimMat);
    col.position.set(cx, 2.0, 8.7); g.add(col);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.22, 0.6), _gTrimMat);
    cap.position.set(cx, 3.92, 8.7); g.add(cap);
  });
  const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.2, 4.2), _gRoofMat);
  porchRoof.position.set(0, 4.08, 8.3); g.add(porchRoof);
  // Porch railing (between columns)
  [[-2.85, 8.7], [2.85, 8.7]].forEach(([rx, rz]) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.08), _gTrimMat);
    rail.position.set(rx, 1.1, rz); g.add(rail);
    for (let i = -1; i <= 1; i++) {
      const bal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 5), _gTrimMat);
      bal.position.set(rx + i * 0.7, 0.6, rz); g.add(bal);
    }
  });

  // ── Front door
  [-0.52, 0.52].forEach(ox => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.8, 0.1),
      new THREE.MeshLambertMaterial({color:0x7a3010}));
    door.position.set(ox, 1.4, 5.06); g.add(door);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.75), _gGlassMat);
    glass.position.set(ox, 1.9, 5.12); g.add(glass);
  });
  const dFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.1, 0.1), _gTrimMat);
  dFrame.position.set(0, 1.55, 5.05); g.add(dFrame);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), _gGoldMat);
  knob.position.set(0.4, 1.4, 5.14); g.add(knob);

  // ── Front windows with shutters + flower boxes
  [[-4.2, 2.6], [4.2, 2.6]].forEach(([wx, wy]) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.55), _gGlassMat);
    win.position.set(wx, wy, 5.07); g.add(win);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.85, 0.07), _gTrimMat);
    fr.position.set(wx, wy, 5.05); g.add(fr);
    // Shutters
    [-1.4, 1.4].forEach(sx => {
      const sh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.85, 0.07), _gShutMat);
      sh.position.set(wx + sx, wy, 5.04); g.add(sh);
    });
    // Flower box
    const fb = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 0.45), _gPotMat);
    fb.position.set(wx, wy - 0.98, 5.08); g.add(fb);
    [0xff3366, 0xff9900, 0xffee00, 0xff66aa, 0xcc44ff].forEach((fc, fi) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 4),
        new THREE.MeshLambertMaterial({color:0x228833}));
      stem.position.set(wx - 0.88 + fi * 0.44, wy - 0.65, 5.1); g.add(stem);
      const bl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 5),
        new THREE.MeshLambertMaterial({color:fc}));
      bl.position.set(wx - 0.88 + fi * 0.44, wy - 0.44, 5.1); g.add(bl);
    });
  });

  // ── Side windows
  [[6.07, 2.6, -1.5],[6.07, 2.6, 1.5],[-6.07, 2.6, -1.5],[-6.07, 2.6, 1.5]].forEach(([wx, wy, wz]) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.4), _gGlassMat);
    win.rotation.y = wx > 0 ? Math.PI / 2 : -Math.PI / 2;
    win.position.set(wx, wy, wz); g.add(win);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.7, 1.8), _gTrimMat);
    fr.position.set(wx, wy, wz); g.add(fr);
  });

  // ── Interior floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 9.6),
    new THREE.MeshLambertMaterial({color:0xd4a870}));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; g.add(floor);

  // ── Rug
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.5),
    new THREE.MeshLambertMaterial({color:0xa02040}));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.03, -0.5); g.add(rug);

  // ── Sofa (against back wall)
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.65, 1.2),
    new THREE.MeshLambertMaterial({color:0x6a4a8a}));
  sofaBase.position.set(-0.5, 0.42, -3.6); g.add(sofaBase);
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.0, 0.35),
    new THREE.MeshLambertMaterial({color:0x6a4a8a}));
  sofaBack.position.set(-0.5, 1.15, -4.15); g.add(sofaBack);
  [-1.9, 1.9].forEach(ax => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.85, 1.2),
      new THREE.MeshLambertMaterial({color:0x5a3a7a}));
    arm.position.set(ax - 0.5, 0.52, -3.6); g.add(arm);
  });
  // Cushions
  [-1.2, -0.1, 1.0].forEach(cx => {
    const cush = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 0.9),
      new THREE.MeshLambertMaterial({color:0xcc8844}));
    cush.position.set(cx - 0.5, 0.88, -3.55); g.add(cush);
  });

  // ── Coffee table
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 1.0),
    new THREE.MeshLambertMaterial({color:0x7a4a1a}));
  tableTop.position.set(-0.5, 0.55, -2.1); g.add(tableTop);
  [[-1.2,-2.6],[0.2,-2.6],[-1.2,-1.6],[0.2,-1.6]].forEach(([tx,tz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 5),
      new THREE.MeshLambertMaterial({color:0x5a3010}));
    leg.position.set(tx, 0.27, tz); g.add(leg);
  });
  // Teacup on table
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.14, 8),
    new THREE.MeshLambertMaterial({color:0xffffff}));
  cup.position.set(-0.2, 0.62, -2.1); g.add(cup);

  // ── Fireplace (back right corner)
  const fpBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.4, 0.5),
    new THREE.MeshLambertMaterial({color:0x8a7060}));
  fpBase.position.set(4.0, 1.2, -4.8); g.add(fpBase);
  const firebox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 0.25),
    new THREE.MeshLambertMaterial({color:0x111111}));
  firebox.position.set(4.0, 0.9, -4.58); g.add(firebox);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 6),
    new THREE.MeshBasicMaterial({color:0xff6600}));
  flame.position.set(4.0, 1.05, -4.58); g.add(flame);
  const flame2 = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 5),
    new THREE.MeshBasicMaterial({color:0xffcc00}));
  flame2.position.set(4.2, 1.0, -4.58); g.add(flame2);
  // Mantle
  const mantle = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 0.7),
    new THREE.MeshLambertMaterial({color:0x7a4a1a}));
  mantle.position.set(4.0, 2.5, -4.7); g.add(mantle);

  // ── Bookshelf (back-left)
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.0, 2.2),
    new THREE.MeshLambertMaterial({color:0x8b5e2a}));
  shelf.position.set(-5.6, 1.5, -3.5); g.add(shelf);
  const bookColors = [0xcc2222, 0x2244cc, 0x22aa44, 0xcc8800, 0x882288, 0x228888];
  for (let bi = 0; bi < 12; bi++) {
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55 + Math.random()*0.25, 0.28),
      new THREE.MeshLambertMaterial({color:bookColors[bi%bookColors.length]}));
    bk.position.set(-5.45, 0.45 + Math.floor(bi/3)*0.85, -4.2 + (bi%3)*0.5); g.add(bk);
  }

  // ── House sign above door
  const sc2d = document.createElement('canvas');
  sc2d.width = 512; sc2d.height = 110;
  const sc = sc2d.getContext('2d');
  sc.fillStyle = '#f5e6c8';
  sc.beginPath(); sc.roundRect(4, 4, 504, 102, 14); sc.fill();
  sc.strokeStyle = '#8b5e2a'; sc.lineWidth = 5; sc.stroke();
  sc.strokeStyle = '#d4a000'; sc.lineWidth = 2;
  sc.beginPath(); sc.roundRect(10, 10, 492, 90, 9); sc.stroke();
  sc.fillStyle = '#6b2a0a';
  sc.font = 'bold 46px Arial';
  sc.textAlign = 'center';
  sc.direction = 'rtl';
  sc.fillText('הבית של סבא וסבתא', 256, 72);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 0.88),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc2d), transparent: true })
  );
  signMesh.position.set(0, 4.8, 5.14); g.add(signMesh);

  g.position.set(GRANNY_X, 0, GRANNY_Z);
  scene.add(g);

  // ── Wall colliders (leave front-center gap for door entry)
  colliders.push({ x: GRANNY_X,       z: GRANNY_Z - 5,   radius: 7   }); // back wall
  colliders.push({ x: GRANNY_X - 6.5, z: GRANNY_Z,       radius: 3   }); // left wall
  colliders.push({ x: GRANNY_X + 6.5, z: GRANNY_Z,       radius: 3   }); // right wall
  colliders.push({ x: GRANNY_X - 5,   z: GRANNY_Z + 5,   radius: 2   }); // front-left beside door
  colliders.push({ x: GRANNY_X + 5,   z: GRANNY_Z + 5,   radius: 2   }); // front-right beside door
})();

// ── Fence & Garden ────────────────────────────────────────────────────────────
(function buildGarden() {
  const postMat = new THREE.MeshLambertMaterial({ color: 0xeee8d0 });
  const railMat = new THREE.MeshLambertMaterial({ color: 0xf5f0e0 });

  const GW = 17, GD = 14;
  const fx1 = GRANNY_X - GW, fx2 = GRANNY_X + GW;
  const fz1 = GRANNY_Z - GD, fz2 = GRANNY_Z + GD;

  function fenceRow(x1, z1, x2, z2) {
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    const steps = Math.round(len / 1.4);
    const isX = Math.abs(dx) > Math.abs(dz);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + dx * t, pz = z1 + dz * t;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.25, 0.13), postMat);
      post.position.set(px, 0.62, pz); scene.add(post);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 4), postMat);
      tip.position.set(px, 1.35, pz); scene.add(tip);
    }
    for (const ry of [0.35, 0.72]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(isX ? len : 0.08, 0.08, isX ? 0.08 : len), railMat);
      rail.position.set((x1 + x2) / 2, ry, (z1 + z2) / 2); scene.add(rail);
    }
  }

  fenceRow(fx1, fz1, fx2, fz1);                      // back
  fenceRow(fx1, fz1, fx1, fz2);                      // left
  fenceRow(fx2, fz1, fx2, fz2);                      // right
  fenceRow(fx1, fz2, GRANNY_X - 2.4, fz2);           // front-left
  fenceRow(GRANNY_X + 2.4, fz2, fx2, fz2);           // front-right

  // Gate posts with gold balls
  [-2.4, 2.4].forEach(gx => {
    const gp = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.75, 0.24), postMat);
    gp.position.set(GRANNY_X + gx, 0.87, fz2); scene.add(gp);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.19, 7, 6), _gGoldMat);
    ball.position.set(GRANNY_X + gx, 1.85, fz2); scene.add(ball);
  });

  // Gate sign on a post
  const gsc2d = document.createElement('canvas');
  gsc2d.width = 380; gsc2d.height = 90;
  const gsc = gsc2d.getContext('2d');
  gsc.fillStyle = '#f5e6c8';
  gsc.beginPath(); gsc.roundRect(3, 3, 374, 84, 12); gsc.fill();
  gsc.strokeStyle = '#8b5e2a'; gsc.lineWidth = 4; gsc.stroke();
  gsc.fillStyle = '#6b2a0a'; gsc.font = 'bold 36px Arial';
  gsc.textAlign = 'center'; gsc.direction = 'rtl';
  gsc.fillText('הבית של סבא וסבתא', 190, 56);
  const gateSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.52),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gsc2d), transparent: true })
  );
  gateSign.position.set(GRANNY_X, 2.35, fz2 + 0.12); scene.add(gateSign);
  const gPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 6), _gWoodMat);
  gPole.position.set(GRANNY_X, 1.25, fz2 + 0.1); scene.add(gPole);

  // Stone path from gate to porch
  for (let si = 0; si < 10; si++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.3 + Math.random() * 0.25, 0.06, 0.75),
      _gStoneMat);
    slab.rotation.y = (Math.random() - 0.5) * 0.12;
    slab.position.set(GRANNY_X + (Math.random() - 0.5) * 0.35, 0.03, fz2 - 0.6 - si * 1.15);
    scene.add(slab);
  }

  // Flower beds
  function plantBed(cx, cz, count) {
    const cols = [0xff3366,0xff9900,0xffee00,0xff66aa,0xcc44ff,0xff4422,0x44aaff,0xffffff,0xff88cc];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random() * 2.0;
      const fx = cx + Math.cos(a) * r, fz = cz + Math.sin(a) * r;
      const h = 0.22 + Math.random() * 0.4;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, h, 4),
        new THREE.MeshLambertMaterial({color:0x228833}));
      stem.position.set(fx, h / 2, fz); scene.add(stem);
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.11 + Math.random() * 0.07, 6, 5),
        new THREE.MeshLambertMaterial({color:cols[i % cols.length]}));
      bloom.position.set(fx, h + 0.1, fz); scene.add(bloom);
    }
  }

  plantBed(GRANNY_X - 5,  GRANNY_Z + 10, 18);
  plantBed(GRANNY_X + 5,  GRANNY_Z + 10, 18);
  plantBed(GRANNY_X - 12, GRANNY_Z + 6,  20);
  plantBed(GRANNY_X + 12, GRANNY_Z + 6,  20);
  plantBed(GRANNY_X - 13, GRANNY_Z - 3,  15);
  plantBed(GRANNY_X + 13, GRANNY_Z - 3,  15);
  plantBed(GRANNY_X,      GRANNY_Z - 11, 12);

  // Trees
  function plantTree(tx, tz, col) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 2.8, 8),
      new THREE.MeshLambertMaterial({color:0x6b3a1f}));
    trunk.position.set(tx, 1.4, tz); scene.add(trunk);
    [[3.2,1.8],[4.2,1.3],[5.0,0.85]].forEach(([py, rad]) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(rad, 9, 7),
        new THREE.MeshLambertMaterial({color:col}));
      f.position.set(tx, py, tz); f.castShadow = true; scene.add(f);
    });
  }

  plantTree(GRANNY_X - 13, GRANNY_Z - 8,  0x2a8a3a);
  plantTree(GRANNY_X + 13, GRANNY_Z - 8,  0x2a8a3a);
  plantTree(GRANNY_X - 15, GRANNY_Z + 9,  0x3aaa4a);
  plantTree(GRANNY_X + 15, GRANNY_Z + 9,  0x1a7a2a);

  // Garden bench
  const bm = new THREE.MeshLambertMaterial({color:0x7a4a1a});
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.65), bm);
  seat.position.set(GRANNY_X + 10, 0.55, GRANNY_Z + 6); scene.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 0.1), bm);
  back.position.set(GRANNY_X + 10, 1.0, GRANNY_Z + 5.68); scene.add(back);
  [[GRANNY_X + 9],[GRANNY_X + 11]].forEach(([lx]) => {
    [0.25, -0.25].forEach(lz => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), bm);
      leg.position.set(lx, 0.27, GRANNY_Z + 6 + lz); scene.add(leg);
    });
  });

  // Porch flower pots
  [-3.2, 3.2].forEach(px => {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.38, 8), _gPotMat);
    pot.position.set(GRANNY_X + px, 0.25, GRANNY_Z + 8.9); scene.add(pot);
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5),
      new THREE.MeshLambertMaterial({color: px < 0 ? 0xff4488 : 0xffaa00}));
    fl.position.set(GRANNY_X + px, 0.66, GRANNY_Z + 8.9); scene.add(fl);
  });

  // Mailbox
  const mb = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.62),
    new THREE.MeshLambertMaterial({color:0x3355aa}));
  mb.position.set(GRANNY_X - 1.8, 1.22, fz2 - 0.3); scene.add(mb);
  const mbPole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.1, 6), _gWoodMat);
  mbPole.position.set(GRANNY_X - 1.8, 0.55, fz2 - 0.3); scene.add(mbPole);
})();

// ── Lady the Dog ──────────────────────────────────────────────────────────────
let _ladyMesh;
const _ladyBubbleEl = document.createElement('div');
_ladyBubbleEl.style.cssText = [
  'position:fixed','background:rgba(255,255,255,0.95)','color:#333',
  'font-size:14px','padding:8px 14px','border-radius:16px',
  'border:2px solid #ff69b4','pointer-events:none','z-index:20',
  'display:none','font-family:Arial,sans-serif','max-width:220px',
  'text-align:center','transform:translateX(-50%)',
  'box-shadow:0 2px 8px rgba(0,0,0,0.18)',
].join(';');
document.body.appendChild(_ladyBubbleEl);

(function spawnLady() {
  const lady = makeDog(0xe8c870);

  // Pink collar
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.155, 0.032, 7, 14),
    new THREE.MeshLambertMaterial({ color: 0xff69b4 })
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.42, 0.28);
  lady.add(collar);

  // Gold name tag
  const tag = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 0.025),
    new THREE.MeshLambertMaterial({ color: 0xd4a000 })
  );
  tag.position.set(0.04, 0.3, 0.39); lady.add(tag);

  lady.scale.set(1.35, 1.35, 1.35);
  lady.position.set(GRANNY_X + 5, 0, GRANNY_Z + 7);
  scene.add(lady);

  _ladyMesh = lady;

  animals.push({
    mesh: lady,
    homePos: { x: GRANNY_X + 2, z: GRANNY_Z + 4 },
    speed: 1.6,
    radius: 8,
    walkTarget: null,
    walkWait: 1.2,
  });
})();

// ── Update ────────────────────────────────────────────────────────────────────
function updateGrandparents(dt) {
  if (!_ladyMesh) return;
  const dx = player.position.x - _ladyMesh.position.x;
  const dz = player.position.z - _ladyMesh.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist < 4.5) {
    _ladyBubbleEl.style.display = 'block';
    _ladyBubbleEl.innerHTML = '<b>לידי 🐾</b><br>שלום אני לידי,<br>אני אוהבת אותך סנופי!';
    const hp = _ladyMesh.position.clone(); hp.y += 1.8;
    const sc = toScreen(hp);
    if (!sc.behind) {
      _ladyBubbleEl.style.left = sc.x + 'px';
      _ladyBubbleEl.style.top  = sc.y + 'px';
    } else {
      _ladyBubbleEl.style.display = 'none';
    }
    // Face player
    _ladyMesh.rotation.y = Math.atan2(dx, dz);
  } else {
    _ladyBubbleEl.style.display = 'none';
  }
}
