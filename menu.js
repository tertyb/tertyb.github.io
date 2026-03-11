// ── Password screen ────────────────────────────────────────────────────────────
(function buildPasswordScreen() {
  const ps = document.createElement('div');
  ps.id = 'password-screen';
  ps.style.cssText = [
    'position:fixed','inset:0','z-index:2000',
    'background:linear-gradient(135deg,#060618 0%,#0e0e35 55%,#060c22 100%)',
    'display:flex','flex-direction:column','align-items:center','justify-content:center',
    'font-family:Arial,sans-serif',
  ].join(';');

  ps.innerHTML = `
    <div style="font-size:72px;margin-bottom:16px;">🐾</div>
    <h1 style="color:#fff;font-size:36px;margin:0 0 8px;
      text-shadow:0 0 30px rgba(100,180,255,0.8);">עולם סנופי</h1>
    <p style="color:#88aadd;font-size:16px;margin:0 0 36px;letter-spacing:1px;">הכנס סיסמה כדי להיכנס</p>
    <input id="pw-input" type="password" maxlength="10"
      style="font-size:28px;letter-spacing:8px;text-align:center;
             width:180px;padding:12px 16px;border-radius:14px;
             border:2px solid rgba(255,255,255,0.2);
             background:rgba(255,255,255,0.08);color:#fff;
             outline:none;font-family:Arial,sans-serif;"
      placeholder="••••" />
    <div id="pw-error" style="color:#ff6b6b;font-size:15px;margin-top:14px;
      height:20px;font-family:Arial,sans-serif;"></div>
    <button id="pw-btn"
      style="margin-top:22px;padding:13px 44px;font-size:20px;font-weight:bold;
             background:linear-gradient(135deg,#22cc66,#119944);color:#fff;
             border:none;border-radius:50px;cursor:pointer;
             box-shadow:0 4px 24px rgba(34,204,102,0.5);font-family:Arial,sans-serif;">
      כניסה ←
    </button>
  `;
  document.body.appendChild(ps);

  function tryPassword() {
    const val = document.getElementById('pw-input').value;
    if (val === '1503') {
      ps.style.transition = 'opacity 0.6s';
      ps.style.opacity = '0';
      setTimeout(() => { ps.style.display = 'none'; }, 620);
    } else {
      const err = document.getElementById('pw-error');
      err.textContent = '❌ סיסמה שגויה, נסה שוב';
      document.getElementById('pw-input').value = '';
      setTimeout(() => { err.textContent = ''; }, 2000);
    }
  }

  document.getElementById('pw-btn').addEventListener('click', tryPassword);
  document.getElementById('pw-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryPassword();
  });
})();

// ── Main Menu ──────────────────────────────────────────────────────────────────

// Inject CSS
const _mStyle = document.createElement('style');
_mStyle.textContent = `
  #main-menu { position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#060618 0%,#0e0e35 55%,#060c22 100%);
    font-family:Arial,sans-serif;direction:rtl;transition:opacity 0.7s ease; }
  .menu-paw { position:absolute;pointer-events:none;user-select:none; }
  #menu-card { position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center; }
  #menu-title { color:#fff;font-size:58px;margin:0 0 4px;
    text-shadow:0 0 40px rgba(100,180,255,0.9),0 2px 0 rgba(0,0,0,0.5); }
  #menu-sub { color:#88aadd;font-size:20px;margin:0 0 54px;letter-spacing:1px; }
  .mbtn {
    padding:17px 0;width:280px;font-size:24px;font-weight:bold;font-family:Arial,sans-serif;
    border:none;border-radius:50px;cursor:pointer;color:#fff;margin-bottom:14px;
    transition:transform 0.15s,box-shadow 0.15s,background 0.2s;direction:rtl;
  }
  .mbtn:hover { transform:scale(1.07); }
  .mbtn:active { transform:scale(0.96); }
  .mbtn-play {
    background:linear-gradient(135deg,#22cc66,#119944);
    box-shadow:0 4px 24px rgba(34,204,102,0.55);font-size:28px;
  }
  .mbtn-play:hover { box-shadow:0 6px 32px rgba(34,204,102,0.75); }
  .mbtn-sec {
    background:linear-gradient(135deg,#2a3a6a,#1a2244);
    box-shadow:0 4px 16px rgba(0,0,50,0.5);font-size:20px;padding:13px 0;
  }
  .mbtn-sec:hover { box-shadow:0 6px 22px rgba(68,136,255,0.35); }
  .mbtn-back {
    background:linear-gradient(135deg,#2a3a6a,#1a2244);min-width:200px;
    font-size:18px;padding:12px 0;box-shadow:0 4px 14px rgba(0,0,0,0.4);
  }
  .mpanel {
    display:none;position:fixed;inset:0;background:rgba(4,4,22,0.97);
    align-items:center;justify-content:center;flex-direction:column;
    z-index:1100;font-family:Arial,sans-serif;direction:rtl;
  }
  @keyframes pawBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.1)} }
  #menu-paw-big { font-size:88px;animation:pawBounce 2.2s ease-in-out infinite;margin-bottom:12px; }
`;
document.head.appendChild(_mStyle);

