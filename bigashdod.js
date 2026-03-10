// ── BIG Ashdod Shopping Center ────────────────────────────────────────────────

const BIG_X = -10, BIG_Z = -90;

(function buildBIGAshdod() {
  const g = new THREE.Group();

  const wallMat   = new THREE.MeshLambertMaterial({ color: 0xd0cfc8 });
  const accentMat = new THREE.MeshLambertMaterial({ color: 0x1155aa });
  const glassMat  = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent:true, opacity:0.55 });
  const roofMat   = new THREE.MeshLambertMaterial({ color: 0x445577 });
  const floorMat  = new THREE.MeshLambertMaterial({ color: 0xf0ece4 });

  // ── Shell walls (no front wall so player can enter) ─────────────────────────
  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(50,9,0.6), wallMat);
  backWall.position.set(0,4.5,-11); backWall.castShadow=true; g.add(backWall);
  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6,9,22), wallMat);
  leftWall.position.set(-25,4.5,0); leftWall.castShadow=true; g.add(leftWall);
  // Right wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6,9,22), wallMat);
  rightWall.position.set(25,4.5,0); rightWall.castShadow=true; g.add(rightWall);
  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(50,22),
    new THREE.MeshLambertMaterial({color:0xfaf8f4,side:THREE.BackSide}));
  ceiling.rotation.x = Math.PI/2; ceiling.position.set(0,9,0); g.add(ceiling);
  // Interior floor
  const iFloor = new THREE.Mesh(new THREE.PlaneGeometry(49.5,21.5), floorMat);
  iFloor.rotation.x = -Math.PI/2; iFloor.position.set(0,0.04,0);
  iFloor.receiveShadow=true; g.add(iFloor);
  // Floor tiles (canvas)
  const ftc = document.createElement('canvas'); ftc.width=ftc.height=256;
  const ftx = ftc.getContext('2d');
  ftx.fillStyle='#f0ece4'; ftx.fillRect(0,0,256,256);
  ftx.strokeStyle='#dddad4'; ftx.lineWidth=2;
  for(let i=0;i<256;i+=32){ ftx.beginPath();ftx.moveTo(i,0);ftx.lineTo(i,256);ftx.stroke(); ftx.beginPath();ftx.moveTo(0,i);ftx.lineTo(256,i);ftx.stroke();}
  const ftTex=new THREE.CanvasTexture(ftc); ftTex.wrapS=ftTex.wrapT=THREE.RepeatWrapping; ftTex.repeat.set(8,6);
  iFloor.material = new THREE.MeshLambertMaterial({map:ftTex});

  // Front facade — two side panels with glass, open center for entry
  const facadeL = new THREE.Mesh(new THREE.BoxGeometry(16,9,0.5), wallMat);
  facadeL.position.set(-17,4.5,11); g.add(facadeL);
  const facadeR = new THREE.Mesh(new THREE.BoxGeometry(16,9,0.5), wallMat);
  facadeR.position.set(17,4.5,11); g.add(facadeR);
  // Glass panels on facade sides
  [-17,17].forEach(fx=>{
    const gp = new THREE.Mesh(new THREE.PlaneGeometry(14,7), glassMat);
    gp.position.set(fx,4,11.3); g.add(gp);
  });

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(52,0.4,24), roofMat);
  roof.position.y=9.2; g.add(roof);
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(52,1.2,24), accentMat);
  parapet.position.y=9.8; g.add(parapet);
  // Blue accent stripes on outside walls
  for(let i=-22;i<=22;i+=5.5){
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.5,9.1,0.6),accentMat);
    s.position.set(i,4.5,11); g.add(s);
  }

  // Entrance canopy
  const canopy=new THREE.Mesh(new THREE.BoxGeometry(18,0.25,5),
    new THREE.MeshLambertMaterial({color:0x1155aa,transparent:true,opacity:0.85}));
  canopy.position.set(0,5.5,13.6); g.add(canopy);
  [-8,0,8].forEach(cx=>{
    const sup=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,5.5,6),
      new THREE.MeshLambertMaterial({color:0x888888}));
    sup.position.set(cx,2.75,15.2); g.add(sup);
  });

  // Glass sliding doors (center, open gap)
  const doorMat=new THREE.MeshBasicMaterial({color:0x99ccee,transparent:true,opacity:0.5});
  [-4.5,4.5].forEach(dx=>{
    const door=new THREE.Mesh(new THREE.BoxGeometry(3.8,4.5,0.1),doorMat);
    door.position.set(dx,2.25,11.1); g.add(door);
  });

  // Side wings
  const wingL=new THREE.Mesh(new THREE.BoxGeometry(10,7,20),wallMat);
  wingL.position.set(-30,3.5,1); wingL.castShadow=true; g.add(wingL);
  const wingR=new THREE.Mesh(new THREE.BoxGeometry(10,7,20),wallMat);
  wingR.position.set(30,3.5,1); wingR.castShadow=true; g.add(wingR);
  [wingL,wingR].forEach(w=>{ const wr=new THREE.Mesh(new THREE.BoxGeometry(10.4,0.4,20.4),roofMat); wr.position.set(w.position.x,7.2,1); g.add(wr); });
  [-30,30].forEach(wx=>{
    [[0,3.5,10.02],[0,3.5,-9.98]].forEach(([ox,wy,wz])=>{
      const w2=new THREE.Mesh(new THREE.PlaneGeometry(6,3.5),glassMat);
      w2.position.set(wx+ox,wy,wz); if(wz<0)w2.rotation.y=Math.PI; g.add(w2);
    });
  });

  // Interior ceiling lights strip
  [-16,-8,0,8,16].forEach(lx=>{
    const strip=new THREE.Mesh(new THREE.BoxGeometry(3,0.15,1.2),
      new THREE.MeshBasicMaterial({color:0xfffff0}));
    strip.position.set(lx,8.9,0); g.add(strip);
  });

  // Parking lot
  const parkMat=new THREE.MeshLambertMaterial({color:0x444444});
  const parking=new THREE.Mesh(new THREE.PlaneGeometry(55,18),parkMat);
  parking.rotation.x=-Math.PI/2; parking.position.set(0,0.02,25); g.add(parking);
  const lm=new THREE.MeshBasicMaterial({color:0xffffff});
  for(let i=-24;i<=24;i+=3.2){
    const line=new THREE.Mesh(new THREE.PlaneGeometry(0.1,6),lm);
    line.rotation.x=-Math.PI/2; line.position.set(i,0.025,25); g.add(line);
  }

  // Shopping carts near entrance
  const cartMat=new THREE.MeshLambertMaterial({color:0xaaaaaa});
  [-7,-4,-1].forEach(cx=>{
    const cart=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.7,1.0),cartMat);
    cart.position.set(cx,0.35,13.5); g.add(cart);
    const ch=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.06,0.06),cartMat);
    ch.position.set(cx,0.8,13.0); g.add(ch);
  });

  g.position.set(BIG_X,0,BIG_Z);
  scene.add(g);

  // Perimeter wall colliders — leaves 9-unit-wide entrance open at z=+11
  // Back wall
  for(let i=-20;i<=20;i+=8) colliders.push({x:BIG_X+i, z:BIG_Z-11, radius:2});
  // Left wall
  for(let i=-10;i<=10;i+=8) colliders.push({x:BIG_X-25, z:BIG_Z+i, radius:2});
  // Right wall
  for(let i=-10;i<=10;i+=8) colliders.push({x:BIG_X+25, z:BIG_Z+i, radius:2});
  // Front facade sides (leaving center open)
  colliders.push({x:BIG_X-17, z:BIG_Z+11, radius:5});
  colliders.push({x:BIG_X+17, z:BIG_Z+11, radius:5});
  // Wings
  colliders.push({x:BIG_X-30, z:BIG_Z+1, radius:7});
  colliders.push({x:BIG_X+30, z:BIG_Z+1, radius:7});
})();

