function b64ToBuffer(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function b64ToDataURL(b64, mime) {
  return `data:${mime};base64,${b64}`;
}

function loadTexture(b64, colorSpace) {
  const url = b64ToDataURL(b64, 'image/png');
  const tex = new THREE.TextureLoader().load(url);
  if (colorSpace === 'srgb') tex.encoding = THREE.sRGBEncoding;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

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
scene.add(new THREE.AmbientLight(0xfff4e0, 1.2));
const sun = new THREE.DirectionalLight(0xfffde7, 3.0);
sun.position.set(20, 40, 20);
sun.castShadow = true;
sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
sun.shadow.camera.top  =  80; sun.shadow.camera.bottom = -80;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.001;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0x87CEEB, 0x4caf50, 1.0));

// ── Ground ────────────────────────────────────────────────────────────────────
function makeGrassTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#3d7a35'; ctx.fillRect(0,0,512,512);
  for (let i=0; i<12000; i++) {
    const x=Math.random()*512, y=Math.random()*512;
    const r=20+Math.floor(Math.random()*60), g=100+Math.floor(Math.random()*80), b=10+Math.floor(Math.random()*30);
    ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(x,y,1+Math.random()*2,2+Math.random()*4);
  }
  for (let i=0; i<300; i++) {
    const x=Math.random()*512, y=Math.random()*512, r=3+Math.random()*12;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(20,60,10,${0.05+Math.random()*0.12})`; ctx.fill();
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(25,25); t.encoding=THREE.sRGBEncoding; return t;
}
function makeDirtTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#a07850'; ctx.fillRect(0,0,256,256);
  for (let i=0; i<5000; i++) {
    const x=Math.random()*256, y=Math.random()*256;
    const v=Math.floor(Math.random()*50-25);
    const base=[160+v, 120+v, 80+v];
    ctx.fillStyle=`rgb(${base[0]},${base[1]},${base[2]})`; ctx.fillRect(x,y,1+Math.random()*3,1+Math.random()*2);
  }
  for (let i=0; i<80; i++) {
    const x=Math.random()*256, y=Math.random()*256, r=1+Math.random()*4;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(80,50,20,${0.1+Math.random()*0.2})`; ctx.fill();
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,20); t.encoding=THREE.sRGBEncoding; return t;
}
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.MeshLambertMaterial({ map: makeGrassTex() })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ── Path ──────────────────────────────────────────────────────────────────────
const pathMat = new THREE.MeshLambertMaterial({ map: makeDirtTex() });
const p1 = new THREE.Mesh(new THREE.PlaneGeometry(4, 80), pathMat);
p1.rotation.x = -Math.PI/2; p1.position.set(0, 0.01, 5); p1.receiveShadow = true; scene.add(p1);
const p2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 4), pathMat);
p2.rotation.x = -Math.PI/2; p2.position.set(0, 0.01, -5); p2.receiveShadow = true; scene.add(p2);

// ── Sky (anime skybox texture) ────────────────────────────────────────────────
const skyTex = new THREE.TextureLoader().load(b64ToDataURL(ASSETS.sky, 'image/jpeg'));
skyTex.encoding = THREE.sRGBEncoding;
const skyMesh = new THREE.Mesh(
  new THREE.SphereGeometry(90, 64, 32),
  new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false })
);
skyMesh.renderOrder = -1;
scene.add(skyMesh);

// Fog to blend distant objects with sky horizon
scene.fog = new THREE.Fog(0xb8cfe8, 80, 350);
renderer.setClearColor(0xb8cfe8);

// ── Clouds ────────────────────────────────────────────────────────────────────
function makeCloud(x, y, z) {
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [[0,0,0,1.6,.6,1.2],[1.2,.3,0,1.2,.55,1],[-1.1,.2,0,1.1,.5,.9]].forEach(([cx,cy,cz,sx,sy,sz]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), m);
    mesh.scale.set(sx, sy, sz); mesh.position.set(cx, cy, cz); g.add(mesh);
  });
  g.position.set(x, y, z); scene.add(g); return g;
}
const clouds = [
  makeCloud(-40,22,-50), makeCloud(25,28,-70), makeCloud(55,24,-30), makeCloud(-20,26,-80),
  makeCloud(40,30,-60), makeCloud(-60,22,-20), makeCloud(10,25,-90), makeCloud(-35,28,-40),
  makeCloud(60,20,-70), makeCloud(-15,24,-55), makeCloud(30,26,-35), makeCloud(-50,30,-65)
];

