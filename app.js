/* ==========================================================
   LÓGICA DEL JUEGO - EMPIEZA LA FIESTA / #LEZADEFIESTA
   (Lee las frases y datos directamente de db.js)
   ========================================================== */

// --- 1. SINTETIZADOR DE AUDIO WEB ---
const SoundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },
  click() { this.playTone(600, 'sine', 0.04, 0.1); },
  swipe() { this.playTone(350, 'triangle', 0.1, 0.15); },
  tick() { this.playTone(900, 'square', 0.03, 0.08); },
  beep() { this.playTone(850, 'sine', 0.12, 0.25); },
  explosion() {
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);
      whiteNoise.connect(filter);
      filter.connect(this.ctx.destination);
      whiteNoise.start();
    } catch(e) {}
  },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.2), i * 90);
    });
  }
};

function triggerHaptic() {
  try {
    SoundEngine.click();
    if ('vibrate' in navigator) navigator.vibrate(30);
  } catch (e) {}
}

// --- 2. ESTADO GLOBAL ---
let currentScreen = 'screenHome';
let activeCardGame = 'yoNunca';
let currentLevel = 'fiesta';
let cardCounter = 0;

let players = JSON.parse(localStorage.getItem('fiesta_players')) || ['Alex', 'Laura', 'Dani'];
let savedTheme = localStorage.getItem('fiesta_theme') || 'purple';

let decks = {};
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCard(game, level) {
  const key = `${game}_${level}`;
  if (!decks[key] || decks[key].length === 0) {
    decks[key] = shuffle(DB[game][level]);
  }
  return decks[key].pop();
}

function getRandomPlayer() {
  if (players.length === 0) return "Alguien";
  return players[Math.floor(Math.random() * players.length)];
}

// --- 3. REFERENCIAS DOM ---
const splashScreen = document.getElementById('splash-screen');
const brandHomeBtn = document.getElementById('brandHomeBtn');
const playerBadgeCount = document.getElementById('playerBadgeCount');
const homePlayerCounter = document.getElementById('homePlayerCounter');
const btnInstallApp = document.getElementById('btnInstallApp');

const allScreens = document.querySelectorAll('.screen');
const mainGameCard = document.getElementById('mainGameCard');
const swipeContainer = document.getElementById('swipeContainer');
const cardCategoryBadge = document.getElementById('cardCategoryBadge');
const cardSipPill = document.getElementById('cardSipPill');
const cardPrefixText = document.getElementById('cardPrefixText');
const cardMainText = document.getElementById('cardMainText');
const btnNextCard = document.getElementById('btnNextCard');

const dilemmaOptA = document.getElementById('dilemmaOptA');
const dilemmaOptB = document.getElementById('dilemmaOptB');
const btnNextPrefieres = document.getElementById('btnNextPrefieres');

const culturaPlayer = document.getElementById('culturaPlayer');
const culturaPrompt = document.getElementById('culturaPrompt');
const culturaTimer = document.getElementById('culturaTimer');
const btnStartCultura = document.getElementById('btnStartCultura');
let culturaInterval = null;

const vrPlayerName = document.getElementById('vrPlayerName');
const vrResultText = document.getElementById('vrResultText');
const btnChooseTruth = document.getElementById('btnChooseTruth');
const btnChooseDare = document.getElementById('btnChooseDare');
const btnNextVR = document.getElementById('btnNextVR');

// DOM Mímica
const mimicaStepPass = document.getElementById('mimicaStepPass');
const mimicaStepRead = document.getElementById('mimicaStepRead');
const mimicaStepAct = document.getElementById('mimicaStepAct');
const mimicaActorName = document.getElementById('mimicaActorName');
const timerPassDisplay = document.getElementById('timerPassDisplay');
const btnActorReceived = document.getElementById('btnActorReceived');
const secretWordDisplay = document.getElementById('secretWordDisplay');
const timerReadDisplay = document.getElementById('timerReadDisplay');
const timerActDisplay = document.getElementById('timerActDisplay');
const btnPauseMimica = document.getElementById('btnPauseMimica');
const btnMimicaGuessed = document.getElementById('btnMimicaGuessed');
const btnNextMimicaRound = document.getElementById('btnNextMimicaRound');
let mimicaTimer = null;
let isMimicaPaused = false;
let currentActSeconds = 45;