// ── BIG Ashdod Sign ───────────────────────────────────────────────────────────
(function makeBIGSign() {
  const c=document.createElement('canvas'); c.width=768; c.height=240;
  const ctx=c.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,768,0);
  grad.addColorStop(0,'#0a1a5a'); grad.addColorStop(0.5,'#1155cc'); grad.addColorStop(1,'#0a1a5a');
  ctx.fillStyle=grad; ctx.fillRect(0,0,768,240);
  ctx.strokeStyle='#88bbff'; ctx.lineWidth=8; ctx.strokeRect(5,5,758,230);
  ctx.font='bold 150px Impact,Arial Black,sans-serif';
  ctx.textAlign='left'; ctx.textBaseline='middle';
  ctx.fillStyle='#fff'; ctx.shadowColor='#000'; ctx.shadowBlur=16; ctx.shadowOffsetX=5; ctx.shadowOffsetY=5;
  ctx.fillText('BIG',30,112);
  ctx.font='bold 110px Impact,Arial Black,sans-serif';
  ctx.fillStyle='#ffcc00'; ctx.shadowBlur=12;
  ctx.fillText('Ashdod',230,112);
  ctx.font='bold 24px Arial,sans-serif';
  ctx.fillStyle='#aaccff'; ctx.shadowBlur=4; ctx.textAlign='center';
  ctx.fillText('🛍  The Largest Shopping Center in Snoopy\'s World  🛍',384,210);
  const tex=new THREE.CanvasTexture(c); tex.encoding=THREE.sRGBEncoding;
  const sg=new THREE.Group();
  sg.add(new THREE.Mesh(new THREE.BoxGeometry(14,4.5,0.3),new THREE.MeshLambertMaterial({map:tex})));
  const fm=new THREE.MeshLambertMaterial({color:0x1155aa});
  const fh=new THREE.Mesh(new THREE.BoxGeometry(14.6,0.35,0.35),fm);
  [2.1,-2.1].forEach(fy=>{const f=fh.clone();f.position.y=fy;sg.add(f);});
  const fv=new THREE.Mesh(new THREE.BoxGeometry(0.35,4.8,0.35),fm);
  [-7.1,7.1].forEach(fx=>{const f=fv.clone();f.position.x=fx;sg.add(f);});
  const spotMat=new THREE.MeshLambertMaterial({color:0xffffcc});
  [-5,-2,1,4].forEach(sx=>{
    const spot=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.08,0.4,8),spotMat);
    spot.position.set(sx,2.5,0.25); sg.add(spot);
  });
  sg.position.set(BIG_X,12.5,BIG_Z-11.2);
  sg.rotation.y=Math.PI;
  scene.add(sg);
  window._bigSign=sg;
})();

