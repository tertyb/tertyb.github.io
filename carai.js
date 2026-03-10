// ── AI Cars ────────────────────────────────────────────────────────────────────
// Simple AI cars that drive along road routes

const AI_CAR_COLORS = [0xdd2222, 0x2244cc, 0x22aa44, 0xeeaa00, 0xcc44cc, 0x00aacc];

function buildAICar(color) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 3.8), bodyMat);
  body.position.y = 0.55; body.castShadow = true; g.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2.0), bodyMat);
  cab.position.set(0, 1.05, -0.2); g.add(cab);
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 });
  const wind = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.42), glassMat);
  wind.position.set(0, 1.08, 0.81); g.add(wind);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const wheels = [];
  [[-0.95,0.28,1.2],[0.95,0.28,1.2],[-0.95,0.28,-1.2],[0.95,0.28,-1.2]].forEach(([wx,wy,wz]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.2,10), wheelMat);
    w.rotation.z = Math.PI/2; w.position.set(wx,wy,wz); g.add(w); wheels.push(w);
  });
  g.userData.wheels = wheels;
  return g;
}

// Road routes: closed-loop waypoints
const CAR_ROUTES = [
  // Main E-W road loop
  [
    { x: -100, z:  2 }, { x:  0,  z:  2 }, { x:  100, z:  2 },
    { x:  100, z: -2 }, { x:  0,  z: -2 }, { x: -100, z: -2 },
  ],
  // North blvd loop
  [
    { x: -85, z: 57 }, { x:  0, z: 57 }, { x:  85, z: 57 },
    { x:  85, z: 53 }, { x:  0, z: 53 }, { x: -85, z: 53 },
  ],
  // South blvd loop
  [
    { x:  85, z: -53 }, { x:  0, z: -53 }, { x: -85, z: -53 },
    { x: -85, z: -57 }, { x:  0, z: -57 }, { x:  85, z: -57 },
  ],
  // N-S central spur loop
  [
    { x:  2, z: -50 }, { x:  2, z:  0 }, { x:  2, z:  50 },
    { x: -2, z:  50 }, { x: -2, z:  0 }, { x: -2, z: -50 },
  ],
  // East avenue loop
  [
    { x: 67, z:  45 }, { x: 67, z:  0 }, { x: 67, z: -45 },
    { x: 63, z: -45 }, { x: 63, z:  0 }, { x: 63, z:  45 },
  ],
  // West avenue loop
  [
    { x: -63, z: -45 }, { x: -63, z:  0 }, { x: -63, z:  45 },
    { x: -67, z:  45 }, { x: -67, z:  0 }, { x: -67, z: -45 },
  ],
];

const aiCars = CAR_ROUTES.map((route, ri) => {
  const car = buildAICar(AI_CAR_COLORS[ri % AI_CAR_COLORS.length]);
  const startWp = Math.floor(Math.random() * route.length);
  const startPt = route[startWp];
  car.position.set(startPt.x, 0, startPt.z);
  scene.add(car);
  return {
    mesh: car,
    route,
    wpIdx: startWp,
    speed: 10 + Math.random() * 6,
  };
});

function updateCarAI(dt) {
  for (const ac of aiCars) {
    const wp = ac.route[ac.wpIdx];
    const dx = wp.x - ac.mesh.position.x;
    const dz = wp.z - ac.mesh.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 1.2) {
      ac.wpIdx = (ac.wpIdx + 1) % ac.route.length;
    } else {
      const angle = Math.atan2(dx, dz);
      ac.mesh.position.x += Math.sin(angle) * ac.speed * dt;
      ac.mesh.position.z += Math.cos(angle) * ac.speed * dt;
      ac.mesh.rotation.y = angle;
      ac.mesh.userData.wheels.forEach(w => { w.rotation.x += ac.speed * dt * 1.6; });
    }
  }
}
