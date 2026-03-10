// ── Sea & Port ────────────────────────────────────────────────────────────────

const SEA_CX = 30, SEA_Z = -118;   // sea center
const PORT_X = 30, PORT_Z = -108;  // pier start (land edge)

// ── Sea ───────────────────────────────────────────────────────────────────────
const seaTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const ctx = c.getContext('2d');
  // Deep ocean gradient
  const g = ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#0a3a6a'); g.addColorStop(0.5,'#0d5090'); g.addColorStop(1,'#0a2a5a');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,512);
  // Wave lines
  ctx.strokeStyle = 'rgba(100,180,255,0.35)'; ctx.lineWidth = 2;
  for(let y=0; y<512; y+=18){
    ctx.beginPath();
    for(let x=0; x<512; x+=4){
      ctx.lineTo(x, y + Math.sin(x*0.05)*4);
    }
    ctx.stroke();
  }
  // Foam highlights
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
  for(let i=0;i<30;i++){
    const rx=Math.random()*512, ry=Math.random()*512;
    ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+30+Math.random()*40,ry+Math.random()*6); ctx.stroke();
  }
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(6,6);
  t.encoding=THREE.sRGBEncoding;
  return t;
})();

const seaMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 80),
  new THREE.MeshLambertMaterial({ map: seaTex, transparent: true, opacity: 0.88 })
);
seaMesh.rotation.x = -Math.PI/2;
seaMesh.position.set(SEA_CX, 0.05, SEA_Z);
scene.add(seaMesh);

// Sandy beach strip at water edge
const beachMat = new THREE.MeshLambertMaterial({ color: 0xe8d8a0 });
const beach = new THREE.Mesh(new THREE.PlaneGeometry(100, 6), beachMat);
beach.rotation.x = -Math.PI/2;
beach.position.set(SEA_CX, 0.02, PORT_Z + 3);
scene.add(beach);

// Horizon water extension (very far)
const deepSea = new THREE.Mesh(
  new THREE.PlaneGeometry(400,200),
  new THREE.MeshLambertMaterial({ color: 0x083060, transparent: true, opacity: 0.9 })
);
deepSea.rotation.x = -Math.PI/2;
deepSea.position.set(SEA_CX, 0.01, SEA_Z - 100);
scene.add(deepSea);

// ── Pier / Dock ───────────────────────────────────────────────────────────────
(function buildPier() {
  const plankMat = new THREE.MeshLambertMaterial({ color: 0x7a5030 });
  const pileMat  = new THREE.MeshLambertMaterial({ color: 0x5a3820 });
  const ropeMat  = new THREE.MeshLambertMaterial({ color: 0xc8a060 });

  // Main dock platform
  const dock = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 30), plankMat);
  dock.position.set(PORT_X, 0.22, PORT_Z - 12);
  dock.receiveShadow = true; dock.castShadow = true;
  scene.add(dock);

  // Plank lines on dock
  for(let i=-14; i<=14; i+=1.6){
    const plank = new THREE.Mesh(new THREE.BoxGeometry(22.1,0.06,0.12),
      new THREE.MeshLambertMaterial({color:0x6a4020}));
    plank.position.set(PORT_X, 0.44, PORT_Z-12+i); scene.add(plank);
  }

  // Dock pilings
  for(let zi=0; zi>=-28; zi-=7){
    [-11,0,11].forEach(xi=>{
      const pile=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.3,3,7),pileMat);
      pile.position.set(PORT_X+xi, -0.8, PORT_Z+zi); scene.add(pile);
    });
  }

  // Side railings
  [-11,11].forEach(rx=>{
    const rail=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,30),ropeMat);
    rail.position.set(PORT_X+rx, 0.7, PORT_Z-12); scene.add(rail);
    // Railing posts
    for(let rz=-13; rz<=3; rz+=3){
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.8,5),pileMat);
      post.position.set(PORT_X+rx, 0.62, PORT_Z+rz); scene.add(post);
    }
  });

  // Bollards + rope loops
  [[-9,3],[-9,-8],[9,3],[9,-8]].forEach(([bx,bz])=>{
    const bol=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,0.7,8),pileMat);
    bol.position.set(PORT_X+bx, 0.57, PORT_Z+bz); scene.add(bol);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(0.2,7,5),pileMat);
    cap.position.set(PORT_X+bx, 0.95, PORT_Z+bz); scene.add(cap);
  });

  // Finger pier extending further into sea
  const finger=new THREE.Mesh(new THREE.BoxGeometry(5,0.35,14),plankMat);
  finger.position.set(PORT_X+8.5, 0.2, PORT_Z-31);
  finger.castShadow=true; scene.add(finger);

  // Collider for dock area
  colliders.push({x:PORT_X, z:PORT_Z-5, radius:3});
  colliders.push({x:PORT_X, z:PORT_Z-20, radius:3});
})();