// ── Trees ─────────────────────────────────────────────────────────────────────
const treePositions = [
  [-8,-8],[8,-10],[-10,5],[12,3],[-6,12],[6,14],[-14,-2],[14,-6],[3,-14],[-3,-12],[16,10],[-16,8],
  [-25,15],[28,-18],[35,10],[-32,8],[20,30],[-22,-30],[40,-20],[-38,25],[50,5],[-48,-10],
  [15,-45],[22,42],[-18,50],[45,35],[-40,-35],[60,-15],[-55,20],[30,-55],[55,-45],[-60,30],
  [70,10],[-65,-25],[42,60],[-50,55],[80,-30],[-75,15],[25,70],[-30,-65],[65,50],[-70,45],
  [85,-50],[-80,-40],[10,85],[-15,-80],[55,75],[-60,-70],[90,-5],[-88,35],[40,-85],[75,-70],
  [-20,90],[50,-90],[30,80],[-45,75],[88,55],[-85,-55],[60,-80],[-65,65],[20,-88],[-35,85]
];
function makeTree(x, z, scale=1) {
  const g = new THREE.Group();
  const tM = new THREE.MeshLambertMaterial({ color: 0x8B5E3C });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.2*scale,.3*scale,1.8*scale,8), tM);
  trunk.position.y = .9*scale; trunk.castShadow = true; g.add(trunk);
  const lm1 = new THREE.MeshLambertMaterial({ color: 0x2e8b2e });
  const lm2 = new THREE.MeshLambertMaterial({ color: 0x3aad3a });
  [[2.2,1.8,.7,lm1],[1.7,2.7,.6,lm2],[1.2,3.4,.5,lm1]].forEach(([r,y,s,m]) => {
    const c = new THREE.Mesh(new THREE.ConeGeometry(r*scale*s*1.1,r*scale,8), m);
    c.position.y = y*scale; c.castShadow = true; g.add(c);
  });
  g.position.set(x, 0, z); scene.add(g);
}
treePositions.forEach(([x,z]) => makeTree(x, z, .8+Math.random()*.5));

// ── Doghouse ──────────────────────────────────────────────────────────────────
function makeDoghouse(x, z) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3,2.2,2.8), new THREE.MeshLambertMaterial({ color:0xd43232 }));
  body.position.y=1.1; body.castShadow=true; body.receiveShadow=true; g.add(body);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4,1.3,4), new THREE.MeshLambertMaterial({ color:0x8b1a1a }));
  roof.rotation.y=Math.PI/4; roof.position.y=2.85; roof.castShadow=true; g.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(.9,1.3,.15), new THREE.MeshLambertMaterial({ color:0x1a0a00 }));
  door.position.set(0,.65,1.43); g.add(door);
  g.position.set(x, 0, z); scene.add(g);
}
makeDoghouse(-6, -6);

// ── Flowers ───────────────────────────────────────────────────────────────────
const fColors = [0xff6b6b,0xffe66d,0xff9ff3,0x74b9ff,0xffeaa7];
for (let i=0; i<150; i++) {
  const a=Math.random()*Math.PI*2, r=8+Math.random()*80;
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.4,5), new THREE.MeshBasicMaterial({ color:0x3a8a3a }));
  stem.position.y = .2; g.add(stem);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.12,6,4), new THREE.MeshBasicMaterial({ color:fColors[i%5] }));
  head.position.y = .45; g.add(head);
  g.position.set(Math.cos(a)*r, 0, Math.sin(a)*r); scene.add(g);
}

// ── NPC Builders ──────────────────────────────────────────────────────────────
function makeCharlie() {
  const g=new THREE.Group();
  const skin=new THREE.MeshLambertMaterial({color:0xffe4b5});
  const shirt=new THREE.MeshLambertMaterial({color:0xf5f5dc});
  const pants=new THREE.MeshLambertMaterial({color:0x4682b4});
  const black=new THREE.MeshLambertMaterial({color:0x111111});
  const zigzag=new THREE.MeshLambertMaterial({color:0xcc9900});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.25,.7,8),shirt); body.position.y=.75; body.castShadow=true; g.add(body);
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(.58,.08,.58),zigzag); stripe.position.y=.83; g.add(stripe);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),skin); head.position.y=1.45; head.castShadow=true; g.add(head);
  [-0.1,0.1].forEach(ex=>{ const e=new THREE.Mesh(new THREE.SphereGeometry(.045,5,4),black); e.position.set(ex,1.49,.27); g.add(e); });
  [[-0.14],[0.14]].forEach(([lx])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.1,.09,.5,7),pants); l.position.set(lx,.25,0); g.add(l); });
  return g;
}
function makeWoodstock() {
  const g=new THREE.Group();
  const y=new THREE.MeshLambertMaterial({color:0xffd700});
  const o=new THREE.MeshLambertMaterial({color:0xff8c00});
  const b=new THREE.MeshLambertMaterial({color:0x111111});
  const body=new THREE.Mesh(new THREE.SphereGeometry(.18,8,7),y); body.scale.set(1,1.2,.9); body.position.y=.42; g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.15,8,7),y); head.position.y=.72; g.add(head);
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.05,.14,5),o); beak.rotation.x=Math.PI/2; beak.position.set(0,.72,.2); g.add(beak);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,5,4),b); eye.position.set(-.07,.76,.13); g.add(eye);
  const tuft=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,4),y); tuft.position.set(0,.9,0); g.add(tuft);
  [[-.06],[.06]].forEach(([lx])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.18,4),o); l.position.set(lx,.09,0); g.add(l); });
  g.scale.set(.9,.9,.9); return g;
}
function makeLucy() {
  const g=new THREE.Group();
  const skin=new THREE.MeshLambertMaterial({color:0xffe4b5});
  const dress=new THREE.MeshLambertMaterial({color:0x1e90ff});
  const hair=new THREE.MeshLambertMaterial({color:0x111111});
  const black=new THREE.MeshLambertMaterial({color:0x111111});
  const body=new THREE.Mesh(new THREE.ConeGeometry(.28,.7,8),dress); body.position.y=.55; body.castShadow=true; g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),skin); head.position.y=1.35; g.add(head);
  const hairM=new THREE.Mesh(new THREE.SphereGeometry(.3,8,5),hair); hairM.scale.set(1,.6,1); hairM.position.y=1.52; g.add(hairM);
  [-0.1,0.1].forEach(ex=>{ const e=new THREE.Mesh(new THREE.SphereGeometry(.045,5,4),black); e.position.set(ex,1.39,.25); g.add(e); });
  [[-0.12],[0.12]].forEach(([lx])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.09,.08,.45,7),skin); l.position.set(lx,.22,0); g.add(l); });
  return g;
}
function makeLinus() {
  const g=new THREE.Group();
  const skin=new THREE.MeshLambertMaterial({color:0xffe4b5});
  const shirt=new THREE.MeshLambertMaterial({color:0xff6b35});
  const pants=new THREE.MeshLambertMaterial({color:0x556b2f});
  const blanket=new THREE.MeshLambertMaterial({color:0x9370db,side:THREE.DoubleSide});
  const black=new THREE.MeshLambertMaterial({color:0x111111});
  const hair=new THREE.MeshLambertMaterial({color:0x8b4513});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.26,.23,.7,8),shirt); body.position.y=.75; g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),skin); head.position.y=1.42; g.add(head);
  const hairM=new THREE.Mesh(new THREE.SphereGeometry(.3,8,5),hair); hairM.scale.set(1,.4,1); hairM.position.y=1.56; g.add(hairM);
  [-0.09,0.09].forEach(ex=>{ const e=new THREE.Mesh(new THREE.SphereGeometry(.04,5,4),black); e.position.set(ex,1.46,.25); g.add(e); });
  [[-0.13],[0.13]].forEach(([lx])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(.09,.08,.48,7),pants); l.position.set(lx,.24,0); g.add(l); });
  const blankM=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),blanket); blankM.rotation.z=.3; blankM.position.set(.38,.85,.1); g.add(blankM);
  return g;
}

