// ── Combat System ─────────────────────────────────────────────────────────────

// ── HP Bar UI ─────────────────────────────────────────────────────────────────
let playerHP = 100;
const MAX_HP = 100;
let playerHurtCooldown = 0;

const hpWrap = document.createElement('div');
hpWrap.style.cssText = [
  'position:fixed','bottom:18px','left:50%','transform:translateX(-50%)',
  'display:flex','flex-direction:column','align-items:center','gap:4px','z-index:30',
  'pointer-events:none',
].join(';');

const hpLabel = document.createElement('div');
hpLabel.style.cssText='color:#fff;font-size:13px;font-family:Arial;font-weight:bold;text-shadow:0 1px 3px #000';
hpLabel.textContent = '❤️ HP: 100';

const hpBarBg = document.createElement('div');
hpBarBg.style.cssText='width:180px;height:14px;background:#333;border-radius:7px;border:2px solid #666;overflow:hidden';
const hpBarFill = document.createElement('div');
hpBarFill.style.cssText='height:100%;width:100%;background:linear-gradient(90deg,#e03030,#ff6060);border-radius:7px;transition:width 0.2s';
hpBarBg.appendChild(hpBarFill);

const shampooLabel = document.createElement('div');
shampooLabel.style.cssText='color:#cc88ff;font-size:13px;font-family:Arial;font-weight:bold;text-shadow:0 1px 3px #000;display:none';
shampooLabel.textContent='💜 [F] Purple Shampoo';

hpWrap.appendChild(hpLabel);
hpWrap.appendChild(hpBarBg);
hpWrap.appendChild(shampooLabel);
document.body.appendChild(hpWrap);

function updateHPBar() {
  const pct = Math.max(0, playerHP) / MAX_HP * 100;
  hpBarFill.style.width = pct + '%';
  hpBarFill.style.background = pct > 50
    ? 'linear-gradient(90deg,#e03030,#ff6060)'
    : pct > 25 ? 'linear-gradient(90deg,#e07000,#ffaa00)'
    : 'linear-gradient(90deg,#880000,#cc2020)';
  hpLabel.textContent = `❤️ HP: ${Math.max(0, playerHP)}`;
}

// ── Combat message popup ───────────────────────────────────────────────────────
const combatMsgEl = document.createElement('div');
combatMsgEl.style.cssText = [
  'position:fixed','top:35%','left:50%','transform:translateX(-50%)',
  'font-size:28px','font-weight:bold','color:#ffffff','font-family:Arial',
  'text-shadow:0 0 12px #8800ff,0 2px 4px #000','pointer-events:none',
  'z-index:40','display:none','transition:opacity 0.3s',
].join(';');
document.body.appendChild(combatMsgEl);
let combatMsgTimer = 0;
function showCombatMsg(txt) {
  combatMsgEl.textContent = txt;
  combatMsgEl.style.display = 'block';
  combatMsgEl.style.opacity = '1';
  combatMsgTimer = 1.8;
}

// ── Player death / respawn ─────────────────────────────────────────────────────
function onPlayerDeath() {
  playerHP = MAX_HP;
  updateHPBar();
  player.position.set(0, 0, 0);
  showCombatMsg('💀 Snoopy fell... but got back up!');
}

