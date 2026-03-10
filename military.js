// ── Military Base ─────────────────────────────────────────────────────────────

const BASE_X = 0, BASE_Z = 112;   // center of base
const GATE_Z  = BASE_Z - 24;      // south entrance gate

// ── Perimeter Fence ───────────────────────────────────────────────────────────
(function buildFence() {
  const postMat  = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const wireMat  = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, wireframe: true });
  const concMat  = new THREE.MeshLambertMaterial({ color: 0x999988 });

  // Four fence walls: north, south (with gap for gate), east, west
  const segments = [
    // [cx, cz, w, d]  — segments avoiding gate gap
    [BASE_X,        BASE_Z+22,  52, 0.3],   // north wall
    [BASE_X-25,     GATE_Z+8,   0.3, 16],   // west wall top
    [BASE_X-25,     GATE_Z-6,   0.3, 12],   // west wall bottom
    [BASE_X+25,     GATE_Z+8,   0.3, 16],   // east wall top
    [BASE_X+25,     GATE_Z-6,   0.3, 12],   // east wall bottom
  ];
  segments.forEach(([cx,cz,w,d])=>{
    const fence=new THREE.Mesh(new THREE.BoxGeometry(Math.max(w,0.3),2.5,Math.max(d,0.3)),wireMat);
    fence.position.set(cx,1.25,cz); scene.add(fence);
    const top=new THREE.Mesh(new THREE.BoxGeometry(Math.max(w,0.3)+0.1,0.15,Math.max(d,0.3)+0.1),postMat);
    top.position.set(cx,2.58,cz); scene.add(top);
  });

  // Fence posts
  const postSpacing=4;
  // North & south horizontals
  for(let x=BASE_X-25; x<=BASE_X+25; x+=postSpacing){
    [BASE_Z+22, GATE_Z].forEach(fz=>{
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,2.8,6),postMat);
      post.position.set(x,1.4,fz); scene.add(post);
    });
  }
  // East & west verticals
  for(let z=GATE_Z; z<=BASE_Z+22; z+=postSpacing){
    [-25,25].forEach(fx=>{
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,2.8,6),postMat);
      post.position.set(BASE_X+fx,1.4,z); scene.add(post);
    });
  }

  // Barbed wire on top
  const barbMat=new THREE.MeshBasicMaterial({color:0xcccccc});
  [-25,25].forEach(fx=>{
    const barb=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,50),barbMat);
    barb.position.set(BASE_X+fx,2.85,BASE_Z); scene.add(barb);
  });
  const barbN=new THREE.Mesh(new THREE.BoxGeometry(52,0.05,0.05),barbMat);
  barbN.position.set(BASE_X,2.85,BASE_Z+22); scene.add(barbN);

  // Main gate arch
  const gateMat=new THREE.MeshLambertMaterial({color:0x556644});
  const gateL=new THREE.Mesh(new THREE.BoxGeometry(0.4,4,0.4),gateMat);
  gateL.position.set(BASE_X-5,2,GATE_Z); scene.add(gateL);
  const gateR=gateL.clone(); gateR.position.set(BASE_X+5,2,GATE_Z); scene.add(gateR);
  const gateTop=new THREE.Mesh(new THREE.BoxGeometry(10.8,0.4,0.5),gateMat);
  gateTop.position.set(BASE_X,4.2,GATE_Z); scene.add(gateTop);
  // Gate sign
  const gsCanvas=document.createElement('canvas'); gsCanvas.width=256; gsCanvas.height=64;
  const gsCtx=gsCanvas.getContext('2d');
  gsCtx.fillStyle='#334422'; gsCtx.fillRect(0,0,256,64);
  gsCtx.font='bold 22px Arial'; gsCtx.fillStyle='#ffff88'; gsCtx.textAlign='center';
  gsCtx.fillStyle='#ffff88'; gsCtx.font='bold 18px Arial'; gsCtx.textAlign='center';
  gsCtx.fillText('שלישות רמת גן',128,28);
  gsCtx.font='14px Arial'; gsCtx.fillText('⚠ כניסה לבעלי הרשאה בלבד ⚠',128,52);
  const gsTex=new THREE.CanvasTexture(gsCanvas); gsTex.encoding=THREE.sRGBEncoding;
  const gateSign=new THREE.Mesh(new THREE.PlaneGeometry(4.5,1.1),
    new THREE.MeshBasicMaterial({map:gsTex}));
  gateSign.position.set(BASE_X,4.0,GATE_Z+0.3); scene.add(gateSign);

  // Guard booths
  [-7,7].forEach(bx=>{
    const booth=new THREE.Mesh(new THREE.BoxGeometry(1.8,2.4,1.8),concMat);
    booth.position.set(BASE_X+bx,1.2,GATE_Z-1); scene.add(booth);
    const bRoof=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.15,2.0),
      new THREE.MeshLambertMaterial({color:0x556644}));
    bRoof.position.set(BASE_X+bx,2.48,GATE_Z-1); scene.add(bRoof);
    const bWin=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.7),
      new THREE.MeshBasicMaterial({color:0x88bbdd,transparent:true,opacity:0.7}));
    bWin.position.set(BASE_X+bx,1.3,GATE_Z-1+(bx<0?0.91:-0.91));
    if(bx>0) bWin.rotation.y=Math.PI;
    scene.add(bWin);
  });
})();