// ── Boats ─────────────────────────────────────────────────────────────────────
function makeBoat(hullColor, sailColor) {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshLambertMaterial({ color: hullColor });
  const sailMat = new THREE.MeshLambertMaterial({ color: sailColor, side: THREE.DoubleSide });
  const woodMat = new THREE.MeshLambertMaterial({ color: 0x8b5e2a });

  // Hull — tapered box
  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.2,1.0,8), hullMat);
  hull.position.y=0.5; hull.castShadow=true; g.add(hull);
  // Hull bow taper
  const bow=new THREE.Mesh(new THREE.ConeGeometry(1.1,2.5,4), hullMat);
  bow.rotation.z=Math.PI/2; bow.position.set(0,0.5,4.6); g.add(bow);
  // Deck
  const deck=new THREE.Mesh(new THREE.BoxGeometry(3.0,0.12,7.5),woodMat);
  deck.position.y=1.06; g.add(deck);
  // Mast
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,5.5,6),woodMat);
  mast.position.set(0,3.8,0); g.add(mast);
  // Sail
  const sailGeo=new THREE.BufferGeometry();
  const pts=[0,0,0, 0,5,0, 2.8,-1,0, 0,0,0, 2.8,-1,0, 2.8,3.5,0];
  sailGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  sailGeo.computeVertexNormals();
  const sail=new THREE.Mesh(sailGeo,sailMat);
  sail.position.set(0,1.2,-0.5); g.add(sail);
  // Ropes
  const rm=new THREE.MeshLambertMaterial({color:0xc8a060});
  const r1=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,4,4),rm);
  r1.rotation.z=0.5; r1.position.set(1.2,3.2,2); g.add(r1);
  return g;
}

// Boat 1 — blue hull, white sail — docked left
const boat1 = makeBoat(0x1a3a6a, 0xffffff);
boat1.position.set(PORT_X - 14, 0, PORT_Z - 10);
boat1.rotation.y = 0.2;
scene.add(boat1);

// Boat 2 — red hull, cream sail — docked right
const boat2 = makeBoat(0xaa2222, 0xfff8e0);
boat2.position.set(PORT_X + 14, 0, PORT_Z - 8);
boat2.rotation.y = -0.15;
scene.add(boat2);

// Small rowboat
(function makeRowboat() {
  const m=new THREE.MeshLambertMaterial({color:0x5a7a2a});
  const hull=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.5,3.2),m);
  hull.position.y=0.25; hull.castShadow=true;
  const rb=new THREE.Group(); rb.add(hull);
  const wm=new THREE.MeshLambertMaterial({color:0x6a4020});
  // Oars
  [-0.65,0.65].forEach(ox=>{
    const oar=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,2.0),wm);
    oar.position.set(ox,0.55,0); oar.rotation.z=ox<0?-0.3:0.3; rb.add(oar);
  });
  rb.position.set(PORT_X+9.5, 0, PORT_Z-30);
  scene.add(rb);
})();

