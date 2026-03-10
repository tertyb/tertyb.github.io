// ── Quest System ──────────────────────────────────────────────────────────────
const QUESTS = [
  {
    id: 'baseball', giver: 'Charlie Brown',
    start: "Good grief! I lost my baseball\nnear the big oak tree. Can you\nfind it for me?",
    active: "The baseball is somewhere\nnear the trees... north-east!",
    done: "You found it!! You're a\ngood sport, Snoopy! 🎉",
    reward: '⚾ Baseball found! +50 pts',
  },
  {
    id: 'flowers', giver: 'Lucy',
    start: "I need 3 flowers for my\ndoctor's stand. Bring them\nto me! Five cents... FREE for you.",
    active: "Find 3 flowers around\nthe park and bring them back!",
    done: "Hmph. Fine, these are\nacceptable. Good dog.",
    reward: '🌸 Flowers delivered! +50 pts',
  },
  {
    id: 'blanket', giver: 'Linus',
    start: "Oh no! My security blanket\nbrew away to the fountain!\nCan you get it back?",
    active: "My blanket is near\nthe town fountain...",
    done: "Oh thank you Snoopy!\n✨ I feel secure again!",
    reward: '🧣 Blanket returned! +50 pts',
  },
];

const questState = {};  // id → 'none'|'active'|'done'
QUESTS.forEach(q => questState[q.id] = 'none');
let questScore = 0;

// Quest collectibles
const questItems = {
  baseball: { x: 18, z: -15, color: 0xdd2222, shape: 'sphere', mesh: null },
  flowers:  { x: 6,  z:  36, color: 0xff66cc, shape: 'flower', mesh: null },
  blanket:  { x: 2,  z: -11, color: 0x88aaff, shape: 'box',    mesh: null },
};

Object.entries(questItems).forEach(([id, item]) => {
  let mesh;
  if (item.shape === 'sphere') {
    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6), new THREE.MeshLambertMaterial({color:item.color}));
  } else if (item.shape === 'box') {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.5), new THREE.MeshLambertMaterial({color:item.color}));
  } else {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.5,5), new THREE.MeshBasicMaterial({color:0x338833}));
    stem.position.y=0.25; g.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18,7,5), new THREE.MeshBasicMaterial({color:item.color}));
    head.position.y=0.58; g.add(head);
    mesh = g;
  }
  mesh.position.set(item.x, 0.35, item.z);
  mesh.visible = false;
  scene.add(mesh);
  item.mesh = mesh;
  questItems[id] = item;
});

// Quest UI panel
const questPanel = document.createElement('div');
questPanel.id = 'questpanel';
questPanel.style.cssText = 'position:fixed;bottom:16px;right:16px;background:rgba(255,255,255,0.88);border:3px solid #333;border-radius:16px;padding:10px 16px;font-size:13px;color:#333;z-index:10;pointer-events:none;box-shadow:3px 3px 0 #333;min-width:180px;display:none;';
document.body.appendChild(questPanel);

// Notification
const notifEl = document.createElement('div');
notifEl.id = 'questnotif';
notifEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,200,0.97);border:3px solid #333;border-radius:18px;padding:16px 28px;font-size:16px;color:#333;z-index:50;pointer-events:none;box-shadow:4px 4px 0 #333;text-align:center;display:none;max-width:280px;';
document.body.appendChild(notifEl);
let notifTimer = 0;

function showNotif(text, duration=3) {
  notifEl.innerHTML = text;
  notifEl.style.display = 'block';
  notifTimer = duration;
}

function startQuest(id) {
  if (questState[id] !== 'none') return;
  questState[id] = 'active';
  const q = QUESTS.find(q=>q.id===id);
  questItems[id].mesh.visible = true;
  questPanel.style.display = 'block';
  questPanel.innerHTML = `<b>📋 Quest Active</b><br>${q.active.replace(/\n/g,'<br>')}`;
  showNotif(`<b>New Quest!</b><br>${q.start.replace(/\n/g,'<br>')}`, 4);
}

function completeQuest(id) {
  questState[id] = 'done';
  const q = QUESTS.find(q=>q.id===id);
  questItems[id].mesh.visible = false;
  questScore += 50;
  // Update quest panel
  const active = QUESTS.filter(q=>questState[q.id]==='active');
  if (active.length === 0) questPanel.style.display = 'none';
  else questPanel.innerHTML = `<b>📋 Quest Active</b><br>${active[0].active.replace(/\n/g,'<br>')}`;
  showNotif(`✅ ${q.reward}`, 3);
}

function updateQuests(dt) {
  // Notif timer
  if (notifTimer > 0) {
    notifTimer -= dt;
    if (notifTimer <= 0) notifEl.style.display = 'none';
  }

  // Check proximity to quest items
  Object.entries(questItems).forEach(([id, item]) => {
    if (questState[id] !== 'active') return;
    const dx = player.position.x - item.x;
    const dz = player.position.z - item.z;
    if (Math.sqrt(dx*dx+dz*dz) < 1.5) completeQuest(id);
    // Float animation
    item.mesh.position.y = 0.35 + Math.sin(Date.now()*0.003)*0.15;
    item.mesh.rotation.y += dt * 2;
  });
}

// Hook into NPC dialogue to trigger quests
function tryTriggerQuest(npcName) {
  const map = {
    'Charlie Brown': 'baseball',
    'Lucy': 'flowers',
    'Linus': 'blanket',
  };
  const id = map[npcName];
  if (id && questState[id] === 'none') {
    setTimeout(() => startQuest(id), 800);
  } else if (id && questState[id] === 'done') {
    // already done, show completion again briefly
  }
}
