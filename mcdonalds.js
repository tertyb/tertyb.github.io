// ── McDonald's ────────────────────────────────────────────────────────────────

const MCD_X = 27, MCD_Z = -30;

// ── Building ──────────────────────────────────────────────────────────────────
(function buildMcDonalds() {
  const g = new THREE.Group();

  const redMat    = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
  const yellowMat = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
  const whiteMat  = new THREE.MeshLambertMaterial({ color: 0xffffff });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(11, 5.5, 9), redMat);
  body.position.y = 2.75; body.castShadow = true; body.receiveShadow = true; g.add(body);

  // Flat roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.3, 9.4), yellowMat);
  roof.position.y = 5.65; g.add(roof);

  // White tile band at base
  const base = new THREE.Mesh(new THREE.BoxGeometry(11.1, 0.7, 9.1), whiteMat);
  base.position.y = 0.35; g.add(base);

  // Windows — large panoramic front
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xcceeff, transparent: true, opacity: 0.75 });
  [[-3.2, 2.8, 4.52], [0, 2.8, 4.52], [3.2, 2.8, 4.52]].forEach(([wx,wy,wz]) => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.0), glassMat);
    w.position.set(wx, wy, wz); g.add(w);
  });

  // Door
  const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
  const dframe = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.2, 0.2), doorFrameMat);
  dframe.position.set(0, 1.6, 4.6); g.add(dframe);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.9, 0.12), whiteMat);
  door.position.set(0, 1.45, 4.68); g.add(door);

  // Drive-through lane indicator on side
  const laneMat = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
  const lane = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 3.0), laneMat);
  lane.position.set(5.58, 1.4, -1); g.add(lane);
  const laneWin = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), glassMat);
  laneWin.rotation.y = -Math.PI/2; laneWin.position.set(5.52, 2.5, -1); g.add(laneWin);

  // McCafé awning
  const awningMat = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(12, 0.12, 1.6), awningMat);
  awning.position.set(0, 3.1, 5.2); g.add(awning);

  g.position.set(MCD_X, 0, MCD_Z);
  scene.add(g);
  colliders.push({ x: MCD_X, z: MCD_Z, radius: 6.2 });
})();


// ── Tortia image overlay — shown when player is near McDonald's ───────────────
(function() {
  const _menuImgOverlay = document.createElement('div');
  _menuImgOverlay.style.cssText = [
    'position:fixed','top:50%','left:50%',
    'transform:translate(-50%,-50%)',
    'width:min(560px,78vw)',
    'display:none','z-index:50',
    'border-radius:10px','overflow:hidden',
    'box-shadow:0 0 40px rgba(0,0,0,0.85)',
    'border:4px solid #ffbb00','pointer-events:none',
  ].join(';');
  _menuImgOverlay.innerHTML = '<img src="tortia.jpg" style="width:100%;display:block;">';
  document.body.appendChild(_menuImgOverlay);
  window._mcdMenuOverlay = _menuImgOverlay;
})();

// ── Golden Arches Sign ────────────────────────────────────────────────────────
(function makeMcDSign() {
  // Sign board texture
  const c = document.createElement('canvas'); c.width = 512; c.height = 200;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#cc0000'; ctx.fillRect(0,0,512,200);
  ctx.strokeStyle = '#ffbb00'; ctx.lineWidth = 10; ctx.strokeRect(5,5,502,190);

  // Big M arches drawn manually
  ctx.strokeStyle = '#ffbb00'; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(145,170); ctx.lineTo(145,60);
  ctx.bezierCurveTo(145,20, 200,20, 200,60);
  ctx.bezierCurveTo(200,20, 255,20, 255,60);
  ctx.lineTo(255,170); ctx.stroke();

  ctx.font = 'bold 52px Impact, Arial Black, sans-serif';
  ctx.fillStyle = '#ffbb00'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.shadowColor='#000'; ctx.shadowBlur=8;
  ctx.fillText("McDonald's", 270, 88);

  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#fff'; ctx.shadowBlur=3;
  ctx.fillText('🌯  Now serving Tortillas!  🌯', 270, 148);

  const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;

  const sg = new THREE.Group();
  sg.add(new THREE.Mesh(new THREE.BoxGeometry(6.4,2.5,0.18),
    new THREE.MeshLambertMaterial({ map: tex })));

  const fm = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
  const fh = new THREE.Mesh(new THREE.BoxGeometry(6.7,0.22,0.22), fm);
  [1.05,-1.05].forEach(fy=>{ const f=fh.clone(); f.position.y=fy; sg.add(f); });
  const fv = new THREE.Mesh(new THREE.BoxGeometry(0.22,2.6,0.22), fm);
  [-3.2,3.2].forEach(fx=>{ const f=fv.clone(); f.position.x=fx; sg.add(f); });

  const pm = new THREE.MeshLambertMaterial({ color: 0x888888 });
  [-2.2,2.2].forEach(px=>{
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,4,6), pm);
    p.position.set(px,-3,0); sg.add(p);
  });

  sg.position.set(MCD_X, 3.0, MCD_Z + 7.5);
  scene.add(sg);
  window._mcdSign = sg;
})();