// ── Port Lighthouse ───────────────────────────────────────────────────────────
(function makeLighthouse() {
  const wm=new THREE.MeshLambertMaterial({color:0xfafafa});
  const rm=new THREE.MeshLambertMaterial({color:0xdd2222});
  const lm=new THREE.MeshLambertMaterial({color:0xffffaa});

  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.5,1.5,10),wm);
  base.position.y=0.75; scene.add(makeAt(base, PORT_X-18, PORT_Z-24));
  const tower=new THREE.Mesh(new THREE.CylinderGeometry(0.8,1.2,7,10),wm);
  tower.position.y=4.75; scene.add(makeAt(tower, PORT_X-18, PORT_Z-24));
  const band1=new THREE.Mesh(new THREE.CylinderGeometry(0.82,0.82,0.5,10),rm);
  band1.position.y=3; scene.add(makeAt(band1, PORT_X-18, PORT_Z-24));
  const band2=new THREE.Mesh(new THREE.CylinderGeometry(0.82,0.82,0.5,10),rm);
  band2.position.y=6; scene.add(makeAt(band2, PORT_X-18, PORT_Z-24));
  const lamp=new THREE.Mesh(new THREE.CylinderGeometry(0.85,0.85,0.9,10),lm);
  lamp.position.y=8.7; scene.add(makeAt(lamp, PORT_X-18, PORT_Z-24));
  const cap=new THREE.Mesh(new THREE.ConeGeometry(1.0,1.2,10),rm);
  cap.position.y=9.6; scene.add(makeAt(cap, PORT_X-18, PORT_Z-24));
  // Light beam
  const lightPt=new THREE.PointLight(0xffffaa,0,30);
  lightPt.position.set(PORT_X-18, 8.8, PORT_Z-24);
  scene.add(lightPt);
  window._lighthouseLight=lightPt;

  function makeAt(mesh,x,z){
    const g2=new THREE.Group();
    g2.add(mesh); g2.position.set(x,0,z); return g2;
  }
})();

function makeAt(mesh,x,z){
  const g=new THREE.Group(); g.add(mesh); g.position.set(x,0,z); return g;
}

// ── Port Restaurant "La Mer" ──────────────────────────────────────────────────
const REST_X = PORT_X, REST_Z = PORT_Z - 2;