// ── Guard Towers ──────────────────────────────────────────────────────────────
(function buildTowers() {
  const concMat=new THREE.MeshLambertMaterial({color:0x888877});
  const roofMat=new THREE.MeshLambertMaterial({color:0x556644});
  [[BASE_X-23,BASE_Z+20],[BASE_X+23,BASE_Z+20],[BASE_X-23,GATE_Z-2],[BASE_X+23,GATE_Z-2]].forEach(([tx,tz])=>{
    const legs=[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]];
    legs.forEach(([lx,lz])=>{
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.14,5.5,5),concMat);
      leg.position.set(tx+lx,2.75,tz+lz); scene.add(leg);
    });
    const platform=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.25,2.4),concMat);
    platform.position.set(tx,5.63,tz); scene.add(platform);
    const walls=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.2,2.4),
      new THREE.MeshLambertMaterial({color:0x667755,wireframe:false}));
    walls.position.set(tx,6.23,tz); scene.add(walls);
    const tRoof=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.2,2.6),roofMat);
    tRoof.position.set(tx,6.93,tz); scene.add(tRoof);
    // Searchlight
    const sl=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.12,0.35,8),
      new THREE.MeshLambertMaterial({color:0xffffcc}));
    sl.position.set(tx,7.18,tz); scene.add(sl);
  });
})();

// ── Barracks ──────────────────────────────────────────────────────────────────
(function buildBarracks() {
  const wallMat=new THREE.MeshLambertMaterial({color:0x6a7a5a});
  const roofMat=new THREE.MeshLambertMaterial({color:0x445533});
  [[BASE_X-13,BASE_Z+8],[BASE_X+13,BASE_Z+8]].forEach(([bx,bz])=>{
    const b=new THREE.Mesh(new THREE.BoxGeometry(9,4,5.5),wallMat);
    b.position.set(bx,2,bz); b.castShadow=true; b.receiveShadow=true; scene.add(b);
    const r=new THREE.Mesh(new THREE.BoxGeometry(9.4,0.3,6),roofMat);
    r.position.set(bx,4.15,bz); scene.add(r);
    // Windows
    [-2.5,0,2.5].forEach(wx=>{
      const w=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.8),
        new THREE.MeshBasicMaterial({color:0x88aacc,transparent:true,opacity:0.7}));
      w.position.set(bx+wx,2.2,bz+2.78); scene.add(w);
    });
    // Door
    const d=new THREE.Mesh(new THREE.BoxGeometry(1.0,2.0,0.15),
      new THREE.MeshLambertMaterial({color:0x334422}));
    d.position.set(bx,1.0,bz+2.83); scene.add(d);
    colliders.push({x:bx,z:bz,radius:3.5});
  });
})();