// ── Tortilla Throw ────────────────────────────────────────────────────────────
const MCD_DOOR = { x: MCD_X, z: MCD_Z + 4.5 };
let mcdThrown = false, mcdActive = false, mcdProgress = 0;
let mcdMesh = null, mcdOrigin = null;

const mcdSplatEl = document.createElement('div');
mcdSplatEl.style.cssText = [
  'position:fixed','top:0','left:0','width:100%','height:100%',
  'pointer-events:none','z-index:100','display:none',
  'background:radial-gradient(ellipse at center,rgba(255,230,150,0.93) 0%,rgba(200,150,50,0.65) 45%,transparent 70%)',
  'transition:opacity 0.4s',
].join(';');
document.body.appendChild(mcdSplatEl);

const mcdSplatText = document.createElement('div');
mcdSplatText.style.cssText = [
  'position:fixed','top:38%','left:50%','transform:translate(-50%,-50%)',
  'font-size:38px','font-weight:bold','color:#cc0000',
  'text-shadow:2px 2px 0 #fff,-2px -2px 0 #fff',
  'pointer-events:none','z-index:101','display:none','text-align:center',
  'font-family:Impact,Arial Black,sans-serif','letter-spacing:3px',
].join(';');
mcdSplatText.innerHTML = "🌯 I'm Lovin' It! 🌯<br><span style='font-size:22px;letter-spacing:1px'>Here's your Tortilla, Snoopy!</span>";
document.body.appendChild(mcdSplatText);

function makeTortillaMesh() {
  const g = new THREE.Group();
  const doughMat  = new THREE.MeshLambertMaterial({ color: 0xf5e4b0 });
  const fillingMat= new THREE.MeshLambertMaterial({ color: 0xcc4422 });
  const lettMat   = new THREE.MeshLambertMaterial({ color: 0x55bb33 });
  // Flat wrap disc
  const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,0.06,14), doughMat);
  g.add(wrap);
  // Filling visible on top
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.04,10), fillingMat);
  fill.position.y = 0.05; g.add(fill);
  const lett = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.03,8), lettMat);
  lett.position.y = 0.08; g.add(lett);
  // Rolled edge
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.38,0.04,6,14), doughMat);
  edge.rotation.x = Math.PI/2; g.add(edge);
  return g;
}

function throwTortilla() {
  if (mcdActive) return;
  mcdActive = true; mcdThrown = true; mcdProgress = 0;
  mcdOrigin = new THREE.Vector3(MCD_X, 2.5, MCD_Z + 4.5);
  mcdMesh = makeTortillaMesh();
  mcdMesh.position.copy(mcdOrigin);
  scene.add(mcdMesh);
}

function updateMcDonalds(dt) {
  if (window._mcdSign) {
    window._mcdSign.rotation.y = Math.sin(Date.now()*0.001)*0.06;
    window._mcdSign.position.y = 3.0 + Math.sin(Date.now()*0.0014)*0.18;
  }
  if (window._mcdMenuOverlay) {
    const mdx = player.position.x - MCD_X, mdz = player.position.z - MCD_Z;
    window._mcdMenuOverlay.style.display =
      Math.sqrt(mdx*mdx + mdz*mdz) < 9 ? 'block' : 'none';
  }
  if (!mcdThrown) {
    const dx=player.position.x-MCD_DOOR.x, dz=player.position.z-MCD_DOOR.z;
    if (Math.sqrt(dx*dx+dz*dz) < 3.5) throwTortilla();
  }
  if (mcdActive && mcdMesh) {
    mcdProgress += dt * 1.4;
    const t = Math.min(mcdProgress, 1.0);
    mcdMesh.position.x = mcdOrigin.x + (player.position.x-mcdOrigin.x)*t;
    mcdMesh.position.z = mcdOrigin.z + (player.position.z-mcdOrigin.z)*t;
    mcdMesh.position.y = mcdOrigin.y + Math.sin(t*Math.PI)*4.0;
    mcdMesh.rotation.y += dt*6;
    mcdMesh.rotation.x += dt*2;
    if (t >= 1.0) {
      scene.remove(mcdMesh); mcdMesh=null; mcdActive=false;
      mcdSplatEl.style.display='block'; mcdSplatEl.style.opacity='1';
      mcdSplatText.style.display='block';
      setTimeout(()=>{
        mcdSplatEl.style.opacity='0';
        setTimeout(()=>{
          mcdSplatEl.style.display='none'; mcdSplatText.style.display='none';
          setTimeout(()=>{ mcdThrown=false; },12000);
        },450);
      },2200);
    }
  }
}