(function buildPortRestaurant() {
  const g = new THREE.Group();
  const wallMat  = new THREE.MeshLambertMaterial({ color: 0xf5f0e8 }); // warm white
  const roofMat  = new THREE.MeshLambertMaterial({ color: 0x1a3a5a }); // navy
  const trimMat  = new THREE.MeshLambertMaterial({ color: 0x0a2a4a });
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent:true, opacity:0.7 });

  // Main body
  const body=new THREE.Mesh(new THREE.BoxGeometry(10,5.5,7), wallMat);
  body.position.y=2.75; body.castShadow=true; body.receiveShadow=true; g.add(body);

  // Hip roof
  const roof=new THREE.Mesh(new THREE.ConeGeometry(8,2.5,4), roofMat);
  roof.rotation.y=Math.PI/4; roof.position.y=6.9; roof.castShadow=true; g.add(roof);

  // Trim band
  const trim=new THREE.Mesh(new THREE.BoxGeometry(10.2,0.28,7.2), trimMat);
  trim.position.y=5.4; g.add(trim);

  // Large panoramic windows (sea view!)
  [[-3,3.0,3.52],[3,3.0,3.52],[-3,3.0,-3.52],[3,3.0,-3.52]].forEach(([wx,wy,wz])=>{
    const win=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.8), glassMat);
    win.position.set(wx,wy,wz);
    if(wz<0) win.rotation.y=Math.PI;
    g.add(win);
  });
  // Side windows
  [[-5.02,3,0],[5.02,3,0]].forEach(([wx,wy,wz])=>{
    const win=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.4), glassMat);
    win.position.set(wx,wy,wz); win.rotation.y=Math.PI/2*(wx<0?-1:1); g.add(win);
  });

  // Door
  const doorMat=new THREE.MeshLambertMaterial({color:0x1a3a5a});
  const dframe=new THREE.Mesh(new THREE.BoxGeometry(1.8,3.0,0.2),trimMat);
  dframe.position.set(0,1.5,3.6); g.add(dframe);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.4,2.7,0.12),doorMat);
  door.position.set(0,1.35,3.68); g.add(door);

  // Terrace/veranda
  const terMat=new THREE.MeshLambertMaterial({color:0x7a5030});
  const terrace=new THREE.Mesh(new THREE.BoxGeometry(10,0.18,4), terMat);
  terrace.position.set(0,0.09,5.5); g.add(terrace);
  // Terrace railing
  const rMat=new THREE.MeshLambertMaterial({color:0x1a3a5a});
  const rail=new THREE.Mesh(new THREE.BoxGeometry(10.2,0.1,0.08),rMat);
  rail.position.set(0,0.75,7.5); g.add(rail);
  [-5,5].forEach(rx=>{
    const rside=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.75,4),rMat);
    rside.position.set(rx,0.38,5.5); g.add(rside);
  });
  for(let i=-4.5;i<=4.5;i+=1.2){
    const post=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.75,5),rMat);
    post.position.set(i,0.38,7.5); g.add(post);
  }

  // Terrace tables with sea-view umbrellas
  const umbMat=new THREE.MeshLambertMaterial({color:0x1a3a5a});
  [[-3,5.5],[3,5.5]].forEach(([tx,tz])=>{
    const tbl=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.08,8),
      new THREE.MeshLambertMaterial({color:0xf0ece4}));
    tbl.position.set(tx,0.28,tz); g.add(tbl);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,1.8,5),
      new THREE.MeshLambertMaterial({color:0x888}));
    pole.position.set(tx,1.0,tz); g.add(pole);
    const umb=new THREE.Mesh(new THREE.ConeGeometry(1.2,0.5,8),umbMat);
    umb.position.set(tx,2.0,tz); umb.rotation.y=Math.PI/8; g.add(umb);
  });

  // Seagull decorations on roof
  const sgMat=new THREE.MeshLambertMaterial({color:0xffffff});
  [[-2,8,1],[2,8,-1]].forEach(([bx,by,bz])=>{
    const bird=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.06,0.25),sgMat);
    bird.position.set(bx,by,bz); g.add(bird);
    const hw=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.12,0.14),sgMat);
    hw.position.set(bx+0.25,by+0.1,bz); g.add(hw);
  });

  g.position.set(REST_X, 0.22, REST_Z);
  scene.add(g);
  colliders.push({x:REST_X, z:REST_Z, radius:6});
})();