const bombEmoji = document.getElementById('bombEmoji');
const bombSubject = document.getElementById('bombSubject');
const btnTriggerBomb = document.getElementById('btnTriggerBomb');
let bombTimer = null;

const surpriseModal = document.getElementById('surpriseModal');
const wheelDisc = document.getElementById('wheelDisc');
const surpriseResultText = document.getElementById('surpriseResultText');
const btnSpinSurpriseWheel = document.getElementById('btnSpinSurpriseWheel');
const btnCloseSurpriseModal = document.getElementById('btnCloseSurpriseModal');

const curseModal = document.getElementById('curseModal');
const curseDescText = document.getElementById('curseDescText');
const btnCloseCurseModal = document.getElementById('btnCloseCurseModal');

const newsModal = document.getElementById('newsModal');
const btnOpenNews = document.getElementById('btnOpenNews');
const btnCloseNewsX = document.getElementById('btnCloseNewsX');
const btnDismissNews = document.getElementById('btnDismissNews');

// --- 4. CONTROL DE TEMPORIZADOR DE MÍMICA ---
function stopMimicaTimer() {
  if (mimicaTimer) {
    clearInterval(mimicaTimer);
    mimicaTimer = null;
  }
}

// --- 5. CAMBIO DE PANTALLAS ---
function switchScreen(id) {
  triggerHaptic();

  // Si salimos de Mímica hacia otra pantalla, paramos el reloj al instante
  if (currentScreen === 'screenMimica' && id !== 'screenMimica') {
    stopMimicaTimer();
  }

  allScreens.forEach(s => s.classList.remove('active'));
  const targetElement = document.getElementById(id);
  if (targetElement) targetElement.classList.add('active');
  currentScreen = id;

  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.target === id) {
      if (btn.dataset.forcedMode && btn.dataset.forcedMode !== activeCardGame) return;
      btn.classList.add('active');
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateModeToggleButtons() {
  document.querySelectorAll('.btn-mode-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === activeCardGame);
  });
}

// --- 6. GESTOS DE DESLIZAMIENTO (SWIPE) ---
let startX = 0, currentX = 0, isDragging = false;

function initSwipe() {
  const onStart = (x) => {
    isDragging = true;
    startX = x;
    currentX = x;
    if (mainGameCard) mainGameCard.style.transition = 'none';
  };
  const onMove = (x) => {
    if (!isDragging || !mainGameCard) return;
    currentX = x;
    const diff = currentX - startX;
    const rotate = diff * 0.08;
    mainGameCard.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
    mainGameCard.style.opacity = `${Math.max(0.4, 1 - Math.abs(diff) / 350)}`;
  };
  const onEnd = () => {
    if (!isDragging || !mainGameCard) return;
    isDragging = false;
    const diff = currentX - startX;
    mainGameCard.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    if (Math.abs(diff) > 100) {
      SoundEngine.swipe();
      const throwOut = diff > 0 ? 500 : -500;
      mainGameCard.style.transform = `translateX(${throwOut}px) rotate(${throwOut * 0.05}deg)`;
      mainGameCard.style.opacity = '0';
      setTimeout(() => {
        nextCardAction();
        mainGameCard.style.transition = 'none';
        mainGameCard.style.transform = 'translateX(0) rotate(0deg)';
        mainGameCard.style.opacity = '1';
      }, 200);
    } else {
      mainGameCard.style.transform = 'translateX(0) rotate(0deg)';
      mainGameCard.style.opacity = '1';
    }
  };

  if (swipeContainer) {
    swipeContainer.addEventListener('touchstart', e => onStart(e.touches[0].clientX));
    swipeContainer.addEventListener('touchmove', e => onMove(e.touches[0].clientX));
    swipeContainer.addEventListener('touchend', onEnd);
    swipeContainer.addEventListener('mousedown', e => onStart(e.clientX));
    window.addEventListener('mousemove', e => { if (isDragging) onMove(e.clientX); });
    window.addEventListener('mouseup', onEnd);
  }
}

