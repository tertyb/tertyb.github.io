// ── Day/Night Cycle ───────────────────────────────────────────────────────────
let dayTime = 0.32; // start mid-morning
const DAY_SPEED = 1 / 360; // full cycle in 6 real minutes

// [time 0-1, skyHex, fogHex, sunIntensity, ambIntensity, ambColorHex, hemiSkyHex]
const DAY_PHASES = [
  { t:0.00, sky:0x03060f, fog:0x03060f, sunI:0.0, ambI:0.08, ambC:0x101530, hemiS:0x101530 },
  { t:0.22, sky:0xff5520, fog:0xff7040, sunI:0.5, ambI:0.4,  ambC:0xff8040, hemiS:0xff6030 },
  { t:0.30, sky:0x87ceeb, fog:0xb8cfe8, sunI:3.0, ambI:1.2,  ambC:0xfff4e0, hemiS:0x87ceeb },
  { t:0.68, sky:0x87ceeb, fog:0xb8cfe8, sunI:3.0, ambI:1.2,  ambC:0xfff4e0, hemiS:0x87ceeb },
  { t:0.78, sky:0xff3a10, fog:0xff5530, sunI:0.4, ambI:0.35, ambC:0xff6030, hemiS:0xff4020 },
  { t:0.88, sky:0x05080f, fog:0x05080f, sunI:0.0, ambI:0.08, ambC:0x101530, hemiS:0x101530 },
  { t:1.00, sky:0x03060f, fog:0x03060f, sunI:0.0, ambI:0.08, ambC:0x101530, hemiS:0x101530 },
];

const _dc = new THREE.Color();
function lerpPhaseColor(a, b, f) { return _dc.set(a).lerp(new THREE.Color(b), f).getHex(); }

function samplePhase(dt) {
  let lo = DAY_PHASES[DAY_PHASES.length - 2];
  let hi = DAY_PHASES[DAY_PHASES.length - 1];
  for (let i = 0; i < DAY_PHASES.length - 1; i++) {
    if (dt >= DAY_PHASES[i].t && dt < DAY_PHASES[i+1].t) { lo = DAY_PHASES[i]; hi = DAY_PHASES[i+1]; break; }
  }
  const f = (dt - lo.t) / Math.max(0.001, hi.t - lo.t);
  return {
    sky:  lerpPhaseColor(lo.sky,  hi.sky,  f),
    fog:  lerpPhaseColor(lo.fog,  hi.fog,  f),
    sunI: lo.sunI + (hi.sunI - lo.sunI) * f,
    ambI: lo.ambI + (hi.ambI - lo.ambI) * f,
    ambC: lerpPhaseColor(lo.ambC, hi.ambC, f),
    hemiS:lerpPhaseColor(lo.hemiS,hi.hemiS,f),
  };
}

// Clock display
const clockEl = document.createElement('div');
clockEl.id = 'dayclock';
clockEl.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.82);border:2px solid #333;border-radius:12px;padding:3px 14px;font-size:13px;color:#333;z-index:10;pointer-events:none;font-family:monospace;box-shadow:2px 2px 0 #333;';
document.body.appendChild(clockEl);

function updateDayNight(dt) {
  dayTime = (dayTime + dt * DAY_SPEED) % 1.0;
  const v = samplePhase(dayTime);

  renderer.setClearColor(v.sky);
  scene.fog.color.set(v.sky);
  ambientLight.color.set(v.ambC);
  ambientLight.intensity = v.ambI;
  hemiLight.color.set(v.hemiS);
  sun.intensity = v.sunI;

  // Move sun/moon arc
  const angle = dayTime * Math.PI * 2 - Math.PI * 0.5;
  sun.position.set(Math.cos(angle) * 80, Math.sin(angle) * 80, 30);

  // Street lamps: on at night
  const isNight = dayTime < 0.25 || dayTime > 0.82;
  const lampIntensity = isNight ? 1.8 : 0;
  for (const l of lampLights) l.intensity = lampIntensity;

  // Clock HH:MM
  const hours = Math.floor(dayTime * 24);
  const minutes = Math.floor((dayTime * 24 * 60) % 60);
  const period = hours < 12 ? 'AM' : 'PM';
  const h12 = hours % 12 || 12;
  clockEl.textContent = `🕐 ${h12}:${String(minutes).padStart(2,'0')} ${period}`;
}
