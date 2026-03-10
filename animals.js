// ── Animals ───────────────────────────────────────────────────────────────────
function makeDog(color=0xc8a060) {
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.BoxGeometry(.5,.3,.8), m);
  body.position.y = .28; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(.28,.26,.28), m);
  head.position.set(0,.46,.38); g.add(head);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(.16,.14,.16), m);
  snout.position.set(0,.4,.52); g.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(.05,4,4),
    new THREE.MeshLambertMaterial({color:0x111111}));
  nose.position.set(0,.42,.61); g.add(nose);
  [[-.08],[.08]].forEach(([ex])=>{
    const e=new THREE.Mesh(new THREE.SphereGeometry(.03,4,4),new THREE.MeshLambertMaterial({color:0x111111}));
    e.position.set(ex,.52,.5); g.add(e);
  });
  const earM = new THREE.MeshLambertMaterial({color: Math.max(0, color-0x202020)});
  [-.14,.14].forEach(ex=>{
    const ear=new THREE.Mesh(new THREE.BoxGeometry(.08,.12,.06),earM);
    ear.position.set(ex,.58,.35); g.add(ear);
  });
  const legM = m;
  [-.15,.15].forEach(lx=>[-.22,.22].forEach(lz=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.1,.2,.1),legM);
    leg.position.set(lx,.09,lz); g.add(leg);
  }));
  const tail=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.25,5),m);
  tail.rotation.z=-.6; tail.position.set(0,.38,-.42); g.add(tail);
  return g;
}

function makeCat(color=0x808080) {
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.BoxGeometry(.35,.28,.62), m);
  body.position.y = .22; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.16,8,6), m);
  head.position.set(0,.4,.3); g.add(head);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(.1,.08,.08),
    new THREE.MeshLambertMaterial({color:0xffe0d0}));
  snout.position.set(0,.38,.46); g.add(snout);
  [-.08,.08].forEach(ex=>{
    const ear=new THREE.Mesh(new THREE.ConeGeometry(.06,.1,4),m);
    ear.position.set(ex,.56,.3); g.add(ear);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,5,4),
      new THREE.MeshLambertMaterial({color:0x22cc44}));
    eye.position.set(ex,.41,.45); g.add(eye);
  });
  [-.08,.08].forEach(lx=>[-.18,.18].forEach(lz=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.08,.16,.08),m);
    leg.position.set(lx,.06,lz); g.add(leg);
  }));
  const tail=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.4,5),m);
  tail.rotation.z=.5; tail.position.set(0,.28,-.35); g.add(tail);
  return g;
}

function makeRabbit(color=0xeeeeee) {
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.SphereGeometry(.2,8,6), m);
  body.scale.set(1,1.1,.9); body.position.y=.22; body.castShadow=true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.14,8,6), m);
  head.position.set(0,.44,.14); g.add(head);
  [-.06,.06].forEach(ex=>{
    const ear=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.22,5), m);
    ear.position.set(ex,.64,.12); g.add(ear);
    const inner=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.2,4),
      new THREE.MeshLambertMaterial({color:0xffaaaa}));
    inner.position.set(ex,.64,.13); g.add(inner);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.02,4,4),
      new THREE.MeshLambertMaterial({color:0xff2222}));
    eye.position.set(ex,.45,.26); g.add(eye);
  });
  [-.08,.08].forEach(lx=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.08,.14,.12),m);
    leg.position.set(lx,.08,.05); g.add(leg);
  });
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.07,6,5),m);
  tail.position.set(0,.26,-.2); g.add(tail);
  return g;
}

function makeBird(color=0x60a0d0) {
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.SphereGeometry(.1,7,5), m);
  body.scale.set(1,1,.8); body.position.y=.22; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.07,6,5), m);
  head.position.set(0,.33,.08); g.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(.03,.08,4),
    new THREE.MeshLambertMaterial({color:0xf0a010}));
  beak.rotation.x=Math.PI/2; beak.position.set(0,.33,.18); g.add(beak);
  [-.12,.12].forEach(wx=>{
    const wing=new THREE.Mesh(new THREE.BoxGeometry(.14,.04,.18),m);
    wing.position.set(wx,.23,0); g.add(wing);
  });
  const tail=new THREE.Mesh(new THREE.BoxGeometry(.06,.04,.1),m);
  tail.position.set(0,.22,-.18); g.add(tail);
  [-.04,.04].forEach(lx=>{
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,.1,4),
      new THREE.MeshLambertMaterial({color:0xf0a010}));
    leg.position.set(lx,.1,0); g.add(leg);
  });
  return g;
}

// Spawn animals around the map
const animalDefs = [
  // Dogs
  { make:()=>makeDog(0xc8a060), x: 18, z: 30, speed:1.2, radius:12 },
  { make:()=>makeDog(0x604020), x:-40, z: 15, speed:1.0, radius:14 },
  { make:()=>makeDog(0xdddddd), x: 60, z:-20, speed:1.4, radius:10 },
  { make:()=>makeDog(0x8b4513), x:-70, z: 60, speed:1.1, radius:12 },
  { make:()=>makeDog(0xf0d090), x: 25, z:-65, speed:1.3, radius:11 },
  { make:()=>makeDog(0x222222), x:-25, z: 70, speed:0.9, radius:13 },
  // Cats
  { make:()=>makeCat(0x808080), x:  8, z: 20, speed:0.9, radius: 8 },
  { make:()=>makeCat(0xff8822), x:-15, z:-20, speed:1.1, radius:10 },
  { make:()=>makeCat(0x222222), x: 50, z: 50, speed:0.8, radius: 9 },
  { make:()=>makeCat(0xddcc88), x:-55, z:-45, speed:1.0, radius:11 },
  { make:()=>makeCat(0xffffff), x: 75, z: 20, speed:0.7, radius: 8 },
  // Rabbits
  { make:()=>makeRabbit(0xeeeeee), x: 35, z: 40, speed:1.8, radius:15 },
  { make:()=>makeRabbit(0xc8a060), x:-45, z:-30, speed:2.0, radius:14 },
  { make:()=>makeRabbit(0x888888), x: 10, z:-50, speed:1.6, radius:12 },
  { make:()=>makeRabbit(0xffd090), x:-80, z: 40, speed:1.9, radius:16 },
  // Birds
  { make:()=>makeBird(0x60a0d0), x: 55, z:-55, speed:2.5, radius:20 },
  { make:()=>makeBird(0xe04040), x:-30, z: 55, speed:2.2, radius:18 },
  { make:()=>makeBird(0x40c060), x: 80, z: 50, speed:2.8, radius:22 },
  { make:()=>makeBird(0xf0c020), x:-65, z:-60, speed:2.4, radius:20 },
];

const animals = animalDefs.map(def => {
  const mesh = def.make();
  mesh.position.set(def.x, 0, def.z);
  scene.add(mesh);
  return {
    mesh,
    homePos: { x: def.x, z: def.z },
    speed: def.speed,
    radius: def.radius,
    walkTarget: null,
    walkWait: Math.random() * 2,
  };
});
