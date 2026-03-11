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
  <button class="mbtn mbtn-sec" id="mbtn-settings">⚙️ הגדרות</button>
  <button class="mbtn mbtn-sec" id="mbtn-letter">✉️ מכתב לסנופי</button>
`;
_menuEl.appendChild(_card);
document.body.appendChild(_menuEl);

// ── Settings panel ─────────────────────────────────────────────────────────────
const _panelSettings = document.createElement('div');
_panelSettings.className = 'mpanel';
_panelSettings.id = 'mpanel-settings';
_panelSettings.innerHTML = `
  <h2 style="color:#fff;font-size:38px;margin:0 0 28px">⚙️ הגדרות</h2>
  <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
              padding:32px 48px;border-radius:20px;color:#cce;font-size:17px;
              line-height:2.3;text-align:right;min-width:360px;max-width:500px">
    <span style="color:#88bbff;font-size:19px;font-weight:bold">בקרות:</span><br>
    <b>WASD / חצים</b> — תנועה<br>
    <b>Shift</b> — ריצה<br>
    <b>Space</b> — קפיצה / עלייה במטוס<br>
    <b>E</b> — אינטראקציה / כניסה לרכב<br>
    <b>F</b> — ירי (מטוס) / מכה עם שמפו<br>
    <b>עכבר</b> — סיבוב מצלמה<br>
    <hr style="border-color:rgba(255,255,255,0.1);margin:14px 0">
    <span style="color:#88bbff;font-size:19px;font-weight:bold">על המשחק:</span><br>
    גרסה 1.0 &nbsp;|&nbsp; עולם סנופי 🐾
  </div>
  <button class="mbtn mbtn-back" id="mbtn-settings-back" style="margin-top:30px">← חזור</button>
`;
document.body.appendChild(_panelSettings);

// ── Letter panel ───────────────────────────────────────────────────────────────
const _panelLetter = document.createElement('div');
_panelLetter.className = 'mpanel';
_panelLetter.id = 'mpanel-letter';
_panelLetter.innerHTML = `
  <h2 style="color:#ffd700;font-size:38px;margin:0 0 22px">✉️ מכתב לסנופי</h2>
  <div style="background:#fffde7;color:#3a2800;padding:40px 50px;border-radius:6px;
              max-width:500px;font-size:18px;line-height:2;text-align:right;direction:rtl;
              box-shadow:0 10px 50px rgba(0,0,0,0.7);font-family:Georgia,serif;position:relative">
    <div style="position:absolute;top:14px;left:18px;font-size:36px;opacity:0.12;user-select:none">🐾🐾</div>
    <b style="font-size:22px;color:#6b3a00">סנופי היקר,</b><br><br>
    אתה הכלב הכי מיוחד שיש בכל העולם.<br>
    בכל יום אתה יוצא להרפתקאות חדשות —<br>
    טס בשמיים, נוהג בצ'רי, מדבר עם חברים,<br>
    קונה בסופר-פארם, ואוסף עצמות זהובות. 🦴<br><br>
    אנחנו אוהבים אותך, סנופי.<br>
    תמשיך לחייך, לרוץ, ולחיות כל רגע.<br><br>
    <span style="color:#aa6600;font-size:16px">בהרבה אהבה,</span><br>
    <b style="font-size:19px">כל מי שמשחק בעולם שלך 💚</b>
  </div>
  <button class="mbtn mbtn-back" id="mbtn-letter-back" style="margin-top:30px">← חזור</button>
`;
document.body.appendChild(_panelLetter);

// ── Button logic ───────────────────────────────────────────────────────────────
document.getElementById('mbtn-play').addEventListener('click', () => {
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
