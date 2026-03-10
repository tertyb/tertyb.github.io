// ── Main Loop ─────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if (!modelLoaded) { renderer.render(scene, camera); return; }

  // Plane flying
  if (inPlane) {
    if (keys['KeyW']||keys['ArrowUp'])   planeSpeed = Math.min(planeSpeed + 160*dt, 85);
    if (keys['KeyS']||keys['ArrowDown']) planeSpeed = Math.max(planeSpeed - 90*dt, 0);
    planeSpeed *= Math.pow(0.994, dt * 60);

    if (planeSpeed > 1) {
      const steer = (keys['KeyA']||keys['ArrowLeft'] ? 1 : keys['KeyD']||keys['ArrowRight'] ? -1 : 0) * dt * 1.2;
      playerPlane.rotation.y += steer;
      // Bank visually
      const bankTarget = (keys['KeyA']||keys['ArrowLeft'] ? 0.32 : keys['KeyD']||keys['ArrowRight'] ? -0.32 : 0);
      playerPlane.rotation.z += (bankTarget - playerPlane.rotation.z) * Math.min(1, dt * 4);
    }
    // Climb — direct strong input, independent of speed
    const climb = keys['Space'] ? 1 : (keys['ShiftLeft']||keys['ShiftRight']) ? -1 : 0;
    planeVelY += climb * 14 * dt;
    // Gravity only when airborne
    if (playerPlane.position.y > 0.7) planeVelY -= 3.5 * dt;
    planeVelY = Math.max(-15, Math.min(15, planeVelY));
    playerPlane.position.x += Math.sin(playerPlane.rotation.y) * planeSpeed * dt;
    playerPlane.position.z += Math.cos(playerPlane.rotation.y) * planeSpeed * dt;
    playerPlane.position.y += planeVelY * dt;
    playerPlane.position.x = Math.max(-275, Math.min(275, playerPlane.position.x));
    playerPlane.position.z = Math.max(-275, Math.min(275, playerPlane.position.z));
    // Pitch visual
    playerPlane.rotation.x = -planeVelY * 0.03;
    // Land on ground
    if (playerPlane.position.y <= 0.56) {
      playerPlane.position.y = 0.56;
      if (planeVelY < 0) planeVelY = 0;
      planeSpeed *= Math.pow(0.90, dt * 60);
    }
  }

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
      car.position.x = Math.max(-280, Math.min(280, car.position.x));
      car.position.z = Math.max(-280, Math.min(280, car.position.z));
    }
    car.userData.wheels.forEach(w => { w.rotation.x += carSpeed * dt * 1.6; });
  }

  // Player movement
  let mx=0, mz=0, isMoving=false;
  if (!inCar && !inPlane) {
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
      if (Math.abs(nx)>280||Math.abs(nz)>280) blocked=true;
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
  const camTarget = inPlane ? playerPlane : (inCar ? car : player);
  const camDist   = inPlane ? 22 : (inCar ? 14 : 9);
  const camHeight = inPlane ? 4.0 : (inCar ? 1.5 : 1.0);
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
  const cdx2 = (inCar || inPlane ? 999 : player.position.x - car.position.x);
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

  // Animal wander
  const t = clock.getElapsedTime();
  for (const a of animals) {
    if (a.walkTarget) {
      const tx = a.walkTarget.x - a.mesh.position.x;
      const tz = a.walkTarget.z - a.mesh.position.z;
      const dist = Math.sqrt(tx*tx + tz*tz);
      if (dist < 0.15) {
        a.walkTarget = null;
        a.walkWait = 1 + Math.random() * 3;
      } else {
        const angle = Math.atan2(tx, tz);
        a.mesh.position.x += Math.sin(angle) * a.speed * dt;
        a.mesh.position.z += Math.cos(angle) * a.speed * dt;
        a.mesh.rotation.y = angle;
        a.mesh.position.y = Math.abs(Math.sin(t * 6 * a.speed)) * 0.05;
      }
    } else {
      a.walkWait -= dt;
      a.mesh.position.y = 0;
      if (a.walkWait <= 0) {
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * a.radius;
        a.walkTarget = {
          x: a.homePos.x + Math.cos(angle) * r,
          z: a.homePos.z + Math.sin(angle) * r,
        };
      }
    }
  }

  // NPC wander & bubbles
  const NPC_SPEED = 1.4;
  const WANDER_RADIUS = 9;
  for (const [i, npc] of npcs.entries()) {
    const dx=player.position.x-npc.mesh.position.x, dz=player.position.z-npc.mesh.position.z;
    const inRange = Math.sqrt(dx*dx+dz*dz) < 3.5;
    if (!inRange) npc.talkVisible = false;

    // Wander AI — pause when player is nearby or talking
    if (!inRange) {
      if (npc.walkTarget) {
        const tx = npc.walkTarget.x - npc.mesh.position.x;
        const tz = npc.walkTarget.z - npc.mesh.position.z;
        const dist = Math.sqrt(tx*tx + tz*tz);
        if (dist < 0.15) {
          // reached target — wait then pick new one
          npc.walkTarget = null;
          npc.walkWait = 1.5 + Math.random() * 2.5;
        } else {
          const angle = Math.atan2(tx, tz);
          npc.mesh.position.x += Math.sin(angle) * NPC_SPEED * dt;
          npc.mesh.position.z += Math.cos(angle) * NPC_SPEED * dt;
          npc.mesh.rotation.y = angle;
          // idle bob while walking
          npc.mesh.position.y = Math.sin(t * 8 + i) * 0.04;
        }
      } else {
        npc.walkWait -= dt;
        npc.mesh.position.y = Math.sin(t * 1.4 + i * 1.3) * 0.04;
        if (npc.walkWait <= 0) {
          // pick a random target within WANDER_RADIUS of home
          const angle = Math.random() * Math.PI * 2;
          const r = 3 + Math.random() * WANDER_RADIUS;
          npc.walkTarget = {
            x: npc.homePos.x + Math.cos(angle) * r,
            z: npc.homePos.z + Math.sin(angle) * r,
          };
        }
      }
    } else {
      // face player when in range
      npc.mesh.rotation.y = Math.atan2(dx, dz);
      npc.mesh.position.y = Math.sin(t * 1.4 + i * 1.3) * 0.04;
      npc.walkTarget = null;
    }

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

  updateDayNight(dt);
  updateWeather(dt);
  updateQuests(dt);
  updateCarAI(dt);
  updateJaja(dt);
  updateGDB(dt);
  updateMcDonalds(dt);
  updateBasketball(dt);
  updateBIGAshdod(dt);
  updatePort(dt);
  updateMilitary(dt);
  updatePlanes(dt);
  updateGrandparents(dt);
  updateCombat(dt);
  updateSuperPharm(dt);

  renderer.render(scene, camera);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
loadSnoopy();
animate();