// ── Shops ─────────────────────────────────────────────────────────────────────
function makeShopSign(label, subtitle, bgColor, textColor) {
  const c=document.createElement('canvas'); c.width=512; c.height=160;
  const ctx=c.getContext('2d');
  ctx.fillStyle=bgColor; ctx.fillRect(0,0,512,160);
  ctx.strokeStyle=textColor; ctx.lineWidth=6; ctx.strokeRect(4,4,504,152);
  ctx.font='bold 72px Impact,Arial Black,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle=textColor;
  ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=8;
  ctx.fillText(label,256,76);
  ctx.font='bold 20px Arial,sans-serif';
  ctx.fillStyle=textColor; ctx.shadowBlur=3;
  ctx.fillText(subtitle,256,138);
  const tex=new THREE.CanvasTexture(c); tex.encoding=THREE.sRGBEncoding; return tex;
}

function makeShopStall(wx,wz,signTex,accentColor) {
  const g=new THREE.Group();
  const ac=new THREE.MeshLambertMaterial({color:accentColor});
  const wm=new THREE.MeshLambertMaterial({color:0xfafafa});
  const cm=new THREE.MeshLambertMaterial({color:0xe8e4dc});
  // Back partition wall
  const back=new THREE.Mesh(new THREE.BoxGeometry(8,4,0.2),wm);
  back.position.set(0,2,-2); g.add(back);
  // Side partitions
  [-4,4].forEach(sx=>{
    const side=new THREE.Mesh(new THREE.BoxGeometry(0.2,4,4),cm);
    side.position.set(sx,2,0); g.add(side);
  });
  // Counter
  const counter=new THREE.Mesh(new THREE.BoxGeometry(7,0.12,1.2),ac);
  counter.position.set(0,1.05,1.5); g.add(counter);
  const counterFront=new THREE.Mesh(new THREE.BoxGeometry(7,1.0,0.18),ac);
  counterFront.position.set(0,0.5,2.12); g.add(counterFront);
  // Accent stripe on wall
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(8.1,0.3,0.22),ac);
  stripe.position.set(0,3.8,-1.9); g.add(stripe);
  // Sign on wall
  const signBoard=new THREE.Mesh(new THREE.PlaneGeometry(5.5,1.75),
    new THREE.MeshBasicMaterial({map:signTex}));
  signBoard.position.set(0,2.9,-1.88); g.add(signBoard);
  g.position.set(wx,0,wz);
  scene.add(g);
  return g;
}