// ── Build menu DOM ─────────────────────────────────────────────────────────────
const _menuEl = document.createElement('div');
_menuEl.id = 'main-menu';

// Scattered background paw prints
for (let i = 0; i < 22; i++) {
  const p = document.createElement('span');
  p.className = 'menu-paw';
  p.textContent = '🐾';
  p.style.cssText =
    `font-size:${18+Math.random()*44}px;` +
    `left:${Math.random()*98}%;top:${Math.random()*98}%;` +
    `opacity:${0.04+Math.random()*0.08};` +
    `transform:rotate(${Math.random()*360}deg)`;
  _menuEl.appendChild(p);
}

const _card = document.createElement('div');
_card.id = 'menu-card';
_card.innerHTML = `
  <div id="menu-paw-big">🐾</div>
  <h1 id="menu-title">עולם סנופי</h1>
  <p id="menu-sub">הרפתקה תלת-מימדית</p>
  <button class="mbtn mbtn-play" id="mbtn-play">🎮 שחק</button>
  <button class="mbtn mbtn-sec" id="mbtn-settings">📖 הוראות</button>
  <button class="mbtn mbtn-sec" id="mbtn-letter">🐾 סנופי</button>
`;
_menuEl.appendChild(_card);
document.body.appendChild(_menuEl);

// ── Settings panel ─────────────────────────────────────────────────────────────
const _panelSettings = document.createElement('div');
_panelSettings.className = 'mpanel';
_panelSettings.id = 'mpanel-settings';
_panelSettings.innerHTML = `
  <div style="font-size:56px;margin-bottom:10px;">🐾</div>
  <h2 style="color:#ffd700;font-size:32px;margin:0 0 20px">הוראות</h2>
  <div style="background:#fffde7;color:#3a2800;
              padding:28px 36px;border-radius:14px;
              width:min(500px,90vw);max-height:60vh;overflow-y:auto;
              font-size:clamp(15px,2.3vw,19px);line-height:2.2;
              text-align:right;direction:rtl;
              box-shadow:0 10px 50px rgba(0,0,0,0.7);font-family:Georgia,serif">
    <b style="font-size:clamp(17px,2.6vw,22px);color:#6b3a00">סנופי יקרה, ברוכה הבאה למשחק שלך 🌸</b><br><br>
    המטרה שלך היא למצוא את כל הבשמים במשחק.<br><br>
    חוץ מזה, המטרה השנייה היא להנות. 😊<br><br>
    <hr style="border:none;border-top:1px solid #d4b896;margin:10px 0">
    <br>
    בהצלחה, אני אוהב אותך. 💚
  </div>
  <button class="mbtn mbtn-back" id="mbtn-settings-back" style="margin-top:22px">← חזור</button>
`;
document.body.appendChild(_panelSettings);