// ── Skeleton mesh ─────────────────────────────────────────────────────────────
function makeSkeleton() {
  const g = new THREE.Group();
  const bm  = new THREE.MeshLambertMaterial({ color: 0xd8d4c0 });
  const em  = new THREE.MeshBasicMaterial({ color: 0xff2200 });

  // Skull
  const skull = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.36), bm);
  skull.position.y = 1.72; g.add(skull);
  // Jaw
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.28), bm);
  jaw.position.set(0, 1.5, 0.04); g.add(jaw);
  // Red eyes
  [-0.1, 0.1].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.04), em);
    eye.position.set(ex, 1.74, 0.19); g.add(eye);
    // Glow point
    const glow = new THREE.PointLight(0xff2200, 0.4, 2.5);
    glow.position.set(ex, 1.74, 0.3); g.add(glow);
  });
  // Teeth
  [-0.07, 0, 0.07].forEach(tx => {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.04),
      new THREE.MeshLambertMaterial({color:0xffffff}));
    tooth.position.set(tx, 1.48, 0.16); g.add(tooth);
  });
  // Neck vertebra
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.2,5), bm);
  neck.position.y = 1.35; g.add(neck);
  // Spine
  for (let i = 0; i < 4; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.1), bm);
    v.position.y = 1.22 - i * 0.18; g.add(v);
  }
  // Ribcage
  for (let ri = 0; ri < 4; ri++) {
    const ry = 1.18 - ri * 0.18;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.55 - ri*0.04, 0.06, 0.3), bm);
    rib.position.y = ry; g.add(rib);
  }
  // Pelvis
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.28), bm);
  pelvis.position.y = 0.54; g.add(pelvis);
  // Upper arms
  [-0.38, 0.38].forEach(ax => {
    const ua = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.52,5), bm);
    ua.rotation.z = ax > 0 ? -0.35 : 0.35;
    ua.position.set(ax * 1.05, 1.08, 0); g.add(ua);
    const la = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.46,5), bm);
    la.rotation.z = ax > 0 ? -0.7 : 0.7;
    la.position.set(ax * 1.4, 0.76, 0); g.add(la);
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.1,0.08), bm);
    hand.position.set(ax * 1.68, 0.5, 0); g.add(hand);
  });
  // Upper legs
  [-0.13, 0.13].forEach(lx => {
    const ul = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.55,5), bm);
    ul.position.set(lx, 0.28, 0); g.add(ul);
    const ll = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.05,0.5,5), bm);
    ll.position.set(lx, -0.2, 0.04); g.add(ll);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.13,0.08,0.22), bm);
    foot.position.set(lx, -0.49, 0.07); g.add(foot);
  });
  g.scale.set(1.15, 1.15, 1.15);
  return g;
}

// ── Shampoo bottle ────────────────────────────────────────────────────────────
let hasShampoo = false;
let shampooCooldown = 0;

function makeShampooMesh() {
  const g = new THREE.Group();
  const purp = new THREE.MeshLambertMaterial({ color: 0x7700cc });
  const white = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.55, 10), purp);
  bottle.position.y = 0.3; g.add(bottle);
  const neck2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.14, 8), purp);
  neck2.position.y = 0.62; g.add(neck2);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 8), white);
  cap.position.y = 0.75; g.add(cap);
  // Label
  const lc = document.createElement('canvas'); lc.width=128; lc.height=64;
  const lctx = lc.getContext('2d');
  lctx.fillStyle='#aa00ff'; lctx.fillRect(0,0,128,64);
  lctx.fillStyle='#ffffff'; lctx.font='bold 16px Arial'; lctx.textAlign='center';
  lctx.fillText('ELVIVE', 64, 28);
  lctx.fillText('Shampoo', 64, 52);
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.145,0.145,0.3,10),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lc)}));
  label.position.y = 0.3; g.add(label);
  return g;
}

const shampooPickupMesh = makeShampooMesh();
shampooPickupMesh.position.set(15, 0, -8);
scene.add(shampooPickupMesh);

// ── Plane bullets ─────────────────────────────────────────────────────────────
const bullets = [];
let bulletCooldown = 0;

function fireBullet() {
  const bm = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xffee00 })
  );
  const pl = new THREE.PointLight(0xffee00, 1.5, 8);
  const grp = new THREE.Group();
  grp.add(bm); grp.add(pl);
  grp.position.copy(playerPlane.position);
  grp.position.y -= 0.3;
  scene.add(grp);
  bullets.push({
    mesh: grp,
    vx: Math.sin(playerPlane.rotation.y) * 90,
    vz: Math.cos(playerPlane.rotation.y) * 90,
    vy: 0,
    life: 4.0,
  });
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
const skeletons = [];
let skeletonKills = 0;

const SPAWN_POINTS = [
  {x:128, z:128},
  {x:-128, z:128},
];

function spawnSkeleton(x, z) {
  const mesh = makeSkeleton();
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  const sk = { mesh, hp:3, alive:true, attackCooldown:0, deathTimer:0, spawnX:x, spawnZ:z };
  skeletons.push(sk);
}

// Spawn initial wave
SPAWN_POINTS.forEach(p => spawnSkeleton(p.x, p.z));

// ── Kill skeleton ─────────────────────────────────────────────────────────────
function killSkeleton(sk) {
  if (!sk.alive) return;
  sk.alive = false;
  sk.deathTimer = 0.6;
  skeletonKills++;
  // Flash white
  sk.mesh.traverse(o => {
    if (o.isMesh) {
      o.userData.origMat = o.material;
      o.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
  });
  // Tumble
  sk.mesh.rotation.z = Math.PI / 2;
}

// ── F key: shoot / swing ──────────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.code !== 'KeyF') return;
  if (inPlane && bulletCooldown <= 0) {
    fireBullet();
    bulletCooldown = 0.18;
    showCombatMsg('✈️ FIRE!');
  } else if (!inCar && !inPlane && hasShampoo && shampooCooldown <= 0) {
    shampooCooldown = 0.55;
    let hits = 0;
    skeletons.forEach(sk => {
      if (!sk.alive) return;
      const dx = sk.mesh.position.x - player.position.x;
      const dz = sk.mesh.position.z - player.position.z;
      if (Math.sqrt(dx*dx+dz*dz) < 3.5) { killSkeleton(sk); hits++; }
    });
    showCombatMsg(hits > 0 ? `💜 SMASH! ×${hits}` : '💜 Swing!');
  }
});