// --- 7. EVENTOS DE RULETA Y MALDICIONES ---
function checkRandomEvents() {
  cardCounter++;
  if (cardCounter % 8 === 0) {
    SoundEngine.fanfare();
    if (surpriseModal) {
      surpriseModal.style.display = 'flex';
      if (wheelDisc) wheelDisc.style.transform = 'rotate(0deg)';
      if (surpriseResultText) surpriseResultText.innerText = "¡Ha saltado la Ruleta Sorpresa! Pulsa para girar.";
      if (btnSpinSurpriseWheel) btnSpinSurpriseWheel.disabled = false;
    }
    return true;
  }
  if (cardCounter % 13 === 0) {
    SoundEngine.beep();
    if (curseModal && curseDescText) {
      curseDescText.innerText = DB.curses[Math.floor(Math.random() * DB.curses.length)];
      curseModal.style.display = 'flex';
    }
    return true;
  }
  return false;
}

if (btnSpinSurpriseWheel) {
  btnSpinSurpriseWheel.addEventListener('click', () => {
    SoundEngine.tick();
    btnSpinSurpriseWheel.disabled = true;
    const randomDeg = Math.floor(Math.random() * 360) + 1440;
    if (wheelDisc) wheelDisc.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
      SoundEngine.fanfare();
      const outcome = DB.surpriseOutcomes[Math.floor(Math.random() * DB.surpriseOutcomes.length)];
      if (surpriseResultText) surpriseResultText.innerText = outcome;
    }, 3500);
  });
}

if (btnCloseSurpriseModal) btnCloseSurpriseModal.addEventListener('click', () => { if (surpriseModal) surpriseModal.style.display = 'none'; });
if (btnCloseCurseModal) btnCloseCurseModal.addEventListener('click', () => { if (curseModal) curseModal.style.display = 'none'; });

// --- 8. CARTAS (YO NUNCA / PROBABLE / MIXTO) ---
function nextCardAction() {
  if (checkRandomEvents()) return;
  triggerHaptic();

  let currentGameToPull = activeCardGame;
  if (activeCardGame === 'mixto') {
    currentGameToPull = Math.random() < 0.5 ? 'yoNunca' : 'probable';
  }

  const phrase = getCard(currentGameToPull, currentLevel);
  const sip = DB.sips[Math.floor(Math.random() * DB.sips.length)];
  if (cardSipPill) cardSipPill.innerText = sip;

  if (currentGameToPull === 'yoNunca') {
    if (cardCategoryBadge) cardCategoryBadge.innerText = `YO NUNCA • ${currentLevel.toUpperCase()}`;
    if (cardPrefixText) cardPrefixText.innerText = '';
    if (cardMainText) cardMainText.innerText = phrase;
  } else {
    if (cardCategoryBadge) cardCategoryBadge.innerText = `PROBABLE • ${currentLevel.toUpperCase()}`;
    if (cardPrefixText) cardPrefixText.innerText = '¿Quién es más probable que...';
    if (cardMainText) cardMainText.innerText = phrase;
  }
}

if (btnNextCard) btnNextCard.addEventListener('click', nextCardAction);

// Modos desde inicio
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    const launch = card.dataset.launch;
    if (launch === 'yoNunca' || launch === 'probable' || launch === 'mixto') {
      activeCardGame = launch;
      updateModeToggleButtons();
      nextCardAction();
      switchScreen('screenCards');
    } else if (launch === 'prefieres') {
      nextPrefieresAction();
      switchScreen('screenPrefieres');
    } else if (launch === 'cultura3s') {
      nextCulturaAction();
      switchScreen('screenCultura');
    } else if (launch === 'verdadReto') {
      nextVRAction();
      switchScreen('screenVerdadReto');
    } else if (launch === 'mimica') {
      startMimicaRound();
      switchScreen('screenMimica');
    } else if (launch === 'bomb') {
      switchScreen('screenBomb');
    }
  });
});

document.querySelectorAll('.btn-mode-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    triggerHaptic();
    activeCardGame = btn.dataset.mode;
    updateModeToggleButtons();
    nextCardAction();
  });
});