// ── Letter panel ───────────────────────────────────────────────────────────────
const _panelLetter = document.createElement('div');
_panelLetter.className = 'mpanel';
_panelLetter.id = 'mpanel-letter';
_panelLetter.innerHTML = `
  <div style="font-size:64px;margin-bottom:8px;">🐾</div>
  <h2 style="color:#ffd700;font-size:32px;margin:0 0 16px">סנופי שלי</h2>
  <div style="background:#fffde7;color:#3a2800;
              padding:28px 32px;border-radius:14px;
              width:min(520px,90vw);max-height:60vh;overflow-y:auto;
              font-size:clamp(14px,2.2vw,18px);line-height:2.0;
              text-align:right;direction:rtl;
              box-shadow:0 10px 50px rgba(0,0,0,0.7);font-family:Georgia,serif;position:relative">
    <div style="position:absolute;top:10px;left:14px;font-size:30px;opacity:0.1;user-select:none">🐾🐾</div>
    <b style="font-size:clamp(16px,2.5vw,22px);color:#6b3a00">סנופי שלי,</b><br><br>
    אני אוהב אותך הכי בעולם. את הדבר הכי חשוב בחיים שלי<br><br>
    חשבתי לא מעט מה להכין לך לשנה שלנו<br>
    והחלטתי להכין לך משהו שאני טוב בו —<br>
    אז הנה משחק עם כל הדברים שאת אוהבת. 🎮<br><br>
    יש מעל ל־20 דברים שאת אוהבת<br>
    חבואים במשחק,<br>
    מקווה שתצליחי למצוא את כולם<br>
    ובעיקר תהני. 🐾<br><br>
    אוהב אותך עד השמיים<br>
    ומאחל לנו עוד המון שנים ביחד.<br><br>
    <b style="font-size:clamp(15px,2.3vw,20px);color:#6b3a00">אני אוהב אותך.</b><br><br>
    <span style="color:#aa6600;font-size:clamp(13px,2vw,17px)">— סנופ 💚</span>
  </div>
  <button class="mbtn mbtn-back" id="mbtn-letter-back" style="margin-top:22px">← חזור</button>
`;
document.body.appendChild(_panelLetter);

// ── Background Music ───────────────────────────────────────────────────────────
const _bgMusic = new Audio('backgroundmusicforvideos-kids-game-gaming-background-music-297733.mp3');
_bgMusic.loop = true;
_bgMusic.volume = 0.45;

// Mute toggle button
const _muteBtn = document.createElement('button');
_muteBtn.id = 'mute-btn';
_muteBtn.textContent = '🔊';
_muteBtn.style.cssText = [
  'position:fixed','bottom:14px','right:14px','z-index:50',
  'background:rgba(0,0,0,0.65)','color:#fff','font-size:20px',
  'border:1px solid rgba(255,255,255,0.3)','border-radius:50%',
  'width:40px','height:40px','cursor:pointer','display:none',
  'font-family:Arial,sans-serif','line-height:1','padding:0',
].join(';');
_muteBtn.addEventListener('click', () => {
  if (_bgMusic.paused) {
    _bgMusic.play().catch(() => {});
    _muteBtn.textContent = '🔊';
  } else {
    _bgMusic.pause();
    _muteBtn.textContent = '🔇';
  }
});
document.body.appendChild(_muteBtn);

// ── Button logic ───────────────────────────────────────────────────────────────
document.getElementById('mbtn-play').addEventListener('click', () => {
  _bgMusic.play().catch(() => {});
  _muteBtn.style.display = 'block';
  _menuEl.style.opacity = '0';
  setTimeout(() => {
    _menuEl.style.display = 'none';
    loadSnoopy();
    animate();
  }, 680);
});

document.getElementById('mbtn-settings').addEventListener('click', () => {
  _panelSettings.style.display = 'flex';
});
document.getElementById('mbtn-settings-back').addEventListener('click', () => {
  _panelSettings.style.display = 'none';
});

document.getElementById('mbtn-letter').addEventListener('click', () => {
  _panelLetter.style.display = 'flex';
});
document.getElementById('mbtn-letter-back').addEventListener('click', () => {
  _panelLetter.style.display = 'none';
});

// ── In-game back-to-menu button ─────────────────────────────────────────────────
const _backToMenuBtn = document.createElement('button');
_backToMenuBtn.textContent = '🏠 תפריט';
_backToMenuBtn.style.cssText = [
  'position:fixed','top:60px','right:14px','z-index:40',
  'background:rgba(0,0,0,0.65)','color:#fff','font-size:14px','font-weight:bold',
  'padding:7px 16px','border-radius:20px','border:1px solid rgba(255,255,255,0.25)',
  'cursor:pointer','display:none','font-family:Arial,sans-serif',
  'box-shadow:0 2px 8px rgba(0,0,0,0.4)',
].join(';');
_backToMenuBtn.addEventListener('click', () => {
  document.getElementById('hud').style.display = 'none';
  _backToMenuBtn.style.display = 'none';
  _menuEl.style.display = 'flex';
  _menuEl.style.opacity = '1';
});
document.body.appendChild(_backToMenuBtn);

// Show back button once game starts
document.getElementById('mbtn-play').addEventListener('click', () => {
  setTimeout(() => { _backToMenuBtn.style.display = 'block'; }, 800);
}, { once: true });