// ── La Mer Sign ───────────────────────────────────────────────────────────────
(function makeLaMerSign() {
  const c=document.createElement('canvas'); c.width=512; c.height=192;
  const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,192);
  g.addColorStop(0,'#0a2a5a'); g.addColorStop(1,'#1a4a8a');
  ctx.fillStyle=g; ctx.fillRect(0,0,512,192);
  // Wave decoration
  ctx.strokeStyle='rgba(100,180,255,0.5)'; ctx.lineWidth=3;
  for(let wx=0; wx<512; wx+=4) ctx.lineTo(wx, 185+Math.sin(wx*0.08)*5);
  ctx.stroke();
  ctx.strokeStyle='#aaddff'; ctx.lineWidth=6; ctx.strokeRect(5,5,502,182);
  ctx.font='bold 100px Georgia,serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle='#ffffff';
  ctx.shadowColor='rgba(0,100,200,0.8)'; ctx.shadowBlur=20;
  ctx.fillText('La Mer',256,82);
  ctx.font='italic 22px Georgia,serif';
  ctx.fillStyle='#aaddff'; ctx.shadowBlur=4;
  ctx.fillText('⚓  Fine Dining at the Port  ⚓',256,154);
  const tex=new THREE.CanvasTexture(c); tex.encoding=THREE.sRGBEncoding;
  const sg=new THREE.Group();
  sg.add(new THREE.Mesh(new THREE.BoxGeometry(5.5,2.0,0.15),
    new THREE.MeshLambertMaterial({map:tex})));
  const fm=new THREE.MeshLambertMaterial({color:0x1a3a5a});
  const fh=new THREE.Mesh(new THREE.BoxGeometry(5.8,0.2,0.2),fm);
  [0.85,-0.85].forEach(fy=>{const f=fh.clone();f.position.y=fy;sg.add(f);});
  const fv=new THREE.Mesh(new THREE.BoxGeometry(0.2,2.2,0.2),fm);
  [-2.7,2.7].forEach(fx=>{const f=fv.clone();f.position.x=fx;sg.add(f);});
  // Anchor decorations
  const am=new THREE.MeshLambertMaterial({color:0xaaddff});
  [-2.4,2.4].forEach(ax=>{
    const a=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.8,5),am);
    a.position.set(ax,0,0.1); sg.add(a);
    const ar=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.04,5,10),am);
    ar.rotation.x=Math.PI/2; ar.position.set(ax,-0.5,0.1); sg.add(ar);
  });
  sg.position.set(REST_X, 5.0, REST_Z + 4.5);
  scene.add(sg);
  window._laMerSign=sg;
})();

// ── Toast with Truffle ────────────────────────────────────────────────────────
const PORT_DOOR={x:REST_X, z:REST_Z+3.9};
let portThrown=false, portActive=false, portProgress=0;
let portMesh=null, portOrigin=null;

const portSplatEl=document.createElement('div');
portSplatEl.style.cssText=[
  'position:fixed','top:0','left:0','width:100%','height:100%',
  'pointer-events:none','z-index:100','display:none',
  'background:radial-gradient(ellipse at center,rgba(240,220,180,0.95) 0%,rgba(160,110,60,0.6) 50%,transparent 72%)',
  'transition:opacity 0.4s',
].join(';');
document.body.appendChild(portSplatEl);

const portSplatText=document.createElement('div');
portSplatText.style.cssText=[
  'position:fixed','top:36%','left:50%','transform:translate(-50%,-50%)',
  'font-size:34px','font-weight:bold','color:#2a1a00',
  'text-shadow:2px 2px 0 #fff,-2px -2px 0 #fff',
  'pointer-events:none','z-index:101','display:none','text-align:center',
  'font-family:Georgia,serif','letter-spacing:2px',
].join(';');
portSplatText.innerHTML='🍞 Bon appétit, Snoopy! 🍞<br><span style="font-size:20px;letter-spacing:1px">Toast with Black Truffle<br>from La Mer 🌊</span>';
document.body.appendChild(portSplatText);