// ¿Qué Prefieres?
function nextPrefieresAction() {
  triggerHaptic();
  const pair = DB.prefieres[Math.floor(Math.random() * DB.prefieres.length)];
  if (dilemmaOptA && dilemmaOptB) {
    dilemmaOptA.innerText = pair[0];
    dilemmaOptB.innerText = pair[1];
  }
}
if (btnNextPrefieres) btnNextPrefieres.addEventListener('click', nextPrefieresAction);

// Cultura 3s
function nextCulturaAction() {
  triggerHaptic();
  if (culturaInterval) clearInterval(culturaInterval);
  if (culturaPlayer) culturaPlayer.innerText = getRandomPlayer();
  if (culturaPrompt) culturaPrompt.innerText = DB.cultura3s[Math.floor(Math.random() * DB.cultura3s.length)];
  if (culturaTimer) culturaTimer.innerText = "3";
  if (btnStartCultura) {
    btnStartCultura.disabled = false;
    btnStartCultura.style.opacity = '1';
  }
}

if (btnStartCultura) {
  btnStartCultura.addEventListener('click', () => {
    btnStartCultura.disabled = true;
    btnStartCultura.style.opacity = '0.5';
    let timeLeft = 3;
    if (culturaTimer) culturaTimer.innerText = timeLeft;
    SoundEngine.tick();

    culturaInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        if (culturaTimer) culturaTimer.innerText = timeLeft;
        SoundEngine.tick();
      } else {
        clearInterval(culturaInterval);
        if (culturaTimer) culturaTimer.innerText = "¡TIEMPO!";
        SoundEngine.explosion();
      }
    }, 1000);
  });
}

// Verdad o Reto
function nextVRAction() {
  triggerHaptic();
  if (vrPlayerName) vrPlayerName.innerText = getRandomPlayer();
  if (vrResultText) vrResultText.innerText = "Elige si quieres confesar una verdad o hacer un reto.";
}

if (btnChooseTruth) {
  btnChooseTruth.addEventListener('click', () => {
    SoundEngine.beep();
    if (vrResultText) vrResultText.innerText = `😇 VERDAD: ${DB.verdades[Math.floor(Math.random() * DB.verdades.length)]}`;
  });
}
if (btnChooseDare) {
  btnChooseDare.addEventListener('click', () => {
    SoundEngine.beep();
    if (vrResultText) vrResultText.innerText = `😈 RETO: ${DB.retos[Math.floor(Math.random() * DB.retos.length)]}`;
  });
}
if (btnNextVR) btnNextVR.addEventListener('click', nextVRAction);

// --- 9. MÍMICA EXPRÉS (TEMPORIZADORES BLINDADOS) ---
function startMimicaRound() {
  triggerHaptic();
  stopMimicaTimer();
  isMimicaPaused = false;
  if (btnPauseMimica) {
    btnPauseMimica.innerText = "⏸️ Pausar";
    btnPauseMimica.classList.remove('paused');
  }

  if (mimicaStepPass) mimicaStepPass.style.display = 'flex';
  if (mimicaStepRead) mimicaStepRead.style.display = 'none';
  if (mimicaStepAct) mimicaStepAct.style.display = 'none';

  if (mimicaActorName) mimicaActorName.innerText = getRandomPlayer();
  if (secretWordDisplay) secretWordDisplay.innerText = DB.mimicaWords[Math.floor(Math.random() * DB.mimicaWords.length)];

  let passSeconds = 10;
  if (timerPassDisplay) timerPassDisplay.innerText = `${passSeconds}s`;

  mimicaTimer = setInterval(() => {
    if (currentScreen !== 'screenMimica') {
      stopMimicaTimer();
      return;
    }

    passSeconds--;
    if (passSeconds > 0) {
      if (timerPassDisplay) timerPassDisplay.innerText = `${passSeconds}s`;
      SoundEngine.tick();
    } else {
      stopMimicaTimer();
      startReadPhase();
    }
  }, 1000);
}

if (btnActorReceived) {
  btnActorReceived.addEventListener('click', () => {
    stopMimicaTimer();
    startReadPhase();
  });
}

