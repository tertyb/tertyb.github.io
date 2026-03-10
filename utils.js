function b64ToBuffer(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function b64ToDataURL(b64, mime) {
  return `data:${mime};base64,${b64}`;
}

function loadTexture(b64, colorSpace) {
  const url = b64ToDataURL(b64, 'image/png');
  const tex = new THREE.TextureLoader().load(url);
  if (colorSpace === 'srgb') tex.encoding = THREE.sRGBEncoding;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

