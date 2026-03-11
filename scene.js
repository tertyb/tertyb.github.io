// ── Scene ─────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xf0a060); // warm amber sky

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf0a060, 80, 320);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 6, 12);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ── Lighting — 6 PM golden hour ───────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xff9944, 0.7); // warm orange ambient
scene.add(ambientLight);
const hemiLight = new THREE.HemisphereLight(0xffb060, 0x8b5c20, 0.6); // amber sky, brown ground
const sun = new THREE.DirectionalLight(0xff8833, 1.6); // deep orange sun, low intensity
sun.position.set(60, 18, 30); // low on horizon
sun.castShadow = true;
sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
sun.shadow.camera.top  =  80; sun.shadow.camera.bottom = -80;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.001;
scene.add(sun);
scene.add(hemiLight);

