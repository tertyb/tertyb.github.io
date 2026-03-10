// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => { keys[e.code]=true; });
window.addEventListener('keyup',   e => { keys[e.code]=false; });
window.addEventListener('keydown', e => {
  if (e.code === 'KeyE') {
    if (inCar) {
      inCar = false; player.visible = true;
      player.position.x = car.position.x + Math.sin(car.rotation.y + Math.PI/2) * 2.8;
      player.position.z = car.position.z + Math.cos(car.rotation.y + Math.PI/2) * 2.8;
      player.position.y = player.userData.groundOffset || 0;
    } else {
      const cdx = player.position.x - car.position.x, cdz = player.position.z - car.position.z;
      if (Math.sqrt(cdx*cdx+cdz*cdz) < 5) {
        inCar = true; player.visible = false; carSpeed = 0;
      } else {
        const near = getNearestNPC(3.5);
        if (near) {
          if (near.talkVisible) {
            near.dialogueIdx = (near.dialogueIdx + 1) % near.dialogues.length;
          near.bubbleEl.innerHTML = `<b>${near.name}</b><br>${near.dialogues[near.dialogueIdx].replace(/\n/g,'<br>')}`;
          } else { near.talkVisible = true; }
        }
      }
    }
  }
  if (e.code === 'Space') e.preventDefault();
});

let camYaw=0, camPitch=0.35, pointerLocked=false;
canvas.addEventListener('click', () => canvas.requestPointerLock());
document.addEventListener('pointerlockchange', () => { pointerLocked = document.pointerLockElement === canvas; });
document.addEventListener('mousemove', e => {
  if (!pointerLocked) return;
  camYaw   -= e.movementX * 0.003;
  camPitch -= e.movementY * 0.003;
  camPitch = Math.max(0.1, Math.min(1.1, camPitch));
});

