/* ==========================================================
   Empieza la Fiesta - Motor Completo y Autónomo v3.5
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

// --- 2. BASE DE DATOS COMPLETA INTEGRADA ---
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
      "Yo nunca me he asustado con mi propio reflejo en un escaparate o cristal.",
      "Yo nunca he mandado un audio de más de cinco minutos que parecía un podcast.",
      "Yo nunca he dejado la cuchara dentro del microondas por despiste.",
      "Yo nunca he fingido que se cortaba la llamada para colgarle a alguien pesado.",
      "Yo nunca he intentado arreglar un aparato electrónico dándole golpes.",
      "Yo nunca he buscado síntomas en Google y he acabado pensando que me moría.",
      "Yo nunca he cantado una canción en inglés inventándome la letra por completo.",
      "Yo nunca he dicho 'te escucho' cuando no estaba prestando la más mínima atención.",
      "Yo nunca he borrado una foto o comentario en redes porque tenía cero likes.",
      "Yo nunca he fingido tener prisa para cortar una conversación por la calle.",
      "Yo nunca me he comprado algo por puro impulso y jamás lo he llegado a estrenar.",
      "Yo nunca he probado la comida de una mascota por curiosidad.",
      "Yo nunca he culpado a otra persona de un ruido o gas mío.",
      "Yo nunca he dejado una serie a medias en el penúltimo capítulo por pura pereza.",
      "Yo nunca he buscado las gafas de sol o el móvil teniéndolo en la mano o en la cabeza.",
      "Yo nunca me he puesto a limpiar mi habitación solo para no ponerme a estudiar.",
      "Yo nunca he fingido ser alérgico a un alimento solo porque no me gustaba.",
      "Yo nunca he mirado el menú de un restaurante antes de ir para decidir qué pedir.",
      "Yo nunca he tenido que pedir dinero prestado porque me quedé sin nada en la cuenta.",
      "Yo nunca me he llevado los botes de champú y gel de un hotel a casa.",
      "Yo nunca he intentado hacer un truco de magia y he quedado en absoluto ridículo.",
      "Yo nunca me he quedado encerrado en una habitación o balcón sin poder salir.",
      "Yo nunca he escondido comida en mi cuarto para que nadie más se la comiera.",
      "Yo nunca he fingido no ver una notificación para responder doce horas más tarde.",
      "Yo nunca he copiado en un examen con chuleta en la muñeca o en el estuche.",
      "Yo nunca he puesto una excusa familiar falsa para no salir de casa un domingo.",
      "Yo nunca he vuelto a regalar algo que me regalaron a mí.",
      "Yo nunca he entrado a una tienda, me he probado cinco cosas y no he comprado nada.",
      "Yo nunca he buscado cómo se escribe una palabra básica por dudar de su ortografía.",
      "Yo nunca me he quedado mirando fijamente a alguien sin darme cuenta en el metro.",
      "Yo nunca he tenido una discusión imaginaria en la ducha y la he ganado con honores.",
      "Yo nunca he usado calcetines desparejados esperando que nadie se diera cuenta.",
      "Yo nunca he tenido una pesadilla tan real que me desperté enfadado con alguien.",
      "Yo nunca he mentido en mi currículum sobre mi nivel real de inglés o informática.",
      "Yo nunca he puesto el modo avión para que dejaran de llegarme mensajes molestos.",
      "Yo nunca he fingido tener pareja para quitarme a una persona pesada de encima.",
      "Yo nunca me he quemado la lengua por no esperar a que se enfriara la comida.",
      "Yo nunca he metido comida o bebida a escondidas en una sala de cine.",
      "Yo nunca he fingido saber bailar salsa, bachata o reguetón y he hecho el ridículo.",
      "Yo nunca me he cortado el pelo yo mismo en casa con un resultado desastroso.",
      "Yo nunca le he pedido perdón a un maniquí tras chocarme con él sin mirar.",
      "Yo nunca he dicho 'qué tiempo loco hace' en un ascensor por romper el silencio.",
      "Yo nunca he mirado el precio de un regalo que me hicieron para ver cuánto costó.",
      "Yo nunca he tenido una playlist secreta con canciones que me daría vergüenza admitir.",
      "Yo nunca he fingido que se me caía el boli para mirar el examen de al lado.",
      "Yo nunca he intentado mover objetos con la mente creyendo que tenía poderes.",
      "Yo nunca me he equivocado de persona al dar un abrazo o saludo por la espalda.",
      "Yo nunca he fingido estar dormido en el coche para no tener que bajar las maletas.",
      "Yo nunca he abierto la nevera diez veces seguidas esperando que apareciera comida nueva.",
      "Yo nunca he fingido entender cómo funciona la bolsa o las criptomonedas.",
      "Yo nunca me he quedado atrapado en una prenda de ropa en un probador.",
      "Yo nunca he tenido una conversación entera de media hora con mi perro o gato.",
      "Yo nunca he probado la comida de otra persona disimuladamente mientras miraba a otro lado.",
      "Yo nunca he dicho que ya había visto una película clásica sin tener idea de qué iba.",
      "Yo nunca me he tropezado en unas escaleras mecánicas o en un bordillo plano.",
      "Yo nunca he fingido dolor de cabeza para marcharme antes de una reunión o cena.",
      "Yo nunca he dejado la ropa limpia en la silla durante dos semanas enteras.",
      "Yo nunca he intentado cantar en falsete y se me ha roto la voz por completo.",
      "Yo nunca he pensado que un producto era gratis solo porque no tenía puesta la etiqueta.",
      "Yo nunca le he dicho al peluquero que me gustaba el corte cuando lo estaba odiando.",
      "Yo nunca he mandado un sticker o emoji sin querer que cambió el sentido de la frase.",
      "Yo nunca me he despertado sin recordar en qué día de la semana vivía.",
      "Yo nunca he mirado por la mirilla de la puerta para evitar cruzarme con un vecino.",
      "Yo nunca he llevado dos zapatillas de diferente modelo puestas a la calle.",
      "Yo nunca he fingido estar trabajando cuando solo miraba las musarañas en la pantalla.",
      "Yo nunca he intentado pagar con una tarjeta caducada o sin saldo y he pasado vergüenza.",
      "Yo nunca me he caído de la cama intentando alcanzar el cargador del móvil.",
      "Yo nunca he dicho que llegaba en 5 minutos sabiendo que tardaría mínimo media hora.",
      "Yo nunca he puesto una alarma con una canción que ahora aborrezco de por vida.",
      "Yo nunca me he atragantado con mi propia saliva estando completamente quieto.",
      "Yo nunca he jugado a piedra, papel o tijera para tomar una decisión importante de mi vida.",
      "Yo nunca he intentado empujar una puerta que decía claramente 'tirar'.",
      "Yo nunca he fingido leer un mensaje importante para no hablar con alguien en el ascensor.",
      "Yo nunca he intentado hacer fuego con dos palos creyéndome un superviviente.",
      "Yo nunca he guardado una caja vacía de un producto durante años 'por si acaso'.",
      "Yo nunca he mirado debajo de la cama antes de dormir por si había alguien.",
      "Yo nunca he cerrado de golpe la puerta del armario porque la ropa no cabía.",
      "Yo nunca he dicho 'a la próxima invito yo' y me he hecho el despistado.",
      "Yo nunca he fingido saber la pronunciación de un plato en un restaurante extranjero.",
      "Yo nunca he intentado hacer rebotar una piedra en el agua y se ha hundido al instante.",
      "Yo nunca he metido el pie en un charco pensando que no cubría nada y me he empapado.",
      "Yo nunca he intentado adivinar el código de desbloqueo del móvil de otra persona.",
      "Yo nunca he fingido que me caía bien el perro de un amigo cuando quería morderme.",
      "Yo nunca he guardado un secreto durante años y se me ha escapado de la forma más tonta.",
      "Yo nunca he intentado silbar con dos dedos y solo he escupido saliva.",
      "Yo nunca he borrado un mensaje de WhatsApp antes de que lo leyeran por arrepentimiento.",
      "Yo nunca he fingido estar borracho con cerveza sin alcohol por pura sugestión.",
      "Yo nunca he puesto una película solo para quedarme dormido en los primeros 10 minutos.",
      "Yo nunca he intentado hacer una pirueta en la piscina y he caído de planchazo.",
      "Yo nunca he dicho que no me gustaba el dulce y me he comido media tableta de chocolate a oscuras.",
      "Yo nunca he intentado hablar con voz de robot delante de un ventilador encendido.",
      "Yo nunca me he tragado un mosquito mientras iba en bicicleta o corriendo.",
      "Yo nunca he fingido que conocía a un grupo de música para no parecer anticuado.",
      "Yo nunca he tenido que pedir ayuda para abrir un tarro de conservas duro.",
      "Yo nunca he mirado el saldo de mi cuenta y he cerrado la app del susto inmediatamente.",
      "Yo nunca he dicho 'yo de pequeño era rubio' enseñando una foto donde no se veía nada.",
      "Yo nunca he intentado tocarme la punta de la nariz con la lengua sin conseguirlo.",
      "Yo nunca he intentado arreglar la antena o el cable dándole golpecitos.",
      "Yo nunca he tenido que buscar tutoriales en YouTube para anudarme una corbata.",
      "Yo nunca he fingido saber catar un vino moviendo la copa y oliéndolo con cara seria.",
      "Yo nunca he mandado un correo electrónico sin el archivo adjunto que decía llevar.",
      "Yo nunca he intentado hacer pompas con chicle y se me ha pegado en toda la nariz.",
      "Yo nunca he intentado saltar a la comba de adulto y casi me rompo los dientes.",
      "Yo nunca he buscado mi casa en Google Street View para ver si salía en la foto.",
      "Yo nunca he fingido que me gustaba el café solo por dármelas de maduro.",
      "Yo nunca he tirado de una cuerda pensando que abría una persiana y la he arrancado.",
      "Yo nunca me he quedado pegado a un chicle ajeno en el asiento del transporte.",
      "Yo nunca he fingido no escuchar mi nombre para no tener que levantarme del sofá.",
      "Yo nunca he intentado hacer un batido casero sin poner la tapa de la batidora.",
      "Yo nunca he pensado que las islas Canarias estaban geográficamente al lado de Baleares.",
      "Yo nunca he tenido un apodo ridículo en el colegio que todavía me da vergüenza recordar.",
      "Yo nunca he intentado imitar la firma de mis padres para autorizar una nota escolar.",
      "Yo nunca me he puesto a cantar villancicos fuera de la época de Navidad.",
      "Yo nunca he intentado hacer equilibrio sobre una pierna con los ojos cerrados y me he caído.",
      "Yo nunca he dicho que iba a ponerme a dieta estricta el lunes y he comido pizza el martes.",
      "Yo nunca he olvidado el pin de mi propia tarjeta SIM al encender el teléfono.",
      "Yo nunca he intentado encender la luz de una habitación cuando ya se había ido la luz general.",
      "Yo nunca he confundido la sal con el azúcar al preparar algo de comer.",
      "Yo nunca he fingido ser aficionado de un equipo de fútbol solo por llevar la contraria.",
      "Yo nunca he intentado quitar una mancha frotando y la he hecho diez veces más grande.",
      "Yo nunca he dejado la plancha enchufada con la duda carcomiéndome todo el día.",
      "Yo nunca he intentado hacer la croqueta sobre la hierba y me he clavado una ortiga.",
      "Yo nunca he dicho 'yo controlo' justo antes de cometer una torpeza monumental.",
      "Yo nunca he intentado doblar una cuchara como Uri Geller pensando que era mago.",
      "Yo nunca he fingido que un bostezo era un estiramiento para disimular el aburrimiento.",
      "Yo nunca me he quedado dormido en la playa y me he despertado quemado por un solo lado.",
      "Yo nunca he intentado pelar una manzana de una sola tira y se me ha roto a los dos centímetros.",
      "Yo nunca he fingido saber jugar al ajedrez y me han hecho jaque mate en cuatro turnos.",
      "Yo nunca he intentado aprender un idioma con una app y lo he abandonado al cuarto día.",
      "Yo nunca he intentado hacer un castillo de naipes y se ha caído al poner la tercera carta.",
      "Yo nunca he fingido estar concentrado en un libro cuando en realidad estaba mirando a alguien.",
      "Yo nunca he confundido a dos personas que no se parecían en absolutamente nada.",
      "Yo nunca he intentado hacer una foto panorámica y ha salido una persona con tres cabezas.",
      "Yo nunca he guardado un ticket de compra creyendo que me iba a desgravar impuestos.",
      "Yo nunca he intentado enfriar una bebida en el congelador y la he dejado olvidada hasta reventar.",
      "Yo nunca he dicho que sabía montar en patinete eléctrico y casi me estampo en la primera curva.",
      "Yo nunca he intentado abrir un paquete de galletas y han salido volando todas por el salón.",
      "Yo nunca he tenido que mirar mis manos para recordar cuál era la izquierda y cuál la derecha.",
      "Yo nunca he intentado cantar ópera en falsete en el coche creyendo que nadie me veía.",
      "Yo nunca me he asustado con la sombra de mi propio abrigo colgado de una percha.",
      "Yo nunca he intentado adivinar el final de una película y he fallado estrepitosamente.",
      "Yo nunca he fingido tener conocimientos de astronomía señalando una estrella inventada.",
      "Yo nunca he intentado hacer pan casero y me ha salido un ladrillo incomible.",
      "Yo nunca he dicho 'no me duele' mientras por dentro estaba llorando del dolor.",
      "Yo nunca me he equivocado de número al marcar y me he quedado hablando por timidez.",
      "Yo nunca he intentado hacer pompas de jabón gigantes y se me han reventado en la cara.",
      "Yo nunca he intentado quitar una etiqueta de un precio y he roto todo el cartón del regalo.",
      "Yo nunca he fingido ser un experto catador de quesos cuando solo sabía si picaba o no.",
      "Yo nunca he intentado arreglar una cremallera atascada con jabón y he manchado toda la tela.",
      "Yo nunca he tenido una pesadilla donde se me caían los dientes y me desperté comprobándolo.",
      "Yo nunca he intentado hacer un salto de longitud casero y me he resbalado de espaldas.",
      "Yo nunca he fingido que se me había olvidado la cartera para que pagara otro la cuenta.",
      "Yo nunca he intentado hacer malabares con tres naranjas y las he destrozado todas.",
      "Yo nunca he dicho 'yo a esa persona la conozco de algo' y era un famoso de la tele.",
      "Yo nunca he intentado hacer masa de pizza y se me ha quedado pegada al techo o a las manos.",
      "Yo nunca me he quedado mirando una lavadora funcionando como si fuera una película.",
      "Yo nunca he intentado hacer un barquito de papel y se ha hundido al tocar el agua.",
      "Yo nunca he fingido entender el plano de un metro o ciudad en un viaje turístico.",
      "Yo nunca he intentado hacer flexiones con palmada y me he golpeado la barbilla.",
      "Yo nunca he dicho 'este año leo 20 libros' y no he pasado de la página 15 del primero.",
      "Yo nunca me he probado una gorra en una tienda y me he dado cuenta de que me quedaba enana.",
      "Yo nunca he intentado hacer sombras chinescas con las manos y solo me salía un perro amorfo.",
      "Yo nunca he intentado colar una canasta con una bola de papel y he roto un vaso.",
      "Yo nunca he dicho 'yo tengo un sexto sentido' y me he equivocado en todas las predicciones.",
      "Yo nunca he intentado hacer yoga viendo un vídeo y me ha dado un tirón en la espalda.",
      "Yo nunca he intentado abrir una botella de refresco agitada y me he duchado entero.",
      "Yo nunca he fingido que me encantaba la comida picante con lágrimas cayéndome por las mejillas.",
      "Yo nunca he intentado hacer rebotar una pelota en la pared y me ha dado de lleno en la cara.",
      "Yo nunca he dicho 'no me mires que me río' y he soltado la carcajada al primer segundo.",
      "Yo nunca he intentado hacerme el dormido cuando entraban en la habitación para que me dejaran en paz.",
      "Yo nunca he intentado aprender a tocar la flauta dulce sin desafinar todas las notas.",
      "Yo nunca he fingido saber qué significaba una palabra culta en una conversación seria.",
      "Yo nunca he intentado saltar un charco y he caído de lleno con los dos pies dentro.",
      "Yo nunca he intentado silenciar el micro en una videollamada y he dejado el audio abierto.",
      "Yo nunca he dicho 'este juego es facilísimo' y he quedado el último en la primera ronda.",
      "Yo nunca me he quedado atrapado en un torniquete del metro por pasar antes de tiempo.",
      "Yo nunca he intentado hacer un nudo marinero y he hecho una maraña que tuve que cortar.",
      "Yo nunca he intentado adivinar el peso de alguien y he dicho una cifra que ofendió a todos.",
      "Yo nunca he fingido que entendía de arte moderno mirando un cuadro en blanco.",
      "Yo nunca he intentado hacer un truco con una moneda y se me ha caído por una alcantarilla.",
      "Yo nunca he dicho 'yo no tengo manías' teniendo 40 manías absurdas que todos conocen.",
      "Yo nunca he intentado correr en una cinta de gimnasio a tope y casi salgo volando.",
      "Yo nunca me he equivocado de pedal al arrancar un coche o una moto.",
      "Yo nunca he intentado hacer un batido saludable y ha terminado sabiendo a barro puro.",
      "Yo nunca he fingido saber usar palillos chinos pinchando la comida disimuladamente.",
      "Yo nunca he intentado hacer un silbido estridente para llamar un taxi y no ha sonado nada.",
      "Yo nunca he dicho 'a mí el frío no me afecta' temblando de pies a cabeza con tres abrigos.",
      "Yo nunca me he quedado encerrado en una tienda porque cerraron la persiana sin mirar.",
      "Yo nunca he intentado pintar una pared de mi casa y ha quedado a parches desastrosos.",
      "Yo nunca he fingido que conocía una calle en mi propia ciudad para no admitir que estaba perdido.",
      "Yo nunca he intentado hacer una voltereta en el césped y me he clavado una rama en las costillas.",
      "Yo nunca he dicho 'yo nunca haría eso' y lo he acabado haciendo al cabo de un mes.",
      "Yo nunca he intentado hacer una foto sin flash de noche y solo se veía una mancha negra.",
      "Yo nunca he intentado arreglar un grifo goteando y he provocado una inundación.",
      "Yo nunca he dicho que me gustaba una serie solo porque estaba de moda en Twitter.",
      "Yo nunca he intentado hacerme un peinado moderno con gomina y parecía que llevaba un casco.",
      "Yo nunca he intentado hacer una tortilla francesa y se ha convertido en huevos revueltos.",
      "Yo nunca me he tropezado subiendo unas escaleras mecánicas completamente quieto.",
      "Yo nunca he intentado adivinar la canción con las primeras notas y era otra totalmente distinta.",
      "Yo nunca he fingido que no me importaba perder en un videojuego cuando estaba que rabiaba.",
      "Yo nunca he intentado hacer una llamada en conferencia y he colgado a todos los participantes.",
      "Yo nunca he dicho 'yo de mayor voy a ser millonario' cuando era niño y ahora estoy contando monedas.",
      "Yo nunca me he quedado mirando fijamente a un punto fijo hasta que alguien me preguntó si estaba vivo.",
      "Yo nunca he intentado abrir una puerta automática empujando antes de que el sensor me viera.",
      "Yo nunca he intentado hacer un dibujo hiperrealista y ha parecido un garabato de primaria.",
      "Yo nunca he dicho 'yo tengo muy buen oído' y he desafinado como una campana rota.",
      "Yo nunca me he comido el último trozo de pizza y he echado la culpa a mi hermano o amigo.",
      "Yo nunca he intentado hacer malabares con dos mandarinas y las he aplastado en el suelo.",
      "Yo nunca he fingido saber de política internacional en una sobremesa familiar.",
      "Yo nunca he intentado saltar a la pata coja durante un minuto y me ha dado un calambre.",
      "Yo nunca he dicho 'esta canción es mía' cuando sonaba el tono de llamada genérico de otro.",
      "Yo nunca he intentado hacer un bizcocho sin levadura creyendo que subiría igual.",
      "Yo nunca me he quedado atrapado en una camiseta al intentar quitármela sin desabrochar.",
      "Yo nunca he intentado imitar el acento gallego o andaluz y he dado absoluta vergüenza ajena.",
      "Yo nunca he dicho 'yo nunca bebo café por la tarde' y me he tomado dos tazas seguidas.",
      "Yo nunca he intentado adivinar el truco de un mago callejero y he hecho el ridículo delante de todos.",
      "Yo nunca he fingido estar enterado de una noticia de última hora para no parecer desinformado.",
      "Yo nunca he intentado hacer una torre con fichas de dominó y la he tirado con el codo.",
      "Yo nunca he dicho 'yo tengo un método infalible para ganar' y he perdido en dos minutos.",
      "Yo nunca me he puesto a buscar las llaves de casa teniéndolas metidas en el bolsillo de atrás.",
      "Yo nunca he intentado pelar una naranja con cuchara y he terminado salpicándome el ojo.",
      "Yo nunca he fingido acordarme del nombre de alguien a quien me presentaron hace 10 segundos.",
      "Yo nunca he intentado hacer flexiones en una pared y casi me caigo de morros.",
      "Yo nunca he dicho 'yo me oriento de maravilla' y he terminado caminando en sentido opuesto durante horas.",
      "Yo nunca he intentado limpiar la pantalla del móvil con la manga y la he dejado más grasienta.",
      "Yo nunca me he asustado con una prenda colgada en el perchero en la penumbra de mi cuarto.",
      "Yo nunca he intentado enfriar la comida soplando tan fuerte que tiré todo el caldo fuera.",
      "Yo nunca he fingido estar mirando la hora en el reloj cuando en verdad no tenía ni pila.",
      "Yo nunca he intentado hacer un hoyo en la arena de la playa tan profundo que casi me caigo dentro.",
      "Yo nunca he dicho 'esta película no da miedo' y luego he dormido con la luz del pasillo encendida."
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
      "Yo nunca he acabado descalzo en una fiesta porque no aguantaba los zapatos.",
      "Yo nunca he vomitado en la calle o en un portal durante una noche de fiesta.",
      "Yo nunca he convencido a alguien sobrio para que me llevara a casa en coche.",
      "Yo nunca he entrado en un local que juré que jamás pisaría en mi vida.",
      "Yo nunca me he creído barman y he preparado una mezcla infernal en una previa.",
      "Yo nunca he intentado entrar a una fiesta diciendo que era primo del DJ o del dueño.",
      "Yo nunca he cantado a gritos abrazado a desconocidos en mitad de la noche.",
      "Yo nunca he tenido que pedir ropa prestada porque la mía estaba destrozada.",
      "Yo nunca he perdido las gafas o las lentillas en mitad de una pista de baile.",
      "Yo nunca he acabado durmiendo con la ropa de fiesta y los zapatos puestos.",
      "Yo nunca he tenido que buscar mi coche al día siguiente porque no recordaba dónde aparqué.",
      "Yo nunca me he equivocado de casa o de portal al volver borracho de madrugada.",
      "Yo nunca he escondido una botella en la calle o en un arbusto para la previa.",
      "Yo nunca he hecho un 'sinpa' en un bar o fiesta de pueblo por despiste o picardía.",
      "Yo nunca he vuelto a casa caminando más de 5 kilómetros porque no había taxis.",
      "Yo nunca me he puesto a llorar en el baño de una discoteca diciendo que quería a todos.",
      "Yo nunca he tirado una copa entera encima de otra persona en una pista de baile.",
      "Yo nunca he mandado un mensaje a mi jefe o profesor un sábado a las 5 de la mañana.",
      "Yo nunca he intentado ligar usando una mentira absurda sobre mi profesión o riqueza.",
      "Yo nunca me he comido la comida de la nevera de un amigo sin pedirle permiso de madrugada.",
      "Yo nunca he llevado gafas de sol de fiesta dentro de una discoteca oscura.",
      "Yo nunca he subido al escenario o tarima de un local sin permiso del de seguridad.",
      "Yo nunca he tenido una discusión acalorada sobre un tema ridículo con un desconocido en la barra.",
      "Yo nunca he salido de fiesta sin un duro en la cartera esperando que me invitaran.",
      "Yo nunca me he despertado en una ciudad o pueblo que no era el mío.",
      "Yo nunca he hecho el trenecito o la conga en una boda o discoteca motivado de más.",
      "Yo nunca he intentado robar una señal de tráfico, valla o cartel durante las fiestas.",
      "Yo nunca he llamado por teléfono a un amigo diez veces seguidas a las 4 de la mañana.",
      "Yo nunca me he bebido el alcohol que sobró de los vasos al día siguiente por la mañana.",
      "Yo nunca he acabado en urgencias o con un vendaje por culpa de una tontería de fiesta.",
      "Yo nunca he dejado a mi cuadrilla tirada para irme detrás de un ligue de fiesta.",
      "Yo nunca he hecho chupitos con licores caseros raros de graduación altísima.",
      "Yo nunca me he reído tanto de fiesta que me he meado literalmente encima.",
      "Yo nunca he intentado saltar una valla de fiesta y me he quedado enganchado del pantalón.",
      "Yo nunca he fingido ser extranjero en un bar para vacilar a la gente de la barra.",
      "Yo nunca he salido de fiesta un día antes de un examen final o entrevista de trabajo.",
      "Yo nunca he perdido el monedero con todo mi dinero en los primeros diez minutos de salir.",
      "Yo nunca me he bebido un chupito con tabasco o ingredientes incomibles por una apuesta.",
      "Yo nunca he tenido que salir escoltado o acompañado fuera de un bar por el portero.",
      "Yo nunca he prometido invitar a una ronda entera y luego me ha temblado la mano.",
      "Yo nunca he fingido estar más borracho de lo que estaba para llamar la atención.",
      "Yo nunca he intentado hacer malabares con botellas llenas y las he reventado.",
      "Yo nunca he acabado de fiesta un martes o miércoles diciendo que solo salía a tomar una.",
      "Yo nunca he compartido vaso con más de cinco personas en una misma ronda.",
      "Yo nunca me he quedado atrapado en el pestillo de un baño químico o portátil.",
      "Yo nunca he hecho un brindis tan motivado que rompí la copa contra la de otro.",
      "Yo nunca he perdido las zapatillas o una sandalia en un barrizal de fiesta de pueblo.",
      "Yo nunca he salido a bailar al centro de la pista cuando no había absolutamente nadie bailando.",
      "Yo nunca he hecho que echaran a un amigo de un bar por reírme de sus tonterías.",
      "Yo nunca me he bebido un cubata que llevaba más de tres horas apoyado en una columna.",
      "Yo nunca he intentado subirme a hombros de un amigo y nos hemos caído los dos.",
      "Yo nunca he dejado las llaves de casa dentro y he tenido que despertar a toda la familia.",
      "Yo nunca he dicho 'la última y nos vamos' y me he quedado cuatro horas más.",
      "Yo nunca he pedido una canción al DJ veinte veces hasta que me mandó a paseo.",
      "Yo nunca me he despertado con moretones en el cuerpo sin tener idea de dónde salieron.",
      "Yo nunca he intentado regatear el precio de una copa al camarero como si fuera un bazar.",
      "Yo nunca he acabado en una charanga o banda de pueblo tocando un instrumento sin saber.",
      "Yo nunca he grabado un vídeo vergonzoso de un amigo y amenazado con subirlo si no me invitaba.",
      "Yo nunca he bailado la macarena o Paquito el Chocolatero dándolo absolutamente todo.",
      "Yo nunca me he ido a casa sin pagar mi parte del bote común de la previa.",
      "Yo nunca he perdido el DNI la misma semana que tenía que renovarlo.",
      "Yo nunca me he tomado un chupito que ardía en llamas y casi me quemo las cejas.",
      "Yo nunca he intentado subir una historia en mejores amigos y la puse en público por error.",
      "Yo nunca he salido de fiesta con resaca del día anterior para curarla con más alcohol.",
      "Yo nunca he tenido que dormir en el suelo o en una esterilla porque no cabía en la cama.",
      "Yo nunca he salido con calcetines blancos y han vuelto a casa negros del barro.",
      "Yo nunca he intentado tirarme a una piscina o fuente pública en plena noche de fiesta.",
      "Yo nunca he fingido estar totalmente sobrio delante de la policía o guardias de seguridad.",
      "Yo nunca he gritado '¡esa es mi canción!' cuando empezó a sonar la peor canción del año.",
      "Yo nunca he acabado en una peña o bajera que olía a humedad y vino añejo.",
      "Yo nunca me he tomado un chupito de golpe y se me ha salido por la nariz del ardor.",
      "Yo nunca he escondido un cubata bajo la chaqueta para sacarlo de un bar a otro.",
      "Yo nunca he dejado el abrigo en el suelo de un rincón para ahorrarme el guardarropa.",
      "Yo nunca he vuelto a casa con el sol completamente fuera y la gente yendo a comprar el pan.",
      "Yo nunca he bailado pegado a un altavoz gigante hasta quedarme sordo dos días enteros.",
      "Yo nunca he convencido a media fiesta para cantar a capela una canción mítica.",
      "Yo nunca he tenido que pedirle perdón al camarero por romper algo en la barra.",
      "Yo nunca he entrado en un local gratis solo por conocer a la persona de la puerta.",
      "Yo nunca he acabado comiendo pizza fría a las seis de la mañana sentado en un bordillo.",
      "Yo nunca he dicho que no me gustaba el reguetón y he perreado hasta el suelo de fiesta.",
      "Yo nunca he sobrevivido a una noche de fiesta gracias a beber agua a litros antes de dormir.",
      "Yo nunca he intentado beber cerveza boca abajo haciendo el pino.",
      "Yo nunca he perdido un zapato en una discoteca y he seguido bailando con uno solo.",
      "Yo nunca me he comido un paquete entero de patatas rancias en una previa sin rechistar.",
      "Yo nunca he intentado abrir una botella de cerveza con los dientes por dármelas de chulo.",
      "Yo nunca he acabado en el coche de un desconocido porque me prometió llevarme a una fiesta mejor.",
      "Yo nunca he tenido que pedirle al portero que me dejara entrar solo para buscar a mi amigo borracho.",
      "Yo nunca he hecho una videollamada grupal a las 4 de la mañana despertando a medio mundo.",
      "Yo nunca he intentado pagar con monedas de céntimos una copa entera en la barra.",
      "Yo nunca me he quedado dormido en una terraza de bar con la copa en la mano.",
      "Yo nunca he subido a la barra de un bar a pedir una copa porque nadie me atendía.",
      "Yo nunca he perdido el ticket del guardarropa y he tenido que esperar al cierre para recuperar mi abrigo.",
      "Yo nunca he terminado cantando canciones de Disney abrazado a gente que no conocía en un pub.",
      "Yo nunca he hecho una apuesta de beber un vaso entero de vodka de un solo trago.",
      "Yo nunca he tenido que sentarme en el suelo del baño con la cabeza entre las piernas para no caerme.",
      "Yo nunca he salido de fiesta con resaca mortal pensando que con una cerveza se me pasaba.",
      "Yo nunca he intentado ligar con alguien usando el traductor de Google en el móvil.",
      "Yo nunca he acabado en una peña de pueblo cantando jotas a pleno pulmón.",
      "Yo nunca he pedido un vaso de agua en la barra y me han mirado como si fuera un extraterrestre.",
      "Yo nunca me he tomado un chupito de licor de hierbas casero que parecía gasolina pura.",
      "Yo nunca he intentado bailar breakdance en la pista y he terminado tirando la copa de tres personas.",
      "Yo nunca he acabado durmiendo en la bañera de un amigo porque no había más sitios libres.",
      "Yo nunca he perdido el autobús de vuelta al pueblo y he tenido que esperar en un banco 6 horas.",
      "Yo nunca he intentado pagar con una tarjeta que sabía de sobra que no tenía saldo.",
      "Yo nunca me he caído por unas escaleras de caracol saliendo de un pub subterráneo.",
      "Yo nunca he dejado una copa a medias porque sabía a colonia barata.",
      "Yo nunca he terminado una noche de fiesta comiendo macarrones fríos directos de la olla a las 7 AM.",
      "Yo nunca he intentado torear a una vaquilla o toro de plástico en unas fiestas patronales.",
      "Yo nunca he grabado un mensaje de audio para mi ex y se lo he mandado a mi madre por error.",
      "Yo nunca he tenido que pedirle a un camarero hielo para ponérmelo en un chichón tras un golpe tonto.",
      "Yo nunca he acabado de fiesta en un polígono industrial sin saber cómo llegué allí.",
      "Yo nunca he intentado hacer malabares con vasos de plástico vacíos y he quedado en ridículo.",
      "Yo nunca he bebido de un embudo o manguera en una fiesta de pueblo.",
      "Yo nunca he terminado una noche de fiesta jurando que iba a correr una maratón al día siguiente.",
      "Yo nunca he perdido la voz por completo durante tres días seguidos tras un festival.",
      "Yo nunca he tenido que lavarme los zapatos de fiesta con lejía por cómo volvieron de barro.",
      "Yo nunca he intentado colarme en los baños del personal para no hacer cola en los de clientes.",
      "Yo nunca he acabado bailando con una fregona o una escoba creyendo que era la reina de la pista.",
      "Yo nunca he hecho un brindis por alguien que no estaba presente inventándome que era su cumpleaños.",
      "Yo nunca he terminado de fiesta un domingo por la tarde con resaca del sábado acumulada.",
      "Yo nunca he intentado mezclar vino blanco con refresco de naranja creando una aberración total.",
      "Yo nunca he tenido que parar un taxi para bajarme a vomitar a los 2 minutos de subir.",
      "Yo nunca he perdido las llaves de la bajera o peña y nos hemos quedado todos en la calle.",
      "Yo nunca he acabado cantando 'Asturias Patria Querida' sin ser asturiano a las cinco de la mañana.",
      "Yo nunca he intentado saltar por encima de una mesa de terraza y la he partido por la mitad.",
      "Yo nunca he tenido que pedirle ropa limpia a un camarero porque me tiraron un litro de cerveza encima.",
      "Yo nunca me he tomado un chupito que picaba tanto que no pude hablar en diez minutos.",
      "Yo nunca he terminado una fiesta en casa ajena ayudando a fregar los platos por pura inercia.",
      "Yo nunca he perdido el mechero veinte veces en una sola noche y vuelto a casa con tres distintos.",
      "Yo nunca he intentado subirme a una estatua o farola para hacerme una foto motivada.",
      "Yo nunca he acabado comiendo pan duro con mayonesa a las 6 AM porque no había nada más en la despensa.",
      "Yo nunca he intentado convencer al taxista de que me cobrara la mitad por ser buena persona.",
      "Yo nunca he tenido que dormir en un colchón inflable pinchado despertándome en el suelo frío.",
      "Yo nunca he terminado en una charanga tocando los platillos o el bombo sin permiso.",
      "Yo nunca he bebido alcohol de una petaca escondida en la bota o en el calcetín.",
      "Yo nunca he intentado hacer un baile sincronizado con un amigo y nos hemos chocado de frente.",
      "Yo nunca he acabado durmiendo con la cabeza apoyada en la barra de un bar mientras sonaba techno.",
      "Yo nunca he tenido que pedirle un trago de agua a un desconocido en la cola del guardarropa.",
      "Yo nunca he salido de fiesta con dos chaquetas puestas para ahorrarme pagar dos guardarropas.",
      "Yo nunca he intentado regalarle una flor robada de un parque a alguien que acababa de conocer.",
      "Yo nunca he acabado en una fiesta temática disfrazado de algo que no tenía nada que ver.",
      "Yo nunca he bebido un chupito con una mosca dentro porque no me di cuenta en la oscuridad.",
      "Yo nunca he terminado discutiendo sobre qué salsa de kebab era mejor a gritos con media acera.",
      "Yo nunca he intentado saltar a una piscina vestido de fiesta y me resbalé en el bordillo.",
      "Yo nunca he tenido que volver a casa con las zapatillas en la mano porque me salieron ampollas gigantes.",
      "Yo nunca he acabado en un karaoke cantando una canción que odiaba a muerte.",
      "Yo nunca he intentado hacer flexiones en medio de la pista de baile para demostrar mi fuerza.",
      "Yo nunca he terminado una noche de fiesta desayunando en el bar donde estaban los abuelos jugando al tute.",
      "Yo nunca he perdido el DNI dentro de mi propia bota y lo encontré dos semanas después.",
      "Yo nunca he intentado hacer un cóctel flameado en una cocina casera y casi quemo la campana extractora.",
      "Yo nunca he terminado en una peña cantando canciones patrias con gente de 70 años.",
      "Yo nunca he tenido que pedir perdón a un grupo entero por haberme tirado encima de su mesa sin querer.",
      "Yo nunca he salido de fiesta con ropa de deporte diciendo que era la nueva moda urbana.",
      "Yo nunca he intentado beberme una jarra de cerveza entera de un solo trago y se me cayó la mitad encima.",
      "Yo nunca he terminado durmiendo en un coche con cuatro personas apretadas porque no había hotel.",
      "Yo nunca he hecho una promesa solemne de montar un negocio multimillonario con un borracho en la barra.",
      "Yo nunca he intentado bailar vals con el camarero mientras recogía los vasos vacíos.",
      "Yo nunca he acabado con las rodillas raspadas por tirarme de rodillas imitando a un guitarrista.",
      "Yo nunca he pedido una copa diciendo 'ponme lo más fuerte que tengas' y me he arrepentido al primer sorbo.",
      "Yo nunca he tenido que salir a la calle a tomar el aire porque el local daba vueltas como una noria.",
      "Yo nunca he terminado comiendo churros congelados porque la churrería estaba cerrada a cal y canto.",
      "Yo nunca he perdido la cartera y me la ha traído un desconocido al día siguiente a mi casa.",
      "Yo nunca he intentado hacer un brindis emotivo en una mesa de desconocidos solo por reírme.",
      "Yo nunca he acabado de fiesta en un pueblo que no sabía ni situar en el mapa de mi provincia.",
      "Yo nunca he tenido que lavarme la cara en una fuente pública con agua helada a las cinco de la mañana.",
      "Yo nunca he intentado bailar con un taburete creyendo que era una persona en la penumbra.",
      "Yo nunca he terminado una fiesta cantando la sintonía de una serie de dibujos animados de los 90.",
      "Yo nunca he bebido de un vaso que encontré encima de un bordillo sin saber de quién demonios era.",
      "Yo nunca he intentado saltar un charco de barro de fiesta y me he quedado clavado hasta los tobillos.",
      "Yo nunca he terminado la noche de fiesta durmiendo en una hamaca de jardín con una manta rota.",
      "Yo nunca he tenido que pedirle perdón al DJ por haberle derramado una copa encima de la mesa de mezclas.",
      "Yo nunca he salido de fiesta un jueves diciendo que volvía a medianoche y me dieron las 7 de la mañana.",
      "Yo nunca he terminado desayunando hamburguesas de 1 euro en un banco de un parque temblando de frío.",
      "Yo nunca he intentado hacer una conga y me he quedado solo en la fila porque nadie me siguió.",
      "Yo nunca he acabado con un tatuaje falso de calcomanía en la cara tras una noche salvaje de peñas.",
      "Yo nunca he bebido un trago de alcohol caliente que llevaba dentro de un coche al sol todo el día.",
      "Yo nunca he terminado la noche de fiesta en el sofá de un amigo tapado con una toalla de playa.",
      "Yo nunca he intentado colarme en una boda ajena solo para comer canapés y beber en la barra libre.",
      "Yo nunca he perdido el reloj de pulsera bailando y jamás supe en qué parte de la discoteca cayó.",
      "Yo nunca he terminado una noche de fiesta jurando amor eterno a mi grupo de amigos con lágrimas en los ojos.",
      "Yo nunca he intentado hacer equilibrio con un vaso lleno en la cabeza y lo he tirado sobre el suelo.",
      "Yo nunca he acabado de fiesta un martes diciendo 'solo me tomo una caña rápida y me voy a dormir'.",
      "Yo nunca me he quedado atrapado en la cola del ropero discutiendo con alguien por una percha idéntica.",
      "Yo nunca he salido de una discoteca con el vaso de plástico en la mano pensando que era de cristal.",
      "Yo nunca he intentado subirme al capó de un taxi parado para pedirle que me llevara.",
      "Yo nunca he terminado cantando villancicos a pleno pulmón en mitad de una noche de agosto.",
      "Yo nunca me he dejado la cazadora en un banco de la plaza y ha seguido ahí al mediodía siguiente intacta.",
      "Yo nunca he terminado en un local latino intentando bailar bachata como si supiera y tropezando con todos.",
      "Yo nunca he intentado abrir una lata con las llaves de casa y he doblado la cerradura entera.",
      "Yo nunca me he bebido un chupito creyendo que era licor dulce y era orujo puro de 50 grados.",
      "Yo nunca he terminado la fiesta montado en un carrito de supermercado empujado por un amigo cuesta abajo.",
      "Yo nunca he prometido a media barra que al día siguiente les invitaba a comer paella en mi casa."
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
      "Yo nunca he guardado fotos o vídeos íntimos en una carpeta secreta con contraseña.",
      "Yo nunca he tenido un amigo con derecho a roce que acabó complicándose de más.",
      "Yo nunca he hecho el amor en un coche en un descampado o aparcamiento.",
      "Yo nunca me he liado con alguien sin acordarme de su nombre al día siguiente.",
      "Yo nunca he dejado marcas o chupetones visibles en el cuello de otra persona.",
      "Yo nunca he tenido que inventar una mentira enorme para tapar un lío amoroso.",
      "Yo nunca he tenido una cita a ciegas que resultó ser un absoluto desastre.",
      "Yo nunca he vuelto a caer con mi ex después de haber dicho mil veces que jamás.",
      "Yo nunca he tenido un encuentro apasionado en el baño de un bar o discoteca.",
      "Yo nunca he tenido una conversación picante mientras estaba en una comida familiar.",
      "Yo nunca me he sentido atraído por el padre o la madre de un amigo.",
      "Yo nunca he besado a alguien solo para poner celosa a una tercera persona.",
      "Yo nunca he grabado o dejado que me grabaran en una situación íntima.",
      "Yo nunca he fingido estar borracho para justificar haberme lanzado a besar a alguien.",
      "Yo nunca he tenido un lío de verano que duró solo 24 horas y jamás volví a ver.",
      "Yo nunca he tenido un sueño ardiente con alguien que me cae realmente mal.",
      "Yo nunca he comprado ropa interior provocativa solo para una ocasión especial.",
      "Yo nunca me he liado con alguien que sabía perfectamente que tenía pareja.",
      "Yo nunca he borrado mensajes de WhatsApp antes de que los viera mi pareja.",
      "Yo nunca he tenido una cita solo porque la otra persona me invitaba a cenar gratis.",
      "Yo nunca he practicado juegos de rol o disfraces en la intimidad.",
      "Yo nunca he dejado que me pagaran copas toda la noche sin tener intención de nada.",
      "Yo nunca he hecho una llamada subida de tono que duró más de una hora.",
      "Yo nunca me he liado con dos personas del mismo grupo de amigos.",
      "Yo nunca he tenido un fetiche extraño que jamás le he contado a nadie.",
      "Yo nunca he utilizado juguetes íntimos a solas o en pareja.",
      "Yo nunca me he despertado en una cama ajena sin tener ropa cerca para escapar.",
      "Yo nunca he sentido atracción por un profesor, médica o figura de autoridad.",
      "Yo nunca he hecho un striptease o baile sugerente para alguien.",
      "Yo nunca he tenido un lío amoroso en la piscina, jacuzzi o en el mar.",
      "Yo nunca he enviado un '¿qué haces despierto?' a las 3 AM con intenciones claras.",
      "Yo nunca he besado a más de tres personas diferentes en un mismo fin de semana.",
      "Yo nunca he fingido ser inocente cuando en verdad soy la persona más picante del grupo.",
      "Yo nunca he sido pillado in fraganti por padres o amigos en pleno acto.",
      "Yo nunca he tenido que ponerme la ropa deprisa para salir corriendo de una casa.",
      "Yo nunca he tenido un flechazo inmediato en el metro o bus que me quitó el hipo.",
      "Yo nunca he tenido una relación a distancia que se mantenía casi solo por videollamadas hot.",
      "Yo nunca he confesado mis sentimientos a alguien solo para conseguir besarle.",
      "Yo nunca he jugado a juegos de cartas quitándome prendas de ropa.",
      "Yo nunca me he liado con alguien en un probador de ropa o en el cine.",
      "Yo nunca he usado comida (nata, chocolate, hielo) en un juego íntimo.",
      "Yo nunca me he enamorado perdidamente de un rollete de una sola noche.",
      "Yo nunca he mirado a un amigo o amiga con deseo prohibido durante una fiesta.",
      "Yo nunca he recibido una propuesta indecente de alguien a cambio de dinero o favores.",
      "Yo nunca he tenido que escapar por la ventana o puerta trasera de una casa ajena.",
      "Yo nunca he fingido que me gustaban las mismas cosas raras solo para ligar.",
      "Yo nunca he tenido una sesión de besos apasionados que duró más de dos horas seguidas.",
      "Yo nunca he dejado una prenda interior olvidada en la casa o coche de otra persona.",
      "Yo nunca he tenido una cita que empezó en un bar y acabó en un hotel en una hora.",
      "Yo nunca he besado a alguien en un fotomatón o cabina cerrada.",
      "Yo nunca he mentido sobre el número real de parejas que he tenido en mi vida.",
      "Yo nunca he tenido curiosidad por participar en un trío o intercambio.",
      "Yo nunca he tenido una aventura con el vecino o vecina del edificio o del pueblo.",
      "Yo nunca he dado un beso con mordisco que hizo sangrar el labio de la otra persona.",
      "Yo nunca he sido el 'secreto' de alguien durante varios meses seguidos.",
      "Yo nunca he sentido celos incontrolables viendo a mi crush bailar con otra persona.",
      "Yo nunca he dicho un cumplido provocativo al oído a alguien en plena pista de baile.",
      "Yo nunca he tenido una relación de puro interés físico sin hablar jamás de nada profundo.",
      "Yo nunca he tenido que inventar una historia para justificar un chupetón en el cuello.",
      "Yo nunca he salido a la calle sin ropa interior por pura adrenalina o comodidad.",
      "Yo nunca he sentido química sexual explosiva con alguien a quien no soportaba como persona.",
      "Yo nunca he mandado una foto sugerente desde el baño de un bar.",
      "Yo nunca he tenido que morder una almohada para no hacer ruido en una casa con gente.",
      "Yo nunca he tenido un amor platónico inconfesable durante más de 3 años.",
      "Yo nunca me he liado con alguien mucho mayor solo por su experiencia.",
      "Yo nunca he aprovechado un momento a oscuras para tocar o besar a alguien.",
      "Yo nunca he tenido un lío romántico en la playa mientras la marea casi nos tapaba.",
      "Yo nunca he enviado un mensaje atrevido y he apagado el móvil asustado por la respuesta.",
      "Yo nunca he tenido una fantasía recurrente con alguien que está sentado en esta mesa.",
      "Yo nunca he besado a alguien en un ascensor entre planta y planta.",
      "Yo nunca he tenido que ducharme con agua helada para calmar las hormonas.",
      "Yo nunca he leído literatura erótica o visto vídeos picantes buscando inspiración.",
      "Yo nunca he hecho una promesa de amor eterno en plena noche de fiesta y pasión.",
      "Yo nunca he sentido ganas irresistibles de besar a un amigo del mismo grupo.",
      "Yo nunca he tenido una cita doble donde acabé deseando a la pareja de mi amigo.",
      "Yo nunca he recibido una foto explícita en mitad de un examen o reunión seria.",
      "Yo nunca he tenido un roce sospechoso bailando en una discoteca apretada.",
      "Yo nunca he tenido un lío con alguien con quien juré sobre la biblia que jamás pasaría.",
      "Yo nunca he tenido que lavar las sábanas a las cuatro de la mañana con urgencia.",
      "Yo nunca he mordido la oreja o el cuello de alguien para ponerle a cien al instante.",
      "Yo nunca me he arrepentido más de no haberme lanzado con alguien que de haberlo hecho.",
      "Yo nunca he tenido un romance con alguien que no hablaba una sola palabra de mi idioma.",
      "Yo nunca he hecho una videollamada picante desde un cuarto de baño con pestillo.",
      "Yo nunca he tenido que fingir dolor de cabeza para escapar de una cama ajena al despertar.",
      "Yo nunca me he liado con alguien en una tienda de campaña en un festival de música.",
      "Yo nunca he tenido un ligue secreto que duró más de un año sin que la cuadrilla sospechara.",
      "Yo nunca he besado a alguien en una piscina mientras otros estaban al otro lado.",
      "Yo nunca he mandado un '¿estás despierto?' a altas horas de la noche con segundas intenciones.",
      "Yo nunca he dejado que alguien me desvistiera con los ojos vendados.",
      "Yo nunca he tenido un encuentro apasionado en las escaleras de un edificio comunal.",
      "Yo nunca me he liado con el hermano o hermana de un amigo de toda la vida.",
      "Yo nunca he tenido que esconder a alguien debajo de la cama porque venían mis padres.",
      "Yo nunca he usado esposas o ataduras suaves durante un juego íntimo.",
      "Yo nunca he tenido una cita romántica en un mirador con vistas a la ciudad solo para liarme.",
      "Yo nunca me he besado apasionadamente bajo la lluvia como si fuera una película de cine.",
      "Yo nunca he tenido un lío con una persona que conocí esa misma noche en la barra.",
      "Yo nunca he fingido ser inocente en la cama cuando tenía mucha más experiencia que la otra persona.",
      "Yo nunca he tenido un desliz íntimo en el asiento trasero de un taxi o coche con amigos delante.",
      "Yo nunca he recibido un masaje con aceite caliente que terminó en algo mucho más intenso.",
      "Yo nunca he mirado con deseo a la pareja de mi mejor amigo durante una cena.",
      "Yo nunca he tenido que ponerme gafas de sol al día siguiente para tapar la noche salvaje.",
      "Yo nunca me he liado con alguien en un balcón o terraza a la vista de los vecinos.",
      "Yo nunca he tenido un lío con alguien que me doblaba la edad solo por su madurez.",
      "Yo nunca he tenido una conversación caliente en un grupo de WhatsApp usando nombres clave.",
      "Yo nunca he besado a alguien con hielo en la boca para ver qué se sentía.",
      "Yo nunca me he liado con dos personas del mismo grupo con solo una semana de diferencia.",
      "Yo nunca he tenido que inventar una historia inverosímil para tapar un chupetón gigante en el pecho.",
      "Yo nunca he hecho el amor con música puesta a todo volumen para no hacer ruido.",
      "Yo nunca he tenido una cita romántica que terminó a los 15 minutos en la cama.",
      "Yo nunca he probado nada picante con comida caliente o chocolate fundido.",
      "Yo nunca he tenido un sueño apasionado con un personaje de película o serie.",
      "Yo nunca me he liado con alguien en los probadores de una tienda de ropa en plenas rebajas.",
      "Yo nunca he recibido una propuesta de hacer un trío de parte de una pareja conocida.",
      "Yo nunca he tenido que buscar mi ropa interior por toda la habitación al despertar con prisas.",
      "Yo nunca he besado a alguien en un portal oscuro esquivando a los vecinos que entraban.",
      "Yo nunca he tenido un lío apasionado en la playa y he terminado lleno de arena incómoda.",
      "Yo nunca he mandado una foto provocativa desde la cama nada más despertarme.",
      "Yo nunca he tenido que morderme la camisa para aguantar la respiración durante un encuentro.",
      "Yo nunca me he liado con alguien por pura venganza hacia otra persona que me rechazó.",
      "Yo nunca he tenido un flechazo con un socorrista, camarera o dependiente en plenas vacaciones.",
      "Yo nunca he hecho una promesa de amor apasionado en mitad de la noche que olvidé por la mañana.",
      "Yo nunca he tenido un roce sospechoso en una pista de baile apretada que continuó fuera.",
      "Yo nunca me he liado con alguien en el coche en un aparcamiento de supermercado vacío.",
      "Yo nunca he tenido que pedirle prestada una camiseta a un ligue para volver a casa a las 8 AM.",
      "Yo nunca he besado a alguien en la boca para callarle la boca en mitad de una discusión.",
      "Yo nunca he tenido una fantasía íntima en un avión o tren de larga distancia.",
      "Yo nunca me he liado con alguien a quien mis amigos odiaban a muerte a sus espaldas.",
      "Yo nunca he tenido que cambiar las sábanas a toda prisa antes de que llegaran mis compañeros de piso.",
      "Yo nunca he usado nata montada o fresas en un juego íntimo en la cama.",
      "Yo nunca he tenido una cita por una app solo porque me aburría un domingo por la tarde.",
      "Yo nunca he sentido una química física tan brutal que no podía ni mantener una conversación normal.",
      "Yo nunca he besado a alguien en un fotomatón bajando la cortina para que no nos vieran.",
      "Yo nunca he tenido una aventura de una noche y me he marchado sin hacer ruido mientras dormía.",
      "Yo nunca me he liado con alguien en una hamaca de playa en mitad de una fiesta nocturna.",
      "Yo nunca he recibido un mensaje con una foto atrevida que borré de inmediato por pánico a que la vieran.",
      "Yo nunca he tenido que inventarme que tenía novio/a para no liarme con alguien que no me gustaba.",
      "Yo nunca he hecho el amor en una ducha pequeña y casi nos caemos los dos del resbalón.",
      "Yo nunca he tenido un ligue apasionado en un viaje de fin de curso o erasmus que nadie supo.",
      "Yo nunca he besado a alguien en un cine en la última fila mientras proyectaban una película infantil.",
      "Yo nunca me he liado con un amigo después de decir 'solo somos amigos' durante tres años.",
      "Yo nunca he tenido un encuentro ardiente en un coche con los cristales completamente empañados.",
      "Yo nunca he tenido que buscar una farmacia de guardia a las 6 de la mañana por un descuido.",
      "Yo nunca he usado disfraces o complementos atrevidos en una noche especial de pasión.",
      "Yo nunca me he liado con alguien en una fiesta en la misma habitación donde otros dormían.",
      "Yo nunca he mandado un mensaje de 'vente ya a mi casa' después de tomarme tres copas.",
      "Yo nunca he tenido que saltar una valla o muro para escapar de la casa de un ligue antes del amanecer.",
      "Yo nunca he besado a alguien en un jacuzzi sintiendo el calor extremo del agua.",
      "Yo nunca he tenido un lío romántico con alguien que tenía acento extranjero solo porque me ponía.",
      "Yo nunca me he liado con una persona de la que no sabía ni la edad exacta que tenía.",
      "Yo nunca he tenido una conversación subida de tono con auriculares puestos mientras iba en el metro.",
      "Yo nunca he tenido que taparle la boca a alguien con un cojín para no despertar a la familia.",
      "Yo nunca he besado a alguien en la pista de baile y me he ido con otra persona completamente distinta.",
      "Yo nunca he tenido un romance de verano tan intenso que lloré desconsoladamente al despedirme.",
      "Yo nunca me he liado con alguien solo porque olía a una colonia que me volvía totalmente loco.",
      "Yo nunca he recibido una propuesta de matrimonio de broma en una noche de pasión salvaje.",
      "Yo nunca he tenido un encuentro ardiente en un barco, lancha o colchoneta hinchable en el mar.",
      "Yo nunca he mandado una foto insinuante por error a un grupo familiar y la borré en medio segundo.",
      "Yo nunca he tenido que ponerme la ropa interior mojada para salir huyendo de una piscina.",
      "Yo nunca me he liado con alguien a quien consideraba mi rival o enemigo acérrimo.",
      "Yo nunca he tenido una fantasía íntima recurrente con dos personas al mismo tiempo.",
      "Yo nunca he besado a alguien con sabor a chupito de fresa en mitad de una discoteca abarrotada.",
      "Yo nunca me he arrepentido más de haber frenado una noche de pasión que de haberme dejado llevar.",
      "Yo nunca he fingido ser tímido para conseguir que la otra persona tomara la iniciativa.",
      "Yo nunca me he liado con alguien en una sala de espera vacía de noche.",
      "Yo nunca he tenido una noche ardiente en una casa rural compartida intentando no hacer crujir el suelo.",
      "Yo nunca he recibido una confesión de amor de una persona con la que solo quería liarme esa noche.",
      "Yo nunca me he desvestido a oscuras tropezando con los muebles de la habitación ajena.",
      "Yo nunca he tenido un lío apasionado en la parte de atrás de una furgoneta o furgón camperizado.",
      "Yo nunca he besado a alguien en una sauna o baño de vapor a escondidas.",
      "Yo nunca he tenido que pedir disculpas por haber arañado la espalda de alguien sin querer.",
      "Yo nunca he fingido estar concentrado en el móvil para que alguien se acercara a besarme.",
      "Yo nunca me he liado con alguien durante una fiesta de pijamas o de disfraces en secreto."
    ]
  },

  probable: [
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
    "llore viendo un vídeo emotivo de perritos o gatos en TikTok?",
    "se crea cualquier noticia falsa que le llegue por un grupo familiar?",
    "pierda las gafas de sol teniéndolas colocadas en la propia cabeza?",
    "se asuste con una paloma o un bicho inofensivo que pasa volando?",
    "devuelva una chaqueta a la tienda después de haberla usado todo un fin de semana?",
    "se duerma en el cine o en el teatro a los diez minutos de empezar la función?",
    "tenga el coche o la habitación con más basura y cajas acumuladas?",
    "se invente una excusa médica ridícula para librarse de un compromiso?",
    "busque en Google síntomas de un resfriado y piense que le queda un mes de vida?",
    "olvide la contraseña de su correo o teléfono y bloquee el dispositivo?",
    "se quede mirando al vacío con cara de despistado pensando en tonterías?",
    "rompa un plato o una taza en una cafetería y se haga el despistado?",
    "tenga la mayor cantidad de pestañas abiertas en el navegador del móvil?",
    "se ponga a ordenar los cajones justo el día antes de un examen o entrega importante?",
    "tarde más de dos horas en elegir qué ropa ponerse antes de salir?",
    "hable con voz tierna y de bebé cuando ve a cualquier perro por la calle?",
    "se gaste la mitad del presupuesto del viaje comprando souvenirs tontos?",
    "coma pizza fría del día anterior directamente del cartón para desayunar?",
    "tenga más memes absurdos guardados en la galería de su teléfono?",
    "salude a alguien efusivamente por la calle que no conocía de nada?",
    "se quede atrapado en un jersey en un probador y empiece a sudar del agobio?",
    "baile fatal en una discoteca pero con una seguridad y autoestima envidiables?",
    "pida un plato rarísimo en el restaurante solo por postureo y luego lo odie?",
    "se queje de que no tiene dinero mientras pide tres cafés y comida para llevar?",
    "se aprenda las canciones de un artista solo dos días antes de ir a su concierto?",
    "tenga la peor letra de escribir a mano del grupo?",
    "se enfade por perder una partida de un juego de mesa o del Mario Kart?",
    "diga que está listo en 5 minutos cuando ni siquiera se ha metido a la ducha?",
    "guarde ropa de hace diez años en el armario 'por si algún día vuelve a estar de moda'?",
    "compre un aparato de gimnasio para casa y acabe usándolo de perchero?",
    "se crea que puede arreglar un electrodoméstico roto y lo destroce más?",
    "sepa todos los cotilleos de la vida de famosos o vecinos sin conocerlos?",
    "tenga más grupos de WhatsApp completamente silenciados de por vida?",
    "se duerma en el transporte público y se despierte en la última estación de la línea?",
    "pierda el ticket del aparcamiento cinco minutos después de haberlo sacado?",
    "se crea un chef profesional por haber echado orégano a unos macarrones con tomate?",
    "pida prestado algo y se le olvide devolverlo durante más de dos años?",
    "se compre una agenda bonita para el nuevo año y solo escriba en las primeras dos páginas?",
    "tenga más fotos suyas en el carrete del móvil haciéndose selfies?",
    "deje el teléfono con un 1% de batería todo el día sin ponerlo a cargar?",
    "haga una captura de pantalla y la mande por error al mismo grupo de donde la sacó?",
    "se quede encerrado en un balcón por culpa del aire y tenga que gritar socorro?",
    "cante en inglés imitando palabras sin tener ni idea de lo que está diciendo?",
    "haga sonar una alarma del coche sin querer y no sepa cómo apagarla?",
    "se crea que va a ganar la lotería cada semana y gaste más de lo debido?",
    "se ría tanto de su propio chiste antes de contarlo que nadie entienda el final?",
    "tenga más cosas acumuladas en el carrito de compras online sin intención de comprar?",
    "se choque contra una puerta de cristal transparente recién limpiada?",
    "diga que no le gusta un dulce y se coma la mitad cuando nadie mira?",
    "se apunte al gimnasio el 1 de enero y no vuelva a ir nunca a partir del 15?",
    "tenga el historial de reproducciones de YouTube o TikTok más vergonzoso?",
    "use calcetines con agujeros en el dedo pensando que nadie se va a fijar jamás?",
    "hable en sueños y cuente secretos sin darse cuenta?",
    "intente matar a una mosca o mosquito y acabe tirando una lámpara?",
    "haga amigos en el baño de un local y se cuenten sus vidas enteras?",
    "confunda a un gemelo con el otro y meta la pata hasta el fondo?",
    "se crea el argumento de una película de ciencia ficción como si fuera real?",
    "mire diez veces el menú de comida a domicilio antes de pedir lo de siempre?",
    "tenga el teléfono móvil con la pantalla reventada y siga usándolo como si nada?",
    "invente una historia inverosímil para justificarse por llegar con retraso?",
    "se compre un libro gordísimo porque tiene una portada bonita y no lo lea jamás?",
    "haga un berrinche ridículo cuando tiene hambre y no hay comida a mano?",
    "hable por teléfono gesticulando con las manos como si la otra persona le viera?",
    "se meta en el coche de un desconocido pensando que es un Uber o un taxi?",
    "guarde cajas de teléfonos y zapatillas en el altillo del armario durante años?",
    "sea incapaz de armar un mueble básico siguiendo las instrucciones de montaje?",
    "le tenga pánico absoluto a las abejas o avispas y monte un escándalo público?",
    "se gaste dinero en skins o trajes para videojuegos virtuales?",
    "repita la misma anécdota diez veces al mismo grupo como si fuera nueva?",
    "lleve siempre un paraguas cuando no llueve y se le olvide el día que cae el diluvio?",
    "se trague un chicle por accidente y piense que se le va a quedar siete años dentro?",
    "haga una videollamada sin peinar y con la cámara apuntando al techo?",
    "pierda el mando de la televisión teniéndolo debajo del cojín donde está sentado?",
    "coma palomitas con tanta ansiedad que se le caiga medio bol al suelo del cine?",
    "confunda una fecha importante de un amigo o pareja por un día de diferencia?",
    "tenga la colección más grande de cables viejos que ya no sirven para ningún móvil?",
    "haga una encuesta por WhatsApp sobre una tontería que a nadie le importa?",
    "mire la hora en el móvil, lo guarde en el bolsillo y no sepa qué hora era?",
    "se equivoque de botón en el ascensor y acabe bajando al sótano o al garaje?",
    "finja que está leyendo un cartel para no tener que cruzar la mirada con nadie?",
    "pida un café descafeinado con leche vegetal y luego pida un bollo gigante?",
    "se coma el envoltorio de una magdalena o dulce por pura distracción?",
    "tenga el escritorio del ordenador repleto de capturas y archivos sin ordenar?",
    "salte de susto cuando alguien le toca la espalda sin avisar por detrás?",
    "haga una compra impulsiva de teletienda o anuncio de Instagram de madrugada?",
    "sea la persona que siempre propone hacerse una foto en grupo y luego no la pasa jamás?"
  ],

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
    ["Tener resaca todos los fines de semana", "Tener que levantarte a las 5 AM todos los días"],
    ["Encontrar al amor de tu vida", "Ganar 10 millones de euros en la lotería"],
    ["Saber hablar todos los idiomas del mundo", "Saber tocar todos los instrumentos a la perfección"],
    ["Tener que bailar cada vez que suene música", "Tener que cantar a los cuatro vientos cada vez que hables"],
    ["Tener un lío con el ex de tu mejor amigo", "Quedarte sin salir de fiesta un año entero"],
    ["Vivir siempre en un verano sofocante a 40°C", "Vivir siempre en un invierno helado a -5°C"],
    ["Tener la habilidad de volar pero a 10 km/h", "Poder hacerte invisible solo cuando estés a oscuras"],
    ["Comer solo comida picante toda la vida", "Comer solo comida completamente sosa sin sal"],
    ["Que tu pareja gane el triple que tú", "Que tu pareja no tenga ingresos y la mantengas tú"],
    ["Tener hipo para siempre cada vez que bebas", "Estornudar tres veces seguidas cada vez que rías"],
    ["Llegar 2 horas antes a todos los sitios", "Llegar 20 minutos tarde a todos lados de por vida"],
    ["Tener que vestir siempre de amarillo chillón", "Tener que llevar puesto un traje formal hasta para dormir"],
    ["Saber leer la mente de las personas", "Poder hacer que olviden lo que tú quieras"],
    ["Tener resaca instantánea nada más beber un trago", "Tener sueño incontrolable a partir de las 23:00 siempre"],
    ["No poder usar redes sociales durante 5 años", "No poder salir de fiesta por la noche durante 2 años"],
    ["Pagar siempre la cuenta en los bares", "Tener que pedirle dinero a tus padres para cada copa"],
    ["Vivir en una casa rural sin cobertura", "Vivir en pleno centro de una ciudad pero sin poder salir"],
    ["Perder el sentido del gusto", "Perder el sentido del olfato para siempre"],
    ["Tener 10 amigos leales para toda la vida", "Tener 100.000 seguidores en redes y patrocinadores"],
    ["Olvidar tu pasado por completo", "No poder crear ningún recuerdo nuevo a partir de hoy"],
    ["Despertarte siempre con resaca sin haber bebido", "Tener dolor de muelas constante cada domingo"],
    ["Ser el más guapo de un grupo tonto", "Ser el más listo de un grupo millonario"],
    ["Que nadie se ría de tus bromas jamás", "Tener que reírte a carcajadas de chistes malos ajenos"],
    ["Tener siempre las manos pegajosas", "Tener siempre arena dentro de los calcetines"],
    ["No volver a ducharte con agua caliente", "No volver a dormir en una cama con almohada cómoda"],
    ["Que todos tus amigos sepan tus secretos íntimos", "Que tu familia sepa todas tus mentiras"],
    ["Tener que comer con palillos chinos toda la vida", "Tener que beber líquidos con tenedor"],
    ["Vivir en un festival de música perpetuo", "Vivir en una biblioteca en silencio absoluto"],
    ["Que tu ex te siga en todas las redes y comente", "Que tu jefe sea amigo de fiesta de tus padres"],
    ["Tener siempre frío en los pies", "Tener siempre sudor en la frente"],
    ["Poder revivir un día de tu pasado", "Poder mirar 5 minutos de tu vida dentro de 10 años"]
  ],

  cultura3s: [
    "3 marcas de cerveza", "3 capitales europeas", "3 excusas para no salir de fiesta", "3 canciones de reguetón míticas",
    "3 comidas sagradas para la resaca", "3 cosas que encuentras en un cuarto de baño", "3 nombres de profesores que tuviste", "3 marcas de coches alemanes",
    "3 animales que nadan en el mar", "3 cosas de color rojo brillante", "3 pueblos cercanos que conozcas", "3 deportes olímpicos de verano",
    "3 series famosas de televisión", "3 cosas que llevas siempre en el bolsillo", "3 frutas típicas de verano", "3 partes del cuerpo con 4 letras",
    "3 mentiras piadosas que todos dicen", "3 marcas de ropa deportiva", "3 cosas que te dan mucho asco", "3 bebidas refrescantes sin alcohol",
    "3 razas de perro pequeñas", "3 villanos míticos del cine", "3 personajes de dibujos animados", "3 cosas que compras en una farmacia",
    "3 tipos de queso", "3 películas de terror conocidas", "3 platos de comida rápida", "3 aplicaciones que más abres al día"
  ],

  verdades: [
    "¿Quién de esta mesa te parece la persona más atractiva físicamente?",
    "¿Cuál es el secreto más oscuro que jamás le has contado a tu familia?",
    "¿Alguna vez has tenido un sueño subido de tono con alguien de los aquí presentes?",
    "¿Qué es lo más vergonzoso que has hecho estando borracho de fiesta?",
    "¿Has mirado alguna vez las conversaciones del móvil de otra persona a escondidas?",
    "¿Cuál ha sido la cita más desastrosa y ridícula de toda tu vida?",
    "¿Te has liado con alguien de quien ahora te dé absoluta vergüenza hablar?",
    "¿Alguna vez has fingido que te encantaba un regalo que en el fondo odiabas?",
    "¿Cuál es la mentira más gorda que has soltado para escaquearte de un plan?",
    "¿Has tenido alguna vez sentimientos románticos por la pareja de un amigo?"
  ],

  retos: [
    "Haz 10 flexiones en el suelo ahora mismo o bebe 2 tragos dobles.",
    "Deja que la persona a tu derecha revise tus 5 fotos eliminadas recientemente.",
    "Enseña las 3 últimas fotos de tu galería sin rechistar a todo el grupo.",
    "Baila sin música durante 30 segundos con total seriedad delante de todos.",
    "Llama a un contacto y dile con voz seria que te casas la semana que viene.",
    "Bébete un trago entero con las manos atadas o colocadas en la espalda.",
    "Habla con acento extranjero hasta que te vuelva a tocar otro turno.",
    "Intercambia una prenda de ropa con la persona sentada a tu izquierda.",
    "Manda un selfie poniendo una mueca ridícula al tercer contacto de tus chats.",
    "Deja que alguien del grupo te dibuje con bolígrafo lo que quiera en el brazo."
  ],

  mimicaWords: [
    "Subir al Everest", "Resaca mortal", "Hacer la croqueta en el suelo", "Tirar la copa en la discoteca",
    "Robar un cono de obra", "Perder el móvil en el taxi", "Ligar en la barra de un bar", "Bailar Paquito el Chocolatero",
    "Tener gases en un ascensor", "Tirarse a una piscina helada", "Cuidar a un amigo borracho", "Hacerse un tatuaje doloroso",
    "Montar a caballo desbocado", "Cantar en la ducha desafinado", "Cambiar una rueda pinchada", "Perrear hasta el suelo",
    "Pelea de gallos de rap", "Robar una señal de tráfico", "Saltar en paracaídas", "Hacer surf con olas gigantes"
  ],

  bombTopics: [
    "Marcas de bebidas, licores o cervezas", "Excusas típicas para no salir de fiesta", "Ciudades del mundo que tengan playa",
    "Cosas que encuentras tiradas en el suelo de un bar", "Canciones míticas de fiesta que todos se saben", "Insultos graciosos o motes de pueblo",
    "Razones por las que te echarían de una discoteca", "Comidas sagradas para curar la resaca", "Pueblos o ciudades que hayas visitado"
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
  let source = [];
  if (game === 'yoNunca') {
    source = DB.yoNunca[level] || DB.yoNunca.fiesta;
  } else if (game === 'probable') {
    source = DB.probable;
  }

  const key = `${game}_${level}`;
  if (!decks[key] || decks[key].length === 0) {
    decks[key] = shuffle(source);
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

// Mímica DOM
const mimicaStepPass = document.getElementById('mimicaStepPass');
const mimicaStepRead = document.getElementById('mimicaStepRead');
const mimicaStepAct = document.getElementById('mimicaStepAct');
const mimicaActorName = document.getElementById('mimicaActorName');
const timerPassDisplay = document.getElementById('timerPassDisplay');
const btnStartPassTimer = document.getElementById('btnStartPassTimer');
const btnActorReceived = document.getElementById('btnActorReceived');
const secretWordDisplay = document.getElementById('secretWordDisplay');
const timerReadDisplay = document.getElementById('timerReadDisplay');
const btnSkipReadPhase = document.getElementById('btnSkipReadPhase');
const timerActDisplay = document.getElementById('timerActDisplay');
const btnPauseMimica = document.getElementById('btnPauseMimica');
const btnMimicaGuessed = document.getElementById('btnMimicaGuessed');
const btnNextMimicaRound = document.getElementById('btnNextMimicaRound');
const mimicaPassMsg = document.getElementById('mimicaPassMsg');

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

// --- 5. CONTROL DEL TEMPORIZADOR DE MÍMICA ---
function stopMimicaTimer() {
  if (mimicaTimer) {
    clearInterval(mimicaTimer);
    mimicaTimer = null;
  }
}

// Resetea visualmente el módulo de mímica al estado inicial
function resetMimicaUI() {
  stopMimicaTimer();
  isMimicaPaused = false;

  if (mimicaStepPass) mimicaStepPass.style.display = 'flex';
  if (mimicaStepRead) mimicaStepRead.style.display = 'none';
  if (mimicaStepAct) mimicaStepAct.style.display = 'none';

  if (btnStartPassTimer) btnStartPassTimer.style.display = 'inline-block';
  if (btnActorReceived) btnActorReceived.style.display = 'none';
  if (timerPassDisplay) timerPassDisplay.innerText = "10s";
  if (mimicaPassMsg) mimicaPassMsg.innerText = "Pulsa arrancar y pásale el móvil en privado.";

  if (btnPauseMimica) {
    btnPauseMimica.innerText = "⏸️ Pausar";
    btnPauseMimica.classList.remove('paused');
  }

  if (mimicaActorName) mimicaActorName.innerText = getRandomPlayer();
  if (secretWordDisplay) secretWordDisplay.innerText = DB.mimicaWords[Math.floor(Math.random() * DB.mimicaWords.length)];
}

// --- 6. CAMBIO DE PANTALLAS ---
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

  if (id === 'screenMimica') {
    resetMimicaUI();
  }

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

// --- 10. MÍMICA EXPRÉS CONTROLADA ---
if (btnStartPassTimer) {
  btnStartPassTimer.addEventListener('click', () => {
    triggerHaptic();
    btnStartPassTimer.style.display = 'none';
    if (btnActorReceived) btnActorReceived.style.display = 'inline-block';
    if (mimicaPassMsg) mimicaPassMsg.innerText = "¡Pásale el móvil antes de que suene la alarma!";

    let passSeconds = 10;
    if (timerPassDisplay) timerPassDisplay.innerText = `${passSeconds}s`;

    stopMimicaTimer();
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
  });
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

if (btnSkipReadPhase) {
  btnSkipReadPhase.addEventListener('click', () => {
    stopMimicaTimer();
    startActPhase();
  });
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

if (btnNextMimicaRound) {
  btnNextMimicaRound.addEventListener('click', () => {
    triggerHaptic();
    resetMimicaUI();
  });
}

// --- 11. LA BOMBA ---
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

// --- 12. TEMAS Y PARTICIPANTES ---
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

// --- 13. NOVEDADES ---
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

// --- 14. PWA ---
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

// --- 15. INICIALIZACIÓN BLINDADA ---
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