// ── NPCs ──────────────────────────────────────────────────────────────────────
const npcDefs = [
  { name:'Charlie Brown', dialogues:["Good grief! Hi Snoopy!\nWant to play baseball?","You're a good dog, Snoopy.","I can never get\nthe kite to fly...","Happiness is a warm puppy."], makeChar:makeCharlie, pos:[7,-5],  rot:-0.5 },
  { name:'Woodstock',     dialogues:["Tweet tweet! 🐦\n(Hello, Snoopy!)","Chirp chirp! 🐦\n(Nice weather today!)","Tweet! 🐦\n(You're my best friend!)","...! 🐦\n(Found any bones?)"],       makeChar:makeWoodstock,pos:[-2,-8], rot:1.0  },
  { name:'Lucy',          dialogues:["Don't trust Charlie Brown's\nbaseball skills.","The doctor is IN.\n5 cents, please!","I'm the most naturally\ngifted person I know.","You need help, Snoopy.\nFive cents."], makeChar:makeLucy, pos:[5,5], rot:-1.2 },
  { name:'Linus',         dialogues:["My blanket is the\nsecret to happiness. ✨","I believe in the\nGreat Pumpkin, Snoopy!","Security is knowing\nyou're not alone.","Have you tried\nholding a blanket?"], makeChar:makeLinus, pos:[-8,3], rot:0.8 }
];
const npcs = npcDefs.map(def => {
  const mesh = def.makeChar();
  mesh.position.set(def.pos[0], 0, def.pos[1]);
  mesh.rotation.y = def.rot;
  mesh.userData.baseRot = def.rot;
  scene.add(mesh);
  return { mesh, ...def, talkVisible: false, dialogueIdx: 0 };
});

// ── Colliders ─────────────────────────────────────────────────────────────────
const colliders = [
  ...treePositions.map(([x,z]) => ({x, z, radius:0.6})),
  {x:-6, z:-6, radius:2.0}
];

// ── Rocks ─────────────────────────────────────────────────────────────────────
function makeRock(x, z, scale=1) {
  const g=new THREE.Group();
  const mat=new THREE.MeshLambertMaterial({color:0x887766});
  [[0.8,0,0,0.38],[0.5,0.52,0.28,0.25],[0.42,-0.38,0.48,0.3]].forEach(([r,ox,oz,y])=>{
    const m=new THREE.Mesh(new THREE.DodecahedronGeometry(r*scale,0),mat);
    m.position.set(ox*scale,y*scale,oz*scale); m.rotation.set(Math.random()*2,Math.random()*3,0);
    m.castShadow=true; g.add(m);
  });
  g.position.set(x,0,z); scene.add(g);
  colliders.push({x,z,radius:0.85*scale});
}
[[20,-25,1.2],[-15,30,0.8],[38,15,1.5],[-42,-10,1.0],[25,55,0.9],
 [-55,38,1.3],[65,-35,1.1],[-70,20,0.8],[48,-65,1.4],[-35,-55,1.0],
 [78,40,0.7],[-80,-60,1.2],[10,-70,1.0],[92,-15,0.9],[-88,45,1.1],
 [35,88,1.3],[-25,-88,0.8],[72,68,1.0],[-65,-75,1.2],[15,92,0.9]
].forEach(([x,z,s])=>makeRock(x,z,s));

// ── Bushes ────────────────────────────────────────────────────────────────────
function makeBush(x, z, scale=1) {
  const g=new THREE.Group();
  const m1=new THREE.MeshLambertMaterial({color:0x2d7a2d});
  const m2=new THREE.MeshLambertMaterial({color:0x3a9e3a});
  [[0,0.55],[0.4,0.42],[-0.35,0.47],[0.1,0.36]].forEach(([ox,r],i)=>{
    const b=new THREE.Mesh(new THREE.SphereGeometry(r*scale,7,5),i%2?m2:m1);
    b.position.set(ox*scale,r*scale,0); b.castShadow=true; g.add(b);
  });
  g.position.set(x,0,z); scene.add(g);
}
[[12,-15],[-18,20],[32,-8],[-28,35],[48,22],[-45,10],[22,45],[-38,-20],
 [15,25],[-12,-30],[40,50],[-55,-15],[68,25],[-62,42],[30,-42],[-22,65],
 [55,-55],[-48,68],[80,-48],[-75,35],[18,-62],[42,-75],[-35,80],[70,-80]
].forEach(([x,z])=>makeBush(x,z,0.7+Math.random()*0.5));

