// ── 3D Asset Loader ───────────────────────────────────────────────────────────
function loadWorldAssets() {
  const gltfLoader = new THREE.GLTFLoader();
  const fbxLoader  = new THREE.FBXLoader();
  const texLoader  = new THREE.TextureLoader();

  function placeFBX(b64data, texturePath, x, z, scale, rotY, colorFallback) {
    const ldr = new THREE.FBXLoader();
    if (texturePath) ldr.setResourcePath(texturePath);
    try {
      const fbx = ldr.parse(b64ToBuffer(b64data), texturePath || '');
      fbx.scale.setScalar(scale);
      fbx.position.set(x, 0, z);
      fbx.rotation.y = rotY;
      fbx.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true; c.receiveShadow = true;
          if (!texturePath) c.material = new THREE.MeshLambertMaterial({ color: colorFallback });
        }
      });
      scene.add(fbx);
    } catch(e) {
      // fallback box if parse fails
      const b = new THREE.Mesh(new THREE.BoxGeometry(8,6,8),
        new THREE.MeshLambertMaterial({ color: colorFallback }));
      b.position.set(x, 3, z); scene.add(b);
    }
  }

  // McDonald's restaurant (GLB — textures embedded)
  gltfLoader.load('assets/engadine_mcdonalds_restaurant_low_poly.glb', gltf => {
    const m = gltf.scene;
    m.scale.setScalar(0.012);
    m.position.set(55, 0, 0);
    m.rotation.y = -Math.PI / 2;
    m.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    scene.add(m);
    colliders.push({ x:55, z:0, radius:12 });
  }, undefined, () => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(14,6,14),
      new THREE.MeshLambertMaterial({ color:0xdd2222 }));
    b.position.set(55,3,0); scene.add(b);
    colliders.push({ x:55, z:0, radius:10 });
  });

  // Residential house (FBX)
  const houseTex = 'assets/house/textures/';
  const housePositions = [[30,-18,0.008,-0.4], [-30,15,0.008,0.8],
                           [18,-50,0.007,1.2],  [-45,-25,0.009,2.1]];
  housePositions.forEach(([x,z,sc,ry]) => {
    placeFBX(ASSETS.houseFbx, houseTex, x, z, sc, ry, 0xd4a06a);
    colliders.push({ x, z, radius: 6 });
  });

  // Office building (FBX)
  placeFBX(ASSETS.officeFbx, 'assets/office/textures/', -55, -10, 0.05, 0, 0xc0c8d4);
  colliders.push({ x:-55, z:-10, radius:10 });
  placeFBX(ASSETS.officeFbx, 'assets/office/textures/', 20,  65, 0.05, 1.57, 0xc0c8d4);
  colliders.push({ x:20, z:65, radius:10 });

  // Pizza restaurant (FBX — tiny model + texture)
  placeFBX(ASSETS.pizzaFbx,
           'assets/pizza/source/Textures/', -20, 55, 0.06, -0.5, 0xffcc88);
  colliders.push({ x:-20, z:55, radius:8 });

  // Paris restaurant (FBX)
  placeFBX(ASSETS.parisFbx,
           'assets/paris-restaurant/textures/', 0, -60, 0.018, 0, 0xf0e8d0);
  colliders.push({ x:0, z:-60, radius:14 });

  // Boring commercial office (FBX — base64 embedded)
  placeFBX(ASSETS.boringOfficeFbx, 'assets/boring-commercialoffice-two-story-building/textures/', 60, 40, 0.05, 0, 0xa0b8c8);
  colliders.push({ x:60, z:40, radius:10 });
  placeFBX(ASSETS.boringOfficeFbx, 'assets/boring-commercialoffice-two-story-building/textures/', -60, 40, 0.05, Math.PI, 0xa0b8c8);
  colliders.push({ x:-60, z:40, radius:10 });

  // Windsor House (GLB — loaded from file path, too large to embed)
  gltfLoader.load('assets/windsor-house-v2/source/WindsorHouseV2.glb', gltf => {
    const m = gltf.scene;
    m.scale.setScalar(0.015);
    m.position.set(40, 0, -55);
    m.rotation.y = Math.PI / 4;
    m.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
    scene.add(m);
    colliders.push({ x:40, z:-55, radius:12 });
  }, undefined, () => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(10,8,10),
      new THREE.MeshLambertMaterial({ color:0xe8d0b0 }));
    b.position.set(40,4,-55); scene.add(b);
    colliders.push({ x:40, z:-55, radius:10 });
  });

  // Chery Tiggo (FBX — loaded from file path, too large to embed)
  {
    const ldr = new THREE.FBXLoader();
    ldr.setResourcePath('assets/chery-tiggo-in-snow/textures/');
    ldr.load('assets/chery-tiggo-in-snow/source/1.fbx', fbx => {
      fbx.scale.setScalar(0.012);
      fbx.position.set(50, 0, 12);
      fbx.rotation.y = -0.6;
      fbx.traverse(c => { if (c.isMesh) { c.castShadow=true; c.receiveShadow=true; } });
      scene.add(fbx);
      colliders.push({ x:50, z:12, radius:4 });
    }, undefined, () => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(4,2,8),
        new THREE.MeshLambertMaterial({ color:0xcc2222 }));
      b.position.set(50,1,12); scene.add(b);
      colliders.push({ x:50, z:12, radius:4 });
    });
  }
}
loadWorldAssets();