function startReadPhase() {
  stopMimicaTimer();
  SoundEngine.beep();
  if (mimicaStepPass) mimicaStepPass.style.display = 'none';
  if (mimicaStepRead) mimicaStepRead.style.display = 'flex';
  if (mimicaStepAct) mimicaStepAct.style.display = 'none';

  let readSeconds = 12;
  if (timerReadDisplay) timerReadDisplay.innerText = `${readSeconds}s`;

  mimicaTimer = setInterval(() => {
    if (currentScreen !== 'screenMimica') {
      stopMimicaTimer();
      return;
    }

    readSeconds--;
    if (readSeconds > 0) {
      if (timerReadDisplay) timerReadDisplay.innerText = `${readSeconds}s`;
      SoundEngine.tick();
    } else {
      stopMimicaTimer();
      startActPhase();
    }
  }, 1000);
}

function startActPhase() {
  stopMimicaTimer();
  SoundEngine.fanfare();
  if (mimicaStepPass) mimicaStepPass.style.display = 'none';
  if (mimicaStepRead) mimicaStepRead.style.display = 'none';
  if (mimicaStepAct) mimicaStepAct.style.display = 'flex';

  currentActSeconds = 45;
  isMimicaPaused = false;
  if (timerActDisplay) timerActDisplay.innerText = currentActSeconds;

  runActInterval();
}

function runActInterval() {
  stopMimicaTimer();
  mimicaTimer = setInterval(() => {
    if (currentScreen !== 'screenMimica') {
      stopMimicaTimer();
      return;
    }

    if (!isMimicaPaused) {
      currentActSeconds--;
      if (currentActSeconds > 0) {
        if (timerActDisplay) timerActDisplay.innerText = currentActSeconds;
        if (currentActSeconds <= 5) SoundEngine.tick();
      } else {
        stopMimicaTimer();
        if (timerActDisplay) timerActDisplay.innerText = "¡TIEMPO!";
        SoundEngine.explosion();
      }
    }
  }, 1000);
}

if (btnPauseMimica) {
  btnPauseMimica.addEventListener('click', () => {
    triggerHaptic();
    isMimicaPaused = !isMimicaPaused;
    if (isMimicaPaused) {
      btnPauseMimica.innerText = "▶️ Reanudar";
      btnPauseMimica.classList.add('paused');
    } else {
      btnPauseMimica.innerText = "⏸️ Pausar";
      btnPauseMimica.classList.remove('paused');
    }
  });
}

if (btnMimicaGuessed) {
  btnMimicaGuessed.addEventListener('click', () => {
    stopMimicaTimer();
    SoundEngine.fanfare();
    if (timerActDisplay) timerActDisplay.innerText = "¡ACERTADO! 🎉";
  });
}

if (btnNextMimicaRound) btnNextMimicaRound.addEventListener('click', startMimicaRound);

// --- 10. LA BOMBA ---
if (btnTriggerBomb) {
  btnTriggerBomb.addEventListener('click', () => {
    triggerHaptic();
    if (bombTimer) clearTimeout(bombTimer);

    if (bombEmoji) {
      bombEmoji.innerText = '💣';
      bombEmoji.classList.add('shaking');
    }
    if (bombSubject) bombSubject.innerText = DB.bombTopics[Math.floor(Math.random() * DB.bombTopics.length)];
    btnTriggerBomb.disabled = true;
    btnTriggerBomb.style.opacity = '0.5';

    const duration = Math.floor(Math.random() * 14000) + 10000;
    bombTimer = setTimeout(() => {
      if (bombEmoji) {
        bombEmoji.classList.remove('shaking');
        bombEmoji.innerText = '💥';
      }
      if (bombSubject) bombSubject.innerText = "¡BOOOOM! Bebe quien tenga el móvil.";
      SoundEngine.explosion();
      btnTriggerBomb.disabled = false;
      btnTriggerBomb.style.opacity = '1';
      btnTriggerBomb.innerText = 'Activar Otra Bomba';
    }, duration);
  });
}

// Niveles
document.querySelectorAll('.btn-level').forEach(btn => {
  btn.addEventListener('click', () => {
    triggerHaptic();
    document.querySelectorAll('.btn-level').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    nextCardAction();
  });
});

