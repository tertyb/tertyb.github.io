// ── Car ───────────────────────────────────────────────────────────────────────
function buildCar() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.65, 4.2), bodyMat);
  body.position.y = 0.62; body.castShadow = true; g.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.65, 2.3), bodyMat);
  cabin.position.set(0, 1.25, -0.25); cabin.castShadow = true; g.add(cabin);
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x99ddff, transparent:true, opacity:0.65 });
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.58), glassMat);
  windshield.position.set(0, 1.25, 0.91); windshield.rotation.x = -0.28; g.add(windshield);
  const rearshield = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.58), glassMat);
  rearshield.position.set(0, 1.25, -1.42); rearshield.rotation.x = 0.28; g.add(rearshield);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const rimMat   = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });
  const wheels = [];
  [[-1.1,0.38,1.35],[1.1,0.38,1.35],[-1.1,0.38,-1.35],[1.1,0.38,-1.35]].forEach(([wx,wy,wz]) => {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.32,14), wheelMat);
    tire.rotation.z = Math.PI/2; wg.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.34,6), rimMat);
    rim.rotation.z = Math.PI/2; wg.add(rim);
    wg.position.set(wx,wy,wz); g.add(wg); wheels.push(wg);
  });
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
  [[-0.65],[0.65]].forEach(([lx]) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.2,0.06), lightMat);
    hl.position.set(lx, 0.62, 2.12); g.add(hl);
  });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
  [[-0.65],[0.65]].forEach(([lx]) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.2,0.06), tailMat);
    tl.position.set(lx, 0.62, -2.12); g.add(tl);
  });
  g.userData.wheels = wheels;
  return g;
}
const car = buildCar();
car.position.set(8, 0, 8);
scene.add(car);
let inCar = false, carSpeed = 0;

// Car hint label
const carHintEl = document.createElement('div');
carHintEl.className = 'bubble-hint';
carHintEl.style.display = 'none';
carHintEl.textContent = '[E] Enter Car';
document.getElementById('bubble-container').appendChild(carHintEl);

