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
makeBuilding( 28,  18,  6, 8, 6,  0xc0522a, 0x7a1a08);  // red brick house
makeBuilding(-32,  22,  5, 12, 5, 0x4a6fa5, 0x22334a);  // slate blue apartment
makeBuilding( 45, -18,  7, 6, 7,  0xe8a830, 0x8a5010);  // mustard yellow house
makeBuilding(-22, -35,  5, 9, 5,  0x2255cc, 0x102060);  // royal blue building
makeBuilding( 12,  50,  6, 7, 6,  0xe06030, 0x882010);  // coral orange house
makeBuilding(-50,  12,  8, 5, 6,  0x3a7a3a, 0x1a401a);  // forest green cottage
makeBuilding( 55,  35,  5, 14, 5, 0x2a8a7a, 0x104840);  // teal apartment
makeBuilding(-18,  60,  6, 6, 6,  0xd04080, 0x801840);  // rose pink house
makeBuilding( 38, -50,  9, 5, 7,  0x8a4a2a, 0x502010);  // burnt sienna warehouse
makeBuilding(-60, -40,  5, 10, 5, 0x6030a0, 0x301860);  // deep purple tower

// North Blvd district (z≈55)
makeBuilding( 70,  55,  6, 7, 6,  0xd44020, 0x881000);  // orange-red house
makeBuilding( 50,  62,  5, 9, 5,  0x20a050, 0x0a5020);  // bright green apt
makeBuilding(-55,  58,  7, 6, 6,  0xc0a020, 0x706000);  // golden house
makeBuilding(-75,  55,  5,11, 5,  0x3060c0, 0x102060);  // cobalt tower
makeBuilding( 20,  80,  6, 6, 6,  0xa02050, 0x600030);  // crimson house
makeBuilding(-20,  75,  8, 5, 7,  0x20a0a0, 0x005050);  // cyan warehouse
makeBuilding( 85,  30,  5, 8, 5,  0xe05080, 0x802030);  // pink-red house
makeBuilding(-85,  25,  6, 7, 6,  0x50a020, 0x205000);  // lime green house

// South Blvd district (z≈-55)
makeBuilding( 72, -55,  5, 9, 5,  0xd06000, 0x803000);  // amber tower
makeBuilding( 48, -62,  6, 6, 6,  0x2060d0, 0x003090);  // sky blue house
makeBuilding(-52, -58,  7, 7, 6,  0x902090, 0x500050);  // violet house
makeBuilding(-78, -55,  5, 5, 5,  0x40b040, 0x205020);  // green cottage
makeBuilding( 22, -80,  6, 8, 5,  0xe03030, 0x900010);  // bright red house
makeBuilding(-25, -78,  5,10, 5,  0x4080c0, 0x204060);  // steel blue apt
makeBuilding( 88, -30,  6, 6, 6,  0xc08020, 0x705010);  // tan-gold house
makeBuilding(-90, -30,  5, 8, 5,  0x802060, 0x401030);  // maroon house

// Far east corridor (x≈65)
makeBuilding( 65,  25,  5, 7, 5,  0xe8c030, 0x906010);  // yellow house
makeBuilding( 65, -25,  5, 9, 5,  0x30a060, 0x105030);  // mint green apt
makeBuilding( 90,   5,  7, 5, 6,  0xc04040, 0x701010);  // salmon house

// Far west corridor (x≈-65)
makeBuilding(-65,  25,  5, 7, 5,  0x5050d0, 0x202080);  // lavender house
makeBuilding(-65, -25,  6, 6, 6,  0xd05020, 0x803010);  // rust house
makeBuilding(-90,   5,  5, 8, 5,  0x20b090, 0x006050);  // seafoam tower