// ── Command Building ──────────────────────────────────────────────────────────
(function buildCommand() {
  const wallMat=new THREE.MeshLambertMaterial({color:0x7a8a6a});
  const roofMat=new THREE.MeshLambertMaterial({color:0x445533});
  const accentMat=new THREE.MeshLambertMaterial({color:0x556644});

  // Main body
  const body=new THREE.Mesh(new THREE.BoxGeometry(14,6,10),wallMat);
  body.position.set(BASE_X,3,BASE_Z+12); body.castShadow=true; body.receiveShadow=true; scene.add(body);
  // Roof
  const roof=new THREE.Mesh(new THREE.BoxGeometry(14.4,0.3,10.4),roofMat);
  roof.position.set(BASE_X,6.15,BASE_Z+12); scene.add(roof);
  const parapet=new THREE.Mesh(new THREE.BoxGeometry(14.6,0.6,10.6),accentMat);
  parapet.position.set(BASE_X,6.6,BASE_Z+12); scene.add(parapet);
  // Antenna on roof
  const ant=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,3,5),
    new THREE.MeshLambertMaterial({color:0x888888}));
  ant.position.set(BASE_X,8.0,BASE_Z+12); scene.add(ant);
  const dish=new THREE.Mesh(new THREE.ConeGeometry(0.8,0.4,8),
    new THREE.MeshLambertMaterial({color:0xaaaaaa}));
  dish.rotation.x=Math.PI/3; dish.position.set(BASE_X+2,7.1,BASE_Z+12); scene.add(dish);
  // Windows
  [-4,0,4].forEach(wx=>{
    const w=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.2),
      new THREE.MeshBasicMaterial({color:0x88aacc,transparent:true,opacity:0.75}));
    w.position.set(BASE_X+wx,3.5,BASE_Z+7.02); scene.add(w);
  });
  // Door — south face (player enters from GATE_Z side)
  const dframe=new THREE.Mesh(new THREE.BoxGeometry(2.0,3.0,0.2),accentMat);
  dframe.position.set(BASE_X,1.5,BASE_Z+7.1); scene.add(dframe);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.6,2.8,0.12),
    new THREE.MeshLambertMaterial({color:0x334422}));
  door.position.set(BASE_X,1.4,BASE_Z+7.18); scene.add(door);
  // Flag pole
  const fp=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,7,6),
    new THREE.MeshLambertMaterial({color:0x999999}));
  fp.position.set(BASE_X+6,3.5,BASE_Z+7); scene.add(fp);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.0),
    new THREE.MeshLambertMaterial({color:0x2255aa,side:THREE.DoubleSide}));
  flag.position.set(BASE_X+6.75,7.0,BASE_Z+7); scene.add(flag);
  // Star of David on flag
  const starMat=new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide});
  const star=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.7),starMat);
  star.position.set(BASE_X+6.76,7.0,BASE_Z+7.01); scene.add(star);

  // Perimeter colliders — leave south entrance open
  colliders.push({x:BASE_X,      z:BASE_Z+17, radius:3}); // back wall
  colliders.push({x:BASE_X-7,    z:BASE_Z+12, radius:2}); // left wall
  colliders.push({x:BASE_X+7,    z:BASE_Z+12, radius:2}); // right wall
})();

// ── Military Vehicles ─────────────────────────────────────────────────────────
(function buildVehicles() {
  function makeJeep(x,z,ry) {
    const g=new THREE.Group();
    const bm=new THREE.MeshLambertMaterial({color:0x4a5a3a});
    const wm=new THREE.MeshLambertMaterial({color:0x1a1a1a});
    const body=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.8,4.5),bm);
    body.position.y=0.7; body.castShadow=true; g.add(body);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.9,2.2),bm);
    cab.position.set(0,1.55,0.4); g.add(cab);
    [[-0.9,0.35,1.6],[0.9,0.35,1.6],[-0.9,0.35,-1.6],[0.9,0.35,-1.6]].forEach(([wx,wy,wz])=>{
      const w=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.22,8),wm);
      w.rotation.z=Math.PI/2; w.position.set(wx,wy,wz); g.add(w);
    });
    // Mounted gun
    const gun=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,1.5,5),bm);
    gun.rotation.x=Math.PI/2; gun.position.set(0,2.35,0); g.add(gun);
    g.position.set(x,0,z); g.rotation.y=ry; scene.add(g);
  }
  function makeTank(x,z,ry) {
    const g=new THREE.Group();
    const bm=new THREE.MeshLambertMaterial({color:0x3a4a2a});
    const wm=new THREE.MeshLambertMaterial({color:0x222211});
    const hull=new THREE.Mesh(new THREE.BoxGeometry(3.5,1.2,5.5),bm);
    hull.position.y=0.9; hull.castShadow=true; g.add(hull);
    const turret=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.0,2.8),bm);
    turret.position.set(0,1.9,0.3); g.add(turret);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,3.5,7),bm);
    barrel.rotation.x=Math.PI/2; barrel.position.set(0,2.1,2.4); g.add(barrel);
    // Tracks
    [-1.85,1.85].forEach(tx=>{
      const track=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.7,5.5),wm);
      track.position.set(tx,0.55,0); g.add(track);
    });
    g.position.set(x,0,z); g.rotation.y=ry; scene.add(g);
  }

  makeJeep(BASE_X-8, BASE_Z+2, 0.3);
  makeJeep(BASE_X+10, BASE_Z+5, -0.2);
  makeTank(BASE_X-10, BASE_Z+18, Math.PI/6);
})();