// Barra inferior
document.querySelectorAll('.nav-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (btn.dataset.forcedMode) {
      activeCardGame = btn.dataset.forcedMode;
      updateModeToggleButtons();
      nextCardAction();
    }
    switchScreen(target);
  });
});

if (brandHomeBtn) brandHomeBtn.addEventListener('click', () => switchScreen('screenHome'));

// --- 11. TEMAS Y PARTICIPANTES ---
function applyTheme(name) {
  try {
    document.body.setAttribute('data-theme', name);
    localStorage.setItem('fiesta_theme', name);
    document.querySelectorAll('.theme-dot').forEach(d => {
      d.classList.toggle('active', d.dataset.color === name);
    });
  } catch (e) {}
}

document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    triggerHaptic();
    applyTheme(dot.dataset.color);
  });
});

function syncPlayers() {
  try {
    localStorage.setItem('fiesta_players', JSON.stringify(players));
    if (playerBadgeCount) playerBadgeCount.innerText = players.length;
    if (homePlayerCounter) homePlayerCounter.innerText = `${players.length} personas`;

    const containerHome = document.getElementById('homeChipsContainer');
    const containerModal = document.getElementById('modalChipsList');
    if (containerHome) containerHome.innerHTML = '';
    if (containerModal) containerModal.innerHTML = '';

    players.forEach((p, idx) => {
      const chip = document.createElement('span');
      chip.className = 'player-chip';
      chip.innerHTML = `<span>${p}</span><button onclick="removePlayer(${idx})">✕</button>`;
      if (containerHome) containerHome.appendChild(chip);
      if (containerModal) containerModal.appendChild(chip.cloneNode(true));
    });
  } catch (e) {}
}

window.removePlayer = (idx) => {
  triggerHaptic();
  players.splice(idx, 1);
  syncPlayers();
};

function addPlayerFrom(input) {
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    players.push(val);
    input.value = '';
    syncPlayers();
    triggerHaptic();
  }
}

const formHome = document.getElementById('formHomePlayer');
if (formHome) {
  formHome.addEventListener('submit', e => {
    e.preventDefault();
    addPlayerFrom(document.getElementById('inputHomePlayer'));
  });
}

const formModal = document.getElementById('formModalPlayer');
if (formModal) {
  formModal.addEventListener('submit', e => {
    e.preventDefault();
    addPlayerFrom(document.getElementById('inputModalPlayer'));
  });
}

const btnOpenM = document.getElementById('btnOpenModal');
if (btnOpenM) {
  btnOpenM.addEventListener('click', () => {
    triggerHaptic();
    const modal = document.getElementById('playersModal');
    if (modal) modal.style.display = 'flex';
  });
}

const btnCloseM = document.getElementById('btnCloseModal');
if (btnCloseM) {
  btnCloseM.addEventListener('click', () => {
    const modal = document.getElementById('playersModal');
    if (modal) modal.style.display = 'none';
  });
}

// --- 12. NOVEDADES / ACTUALIZACIONES ---
function showNewsModal() {
  if (newsModal) newsModal.style.display = 'flex';
}

if (btnOpenNews) {
  btnOpenNews.addEventListener('click', () => {
    triggerHaptic();
    showNewsModal();
  });
}

if (btnCloseNewsX) {
  btnCloseNewsX.addEventListener('click', () => {
    if (newsModal) newsModal.style.display = 'none';
  });
}

if (btnDismissNews) {
  btnDismissNews.addEventListener('click', () => {
    triggerHaptic();
    if (newsModal) newsModal.style.display = 'none';
  });
}

// --- 13. BOTÓN NATIVO PWA & OFFLINE ---
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstallApp) btnInstallApp.style.display = 'inline-block';
});

if (btnInstallApp) {
  btnInstallApp.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      btnInstallApp.style.display = 'none';
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  if (btnInstallApp) btnInstallApp.style.display = 'none';
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// --- 14. INICIALIZACIÓN BLINDADA ---
window.addEventListener('DOMContentLoaded', () => {
  try {
    applyTheme(savedTheme);
    syncPlayers();
    initSwipe();
  } catch (err) {
    console.error("Error durante el arranque:", err);
  }

  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
        showNewsModal();
      }, 400);
    } else {
      showNewsModal();
    }
  }, 1200);
});
