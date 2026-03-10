// ── Planes & Sky Birds ────────────────────────────────────────────────────────

function makePlaneMesh(bodyColor) {
  const g = new THREE.Group();
  const m  = new THREE.MeshLambertMaterial({ color: bodyColor });
  const dm = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
  const gm = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent:true, opacity:0.7 });

  // Fuselage
  const fuse = new THREE.Mesh(new THREE.BoxGeometry(1.0,0.85,6.0), m);
  fuse.castShadow=true; g.add(fuse);
  // Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.42,1.5,8), m);
  nose.rotation.x=-Math.PI/2; nose.position.z=3.75; g.add(nose);
  // Wings
  const wings = new THREE.Mesh(new THREE.BoxGeometry(8.0,0.15,2.2), m);
  wings.position.set(0,-0.05,0.3); wings.castShadow=true; g.add(wings);
  // Wing tips
  [-4,4].forEach(wx=>{
    const tip=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,1.0),m);
    tip.position.set(wx,0.12,0.3); g.add(tip);
  });
  // Tail vertical
  const tailV=new THREE.Mesh(new THREE.BoxGeometry(0.15,1.2,1.6),m);
  tailV.position.set(0,0.6,-2.6); g.add(tailV);
  // Tail horizontal
  const tailH=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.12,1.1),m);
  tailH.position.set(0,0.08,-2.6); g.add(tailH);
  // Cockpit
  const cockpit=new THREE.Mesh(new THREE.BoxGeometry(0.82,0.52,1.3),gm);
  cockpit.position.set(0,0.55,1.6); g.add(cockpit);
  // Engines
  [-2.5,2.5].forEach(ex=>{
    const eng=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.2,1.4,8),dm);
    eng.rotation.x=Math.PI/2; eng.position.set(ex,-0.28,0.5); g.add(eng);
    const exh=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.24,0.22,8),dm);
    exh.rotation.x=Math.PI/2; exh.position.set(ex,-0.28,-0.4); g.add(exh);
  });
  // Landing gear
  [[-1.8,-0.56,0.4],[1.8,-0.56,0.4],[0,-0.56,3.0]].forEach(([wx,wy,wz])=>{
    const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.18,8),dm);
    wh.rotation.z=Math.PI/2; wh.position.set(wx,wy,wz); g.add(wh);
  });
  return g;
}

// ── Runway at military base ───────────────────────────────────────────────────
const RUNWAY_X = BASE_X + 10, RUNWAY_Z_CENTER = BASE_Z + 6;

(function buildRunway() {
  const rwMat=new THREE.MeshLambertMaterial({color:0x2a2a2a});
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(7,44),rwMat);
  rw.rotation.x=-Math.PI/2; rw.position.set(RUNWAY_X,0.03,RUNWAY_Z_CENTER);
  rw.receiveShadow=true; scene.add(rw);
  // Centre-line dashes
  const wm=new THREE.MeshBasicMaterial({color:0xffffff});
  for(let i=-18;i<=18;i+=5){
    const d=new THREE.Mesh(new THREE.PlaneGeometry(0.3,2.5),wm);
    d.rotation.x=-Math.PI/2; d.position.set(RUNWAY_X,0.04,RUNWAY_Z_CENTER+i); scene.add(d);
  }
  // Threshold bars
  [-3.5,-2.5,-1.5,-0.5,0.5,1.5,2.5,3.5].forEach(bx=>{
    const bar=new THREE.Mesh(new THREE.PlaneGeometry(0.4,1.8),wm);
    bar.rotation.x=-Math.PI/2; bar.position.set(RUNWAY_X+bx,0.04,RUNWAY_Z_CENTER-20); scene.add(bar);
    const bar2=bar.clone(); bar2.position.z=RUNWAY_Z_CENTER+20; scene.add(bar2);
  });
  // Edge lights (yellow cones)
  const lm=new THREE.MeshLambertMaterial({color:0xffee44});
  for(let i=-18;i<=18;i+=4){
    [-3.8,3.8].forEach(lx=>{
      const l=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.28,5),lm);
      l.position.set(RUNWAY_X+lx,0.14,RUNWAY_Z_CENTER+i); scene.add(l);
    });
  }
})();

// ── Player Plane ──────────────────────────────────────────────────────────────
let inPlane   = false;
let planeSpeed = 0;
let planeVelY  = 0;
const PLANE_MAX_SPEED = 85;
const PLANE_ACCEL     = 160;
const PLANE_DECEL     = 90;

const playerPlane = makePlaneMesh(0x4a6040); // military green
playerPlane.position.set(RUNWAY_X, 0.56, BASE_Z - 12);
scene.add(playerPlane);

// Plane enter hint
const planeHintEl = document.createElement('div');
planeHintEl.style.cssText=[
  'position:fixed','bottom:80px','left:50%','transform:translateX(-50%)',
  'background:rgba(0,0,0,0.8)','color:#fff','font-size:15px','font-weight:bold',
  'padding:6px 20px','border-radius:14px','pointer-events:none','z-index:20',
  'display:none','font-family:Arial,sans-serif','border:1px solid #aaa',
].join(';');
planeHintEl.textContent = '[E] Board Plane ✈';
document.body.appendChild(planeHintEl);