// ── Mountains ─────────────────────────────────────────────────────────────────
function makeMountain(x, z, scale=1, color=0x6b7f6b) {
  const g=new THREE.Group();
  const mat=new THREE.MeshLambertMaterial({color});
  const peak=new THREE.Mesh(new THREE.ConeGeometry(12*scale,22*scale,7),mat);
  peak.position.y=0; g.add(peak);
  const snow=new THREE.Mesh(new THREE.ConeGeometry(4.5*scale,8*scale,6),
    new THREE.MeshLambertMaterial({color:0xf0f0f5}));
  snow.position.y=9.5*scale; g.add(snow);
  [[9,-2,0.75],[-7,-3,0.65]].forEach(([ox,oy,ss])=>{
    const s=new THREE.Mesh(new THREE.ConeGeometry(10*scale*ss,16*scale*ss,6),mat);
    s.position.set(ox*scale,oy,0); g.add(s);
  });
  g.position.set(x,0,z); scene.add(g);
}
[[120,120,1.2,0x5a6e5a],[100,130,0.9,0x6b7f6b],[-120,110,1.0,0x4a5e4a],
 [130,-110,1.1,0x5a6e5a],[-115,-120,0.8,0x6b7f6b],[115,90,0.75,0x7a8f7a],
 [-100,-100,1.0,0x5a6e5a],[80,140,0.85,0x6b7f6b]
].forEach(([x,z,s,c])=>makeMountain(x,z,s,c));

// ── Ponds ─────────────────────────────────────────────────────────────────────
function makePond(x, z, r=7) {
  const pond=new THREE.Mesh(new THREE.CircleGeometry(r,24),
    new THREE.MeshBasicMaterial({color:0x3399cc,transparent:true,opacity:0.78}));
  pond.rotation.x=-Math.PI/2; pond.position.set(x,0.05,z); scene.add(pond);
  for(let i=0;i<10;i++){
    const a=(i/10)*Math.PI*2, rr=r*0.75+Math.random()*r*0.35;
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.7,4),
      new THREE.MeshLambertMaterial({color:0x5a7a3a}));
    stem.position.set(x+Math.cos(a)*rr,0.35,z+Math.sin(a)*rr); scene.add(stem);
    const head=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.28,5),
      new THREE.MeshLambertMaterial({color:0x7a4a1e}));
    head.position.set(x+Math.cos(a)*rr,0.84,z+Math.sin(a)*rr); scene.add(head);
  }
  colliders.push({x,z,radius:r});
}
makePond(0,32,8);
makePond(-50,50,6);
makePond(62,30,5);

// ── Fountain ──────────────────────────────────────────────────────────────────
(function(){
  const g=new THREE.Group();
  const sMat=new THREE.MeshLambertMaterial({color:0xbbbbbb});
  const wMat=new THREE.MeshBasicMaterial({color:0x44aadd,transparent:true,opacity:0.82});
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.9,0.5,16),sMat);
  basin.position.y=0.25; g.add(basin);
  const post=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.3,8),sMat);
  post.position.y=0.95; g.add(post);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.0,0.32,12),sMat);
  bowl.position.y=1.72; g.add(bowl);
  const spout=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.1,0.5,6),sMat);
  spout.position.y=2.05; g.add(spout);
  const water=new THREE.Mesh(new THREE.CircleGeometry(2.4,20),wMat);
  water.rotation.x=-Math.PI/2; water.position.y=0.51; g.add(water);
  g.position.set(0,0,-13); scene.add(g);
  colliders.push({x:0,z:-13,radius:3});
})();

// ── Street Lamps ──────────────────────────────────────────────────────────────
function makeLamp(x, z) {
  const g=new THREE.Group();
  const pMat=new THREE.MeshLambertMaterial({color:0x444444});
  const post=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,4.2,6),pMat);
  post.position.y=2.1; g.add(post);
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,1.1,5),pMat);
  arm.rotation.z=Math.PI/2; arm.position.set(0.45,4.05,0); g.add(arm);
  const globe=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),
    new THREE.MeshBasicMaterial({color:0xffffcc}));
  globe.position.set(0.9,4.05,0); g.add(globe);
  g.position.set(x,0,z); scene.add(g);
}
[[10,0],[-10,0],[0,10],[0,-10],[20,20],[-20,-20],[30,0],[-30,0],
 [0,30],[0,-30],[15,-15],[-15,15],[40,-5],[-40,5],[-18,28],[18,28]
].forEach(([x,z])=>makeLamp(x,z));

