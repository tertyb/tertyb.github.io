// ── Scene ─────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xb8cfe8);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xb8cfe8, 80, 350);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 6, 12);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ── Lighting ──────────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xfff4e0, 1.2);
scene.add(ambientLight);
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x4caf50, 1.0);
const sun = new THREE.DirectionalLight(0xfffde7, 3.0);
sun.position.set(20, 40, 20);
sun.castShadow = true;
sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
sun.shadow.camera.top  =  80; sun.shadow.camera.bottom = -80;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.001;
scene.add(sun);
scene.add(hemiLight);

