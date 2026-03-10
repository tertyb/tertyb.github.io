// ── Player state ──────────────────────────────────────────────────────────────
let player = new THREE.Object3D();
player.position.set(0, 0, 2);
scene.add(player);

let velY = 0;
const GRAVITY = -20;

let mixer=null, actionWalk=null, actionIdle=null, currentAction=null;
let modelLoaded=false;

// ── Load Snoopy FBX with PBR textures ────────────────────────────────────────
function applyPBRMaterials(fbx) {
  // Pre-load all textures from embedded base64
  const furBaseT   = loadTexture(ASSETS.furBase,   'srgb');
  const furNormT   = loadTexture(ASSETS.furNormal,  'linear');
  const furRoughT  = loadTexture(ASSETS.furRough,   'linear');
  const furMetalT  = loadTexture(ASSETS.furMetal,   'linear');
  const miscBaseT  = loadTexture(ASSETS.miscBase,   'srgb');
  const miscNormT  = loadTexture(ASSETS.miscNormal, 'linear');
  const miscRoughT = loadTexture(ASSETS.miscRough,  'linear');
  const miscMetalT = loadTexture(ASSETS.miscMetal,  'linear');

  const furMat = new THREE.MeshStandardMaterial({
    map:          furBaseT,
    normalMap:    furNormT,
    roughnessMap: furRoughT,
    metalnessMap: furMetalT,
    roughness:    1.0,
    metalness:    1.0,
    skinning:     true,
  });

  const miscMat = new THREE.MeshStandardMaterial({
    map:          miscBaseT,
    normalMap:    miscNormT,
    roughnessMap: miscRoughT,
    metalnessMap: miscMetalT,
    roughness:    1.0,
    metalness:    1.0,
    skinning:     true,
  });

  fbx.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow    = true;
    child.receiveShadow = true;

    // Read the ORIGINAL material name(s) from the FBX before replacing
    const getMats = m => Array.isArray(m) ? m : [m];
    const origMats = getMats(child.material);

    // Map each original material slot to the correct PBR material
    const newMats = origMats.map(m => {
      const n = (m.name || '').toLowerCase();
      console.log('Mesh:', child.name, '| Material slot:', m.name);
      if (n.includes('misc')) return miscMat;
      // fur_m and furtexture_m both get the fur texture
      return furMat;
    });

    child.material = newMats.length === 1 ? newMats[0] : newMats;
    // Ensure skinning flag is set for SkinnedMesh nodes
    if (child.isSkinnedMesh) getMats(child.material).forEach(m => m.skinning = true);
  });
}

function loadSnoopy() {
  const loader = new THREE.FBXLoader();
  try {
    const fbx = loader.parse(b64ToBuffer(ASSETS.fbx), '');

    // Apply PBR textures BEFORE computing bounding box
    applyPBRMaterials(fbx);

    // Compute bounding box to auto-scale & ground the model correctly
    const bbox = new THREE.Box3().setFromObject(fbx);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    console.log('FBX raw size:', size);

    // Target height ~1.6 world units for Snoopy
    const targetHeight = 1.6;
    const autoScale = targetHeight / size.y;
    fbx.scale.setScalar(autoScale);

    // After scaling, recompute bbox to get the ground offset
    const bbox2 = new THREE.Box3().setFromObject(fbx);
    const groundOffset = -bbox2.min.y; // lift so feet are at y=0

    // Replace placeholder player
    scene.remove(player);
    player = fbx;
    player.position.set(0, groundOffset, 2);
    scene.add(player);

    // Store ground offset for movement code
    player.userData.groundOffset = groundOffset;

    // Animation — FBX has "rig|Walk"
    mixer = new THREE.AnimationMixer(fbx);
    if (fbx.animations && fbx.animations.length > 0) {
      const walkClip = THREE.AnimationClip.findByName(fbx.animations, 'rig|Walk')
                    || fbx.animations[0];
      console.log('Using animation clip:', walkClip.name);
      actionWalk = mixer.clipAction(walkClip);
      actionWalk.setLoop(THREE.LoopRepeat);
      actionWalk.timeScale = 1.0;

      // Idle = same clip at very slow speed
      actionIdle = mixer.clipAction(walkClip);
      actionIdle.setLoop(THREE.LoopRepeat);
      actionIdle.timeScale = 0.08;

      currentAction = actionIdle;
      actionIdle.play();
    }

    modelLoaded = true;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    console.log('Snoopy loaded! Scale:', autoScale, 'GroundOffset:', groundOffset, 'Animations:', fbx.animations.map(a=>a.name));
  } catch(err) {
    console.error('FBX load error:', err);
    // Fallback: white box character
    scene.remove(player);
    const fallback = new THREE.Mesh(
      new THREE.BoxGeometry(0.6,1.2,0.4),
      new THREE.MeshLambertMaterial({color:0xffffff})
    );
    fallback.position.set(0,0.6,2);
    player = fallback;
    scene.add(player);
    modelLoaded = true;
    document.getElementById('loading').textContent = '⚠️ Used fallback model';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
  }
}

function switchAction(next) {
  if (currentAction === next) return;
  if (currentAction) currentAction.fadeOut(0.2);
  next.reset().fadeIn(0.2).play();
  currentAction = next;
}