function makeToastMesh() {
  const g=new THREE.Group();
  const breadMat=new THREE.MeshLambertMaterial({color:0xd4922a});
  const crustMat=new THREE.MeshLambertMaterial({color:0x7a4010});
  const trufMat =new THREE.MeshLambertMaterial({color:0x1a0a00});
  const butterMat=new THREE.MeshLambertMaterial({color:0xf5e060});
  // Toast slice — slightly rounded
  const toast=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.06,0.55),breadMat);
  toast.position.y=0; g.add(toast);
  // Crust edges
  const ce=new THREE.Mesh(new THREE.BoxGeometry(0.58,0.09,0.58),crustMat);
  ce.position.y=-0.015; g.add(ce);
  // Butter shine
  const butter=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.4),butterMat);
  butter.rotation.x=-Math.PI/2; butter.position.y=0.04; g.add(butter);
  // Truffle shavings (dark irregular blobs)
  for(let i=0;i<8;i++){
    const blob=new THREE.Mesh(new THREE.SphereGeometry(0.04+Math.random()*0.03,5,4),trufMat);
    const a=Math.random()*Math.PI*2, r=0.05+Math.random()*0.18;
    blob.position.set(Math.cos(a)*r, 0.055, Math.sin(a)*r);
    blob.scale.set(1,0.4,0.8+Math.random()*0.4);
    g.add(blob);
  }
  // Sprig of herb on top
  const herbMat=new THREE.MeshLambertMaterial({color:0x2a7a1a});
  const herb=new THREE.Mesh(new THREE.SphereGeometry(0.04,4,3),herbMat);
  herb.scale.set(1.8,0.6,1); herb.position.set(0.06,0.07,-0.06); g.add(herb);
  // Plate under toast
  const plateMat=new THREE.MeshLambertMaterial({color:0xffffff});
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.44,0.06,12),plateMat);
  plate.position.y=-0.06; g.add(plate);
  const plateRim=new THREE.Mesh(new THREE.TorusGeometry(0.46,0.04,6,14),plateMat);
  plateRim.rotation.x=Math.PI/2; plateRim.position.y=-0.04; g.add(plateRim);
  return g;
}

function throwToast() {
  if(portActive) return;
  portActive=true; portThrown=true; portProgress=0;
  portOrigin=new THREE.Vector3(REST_X,2.0,REST_Z+3.5);
  portMesh=makeToastMesh();
  portMesh.position.copy(portOrigin);
  scene.add(portMesh);
}

function updatePort(dt) {
  // Animate sea UVs (scrolling waves)
  if(seaTex.offset) seaTex.offset.x += dt*0.012;
  seaTex.offset = seaTex.offset || {x:0,y:0};
  seaTex.offset.x = (seaTex.offset.x||0) + dt*0.012;
  seaMesh.material.map.offset.set(seaTex.offset.x, Math.sin(Date.now()*0.0003)*0.015);

  // Rock boats gently
  const t=Date.now()*0.001;
  boat1.position.y = Math.sin(t*0.7)*0.08;
  boat1.rotation.z = Math.sin(t*0.5)*0.025;
  boat2.position.y = Math.sin(t*0.8+1)*0.08;
  boat2.rotation.z = Math.sin(t*0.6+1)*0.025;

  // Lighthouse light pulse
  if(window._lighthouseLight){
    const angle=t*0.8;
    window._lighthouseLight.intensity = (Math.sin(angle)*0.5+0.5)*2.5;
  }

  // Sign gentle bob
  if(window._laMerSign){
    window._laMerSign.rotation.y=Math.sin(t*0.6)*0.05;
    window._laMerSign.position.y=5.0+Math.sin(t*0.9)*0.14;
  }

  // Proximity check
  if(!portThrown){
    const dx=player.position.x-PORT_DOOR.x, dz=player.position.z-PORT_DOOR.z;
    if(Math.sqrt(dx*dx+dz*dz)<3.5) throwToast();
  }

  // Animate toast flying
  if(portActive && portMesh){
    portProgress+=dt*1.3;
    const tp=Math.min(portProgress,1.0);
    portMesh.position.x=portOrigin.x+(player.position.x-portOrigin.x)*tp;
    portMesh.position.z=portOrigin.z+(player.position.z-portOrigin.z)*tp;
    portMesh.position.y=portOrigin.y+Math.sin(tp*Math.PI)*4.5;
    portMesh.rotation.x+=dt*3; portMesh.rotation.z+=dt*2;
    if(tp>=1.0){
      scene.remove(portMesh); portMesh=null; portActive=false;
      portSplatEl.style.display='block'; portSplatEl.style.opacity='1';
      portSplatText.style.display='block';
      setTimeout(()=>{
        portSplatEl.style.opacity='0';
        setTimeout(()=>{
          portSplatEl.style.display='none'; portSplatText.style.display='none';
          setTimeout(()=>{ portThrown=false; },12000);
        },450);
      },2600);
    }
  }
}