// ── Park Benches ──────────────────────────────────────────────────────────────
function makeBench(x, z, rotY=0) {
  const g=new THREE.Group();
  const wMat=new THREE.MeshLambertMaterial({color:0x8b5e3c});
  const mMat=new THREE.MeshLambertMaterial({color:0x555555});
  const seat=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.1,0.5),wMat);
  seat.position.y=0.5; g.add(seat);
  const back=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.42,0.08),wMat);
  back.position.set(0,0.82,-0.21); back.rotation.x=0.1; g.add(back);
  [[-0.55],[0.55]].forEach(([lx])=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.5,0.52),mMat);
    leg.position.set(lx,0.25,0); g.add(leg);
  });
  g.position.set(x,0,z); g.rotation.y=rotY; scene.add(g);
}
[[5,22,0],[-5,22,Math.PI],[22,5,Math.PI/2],[-22,-5,Math.PI/2],
 [28,38,0],[-12,42,0.8],[0,38,Math.PI/4],[50,28,Math.PI/3],
 [-3,-16,0],[3,-16,Math.PI]
].forEach(([x,z,r])=>makeBench(x,z,r));

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => { keys[e.code]=true; });
window.addEventListener('keyup',   e => { keys[e.code]=false; });
window.addEventListener('keydown', e => {
  if (e.code === 'KeyE') {
    if (inCar) {
      inCar = false; player.visible = true;
      player.position.x = car.position.x + Math.sin(car.rotation.y + Math.PI/2) * 2.8;
      player.position.z = car.position.z + Math.cos(car.rotation.y + Math.PI/2) * 2.8;
      player.position.y = player.userData.groundOffset || 0;
    } else {
      const cdx = player.position.x - car.position.x, cdz = player.position.z - car.position.z;
      if (Math.sqrt(cdx*cdx+cdz*cdz) < 5) {
        inCar = true; player.visible = false; carSpeed = 0;
      } else {
        const near = getNearestNPC(3.5);
        if (near) {
          if (near.talkVisible) {
            near.dialogueIdx = (near.dialogueIdx + 1) % near.dialogues.length;
          near.bubbleEl.innerHTML = `<b>${near.name}</b><br>${near.dialogues[near.dialogueIdx].replace(/\n/g,'<br>')}`;
          } else { near.talkVisible = true; }
        }
      }
    }
  }
  if (e.code === 'Space') e.preventDefault();
});

let camYaw=0, camPitch=0.35, pointerLocked=false;
canvas.addEventListener('click', () => canvas.requestPointerLock());
document.addEventListener('pointerlockchange', () => { pointerLocked = document.pointerLockElement === canvas; });
document.addEventListener('mousemove', e => {
  if (!pointerLocked) return;
  camYaw   -= e.movementX * 0.003;
  camPitch -= e.movementY * 0.003;
  camPitch = Math.max(0.1, Math.min(1.1, camPitch));
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getNearestNPC(maxDist) {
  let best=null, bestD=maxDist;
  for (const npc of npcs) {
    const dx=player.position.x-npc.mesh.position.x, dz=player.position.z-npc.mesh.position.z;
    const d=Math.sqrt(dx*dx+dz*dz);
    if (d<bestD) { bestD=d; best=npc; }
  }
  return best;
}

function toScreen(worldPos) {
  const v = worldPos.clone().project(camera);
  return { x:(v.x*.5+.5)*window.innerWidth, y:(-v.y*.5+.5)*window.innerHeight, behind:v.z>1 };
}

// ── Bubble DOM ────────────────────────────────────────────────────────────────
const bubbleContainer = document.getElementById('bubble-container');
npcs.forEach(npc => {
  const div=document.createElement('div'); div.className='speech-bubble'; div.style.display='none';
  div.innerHTML=`<b>${npc.name}</b><br>${npc.dialogues[0].replace(/\n/g,'<br>')}`;
  bubbleContainer.appendChild(div); npc.bubbleEl=div;
  const hint=document.createElement('div'); hint.className='bubble-hint'; hint.style.display='none';
  hint.textContent='[E] Talk'; bubbleContainer.appendChild(hint); npc.hintEl=hint;
});

// ── Bones (collectibles) ──────────────────────────────────────────────────────
const bonePositions = [[15,8],[-20,-12],[35,25],[-30,-28],[18,-40],[45,-15],[-25,38],[28,-22],[-42,18],[10,35]];
const boneMeshes = [];
let score = 0;
const boneMat = new THREE.MeshLambertMaterial({ color: 0xf5f5dc });
bonePositions.forEach(([x,z]) => {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.38,6), boneMat);
  shaft.rotation.z = Math.PI/2; g.add(shaft);
  [[-0.2,0,0],[0.2,0,0]].forEach(([ox]) => {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.11,6,4), boneMat);
    knob.position.set(ox,0,0); g.add(knob);
  });
  g.position.set(x, 0.35, z);
  g.userData.collected = false;
  scene.add(g);
  boneMeshes.push(g);
});


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

