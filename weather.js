// ── Weather System ────────────────────────────────────────────────────────────
let isRaining = false;
let rainTimer = 60 + Math.random() * 120; // seconds until first rain
let rainDuration = 0;

// Rain particle system
const RAIN_COUNT = 600;
const rainPositions = new Float32Array(RAIN_COUNT * 3);
for (let i = 0; i < RAIN_COUNT; i++) {
  rainPositions[i*3]   = (Math.random() - 0.5) * 80;
  rainPositions[i*3+1] = Math.random() * 30;
  rainPositions[i*3+2] = (Math.random() - 0.5) * 80;
}
const rainGeo = new THREE.BufferGeometry();
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
const rainMat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.12, transparent: true, opacity: 0.6 });
const rain = new THREE.Points(rainGeo, rainMat);
rain.visible = false;
scene.add(rain);

// Rain sound indicator
const rainEl = document.createElement('div');
rainEl.id = 'rainindicator';
rainEl.textContent = '🌧 Rain';
rainEl.style.cssText = 'position:fixed;bottom:80px;left:16px;background:rgba(80,120,200,0.88);border:2px solid #336;border-radius:10px;padding:4px 12px;font-size:14px;color:#eef;display:none;z-index:10;pointer-events:none;box-shadow:2px 2px 0 #336;';
document.body.appendChild(rainEl);

function updateWeather(dt) {
  // Move rain with camera
  rain.position.x = camera.position.x;
  rain.position.z = camera.position.z;

  if (isRaining) {
    rainDuration -= dt;
    // Animate rain drops falling
    const pos = rainGeo.attributes.position.array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i*3+1] -= dt * 22;
      if (pos[i*3+1] < -2) pos[i*3+1] = 28 + Math.random() * 5;
    }
    rainGeo.attributes.position.needsUpdate = true;
    if (rainDuration <= 0) {
      isRaining = false;
      rain.visible = false;
      rainEl.style.display = 'none';
      rainTimer = 45 + Math.random() * 90;
    }
  } else {
    rainTimer -= dt;
    if (rainTimer <= 0) {
      isRaining = true;
      rainDuration = 15 + Math.random() * 25;
      rain.visible = true;
      rainEl.style.display = 'block';
    }
  }
}