// Item mesh builders
function makeBootMesh() {
  const g=new THREE.Group();
  const m=new THREE.MeshLambertMaterial({color:0x1a0a00});
  const sole=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.07,0.7),new THREE.MeshLambertMaterial({color:0x111111}));
  sole.position.y=0; g.add(sole);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.35,0.55),m);
  body.position.set(0,0.21,-0.07); g.add(body);
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.5,0.24),m);
  shaft.position.set(0,0.47,0.18); g.add(shaft);
  const toe=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.12,0.22),m);
  toe.position.set(0,0.1,0.32); g.add(toe);
  // Laces
  const laceMat=new THREE.MeshLambertMaterial({color:0xeeeeee});
  [0.32,0.42,0.52,0.62].forEach(ly=>{
    const lace=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.025,0.025),laceMat);
    lace.position.set(0,ly,0.31); g.add(lace);
  });
  return g;
}

function makeShirtMesh() {
  const g=new THREE.Group();
  const m=new THREE.MeshLambertMaterial({color:0x2244aa});
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.12),m);
  body.position.y=0.35; g.add(body);
  [-0.44,0.44].forEach(sx=>{
    const sleeve=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.22,0.1),m);
    sleeve.position.set(sx,0.65,0); sleeve.rotation.z=(sx<0?1:-1)*0.4; g.add(sleeve);
  });
  // Collar
  const collar=new THREE.Mesh(new THREE.TorusGeometry(0.14,0.04,5,10),
    new THREE.MeshLambertMaterial({color:0x1a3388}));
  collar.rotation.x=Math.PI/2; collar.position.set(0,0.78,0); g.add(collar);
  // Zara logo stripe
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.06,0.13),
    new THREE.MeshLambertMaterial({color:0xffffff}));
  stripe.position.set(0,0.5,0); g.add(stripe);
  return g;
}

function makePajamasMesh() {
  const g=new THREE.Group();
  const m=new THREE.MeshLambertMaterial({color:0xffaacc});
  const stripeMat=new THREE.MeshLambertMaterial({color:0xff66aa});
  // Top
  const top=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.6,0.12),m);
  top.position.y=0.3; g.add(top);
  [-0.38,0.38].forEach(sx=>{
    const sl=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.18,0.1),m);
    sl.position.set(sx,0.55,0); g.add(sl);
  });
  // Stripes on top
  [0.15,0.32,0.5].forEach(sy=>{
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.04,0.13),stripeMat);
    s.position.y=sy; g.add(s);
  });
  // Pants
  const pants=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.6,0.12),m);
  pants.position.y=-0.32; g.add(pants);
  [-0.18,0.18].forEach(px=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.42,0.12),m);
    leg.position.set(px,-0.83,0); g.add(leg);
    const ls=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.04,0.13),stripeMat);
    [0,-0.2,-0.4].forEach(ly=>{ const lc=ls.clone(); lc.position.set(px,-0.7+ly,0); g.add(lc); });
  });
  return g;
}

function makeSuppliesMesh() {
  const g=new THREE.Group();
  // Box
  const boxMat=new THREE.MeshLambertMaterial({color:0xff6600});
  const box=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.6,0.55),boxMat);
  box.position.y=0.3; g.add(box);
  // Label
  const labelMat=new THREE.MeshLambertMaterial({color:0xffffff});
  const label=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.38),labelMat);
  label.position.set(0,0.3,0.28); g.add(label);
  // Items poking out top
  const itemColors=[0x2266cc,0xcc2222,0x22aa44,0xcccc00];
  itemColors.forEach((col,i)=>{
    const item=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.22,0.1),
      new THREE.MeshLambertMaterial({color:col}));
    item.position.set(-0.24+i*0.16,0.7,0); g.add(item);
  });
  return g;
}

