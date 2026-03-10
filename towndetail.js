// ── Town Detail: sidewalks, square, hills, signs, fences ─────────────────────

const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0xc8c0b0 });
const stoneMat    = new THREE.MeshLambertMaterial({ color: 0xaaa090 });
const fenceMat    = new THREE.MeshLambertMaterial({ color: 0xd4a860 });

// ── Sidewalks alongside roads ─────────────────────────────────────────────────
function makeSidewalk(x, z, w, len, rotZ=0, y=0.015) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), sidewalkMat);
  m.rotation.x = -Math.PI/2;
  if (rotZ) m.rotation.z = rotZ;
  m.position.set(x, y, z);
  scene.add(m);
}
// Along Main Street (z=0, x±65)
makeSidewalk(  0,  3.5, 1.5, 130, Math.PI/2);  // north sidewalk
makeSidewalk(  0, -3.5, 1.5, 130, Math.PI/2);  // south sidewalk
// North spurs
makeSidewalk(-30, 22, 1.2,  44, 0, 0.04);   // Oak Ave east side
makeSidewalk(-32.8, 22, 1.2, 44, 0, 0.04); // Oak Ave west side
makeSidewalk( 15, 20, 1.2,  40, 0, 0.04);   // Elm St east
makeSidewalk( 17.8, 20, 1.2, 40, 0, 0.04); // Elm St west
// South spurs
makeSidewalk(-20,-22, 1.2,  44, 0, 0.04);
makeSidewalk(-22.8,-22,1.2, 44, 0, 0.04);
makeSidewalk( 35,-18, 1.2,  36, 0, 0.04);
makeSidewalk( 37.8,-18,1.2, 36, 0, 0.04);

// ── Town Square (central plaza near fountain at 0,0,-13) ──────────────────────
(function() {
  // Stone pavement
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), stoneMat);
  plaza.rotation.x = -Math.PI/2; plaza.position.set(0, 0.01, -13); scene.add(plaza);

  // Raised border
  const borderMat = new THREE.MeshLambertMaterial({ color: 0x888070 });
  [[0,-11,22,0.3,0.6],[0,11,22,0.3,0.6],[-11,0,0.3,0.3,22],[11,0,0.3,0.3,22]].forEach(([bx,bz,bw,bh,bd])=>{
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd), borderMat);
    b.position.set(bx, 0.15, -13+bz); scene.add(b);
  });

  // Decorative tiles pattern (lighter squares)
  const tileMat = new THREE.MeshLambertMaterial({ color: 0xd8d0c0 });
  for (let tx=-9; tx<=9; tx+=6) for (let tz=-9; tz<=9; tz+=6) {
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(2,2), tileMat);
    tile.rotation.x=-Math.PI/2; tile.position.set(tx, 0.015, -13+tz); scene.add(tile);
  }

  // Flower ring around fountain
  const flMats = [0xff4466,0xffcc00,0xff88cc,0x88ddff].map(c=>new THREE.MeshBasicMaterial({color:c}));
  for (let fi=0; fi<16; fi++) {
    const a=(fi/16)*Math.PI*2, r=4.5;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.5,4), new THREE.MeshBasicMaterial({color:0x338833}));
    stem.position.set(Math.cos(a)*r, 0.25, -13+Math.sin(a)*r); scene.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14,5,4), flMats[fi%4]);
    head.position.set(Math.cos(a)*r, 0.6, -13+Math.sin(a)*r); scene.add(head);
  }

  // Flag pole in corner of square
  const poleMat = new THREE.MeshLambertMaterial({color:0xbbbbbb});
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,6,6), poleMat);
  pole.position.set(9, 3, -13-9); scene.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), new THREE.MeshBasicMaterial({color:0xdd2222, side:THREE.DoubleSide}));
  flag.position.set(9+0.9, 5.6, -13-9); scene.add(flag);
})();

// ── Shop Signs ────────────────────────────────────────────────────────────────
function makeSign(x, y, z, rotY, text, bgColor) {
  const g = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.12),
    new THREE.MeshLambertMaterial({ color: bgColor }));
  g.add(board);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.08),
    new THREE.MeshLambertMaterial({ color: 0x4a3010 }));
  frame.position.z = -0.04; g.add(frame);
  g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g);
}
// Signs on building fronts
makeSign( 28,  7.5, 21.1,  0,        'Shop',   0xffdd44);  // brick house
makeSign(-32, 11,   27.6,  0,        'Apt',    0x6699ff);  // gray apt
makeSign( 45, 5.5, -11.5,  Math.PI,  'Cafe',   0xff8844);  // tan house
makeSign(-50, 5,    15.1,  0,        'Market', 0x88dd44);  // cottage
makeSign( 55, 7,    38.6,  0,        'Tower',  0x44ddcc);  // teal apt
makeSign(-18, 5.5,  63.1,  0,        'Bakery', 0xff66aa);  // pink house