// ── Hamal Mamram (Basement) ───────────────────────────────────────────────────
const MAMRAM_X=BASE_X, MAMRAM_Z=BASE_Z+14;

(function buildMamram() {
  const g=new THREE.Group();
  const wallMat =new THREE.MeshLambertMaterial({color:0x2a2a35,side:THREE.BackSide});
  const floorMat=new THREE.MeshLambertMaterial({color:0x1a1a22});
  const ceilMat =new THREE.MeshLambertMaterial({color:0x222233});
  const concMat =new THREE.MeshLambertMaterial({color:0x3a3a44});

  // Staircase entrance shaft going into the command building
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(3,3,6),
    new THREE.MeshLambertMaterial({color:0x222233,side:THREE.BackSide}));
  shaft.position.set(BASE_X,1.5,BASE_Z+9.5); scene.add(shaft);
  // Stair steps
  const stepMat=new THREE.MeshLambertMaterial({color:0x444455});
  for(let i=0;i<8;i++){
    const step=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.2,0.6),stepMat);
    step.position.set(BASE_X, -0.1-i*0.22, BASE_Z+8.5-i*0.5); scene.add(step);
  }
  // Handrails
  const hrMat=new THREE.MeshLambertMaterial({color:0x999999});
  [-1.1,1.1].forEach(hx=>{
    const hr=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,4,5),hrMat);
    hr.rotation.x=0.5; hr.position.set(BASE_X+hx,0.6,BASE_Z+9.5); scene.add(hr);
  });

  // "HAMAL MAMRAM" sign above entrance
  const sc=document.createElement('canvas'); sc.width=512; sc.height=128;
  const sctx=sc.getContext('2d');
  sctx.fillStyle='#111122'; sctx.fillRect(0,0,512,128);
  sctx.strokeStyle='#00ff88'; sctx.lineWidth=4; sctx.strokeRect(4,4,504,120);
  sctx.font='bold 34px monospace'; sctx.fillStyle='#00ff88'; sctx.textAlign='center';
  sctx.fillText('⬇  HAMAL MAMRAM  ⬇',256,56);
  sctx.font='22px monospace'; sctx.fillStyle='#00cc66';
  sctx.fillText('חמל ממר"מ — מסווג',256,96);
  const stex=new THREE.CanvasTexture(sc); stex.encoding=THREE.sRGBEncoding;
  const entrSign=new THREE.Mesh(new THREE.PlaneGeometry(4.0,1.0),
    new THREE.MeshBasicMaterial({map:stex}));
  entrSign.position.set(BASE_X,3.2,BASE_Z+7.3); scene.add(entrSign);

  // Underground room (below ground, entered via ramp — visually accessible)
  // Floor
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,10),floorMat);
  floor.rotation.x=-Math.PI/2; floor.position.set(MAMRAM_X,-1.8,MAMRAM_Z); scene.add(floor);
  // Ceiling
  const ceil=new THREE.Mesh(new THREE.PlaneGeometry(16,10),ceilMat);
  ceil.rotation.x=Math.PI/2; ceil.position.set(MAMRAM_X,1.0,MAMRAM_Z); scene.add(ceil);
  // Walls
  const wData=[[16,3,0,MAMRAM_Z+5],[16,3,0,MAMRAM_Z-5],[3,10,MAMRAM_X-8,0],[3,10,MAMRAM_X+8,0]];
  wData.forEach(([w,d,ox,oz])=>{
    const wall=new THREE.Mesh(new THREE.BoxGeometry(w,2.8,0.25),concMat);
    wall.position.set(ox||MAMRAM_X, -0.4, oz||MAMRAM_Z); scene.add(wall);
  });

  // Ceiling fluorescent lights
  const lm=new THREE.MeshBasicMaterial({color:0xccffee});
  [-4,0,4].forEach(lx=>{
    const tube=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.1,0.2),lm);
    tube.position.set(MAMRAM_X+lx,0.92,MAMRAM_Z); scene.add(tube);
    const glow=new THREE.PointLight(0x88ffcc,0.4,6);
    glow.position.set(MAMRAM_X+lx,0.7,MAMRAM_Z); scene.add(glow);
  });

  // Computer workstations — 2 rows
  const deskMat=new THREE.MeshLambertMaterial({color:0x222233});
  const screenMat=new THREE.MeshLambertMaterial({color:0x001a00});
  const screenOnMat=new THREE.MeshBasicMaterial({color:0x00ff44});
  const keyboardMat=new THREE.MeshLambertMaterial({color:0x111122});
  const chairMat=new THREE.MeshLambertMaterial({color:0x111111});

  function makeWorkstation(cx,cz,ry) {
    const wg=new THREE.Group();
    // Desk
    const desk=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.9),deskMat);
    desk.position.y=0; wg.add(desk);
    const dleg=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.72,0.08),deskMat);
    [[-0.85,0.38,-0.4],[0.85,0.38,-0.4],[-0.85,0.38,0.4],[0.85,0.38,0.4]].forEach(([dlx,dly,dlz])=>{
      const l=dleg.clone(); l.position.set(dlx,dly,dlz); wg.add(l);
    });
    // Monitor
    const monitor=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.65,0.06),screenMat);
    monitor.position.set(0,0.42,-0.28); wg.add(monitor);
    // Screen glow — green text effect
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(0.88,0.55),screenOnMat);
    screen.position.set(0,0.42,-0.248); wg.add(screen);
    // Monitor stand
    const stand=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.15),deskMat);
    stand.position.set(0,0.1,-0.24); wg.add(stand);
    // Keyboard
    const kb=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.03,0.28),keyboardMat);
    kb.position.set(0,0.06,0.1); wg.add(kb);
    // Mouse
    const mouse=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.04,0.15),keyboardMat);
    mouse.position.set(0.45,0.05,0.1); wg.add(mouse);
    // Chair
    const seat=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.08,0.55),chairMat);
    seat.position.set(0,-0.28,0.6); wg.add(seat);
    const back=new THREE.Mesh(new THREE.BoxGeometry(0.58,0.7,0.07),chairMat);
    back.position.set(0,0.14,0.88); wg.add(back);
    const cleg=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.3,5),chairMat);
    cleg.position.set(0,-0.43,0.6); wg.add(cleg);

    wg.position.set(cx,-1.76,cz);
    wg.rotation.y=ry;
    scene.add(wg);
  }

  // Front row — facing north wall (toward sea)
  [-5,-2,1,4].forEach(wx=>makeWorkstation(MAMRAM_X+wx, MAMRAM_Z-3, 0));
  // Back row — facing south
  [-5,-2,1,4].forEach(wx=>makeWorkstation(MAMRAM_X+wx, MAMRAM_Z+3, Math.PI));

  // Map board on north wall
  const mapCanvas=document.createElement('canvas'); mapCanvas.width=512; mapCanvas.height=320;
  const mc=mapCanvas.getContext('2d');
  mc.fillStyle='#001500'; mc.fillRect(0,0,512,320);
  mc.strokeStyle='#00aa44'; mc.lineWidth=1;
  for(let i=0;i<512;i+=32) { mc.beginPath();mc.moveTo(i,0);mc.lineTo(i,320);mc.stroke(); }
  for(let i=0;i<320;i+=32) { mc.beginPath();mc.moveTo(0,i);mc.lineTo(512,i);mc.stroke(); }
  mc.strokeStyle='#00ff88'; mc.lineWidth=2;
  mc.beginPath(); mc.arc(256,160,60,0,Math.PI*2); mc.stroke();
  mc.beginPath(); mc.arc(256,160,100,0,Math.PI*2); mc.stroke();
  mc.fillStyle='#ff4444'; mc.beginPath(); mc.arc(256,160,6,0,Math.PI*2); mc.fill();
  mc.fillStyle='#00ff88'; mc.font='bold 18px monospace'; mc.textAlign='center';
  mc.fillText('◉ MAMRAM BASE',256,290);
  [[-1,0.6],[0.5,-0.4],[-0.3,0.8],[0.8,0.2]].forEach(([rx,rz])=>{
    mc.fillStyle='#ffaa00'; mc.beginPath(); mc.arc(256+rx*80,160+rz*60,4,0,Math.PI*2); mc.fill();
  });
  const mapTex=new THREE.CanvasTexture(mapCanvas); mapTex.encoding=THREE.sRGBEncoding;
  const mapBoard=new THREE.Mesh(new THREE.PlaneGeometry(4.5,2.8),
    new THREE.MeshBasicMaterial({map:mapTex}));
  mapBoard.position.set(MAMRAM_X,0.0,MAMRAM_Z-4.85); scene.add(mapBoard);

  // "CLASSIFIED" stamp on wall
  const clCanvas=document.createElement('canvas'); clCanvas.width=256; clCanvas.height=64;
  const clCtx=clCanvas.getContext('2d');
  clCtx.fillStyle='rgba(0,0,0,0)'; clCtx.fillRect(0,0,256,64);
  clCtx.font='bold 36px Impact'; clCtx.fillStyle='rgba(200,0,0,0.85)';
  clCtx.textAlign='center'; clCtx.strokeStyle='rgba(200,0,0,0.85)'; clCtx.lineWidth=3;
  clCtx.strokeRect(5,5,246,54); clCtx.fillText('CLASSIFIED',128,44);
  const clTex=new THREE.CanvasTexture(clCanvas); clTex.encoding=THREE.sRGBEncoding;
  const clSign=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.56),
    new THREE.MeshBasicMaterial({map:clTex,transparent:true}));
  clSign.rotation.z=0.2; clSign.position.set(MAMRAM_X+6,0.2,MAMRAM_Z-4.8); scene.add(clSign);
})();