// Shop definitions — world coords inside building
const SHOPS = [
  {
    id:'stevemadden',
    name:'Steve Madden',
    sub:'👢 Premium Footwear',
    bg:'#111111', fg:'#ffffff',
    accent:0x111111,
    wx: BIG_X-18, wz: BIG_Z+1,
    itemLabel:'👢 New boots! Steve Madden, Snoopy!',
    makeMesh: makeBootMesh,
    thrown:false, active:false, progress:0, mesh:null,
  },
  {
    id:'zara',
    name:'ZARA',
    sub:'👗 Fashion & Clothing',
    bg:'#ffffff', fg:'#111111',
    accent:0x222222,
    wx: BIG_X-6, wz: BIG_Z+1,
    itemLabel:'👗 Fresh Zara fit for Snoopy!',
    makeMesh: makeShirtMesh,
    thrown:false, active:false, progress:0, mesh:null,
  },
  {
    id:'victoriasecret',
    name:"Victoria's",
    sub:'🌸 Secret Pajamas',
    bg:'#cc2255', fg:'#ffffff',
    accent:0xcc2255,
    wx: BIG_X+6, wz: BIG_Z+1,
    itemLabel:"🌸 Comfy pajamas from Victoria's Secret!",
    makeMesh: makePajamasMesh,
    thrown:false, active:false, progress:0, mesh:null,
  },
  {
    id:'maxstock',
    name:'MAX STOCK',
    sub:'📦 Everything & More',
    bg:'#ff6600', fg:'#ffffff',
    accent:0xff6600,
    wx: BIG_X+18, wz: BIG_Z+1,
    itemLabel:'📦 Loaded with supplies from Max Stock!',
    makeMesh: makeSuppliesMesh,
    thrown:false, active:false, progress:0, mesh:null,
  },
];

// Build stalls & place display items
SHOPS.forEach(shop=>{
  const tex=makeShopSign(shop.name, shop.sub, shop.bg, shop.fg);
  makeShopStall(shop.wx, shop.wz, tex, shop.accent);
  // Display item on counter
  const display=shop.makeMesh();
  display.position.set(shop.wx, 1.15, shop.wz+1.5);
  display.scale.setScalar(0.9);
  scene.add(display);
  shop.displayMesh=display;
  // E hint per shop
  const hint=document.createElement('div');
  hint.style.cssText=[
    'position:fixed','bottom:120px','left:50%','transform:translateX(-50%)',
    'background:rgba(0,0,0,0.8)','color:#fff','font-size:14px','font-weight:bold',
    'padding:5px 18px','border-radius:12px','pointer-events:none','z-index:20',
    'display:none','font-family:Arial,sans-serif',
  ].join(';');
  hint.textContent=`[E] Buy from ${shop.name}`;
  document.body.appendChild(hint);
  shop.hintEl=hint;
});

// Purchase overlay
const shopSplatEl=document.createElement('div');
shopSplatEl.style.cssText=[
  'position:fixed','top:0','left:0','width:100%','height:100%',
  'pointer-events:none','z-index:100','display:none',
  'background:radial-gradient(ellipse at center,rgba(255,255,255,0.95) 0%,rgba(200,200,255,0.7) 45%,transparent 70%)',
  'transition:opacity 0.4s',
].join(';');
document.body.appendChild(shopSplatEl);

const shopReceiptEl=document.createElement('div');
shopReceiptEl.style.cssText=[
  'position:fixed','top:35%','left:50%','transform:translate(-50%,-50%)',
  'background:#fff','border:3px solid #333','border-radius:16px',
  'padding:20px 36px','font-size:22px','font-weight:bold','color:#222',
  'pointer-events:none','z-index:101','display:none','text-align:center',
  'font-family:Arial,sans-serif','box-shadow:4px 4px 0 #333',
  'min-width:300px',
].join(';');
document.body.appendChild(shopReceiptEl);