// ── Small Hills ───────────────────────────────────────────────────────────────
function makeHill(x, z, rx, rz, h, color=0x3d7a35) {
  const geo = new THREE.SphereGeometry(1, 12, 8);
  const mat = new THREE.MeshLambertMaterial({ color });
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(rx, h, rz);
  m.position.set(x, 0, z);
  m.receiveShadow = true;
  scene.add(m);
}
makeHill( 80,  80, 18, 18, 5, 0x3d7a35);
makeHill(-80,  75, 14, 14, 4, 0x3d7a35);
makeHill( 75, -80, 16, 16, 6, 0x3d7a35);
makeHill(-75, -75, 12, 12, 4, 0x3d7a35);
makeHill( 40,  90, 10, 10, 3, 0x4a8a40);
makeHill(-40, -90, 10, 10, 3, 0x4a8a40);
makeHill( 100,  0, 12, 12, 4, 0x3d7a35);
makeHill(-100,  0, 12, 12, 4, 0x3d7a35);

// ── Wooden Fences ─────────────────────────────────────────────────────────────
function makeFence(x, z, len, rotY=0) {
  const g = new THREE.Group();
  const postN = Math.ceil(len / 1.4);
  for (let i=0; i<postN; i++) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), fenceMat);
    post.position.set(i*1.4 - len/2, 0.45, 0); g.add(post);
  }
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.06), fenceMat);
  rail1.position.set(0, 0.65, 0); g.add(rail1);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.06), fenceMat);
  rail2.position.set(0, 0.3, 0); g.add(rail2);
  g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
}
// Fences around some buildings
makeFence( 28, 22.5, 12);     // brick house front
makeFence( 22,  18,  10, Math.PI/2);
makeFence(-50, 16.5, 14);     // cottage front
makeFence(-44,  12,   8, Math.PI/2);
makeFence( 12, 54.5, 14);     // warm house
makeFence( 18,  50,   8, Math.PI/2);
makeFence(-18, 64.5, 14);     // pink house
makeFence(-12,  60,   8, Math.PI/2);

// ── Park Area ─────────────────────────────────────────────────────────────────
(function() {
  // Grass patch (darker green)
  const parkMat = new THREE.MeshLambertMaterial({ color: 0x2d6a28 });
  const park = new THREE.Mesh(new THREE.PlaneGeometry(30, 25), parkMat);
  park.rotation.x=-Math.PI/2; park.position.set(0, 0.005, 38); scene.add(park);

  // Park path (circular)
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xc8b890 });
  for (let i=0; i<12; i++) {
    const a = (i/12)*Math.PI*2;
    const seg = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), pathMat);
    seg.rotation.x=-Math.PI/2; seg.rotation.z=-a;
    seg.position.set(Math.cos(a)*9, 0.01, 38+Math.sin(a)*9); scene.add(seg);
  }

  // Picnic tables
  [[0,33],[-6,42],[6,42]].forEach(([px,pz])=>{
    const tbl = new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.9), new THREE.MeshLambertMaterial({color:0x9b6a3a}));
    tbl.position.set(px, 0.65, pz); scene.add(tbl);
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.6,0.8), new THREE.MeshLambertMaterial({color:0x775030}));
    legs.position.set(px,0.3,pz); scene.add(legs);
  });
})();

// ── River ─────────────────────────────────────────────────────────────────────
(function() {
  const riverMat = new THREE.MeshBasicMaterial({color:0x2288cc, transparent:true, opacity:0.7});
  // Winding river segments
  [[-90,0,8,100,0],[-45,20,100,8,0.3],[30,40,8,80,0],[70,10,8,60,0]].forEach(([rx,rz,rw,rlen,roty])=>{
    const r = new THREE.Mesh(new THREE.PlaneGeometry(rw, rlen), riverMat);
    r.rotation.x=-Math.PI/2; r.rotation.z=roty; r.position.set(rx,-0.05,rz); scene.add(r);
  });

  // Small bridge over river
  const bridgeMat = new THREE.MeshLambertMaterial({color:0x8a6040});
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 8), bridgeMat);
  deck.position.set(-45, 0.2, 20); scene.add(deck);
  // Bridge railings
  [[-4.6],[ 4.6]].forEach(([bx])=>{
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 8), bridgeMat);
    rail.position.set(-45+bx, 0.7, 20); scene.add(rail);
  });
})();

// ── Decorative Streetside Details ─────────────────────────────────────────────
// Trash cans
function makeTrashcan(x, z) {
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.18,0.55,7),
    new THREE.MeshLambertMaterial({color:0x446644}));
  can.position.set(x,0.28,z); scene.add(can);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.06,7),
    new THREE.MeshLambertMaterial({color:0x335533}));
  lid.position.set(x,0.58,z); scene.add(lid);
}
[[-2,3.8],[2,3.8],[10,3.8],[-10,-3.8],[30,3.8],[-30,-3.8]].forEach(([x,z])=>makeTrashcan(x,z));

// Mailboxes
function makeMailbox(x, z, rotY=0) {
  const g = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.38,0.3), new THREE.MeshLambertMaterial({color:0x3355aa}));
  box.position.y=1.1; g.add(box);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.06,1.0,0.06), new THREE.MeshLambertMaterial({color:0x888888}));
  post.position.y=0.5; g.add(post);
  g.position.set(x,0,z); g.rotation.y=rotY; scene.add(g);
}
makeMailbox(24.5,18,0); makeMailbox(-29.5,22,0);
makeMailbox(41.5,-18,0); makeMailbox(-19.5,-35,0);
makeMailbox(8.5,50,0); makeMailbox(51.5,35,0);
