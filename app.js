/* ==========================================================
   Empieza la Fiesta - Motor Completo y Autónomo
   ========================================================== */

// --- 1. SINTETIZADOR DE AUDIO WEB BLINDADO ---
const SoundEngine = {
  ctx: null,
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    } catch (e) {}
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

// --- 2. BASE DE DATOS INTEGRADA ---
const DB = {
  sips: [
    "1 Trago", "2 Tragos", "¡Chupito!", "Manda 2 Tragos",
    "1 Trago", "2 Tragos", "Trago Doble", "Manda 1 Trago", "Manda Chupito"
  ],

  curses: [
    "Prohibido decir 'SÍ' o 'NO'. Quien lo diga, 1 trago.",
    "Compañeros de trago: Cada vez que beba una persona, su vecino de derecha bebe con él.",
    "Prohibido señalar con el dedo. Hay que señalar con el codo.",
    "Todos deben hablar con las manos detrás de la espalda.",
    "Hablad con acento extranjero hasta nuevo aviso.",
    "Prohibido mirar a nadie directamente a los ojos mientras habla.",
    "Prohibido decir nombres propios de personas del grupo.",
    "Quien beba debe brindar antes chocando los vasos en el aire.",
    "Prohibido tocar el teléfono móvil con la mano dominante.",
    "Cada vez que alguien se ría en voz alta debe dar un trago."
  ],

  surpriseOutcomes: [
    "¡Todos beben 1 trago por la salud del grupo!",
    "Elige a una persona para que se beba 2 tragos dobles.",
    "¡Te salvaste! Eres inmune a beber durante las próximas 2 rondas.",
    "¡Chupito general para todos los participantes!",
    "Beben todos los que lleven ropa de color oscuro.",
    "La persona con menos batería en el móvil se bebe 2 tragos.",
    "Beben todos los que tengan pareja en este momento.",
    "Elige a tu esclavo: beberá cada vez que tú bebas en las próximas 3 cartas.",
    "Quien lleve el calzado más sucio se bebe un trago.",
    "El último en tocarse la nariz bebe 2 tragos inmediatos."
  ],

  yoNunca: {
    light: [
      "Yo nunca me he quedado dormido en el autobús o tren y me he pasado de parada.",
      "Yo nunca he fingido estar enfermo para librarme de un plan que me daba pereza.",
      "Yo nunca he mirado el móvil ajeno por encima del hombro disimulando.",
      "Yo nunca he dicho 'ya salgo' cuando ni siquiera me había cambiado de ropa.",
      "Yo nunca he roto algo en una casa ajena y me he quedado callado.",
      "Yo nunca he tropezado en plena calle y me he puesto a correr disimulando.",
      "Yo nunca he olvidado el cumpleaños de un amigo cercano o familiar directo.",
      "Yo nunca he usado la ropa o colonia de otra persona sin pedirle permiso.",
      "Yo nunca he cantado con auriculares a todo volumen pensando que sonaba bien.",
      "Yo nunca he fingido que me gustaba un regalo que en el fondo me parecía horrible.",
      "Yo nunca me he reído a carcajadas en un momento completamente inapropiado o solemne.",
      "Yo nunca he dejado un mensaje en 'visto' durante varios días por pura pereza.",
      "Yo nunca he comido comida del suelo aplicando la regla de los cinco segundos.",
      "Yo nunca he fingido hablar por teléfono para evitar saludar a alguien en la calle.",
      "Yo nunca he stalkeado tanto a alguien que le di me gusta a una foto de hace años.",
      "Yo nunca he salido de casa con la ropa del revés o con una etiqueta colgando.",
      "Yo nunca he hecho una captura de pantalla y se la he enviado por error a esa misma persona.",
      "Yo nunca he tirado comida disimuladamente a una servilleta para no comérmela.",
      "Yo nunca he bailado delante del espejo creyendo que era una estrella de videoclip.",
      "Yo nunca he buscado mi propio nombre en Google para ver qué salía.",
      "Yo nunca he entrado al baño equivocado por despiste total.",
      "Yo nunca he fingido entender un chiste del que no me he enterado de nada.",
      "Yo nunca he intentado abrir la puerta de un coche que no era el mío pensando que sí.",
      "Yo nunca he saludado con la mano a un desconocido creyendo que era un amigo.",
      "Yo nunca he fingido saber de una película o tema del que no tenía ni idea.",
      "Yo nunca me he echado colonia de muestra en una tienda solo para no gastar de la mía.",
      "Yo nunca he devuelto una prenda de ropa usada con la etiqueta todavía puesta.",
      "Yo nunca he mentido sobre mi edad para entrar en algún sitio o en internet.",
      "Yo nunca he llorado viendo una película de dibujos animados.",
      "Yo nunca me he asustado con mi propio reflejo en un escaparate o cristal."
    ],
    fiesta: [
      "Yo nunca he perdido el móvil, las llaves o la cartera durante una noche de fiesta.",
      "Yo nunca he prometido 'no vuelvo a beber nunca más' y he bebido esa misma semana.",
      "Yo nunca he intentado colarme en una discoteca o zona VIP sin pagar entrada.",
      "Yo nunca he terminado de after en la casa o bajera de personas que acababa de conocer.",
      "Yo nunca he mandado un audio de fiesta del que me he arrepentido la mañana siguiente.",
      "Yo nunca he hecho la bomba de humo (irme de una fiesta sin despedirme de nadie).",
      "Yo nunca he tenido que cuidar toda la noche a un amigo que iba destruido.",
      "Yo nunca he perdido una chaqueta de fiesta y nunca más ha vuelto a aparecer.",
      "Yo nunca he mezclado tres o más bebidas alcohólicas diferentes en el mismo vaso.",
      "Yo nunca he besado a alguien en una fiesta y luego no me acordaba de su nombre.",
      "Yo nunca he subido un vídeo o historia a redes que borré al despertar de la vergüenza.",
      "Yo nunca me he gastado más de 50€ en una sola noche sin tener idea de en qué se fueron.",
      "Yo nunca he intentado ligar con el camarero/a para conseguir copas o chupitos gratis.",
      "Yo nunca me he quedado dormido en el suelo de un bar o en el baño de un local.",
      "Yo nunca he terminado desayunando churros o kebab sin haber dormido nada.",
      "Yo nunca he roto un vaso o botella en una discoteca y me he alejado disimulando.",
      "Yo nunca me he caído por culpa de llevar copas de más intentando hacer un baile.",
      "Yo nunca he pedido una ronda de chupitos y me he escaqueado a la hora de pagar.",
      "Yo nunca he bebido del vaso de otra persona sin saber qué demonios llevaba dentro.",
      "Yo nunca he acabado descalzo en una fiesta porque no aguantaba los zapatos."
    ],
    hot: [
      "Yo nunca he besado al ex o al crush de un amigo o amiga.",
      "Yo nunca he tenido un sueño subido de tono con alguien de esta misma sala.",
      "Yo nunca he enviado o recibido una foto sugerente sin ropa.",
      "Yo nunca he tenido una aventura con un compañero de clase o de trabajo.",
      "Yo nunca he practicado sexting en plena madrugada estando de fiesta.",
      "Yo nunca he sido infiel ni he ayudado a que otra persona lo fuera.",
      "Yo nunca me he liado con dos o más personas distintas en una misma noche.",
      "Yo nunca he tenido una cita tan mala que me inventé una emergencia para huir.",
      "Yo nunca he tenido un lío con alguien diez años mayor que yo.",
      "Yo nunca he buscado el perfil del ex de mi pareja o crush desde una cuenta falsa.",
      "Yo nunca me he liado con alguien única y exclusivamente por despecho.",
      "Yo nunca he mandado un mensaje picante a la persona equivocada por error.",
      "Yo nunca he fingido satisfacción solo para que el momento terminara antes.",
      "Yo nunca he probado nada con alguien de mi mismo sexo.",
      "Yo nunca he jugado a verdad o reto o a la botella con segundas intenciones claras.",
      "Yo nunca he tenido una fantasía íntima con el hermano o hermana de un amigo.",
      "Yo nunca he tenido un encuentro íntimo en un lugar público o al aire libre.",
      "Yo nunca me he liado con alguien de quien ahora me da total vergüenza admitir.",
      "Yo nunca he usado una aplicación de citas teniendo ya una pareja formal.",
      "Yo nunca he guardado fotos o vídeos íntimos en una carpeta secreta con contraseña."
    ]
  },

  probable: {
    light: [
      "sea la persona con más horas de pantalla y adicción al móvil del grupo?",
      "se gaste todo el sueldo nada más cobrar en caprichos completamente inútiles?",
      "llegue media hora tarde incluso a su propia boda o cumpleaños?",
      "se ría a carcajadas en un momento donde reine el silencio absoluto e incómodo?",
      "caiga en una estafa fácil de internet por confiado e inocente?",
      "se quede encerrado en un baño por no saber hacia dónde gira el pestillo?",
      "cante a gritos en la ducha creyendo que canta como los ángeles?",
      "cancele los planes un domingo por la tarde a última hora por pereza extrema?",
      "tenga más de 30 alarmas consecutivas programadas cada mañana?",
      "se ponga a hablar de su vida entera con desconocidos en la cola del súper?",
      "tropiece en una baldosa completamente lisa en mitad de la calle?",
      "se coma la comida ajena que estaba guardada con nombre en la nevera?",
      "deje en visto a todo el mundo durante tres días seguidos sin motivo?",
      "se compre ropa carísima que solo se va a poner una vez en la vida?",
      "llore viendo un vídeo emotivo de perritos o gatos en TikTok?"
    ],
    fiesta: [
      "pierda el móvil, las llaves o las gafas en la primera hora de pisar la fiesta?",
      "proponga ir de after a las seis de la mañana cuando todos están completamente muertos?",
      "se haga íntimo amigo del portero o del relaciones públicas en menos de 5 minutos?",
      "acabe durmiendo en un banco de la plaza o en una esquina sin enterarse de nada?",
      "desaparezca de la discoteca sin decir una sola palabra a nadie (bomba de humo)?",
      "se gaste medio sueldo invitando a rondas de chupitos a absolutos desconocidos?",
      "se ponga nostálgico y llore en el baño diciendo que sois sus mejores amigos?",
      "se tropiece intentando hacer un paso de baile que vio en un vídeo motivado?",
      "pierda la chaqueta o abrigo y le eche la culpa a otra persona del grupo?",
      "cante reguetón viejo o rock clásico a grito pelado dejándose la voz entera?"
    ],
    hot: [
      "acabe liándose con alguien en los primeros 20 minutos de pisar el local?",
      "le mande un 'te echo de menos' a su ex a las cuatro de la madrugada con copas encima?",
      "tenga una cuenta secreta en redes para cotillear los perfiles de todos sus ligues?",
      "se líe con el hermano/a o primo/a de un amigo si tuviera la ocasión perfecta?",
      "protagonice las historias de amor más telenoveleras, dramáticas y tóxicas?",
      "se vaya de la fiesta con alguien que acaba de conocer hace 10 minutos?",
      "acumule más mensajes y fotos picantes archivadas en carpetas secretas?",
      "proponga juegos de prendas, besos o retos atrevidos en cuanto hay confianza?",
      "se haya liado con alguien de quien ahora le dé auténtica vergüenza reconocer el nombre?",
      "tenga un fetiche o gusto inconfesable que jamás admitiría en público?"
    ]
  },

  prefieres: [
    ["Saber la fecha exacta de tu muerte", "Saber la causa exacta de tu muerte"],
    ["Tener acceso al historial de búsqueda de todos", "Que todos tengan acceso al tuyo"],
    ["Perder el móvil en un viaje al extranjero", "Perder todas las maletas y la ropa"],
    ["No volver a beber alcohol en fiestas jamás", "No volver a comer pizza ni hamburguesas"],
    ["Tener que decir en voz alta todo lo que piensas", "No poder hablar nunca más"],
    ["Poder teletransportarte a cualquier sitio", "Poder viajar en el tiempo al pasado"],
    ["Volver con tu peor ex", "Liártela con un completo desconocido ahora mismo"],
    ["Que tus padres lean todos tus chats de WhatsApp", "Que tu jefe vea tus fotos privadas"],
    ["Vivir sin música el resto de tu vida", "Vivir sin televisión ni series"],
    ["Tener resaca todos los fines de semana", "Tener que levantarte a las 5 AM todos los días"]
  ],

  cultura3s: [
    "3 marcas de cerveza", "3 capitales europeas", "3 excusas para no salir de fiesta", "3 canciones de reguetón míticas",
    "3 comidas sagradas para la resaca", "3 cosas que encuentras en un cuarto de baño", "3 nombres de profesores que tuviste", "3 marcas de coches alemanes",
    "3 animales que nadan en el mar", "3 cosas de color rojo brillante"
  ],

  verdades: [
    "¿Quién de esta mesa te parece la persona más atractiva físicamente?",
    "¿Cuál es el secreto más oscuro que jamás le has contado a tu familia?",
    "¿Alguna vez has tenido un sueño subido de tono con alguien de los aquí presentes?",
    "¿Qué es lo más vergonzoso que has hecho estando borracho de fiesta?",
    "¿Has mirado alguna vez las conversaciones del móvil de otra persona a escondidas?"
  ],

  retos: [
    "Haz 10 flexiones en el suelo ahora mismo o bebe 2 tragos dobles.",
    "Deja que la persona a tu derecha revise tus 5 fotos eliminadas recientemente.",
    "Enseña las 3 últimas fotos de tu galería sin rechistar a todo el grupo.",
    "Baila sin música durante 30 segundos con total seriedad delante de todos.",
    "Llama a un contacto y dile con voz seria que te casas la semana que viene."
  ],

  mimicaWords: [
    "Subir al Everest", "Resaca mortal", "Hacer la croqueta en el suelo", "Tirar la copa en la discoteca",
    "Robar un cono de obra", "Perder el móvil en el taxi", "Ligar en la barra de un bar", "Bailar Paquito el Chocolatero"
  ],

  bombTopics: [
    "Marcas de bebidas, licores o cervezas", "Excusas típicas para no salir de fiesta", "Ciudades del mundo que tengan playa",
    "Cosas que encuentras tiradas en el suelo de un bar", "Canciones míticas de fiesta que todos se saben"
  ]
};

// --- 3. ESTADO GLOBAL ---
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

// --- 4. REFERENCIAS DOM ---
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

// --- 5. DETENCIÓN DEL TEMPORIZADOR DE MÍMICA ---
function stopMimicaTimer() {
  if (mimicaTimer) {
    clearInterval(mimicaTimer);
    mimicaTimer = null;
  }
}

// --- 6. CAMBIO DE PANTALLAS ---
function switchScreen(id) {
  triggerHaptic();

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

// --- 7. DESLIZAMIENTO DE CARTAS (SWIPE) ---
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

// --- 8. EVENTOS ALEATORIOS ---
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

// --- 9. MOTOR DE CARTAS ---
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

// Mímica Exprés
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

// La Bomba
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

// --- 10. TEMAS Y PARTICIPANTES ---
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

// --- 11. NOVEDADES ---
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

// --- 12. PWA ---
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

// --- 13. INICIALIZACIÓN BLINDADA ---
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