// ── Main update ───────────────────────────────────────────────────────────────
function updateCombat(dt) {
  const t = clock.getElapsedTime();

  // Combat message fade
  if (combatMsgTimer > 0) {
    combatMsgTimer -= dt;
    if (combatMsgTimer <= 0.4) combatMsgEl.style.opacity = (combatMsgTimer / 0.4).toString();
    if (combatMsgTimer <= 0) combatMsgEl.style.display = 'none';
  }

  // Shampoo pickup bob & collect
  if (!hasShampoo) {
    shampooPickupMesh.position.y = 0.5 + Math.sin(t * 2.5) * 0.12;
    shampooPickupMesh.rotation.y += dt * 2.0;
    const dx = player.position.x - shampooPickupMesh.position.x;
    const dz = player.position.z - shampooPickupMesh.position.z;
    if (Math.sqrt(dx*dx+dz*dz) < 1.6) {
      hasShampoo = true;
      scene.remove(shampooPickupMesh);
      shampooLabel.style.display = 'block';
      showCombatMsg('השמפו האהוב על סנופי 💜 לחץ F לתקוף!');
    }
  }

  // Cooldowns
  bulletCooldown  = Math.max(0, bulletCooldown - dt);
  shampooCooldown = Math.max(0, shampooCooldown - dt);
  playerHurtCooldown = Math.max(0, playerHurtCooldown - dt);

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.life -= dt;
    b.mesh.position.x += b.vx * dt;
    b.mesh.position.z += b.vz * dt;
    if (b.life <= 0) { scene.remove(b.mesh); bullets.splice(i, 1); continue; }
    let hit = false;
    for (const sk of skeletons) {
      if (!sk.alive) continue;
      const dx = b.mesh.position.x - sk.mesh.position.x;
      const dz = b.mesh.position.z - sk.mesh.position.z;
      if (Math.sqrt(dx*dx+dz*dz) < 2.2) {
        killSkeleton(sk);
        showCombatMsg('💥 Direct Hit!');
        hit = true; break;
      }
    }
    if (hit) { scene.remove(b.mesh); bullets.splice(i, 1); }
  }

  // Skeletons update
  for (let i = skeletons.length - 1; i >= 0; i--) {
    const sk = skeletons[i];
    if (!sk.alive) {
      sk.deathTimer -= dt;
      if (sk.deathTimer <= 0) { scene.remove(sk.mesh); skeletons.splice(i, 1); }
      continue;
    }
    const target = inPlane ? playerPlane : player;
    const dx = target.position.x - sk.mesh.position.x;
    const dz = target.position.z - sk.mesh.position.z;
    const dist = Math.sqrt(dx*dx+dz*dz);

    if (dist < 55 && dist > 1.6) {
      const angle = Math.atan2(dx, dz);
      sk.mesh.position.x += Math.sin(angle) * 2.0 * dt;
      sk.mesh.position.z += Math.cos(angle) * 2.0 * dt;
      sk.mesh.rotation.y = angle;
      // Walk bob
      sk.mesh.position.y = Math.abs(Math.sin(t * 5 + sk.spawnX)) * 0.06;
      // Arm swing
      sk.mesh.children.forEach((c, ci) => {
        if (ci >= 10 && ci <= 11) c.rotation.x = Math.sin(t * 5 + ci) * 0.3;
      });
    }

    // Attack player on ground
    if (!inPlane && dist < 1.8) {
      sk.attackCooldown -= dt;
      if (sk.attackCooldown <= 0) {
        sk.attackCooldown = 1.5;
        if (playerHurtCooldown <= 0) {
          playerHP = Math.max(0, playerHP - 12);
          playerHurtCooldown = 0.4;
          updateHPBar();
          if (playerHP <= 0) onPlayerDeath();
          else showCombatMsg('💀 Ouch!');
        }
      }
    }
  }

  // Kill counter
  if (skeletonKills > 0) {
    hpLabel.textContent = `❤️ HP: ${Math.max(0,playerHP)}  |  💀 Kills: ${skeletonKills}`;
  }
}