// ── 3D Asset Loader ───────────────────────────────────────────────────────────
function loadWorldAssets() {
  const gltfLoader = new THREE.GLTFLoader();
  const fbxLoader  = new THREE.FBXLoader();
  const texLoader  = new THREE.TextureLoader();

  function placeFBX(b64data, texturePath, x, z, scale, rotY, colorFallback) {
    const ldr = new THREE.FBXLoader();
    if (texturePath) ldr.setResourcePath(texturePath);
    try {
      const fbx = ldr.parse(b64ToBuffer(b64data), texturePath || '');
      fbx.scale.setScalar(scale);
      fbx.position.set(x, 0, z);
      fbx.rotation.y = rotY;
      fbx.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true; c.receiveShadow = true;
          if (!texturePath) c.material = new THREE.MeshLambertMaterial({ color: colorFallback });
        }
      });
      scene.add(fbx);
    } catch(e) {
      // fallback box if parse fails
      const b = new THREE.Mesh(new THREE.BoxGeometry(8,6,8),
        new THREE.MeshLambertMaterial({ color: colorFallback }));
      b.position.set(x, 3, z); scene.add(b);
    }
  }

  // McDonald's restaurant (GLB — textures embedded)
  gltfLoader.load('assets/engadine_mcdonalds_restaurant_low_poly.glb', gltf => {
    const m = gltf.scene;
    m.scale.setScalar(0.012);
    m.position.set(55, 0, 0);
    m.rotation.y = -Math.PI / 2;
    m.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    scene.add(m);
    colliders.push({ x:55, z:0, radius:12 });
  }, undefined, () => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(14,6,14),
      new THREE.MeshLambertMaterial({ color:0xdd2222 }));
    b.position.set(55,3,0); scene.add(b);
    colliders.push({ x:55, z:0, radius:10 });
  });

  // Residential house (FBX)
  const houseTex = 'assets/house/textures/';
  const housePositions = [[30,-18,0.008,-0.4], [-30,15,0.008,0.8],
                           [18,-50,0.007,1.2],  [-45,-25,0.009,2.1]];
  housePositions.forEach(([x,z,sc,ry]) => {
    placeFBX(ASSETS.houseFbx, houseTex, x, z, sc, ry, 0xd4a06a);
    colliders.push({ x, z, radius: 6 });
  });

  // Office building (FBX)
  placeFBX(ASSETS.officeFbx, 'assets/office/textures/', -55, -10, 0.05, 0, 0xc0c8d4);
  colliders.push({ x:-55, z:-10, radius:10 });
  placeFBX(ASSETS.officeFbx, 'assets/office/textures/', 20,  65, 0.05, 1.57, 0xc0c8d4);
  colliders.push({ x:20, z:65, radius:10 });

  // Pizza restaurant (FBX — tiny model + texture)
  placeFBX(ASSETS.pizzaFbx,
           'assets/pizza/source/Textures/', -20, 55, 0.06, -0.5, 0xffcc88);
  colliders.push({ x:-20, z:55, radius:8 });

  // Paris restaurant (FBX)
  placeFBX(ASSETS.parisFbx,
           'assets/paris-restaurant/textures/', 0, -60, 0.018, 0, 0xf0e8d0);
  colliders.push({ x:0, z:-60, radius:14 });

  // Boring commercial office (FBX — base64 embedded)
  placeFBX(ASSETS.boringOfficeFbx, 'assets/boring-commercialoffice-two-story-building/textures/', 60, 40, 0.05, 0, 0xa0b8c8);
  colliders.push({ x:60, z:40, radius:10 });
  placeFBX(ASSETS.boringOfficeFbx, 'assets/boring-commercialoffice-two-story-building/textures/', -60, 40, 0.05, Math.PI, 0xa0b8c8);
  colliders.push({ x:-60, z:40, radius:10 });

  // Windsor House (GLB — loaded from file path, too large to embed)
  gltfLoader.load('assets/windsor-house-v2/source/WindsorHouseV2.glb', gltf => {
    const m = gltf.scene;
    m.scale.setScalar(0.015);
    m.position.set(40, 0, -55);
    m.rotation.y = Math.PI / 4;
    m.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    scene.add(m);
    colliders.push({ x:40, z:-55, radius:12 });
  }, undefined, () => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(10,8,10),
      new THREE.MeshLambertMaterial({ color:0xe8d0b0 }));
    b.position.set(40,4,-55); scene.add(b);
    colliders.push({ x:40, z:-55, radius:10 });
  });

  // Chery Tiggo (FBX — loaded from file path, too large to embed)
  {
    const ldr = new THREE.FBXLoader();
    ldr.setResourcePath('assets/chery-tiggo-in-snow/textures/');
    ldr.load('assets/chery-tiggo-in-snow/source/1.fbx', fbx => {
      fbx.scale.setScalar(0.012);
      fbx.position.set(50, 0, 12);
      fbx.rotation.y = -0.6;
      fbx.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
      scene.add(fbx);
      colliders.push({ x:50, z:12, radius:4 });
    }, undefined, () => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(4,2,8),
        new THREE.MeshLambertMaterial({ color:0xcc2222 }));
      b.position.set(50,1,12); scene.add(b);
      colliders.push({ x:50, z:12, radius:4 });
    });
  }
}
loadWorldAssets();
// ── Player state ──────────────────────────────────────────────────────────────
let player = new THREE.Object3D();
player.position.set(0, 0, 2);
scene.add(player);

let velY = 0;
const GRAVITY = -20;

let mixer=null, actionWalk=null, actionIdle=null, currentAction=null;
let modelLoaded=false;