// ── Hamal Mamram Message ──────────────────────────────────────────────────────
const mamramMsgEl=document.createElement('div');
mamramMsgEl.style.cssText=[
  'position:fixed','top:50%','left:50%','transform:translate(-50%,-50%)',
  'background:rgba(0,10,0,0.97)','border:3px solid #00ff88',
  'border-radius:12px','padding:28px 42px','pointer-events:none',
  'z-index:110','display:none','text-align:center',
  'box-shadow:0 0 30px rgba(0,255,136,0.5)',
].join(';');
mamramMsgEl.innerHTML=`
  <div style="font-family:monospace;font-size:13px;color:#00ff88;letter-spacing:2px;margin-bottom:14px">⬛ שלישות רמת גן — חמל ממר"מ ⬛</div>
  <div style="font-family:Arial,sans-serif;font-size:26px;font-weight:bold;color:#ffffff;direction:rtl;line-height:1.6">
    פה סנופי הכיר את סנופ
  </div>
  <div style="font-family:monospace;font-size:11px;color:#00aa55;margin-top:16px;letter-spacing:1px">[ CLASSIFIED — TOP SECRET ]</div>`;
document.body.appendChild(mamramMsgEl);

let mamramShown=false, mamramTimer=0;

function updateMilitary(dt) {
  // Rotate radar dish
  if(window._radarDish) window._radarDish.rotation.y+=dt*0.8;

  // Hamal Mamram proximity — trigger when player walks down into basement area
  const dx=player.position.x-MAMRAM_X, dz=player.position.z-MAMRAM_Z;
  const nearMamram=Math.sqrt(dx*dx+dz*dz)<7;

  if(nearMamram && !mamramShown){
    mamramShown=true;
    mamramMsgEl.style.display='block';
    mamramTimer=5.0;
  }
  if(mamramTimer>0){
    mamramTimer-=dt;
    if(mamramTimer<=0){
      mamramMsgEl.style.display='none';
      setTimeout(()=>{ mamramShown=false; },15000);
    }
  }
}