// ── AI Planes (sky) ───────────────────────────────────────────────────────────
const AI_PLANE_DEFS = [
  { color:0xcccccc, cx:  0, cz:  0, radius:90, alt:55, speed:0.36, phase:0 },
  { color:0x4488cc, cx: 20, cz:-20, radius:70, alt:68, speed:0.25, phase:Math.PI },
  { color:0xcc4433, cx:-15, cz: 15, radius:55, alt:48, speed:0.48, phase:Math.PI/2 },
];

const aiPlanes = AI_PLANE_DEFS.map(def=>{
  def.mesh = makePlaneMesh(def.color);
  def.angle = def.phase;
  def.mesh.position.set(
    def.cx + Math.cos(def.angle)*def.radius,
    def.alt,
    def.cz + Math.sin(def.angle)*def.radius
  );
  scene.add(def.mesh);
  return def;
});

// ── Sky Birds (flocks) ────────────────────────────────────────────────────────
function makeSkyBird(color) {
  const g=new THREE.Group();
  const m=new THREE.MeshLambertMaterial({color});
  const body=new THREE.Mesh(new THREE.SphereGeometry(0.18,6,4),m);
  body.scale.set(1,0.7,1.4); g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.12,5,4),m);
  head.position.set(0,0.08,0.26); g.add(head);
  [[-0.28,0],[0.28,0]].forEach(([wx])=>{
    const wing=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.04,0.3),m);
    wing.position.set(wx,0.03,0); g.add(wing);
  });
  return g;
}

const SKY_FLOCKS = [
  { cx: 30,  cy:20, cz:-40, birds:7, radius:6, speed:4.0, color:0x334455, angle:0 },
  { cx:-50,  cy:17, cz: 30, birds:6, radius:5, speed:3.5, color:0x443322, angle:2.1 },
  { cx: 60,  cy:25, cz: 60, birds:8, radius:7, speed:4.5, color:0x445533, angle:4.2 },
  { cx:-30,  cy:22, cz:-60, birds:5, radius:5, speed:3.8, color:0x333344, angle:1.0 },
];

SKY_FLOCKS.forEach(flock=>{
  flock.meshes=[];
  for(let i=0;i<flock.birds;i++){
    const bird=makeSkyBird(flock.color);
    bird.position.set(
      flock.cx + (Math.random()-0.5)*flock.radius*2,
      flock.cy + (Math.random()-0.5)*3,
      flock.cz + (Math.random()-0.5)*flock.radius*2
    );
    scene.add(bird);
    flock.meshes.push({ mesh:bird, offset: Math.random()*Math.PI*2 });
  }
});

// ── Update ────────────────────────────────────────────────────────────────────
function updatePlanes(dt) {
  const t = Date.now() * 0.001;

  // AI planes circle
  aiPlanes.forEach(ap=>{
    ap.angle += ap.speed * dt;
    const nx = ap.cx + Math.cos(ap.angle)*ap.radius;
    const nz = ap.cz + Math.sin(ap.angle)*ap.radius;
    const dx = nx - ap.mesh.position.x;
    const dz = nz - ap.mesh.position.z;
    ap.mesh.rotation.y = Math.atan2(dx,dz);
    ap.mesh.position.set(nx, ap.alt + Math.sin(ap.angle*0.5)*3, nz);
    ap.mesh.rotation.z = Math.sin(ap.angle)*0.12; // gentle bank
  });

  // Sky bird flocks drift slowly
  SKY_FLOCKS.forEach(flock=>{
    flock.angle += 0.08 * dt;
    flock.cx += Math.cos(flock.angle) * flock.speed * dt;
    flock.cz += Math.sin(flock.angle) * flock.speed * dt;
    // Wrap flock position within map
    if(Math.abs(flock.cx)>130) flock.cx *= -0.9;
    if(Math.abs(flock.cz)>130) flock.cz *= -0.9;
    flock.meshes.forEach((b,i)=>{
      const bo = b.offset + t*2.5;
      b.mesh.position.x = flock.cx + Math.cos(bo*0.7 + i)*flock.radius*0.8;
      b.mesh.position.y = flock.cy + Math.sin(bo*1.2)*1.5;
      b.mesh.position.z = flock.cz + Math.sin(bo*0.5 + i)*flock.radius*0.8;
      // Wing flap
      b.mesh.rotation.z = Math.sin(bo*4)*0.3;
      b.mesh.rotation.y = Math.atan2(
        Math.cos(bo*0.7 + i)*flock.radius*0.8 - b.mesh.position.x + flock.cx,
        Math.sin(bo*0.5 + i)*flock.radius*0.8 - b.mesh.position.z + flock.cz
      );
    });
  });

  // Player plane hint
  if(!inPlane && playerPlane.position.y < 2) {
    const pdx=player.position.x-playerPlane.position.x;
    const pdz=player.position.z-playerPlane.position.z;
    planeHintEl.style.display=Math.sqrt(pdx*pdx+pdz*pdz)<6?'block':'none';
  } else {
    planeHintEl.style.display='none';
  }

  // Player plane on ground: gentle idle bob
  if(!inPlane) {
    playerPlane.position.y = 0.56 + Math.sin(t*1.2)*0.02;
  }
}