// ── Load Snoopy FBX with PBR textures ────────────────────────────────────────
function applyPBRMaterials(fbx) {
  // Pre-load all textures from embedded base64
  const furBaseT   = loadTexture(ASSETS.furBase,   'srgb');
  const furNormT   = loadTexture(ASSETS.furNormal,  'linear');
  const furRoughT  = loadTexture(ASSETS.furRough,   'linear');
  const furMetalT  = loadTexture(ASSETS.furMetal,   'linear');
  const miscBaseT  = loadTexture(ASSETS.miscBase,   'srgb');
  const miscNormT  = loadTexture(ASSETS.miscNormal, 'linear');
  const miscRoughT = loadTexture(ASSETS.miscRough,  'linear');
  const miscMetalT = loadTexture(ASSETS.miscMetal,  'linear');

  const furMat = new THREE.MeshStandardMaterial({
    map:          furBaseT,
    normalMap:    furNormT,
    roughnessMap: furRoughT,
    metalnessMap: furMetalT,
    roughness:    1.0,
    metalness:    1.0,
    skinning:     true,
  });

  const miscMat = new THREE.MeshStandardMaterial({
    map:          miscBaseT,
    normalMap:    miscNormT,
    roughnessMap: miscRoughT,
    metalnessMap: miscMetalT,
    roughness:    1.0,
    metalness:    1.0,
    skinning:     true,
  });

  fbx.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow    = true;
    child.receiveShadow = true;

    // Read the ORIGINAL material name(s) from the FBX before replacing
    const getMats = m => Array.isArray(m) ? m : [m];
    const origMats = getMats(child.material);

    // Map each original material slot to the correct PBR material
    const newMats = origMats.map(m => {
      const n = (m.name || '').toLowerCase();
      console.log('Mesh:', child.name, '| Material slot:', m.name);
      if (n.includes('misc')) return miscMat;
      // fur_m and furtexture_m both get the fur texture
      return furMat;
    });

    child.material = newMats.length === 1 ? newMats[0] : newMats;
    // Ensure skinning flag is set for SkinnedMesh nodes
    if (child.isSkinnedMesh) getMats(child.material).forEach(m => m.skinning = true);
  });
}

function loadSnoopy() {
  const loader = new THREE.FBXLoader();
  try {
    const fbx = loader.parse(b64ToBuffer(ASSETS.fbx), '');

    // Apply PBR textures BEFORE computing bounding box
    applyPBRMaterials(fbx);

    // Compute bounding box to auto-scale & ground the model correctly
    const bbox = new THREE.Box3().setFromObject(fbx);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    console.log('FBX raw size:', size);

    // Target height ~1.6 world units for Snoopy
    const targetHeight = 1.6;
    const autoScale = targetHeight / size.y;
    fbx.scale.setScalar(autoScale);

    // After scaling, recompute bbox to get the ground offset
    const bbox2 = new THREE.Box3().setFromObject(fbx);
    const groundOffset = -bbox2.min.y; // lift so feet are at y=0

    // Replace placeholder player
    scene.remove(player);
    player = fbx;
    player.position.set(0, groundOffset, 2);
    scene.add(player);

    // Store ground offset for movement code
    player.userData.groundOffset = groundOffset;

    // Animation — FBX has "rig|Walk"
    mixer = new THREE.AnimationMixer(fbx);
    if (fbx.animations && fbx.animations.length > 0) {
      const walkClip = THREE.AnimationClip.findByName(fbx.animations, 'rig|Walk')
                    || fbx.animations[0];
      console.log('Using animation clip:', walkClip.name);
      actionWalk = mixer.clipAction(walkClip);
      actionWalk.setLoop(THREE.LoopRepeat);
      actionWalk.timeScale = 1.0;

      // Idle = same clip at very slow speed
      actionIdle = mixer.clipAction(walkClip);
      actionIdle.setLoop(THREE.LoopRepeat);
      actionIdle.timeScale = 0.08;

      currentAction = actionIdle;
      actionIdle.play();
    }

    modelLoaded = true;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    console.log('Snoopy loaded! Scale:', autoScale, 'GroundOffset:', groundOffset, 'Animations:', fbx.animations.map(a=>a.name));
  } catch(err) {
    console.error('FBX load error:', err);
    // Fallback: white box character
    scene.remove(player);
    const fallback = new THREE.Mesh(
      new THREE.BoxGeometry(0.6,1.2,0.4),
      new THREE.MeshLambertMaterial({color:0xffffff})
    );
    fallback.position.set(0,0.6,2);
    player = fallback;
    scene.add(player);
    modelLoaded = true;
    document.getElementById('loading').textContent = '⚠️ Used fallback model';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
  }
}

function switchAction(next) {
  if (currentAction === next) return;
  if (currentAction) currentAction.fadeOut(0.2);
  next.reset().fadeIn(0.2).play();
  currentAction = next;
}

