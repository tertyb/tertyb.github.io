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