function throwShopItem(shop) {
  if(shop.active) return;
  shop.active=true; shop.thrown=true; shop.progress=0;
  shop.mesh=shop.makeMesh();
  shop.mesh.position.set(shop.wx, 1.2, shop.wz);
  scene.add(shop.mesh);
}

// E key — buy from nearest shop
window.addEventListener('keydown', e=>{
  if(e.code!=='KeyE') return;
  for(const shop of SHOPS){
    if(shop.thrown) continue;
    const dx=player.position.x-shop.wx, dz=player.position.z-shop.wz;
    if(Math.sqrt(dx*dx+dz*dz)<4.5){ throwShopItem(shop); break; }
  }
});

// ── Entrance notification ─────────────────────────────────────────────────────
const bigEntryEl=document.createElement('div');
bigEntryEl.style.cssText=[
  'position:fixed','bottom:100px','left:50%','transform:translateX(-50%)',
  'background:rgba(10,42,110,0.92)','color:#fff','font-size:17px','font-weight:bold',
  'padding:10px 26px','border-radius:22px','pointer-events:none','z-index:20',
  'display:none','font-family:Arial,sans-serif','border:2px solid #88bbff',
  'text-align:center',
].join(';');
bigEntryEl.innerHTML='🛍 Welcome to BIG Ashdod!<br><span style="font-size:13px;font-weight:normal">Steve Madden · Zara · Victoria\'s Secret · Max Stock</span>';
document.body.appendChild(bigEntryEl);

let bigWelcomed=false, bigEntryTimer=0;

function updateBIGAshdod(dt) {
  if(window._bigSign){
    const s=1.0+Math.sin(Date.now()*0.0015)*0.018;
    window._bigSign.scale.set(s,s,1);
  }

  // Rotate display items
  SHOPS.forEach(shop=>{
    if(shop.displayMesh) shop.displayMesh.rotation.y += dt*0.8;
  });

  // Welcome message
  const pdx=player.position.x-BIG_X, pdz=player.position.z-(BIG_Z+14);
  if(Math.sqrt(pdx*pdx+pdz*pdz)<18 && !bigWelcomed){
    bigWelcomed=true; bigEntryEl.style.display='block'; bigEntryTimer=4;
  }
  if(bigEntryTimer>0){ bigEntryTimer-=dt; if(bigEntryTimer<=0){ bigEntryEl.style.display='none'; setTimeout(()=>{bigWelcomed=false;},10000); } }

  // Shop hints & item flight
  SHOPS.forEach(shop=>{
    const dx=player.position.x-shop.wx, dz=player.position.z-shop.wz;
    const dist=Math.sqrt(dx*dx+dz*dz);
    shop.hintEl.style.display=(dist<4.5 && !shop.thrown)?'block':'none';

    if(shop.active && shop.mesh){
      shop.progress+=dt*1.5;
      const t=Math.min(shop.progress,1.0);
      shop.mesh.position.x=shop.wx+(player.position.x-shop.wx)*t;
      shop.mesh.position.z=shop.wz+(player.position.z-shop.wz)*t;
      shop.mesh.position.y=1.2+Math.sin(t*Math.PI)*3.5;
      shop.mesh.rotation.y+=dt*5;
      shop.mesh.rotation.x+=dt*3;
      if(t>=1.0){
        scene.remove(shop.mesh); shop.mesh=null; shop.active=false;
        shopSplatEl.style.display='block'; shopSplatEl.style.opacity='1';
        shopReceiptEl.innerHTML=`🛍 <b>Purchase Complete!</b><br><br>${shop.itemLabel}<br><br><span style="font-size:15px;color:#888">Thank you for shopping at BIG Ashdod!</span>`;
        shopReceiptEl.style.display='block';
        setTimeout(()=>{
          shopSplatEl.style.opacity='0';
          setTimeout(()=>{ shopSplatEl.style.display='none'; shopReceiptEl.style.display='none'; setTimeout(()=>{ shop.thrown=false; },15000); },450);
        },2800);
      }
    }
  });
}