// ── Main Loop ─────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if (!modelLoaded) { renderer.render(scene, camera); return; }

  // Car driving
  if (inCar) {
    if (keys['KeyW']||keys['ArrowUp'])   carSpeed = Math.min(carSpeed + 200*dt, 400);
    if (keys['KeyS']||keys['ArrowDown']) carSpeed = Math.max(carSpeed - 100*dt, -50);
    carSpeed *= Math.pow(0.88, dt * 60);
    if (Math.abs(carSpeed) > 0.08) {
      const steer = (keys['KeyA']||keys['ArrowLeft'] ? 1 : keys['KeyD']||keys['ArrowRight'] ? -1 : 0)
                    * dt * 2.0 * Math.sign(carSpeed);
      car.rotation.y += steer;
      car.position.x += Math.sin(car.rotation.y) * carSpeed * dt;
      car.position.z += Math.cos(car.rotation.y) * carSpeed * dt;
      car.position.x = Math.max(-145, Math.min(145, car.position.x));
      car.position.z = Math.max(-145, Math.min(145, car.position.z));
    }
    car.userData.wheels.forEach(w => { w.rotation.x += carSpeed * dt * 1.6; });
  }

  // Player movement
  let mx=0, mz=0, isMoving=false;
  if (!inCar) {
    if (keys['KeyW']||keys['ArrowUp'])    mz -= 1;
    if (keys['KeyS']||keys['ArrowDown'])  mz += 1;
    if (keys['KeyA']||keys['ArrowLeft'])  mx -= 1;
    if (keys['KeyD']||keys['ArrowRight']) mx += 1;

    const groundY = player.userData.groundOffset || 0;
    const isOnGround = player.position.y <= groundY + 0.05;
    if (keys['Space'] && isOnGround) velY = 7.5;
    velY += GRAVITY * dt;
    player.position.y = Math.max(groundY, player.position.y + velY * dt);
    if (player.position.y <= groundY) velY = 0;

    const isSprinting = keys['ShiftLeft'] || keys['ShiftRight'];
    isMoving = mx!==0 || mz!==0;
    if (isMoving) {
      const speed = (isSprinting ? 8.0 : 4.0) * dt;
      const angle = Math.atan2(mx, mz) + camYaw;
      const nx = player.position.x + Math.sin(angle)*speed;
      const nz = player.position.z + Math.cos(angle)*speed;
      let blocked = false;
      for (const c of colliders) {
        const dx=nx-c.x, dz=nz-c.z;
        if (Math.sqrt(dx*dx+dz*dz) < c.radius+0.5) { blocked=true; break; }
      }
      if (Math.abs(nx)>145||Math.abs(nz)>145) blocked=true;
      if (!blocked) { player.position.x=nx; player.position.z=nz; }
      player.rotation.y = angle;
    }
    if (mixer) {
      if (isMoving && actionWalk) {
        actionWalk.timeScale = (keys['ShiftLeft']||keys['ShiftRight']) ? 2.0 : 1.0;
        actionWalk.paused = false; switchAction(actionWalk);
      } else if (!isMoving && currentAction) { currentAction.paused = true; }
      mixer.update(dt);
    }
  }

  // Bone collection
  boneMeshes.forEach(bone => {
    if (bone.userData.collected) return;
    bone.rotation.y += dt * 2.5;
    bone.position.y = 0.35 + Math.sin(clock.getElapsedTime()*3 + bone.position.x)*0.06;
    const dx=player.position.x-bone.position.x, dz=player.position.z-bone.position.z;
    if (Math.sqrt(dx*dx+dz*dz) < 0.9) {
      bone.userData.collected = true;
      scene.remove(bone);
      score++;
      const scoreEl = document.getElementById('score');
      scoreEl.textContent = score >= 10 ? '🦴 All bones found! 🎉' : `🦴 Bones: ${score} / 10`;
      scoreEl.classList.add('pop');
      setTimeout(() => scoreEl.classList.remove('pop'), 150);
    }
  });

  // Camera
  const camTarget = inCar ? car : player;
  const camDist = inCar ? 14 : 9;
  const camHeight = inCar ? 1.5 : 1.0;
  const camOffX = Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  const camOffY = Math.sin(camPitch) * camDist;
  const camOffZ = Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  const targetCamX = camTarget.position.x + camOffX;
  const targetCamZ = camTarget.position.z + camOffZ;
  const targetCamY = camTarget.position.y + camOffY + camHeight;
  camera.position.x = targetCamX;
  camera.position.z = targetCamZ;
  camera.position.y += (targetCamY - camera.position.y) * Math.min(1, 12 * dt);
  camera.lookAt(camTarget.position.x, camTarget.position.y + camHeight, camTarget.position.z);

  // Car enter hint
  const cdx2 = (inCar ? 999 : player.position.x - car.position.x);
  const cdz2 = (inCar ? 999 : player.position.z - car.position.z);
  const nearCar = Math.sqrt(cdx2*cdx2+cdz2*cdz2) < 5;
  carHintEl.style.display = nearCar ? 'block' : 'none';
  if (nearCar) {
    const cp = car.position.clone(); cp.y += 2.2;
    const cs = toScreen(cp);
    if (!cs.behind) { carHintEl.style.left=cs.x+'px'; carHintEl.style.top=cs.y+'px'; }
  }

  // Clouds drift
  clouds.forEach((c,i) => { c.position.x += 0.005*(i%2===0?1:-1); });

  // NPC idle bobbing & bubbles
  const t = clock.getElapsedTime();
  for (const [i, npc] of npcs.entries()) {
    npc.mesh.position.y = Math.sin(t * 1.4 + i * 1.3) * 0.05;
    npc.mesh.rotation.y = npc.mesh.userData.baseRot + Math.sin(t * 0.7 + i * 0.9) * 0.06;

    const dx=player.position.x-npc.mesh.position.x, dz=player.position.z-npc.mesh.position.z;
    const inRange = Math.sqrt(dx*dx+dz*dz) < 3.5;
    if (!inRange) npc.talkVisible = false;
    npc.hintEl.style.display   = inRange && !npc.talkVisible ? 'block' : 'none';
    npc.bubbleEl.style.display = npc.talkVisible ? 'block' : 'none';
    npc.hintEl.textContent = inRange && !npc.talkVisible ? '[E] Talk' : '';
    const hp = npc.mesh.position.clone(); hp.y += 2.4;
    const sc = toScreen(hp);
    if (!sc.behind) {
      npc.bubbleEl.style.left=sc.x+'px'; npc.bubbleEl.style.top=sc.y+'px';
      npc.hintEl.style.left=sc.x+'px';   npc.hintEl.style.top=(sc.y+18)+'px';
    } else {
      npc.bubbleEl.style.display='none'; npc.hintEl.style.display='none';
    }
  }

  skyMesh.position.set(camera.position.x, 30, camera.position.z);
  renderer.render(scene, camera);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
loadSnoopy();
animate();
