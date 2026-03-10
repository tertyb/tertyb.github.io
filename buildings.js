// ── Buildings ─────────────────────────────────────────────────────────────────
function makeBuilding(x, z, w, h, d, wallColor, roofColor) {
  const g = new THREE.Group();
  const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
  body.position.y = h/2; body.castShadow = true; body.receiveShadow = true; g.add(body);
  const roofMat = new THREE.MeshLambertMaterial({ color: roofColor });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.78, 2.5, 4), roofMat);
  roof.rotation.y = Math.PI/4; roof.position.y = h + 1.25; roof.castShadow = true; g.add(roof);
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
  const rows = Math.max(1, Math.floor(h/2.5));
  const cols = Math.max(1, Math.floor(w/2.2));
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), glassMat);
    win.position.set(-w/2+1.1+c*2, 1.4+r*2.4, d/2+0.02); g.add(win);
  }
  g.position.set(x, 0, z); scene.add(g);
  colliders.push({ x, z, radius: Math.max(w,d)*0.65 });
}
makeBuilding( 28,  18,  6, 8, 6,  0xd4a96a, 0x8b3a2a);  // brick house
makeBuilding(-32,  22,  5, 12, 5, 0xc8c8c8, 0x555555);  // gray apartment
makeBuilding( 45, -18,  7, 6, 7,  0xe8d5a0, 0x7a5c2e);  // tan house
makeBuilding(-22, -35,  5, 9, 5,  0xb0c8e0, 0x2255aa);  // blue building
makeBuilding( 12,  50,  6, 7, 6,  0xd4b8a0, 0x994422);  // warm house
makeBuilding(-50,  12,  8, 5, 6,  0xe0d0b0, 0x8b6040);  // wide cottage
makeBuilding( 55,  35,  5, 14, 5, 0xa0b8a0, 0x336633);  // tall green apt
makeBuilding(-18,  60,  6, 6, 6,  0xf0c8b0, 0xcc4422);  // pink house
makeBuilding( 38, -50,  9, 5, 7,  0xc0b890, 0x665522);  // warehouse
makeBuilding(-60, -40,  5, 10, 5, 0xd8c8e8, 0x664488);  // purple tower

