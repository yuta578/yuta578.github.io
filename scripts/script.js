const SOUND_FILE = "media/scramble.mp3";

// ── MINIJUEGO ──────────────────────────────────────────────
const MINI_GOAL = 5;
const MINI_KEY  = 'lucky_found';
const MINI_DONE = 'minigame_done';
const AI_CHAT_DONE = 'ai_chat_done';

const specialPhrases = [
  "Hay algo escondido entre las palabras. Encuéntralo.",
  "No todo lo que ves es lo que parece. Sigue mirando.",
  "Algunas puertas solo se abren si sabes dónde buscar.",
  "Lo extraordinario se esconde dentro de lo ordinario.",
  "Este mensaje fue escrito para ti. Solo para ti.",
  "Hay señales en el ruido. Aprende a leerlas.",
  "No es casualidad que estés aquí ahora mismo.",
  "Cada vez que presionas, algo cambia. ¿Lo notas?",
];

const specialWordPhrases = [
  ["El que busca siempre encuentra ", "algo", " que no esperaba."],
  ["La constancia es la clave ", "oculta", " del éxito."],
  ["Detrás de cada error hay una ", "señal", " que ignoramos."],
  ["El progreso real empieza cuando dejas de buscar ", "atajos", "."],
  ["Hay momentos que parecen normales pero son ", "únicos", "."],
  ["Lo que practicas en silencio define lo que eres en ", "público", "."],
  ["Cada pequeño paso deja una ", "huella", " más profunda de lo que crees."],
  ["No esperes el momento perfecto. El momento ", "eres", " tú."],
  ["Dentro de cada hábito hay una ", "chispa", " que espera encenderse."],
  ["La diferencia entre avanzar y quedarte está en una sola ", "decisión", "."],
];

const SPECIAL_PROB = 0.30;

function getFoundSet() {
  try { return new Set(JSON.parse(localStorage.getItem(MINI_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveFoundSet(set) {
  localStorage.setItem(MINI_KEY, JSON.stringify([...set]));
}

function playClick() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

const completeSound = new Audio('media/complete.mp3');
const hojaSound = new Audio('media/hoja.mp3');

const NOTIFY_SEEN = 'mini_notify_seen';

function showCompleteSequence() {
  if (localStorage.getItem(NOTIFY_SEEN) === '1') return;
  if (document.getElementById('mini-notify')) return;
  const msg1 = 'Encontraste lo que necesitaba';
  const msg2 = 'ya puedes volver';
  const el = document.createElement('div');
  el.id = 'mini-notify';
  el.style.cssText = `
    position: fixed; top: 16px; left: 20px;
    display: flex; align-items: center; gap: 8px;
    opacity: 0; transition: opacity 0.6s ease;
    font-family: 'Georgia', serif; pointer-events: none;
  `;
  el.innerHTML = `
    <img src="media/teto.png" alt="" style="width:50px;height:50px;object-fit:contain;opacity:0.7;">
    <span id="mini-notify-text" style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#6a8a5a;">${msg1}</span>
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => {
        document.getElementById('mini-notify-text').textContent = msg2;
        el.style.opacity = '1';
        setTimeout(() => {
          el.style.opacity = '0';
          setTimeout(() => { el.remove(); localStorage.setItem(NOTIFY_SEEN, '1'); }, 700);
        }, 3000);
      }, 700);
    }, 3000);
  }));
}

const RELOAD_ANGER_KEY = 'prescript_anger';
const ANGER_MAX = 20;

(function initAnger() {
  const cur = parseInt(localStorage.getItem(RELOAD_ANGER_KEY) || '0');
  const next = Math.min(cur + 1, ANGER_MAX);
  localStorage.setItem(RELOAD_ANGER_KEY, next);

  if (next >= ANGER_MAX) {
    setTimeout(() => { localStorage.clear(); location.reload(); }, 800);
    return;
  }

  setInterval(() => {
    const v = parseInt(localStorage.getItem(RELOAD_ANGER_KEY) || '0');
    if (v > 0) localStorage.setItem(RELOAD_ANGER_KEY, v - 1);
  }, 5000);
})();

function showWelcome() {
  const anger = parseInt(localStorage.getItem(RELOAD_ANGER_KEY) || '0');

  const normalMsgs = ["bienvenido de nuevo.","aquí estás otra vez.","sabía que volverías.","de nuevo por aquí.","qué bueno verte.","sigues volviendo.","otra vez tú.","no te cansas de venir.","siempre regresas.","bienvenido."];
  const angry1Msgs = ["¿otra vez?","para. ya.","en serio. para.","no voy a cambiar."];
  const angry2Msg  = "Te lo Advierto.";
  const angry3Msg  = "PARA YA.";

  let msg, color;
  if (anger >= 13)      { msg = angry3Msg; color = '#cc0000'; }
  else if (anger >= 9)  { msg = angry2Msg; color = '#cc0000'; }
  else if (anger >= 5)  { msg = angry1Msgs[Math.floor(Math.random() * angry1Msgs.length)]; color = '#aa2222'; }
  else                  { msg = normalMsgs[Math.floor(Math.random() * normalMsgs.length)]; color = '#555'; }

  const el = document.createElement('div');
  el.style.cssText = `position:fixed;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:${color};font-family:'Georgia',serif;opacity:0;transition:opacity 0.6s ease;pointer-events:none;white-space:nowrap;`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    const flor = document.querySelector('.prescrip-image');
    el.style.top = flor ? (flor.getBoundingClientRect().top - 24) + 'px' : '16px';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 700); }, 3000);
    });
  }, 300);
}

function getLabelFromId(id) {
  if (id.startsWith('sp:')) {
    const key = id.slice(3);
    const full = specialPhrases.find(p => p.slice(0, 30) === key);
    return full || key;
  }
  if (id.startsWith('wp:')) {
    const parts = id.slice(3).split(':');
    const word = parts[0];
    const beforeKey = parts[1] || '';
    const entry = specialWordPhrases.find(p => p[1] === word && p[0].slice(0, 20) === beforeKey);
    return entry ? entry[0] + entry[1] + entry[2] : word;
  }
  return id;
}

function buildHoja() {
  if (document.getElementById('hoja-trigger')) return;
  const trigger = document.createElement('div');
  trigger.id = 'hoja-trigger';
  trigger.innerHTML = '&#8679 &#8679 &#8679;';
  trigger.style.cssText = `position:fixed;left:28px;bottom:28px;font-size:18px;color:rgba(200,190,160,0.35);cursor:default;user-select:none;transition:color 0.3s;z-index:100;`;
  const hoja = document.createElement('div');
  hoja.id = 'hoja-panel';
  hoja.style.cssText = `position:fixed;left:0;bottom:0;width:260px;height:55vh;background:#0d0d0d;border-top:1px solid #1e1e1e;border-right:1px solid #1e1e1e;transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);z-index:99;display:flex;flex-direction:column;padding:20px 28px 24px;box-sizing:border-box;`;
  const closeBtn = document.createElement('div');
  closeBtn.innerHTML = '&#8681 &#8681 &#8681;';
  closeBtn.style.cssText = `font-size:16px;color:rgba(200,190,160,0.3);cursor:default;user-select:none;text-align:center;margin-bottom:18px;transition:color 0.2s;flex-shrink:0;`;
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = 'rgba(200,190,160,0.7)'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = 'rgba(200,190,160,0.3)'; });
  const title = document.createElement('div');
  title.style.cssText = `font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:#333;margin-bottom:16px;font-family:'Georgia',serif;flex-shrink:0;`;
  title.textContent = 'encontradas';
  const lista = document.createElement('div');
  lista.id = 'hoja-lista';
  lista.style.cssText = `flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:8px;min-width:0;`;
  hoja.appendChild(closeBtn);
  hoja.appendChild(title);
  hoja.appendChild(lista);
  document.body.appendChild(hoja);
  document.body.appendChild(trigger);
  let open = false;
  function openHoja() { open = true; hoja.style.transform = 'translateY(0)'; trigger.style.color = 'rgba(200,190,160,0)'; refreshLista(); hojaSound.currentTime=0; hojaSound.play().catch(()=>{}); }
  function closeHoja() { open = false; hoja.style.transform = 'translateY(100%)'; trigger.style.color = 'rgba(200,190,160,0.35)'; hojaSound.currentTime=0; hojaSound.play().catch(()=>{}); }
  trigger.addEventListener('mouseenter', () => { if (!open) { trigger.style.color = 'rgba(200,190,160,0.7)'; openHoja(); } });
  trigger.addEventListener('mouseleave', () => { if (!open) trigger.style.color = 'rgba(200,190,160,0.35)'; });
  trigger.addEventListener('click', () => { if (!open) openHoja(); });
  closeBtn.addEventListener('click', () => { if (open) closeHoja(); });
  refreshLista();
}

function refreshLista() {
  const lista = document.getElementById('hoja-lista');
  if (!lista) return;
  lista.innerHTML = '';
  const found = getFoundSet();
  if (found.size === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:9px;color:#222;font-family:Georgia,serif;font-style:italic;letter-spacing:0.1em;';
    empty.textContent = 'ninguna aún.';
    lista.appendChild(empty);
    return;
  }
  found.forEach(id => {
    const label = getLabelFromId(id);
    const item = document.createElement('div');
    item.style.cssText = `font-size:9px;color:#6a8a5a;font-family:'Georgia',serif;font-style:italic;letter-spacing:0.05em;line-height:1.5;border-bottom:1px solid #1a1a1a;padding-bottom:6px;word-break:break-word;white-space:normal;`;
    item.textContent = label;
    lista.appendChild(item);
  });
}

function onFound() {
  playClick();
  refreshLista();
  if (getFoundSet().size >= MINI_GOAL) {
    localStorage.setItem(MINI_DONE, '1');
    completeSound.currentTime = 0;
    completeSound.play().catch(() => {});
    completeSound.volume = 0.8;
    showCompleteSequence();
  }
}

function renderSpecialPhrase(text) {
  const container = document.getElementById('p-text');
  const id = 'sp:' + text.slice(0, 30);
  const found = getFoundSet();
  const alreadyFound = found.has(id);

  container.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = text;
  span.style.cssText = `
    cursor: default;
    border-bottom: 1px solid ${alreadyFound ? '#3a5a3a' : 'rgba(200,190,160,0.25)'};
    transition: border-color 0.2s, color 0.2s;
    color: ${alreadyFound ? '#5a8a5a' : '#e8e0d0'};
  `;
  if (!alreadyFound) {
    span.addEventListener('mouseenter', () => { span.style.borderColor = 'rgba(200,190,160,0.7)'; });
    span.addEventListener('mouseleave', () => { span.style.borderColor = 'rgba(200,190,160,0.25)'; });
    span.addEventListener('click', () => {
      const f = getFoundSet();
      if (f.has(id)) return;
      f.add(id);
      saveFoundSet(f);
      span.style.color = '#5a8a5a';
      span.style.borderColor = '#3a5a3a';
      onFound();
    });
  }
  container.appendChild(span);
}

function renderWordPhrase(parts) {
  const [before, word, after] = parts;
  const container = document.getElementById('p-text');
  const id = 'wp:' + word + ':' + before.slice(0, 20);
  const found = getFoundSet();
  const alreadyFound = found.has(id);

  container.innerHTML = '';
  const addText = (t) => container.appendChild(document.createTextNode(t));

  addText(before);
  const span = document.createElement('span');
  span.textContent = word;
  span.style.cssText = `
    cursor: default;
    background: ${alreadyFound ? 'rgba(80,120,70,0.18)' : 'rgba(200,190,160,0.08)'};
    border-bottom: 1px solid ${alreadyFound ? '#3a5a3a' : 'rgba(200,190,160,0.3)'};
    padding: 0 2px;
    color: ${alreadyFound ? '#5a8a5a' : '#e8e0d0'};
    transition: background 0.2s, color 0.2s;
  `;
  if (!alreadyFound) {
    span.addEventListener('mouseenter', () => {
      span.style.background = 'rgba(200,190,160,0.15)';
      span.style.borderColor = 'rgba(200,190,160,0.7)';
    });
    span.addEventListener('mouseleave', () => {
      span.style.background = 'rgba(200,190,160,0.08)';
      span.style.borderColor = 'rgba(200,190,160,0.3)';
    });
    span.addEventListener('click', () => {
      const f = getFoundSet();
      if (f.has(id)) return;
      f.add(id);
      saveFoundSet(f);
      span.style.background = 'rgba(80,120,70,0.18)';
      span.style.borderColor = '#3a5a3a';
      span.style.color = '#5a8a5a';
      onFound();
    });
  }
  container.appendChild(span);
  addText(after);
}
// ── FIN MINIJUEGO ───────────────────────────────────────────

const sujetos = [
  "El que lo intenta", "Quien da el primer paso", "El que aprende cada día",
  "Alguien constante", "El que sigue adelante", "Quien se equivoca",
  "El que se levanta", "Una mente curiosa", "El que practica",
  "Quien sabe escuchar", "El que observa y aprende", "Alguien paciente",
  "El que decide cambiar", "Quien busca mejorar", "El que se adapta",
  "Una buena decisión", "Un pequeño paso", "El esfuerzo de cada día",
  "La disciplina", "La constancia", "Aprender siempre",
  "El hábito diario", "La motivación", "El compromiso",
  "El enfoque", "La dedicación", "La práctica constante",
  "El cambio", "La perseverancia", "El progreso",
  "La intención", "Intentarlo de verdad", "La actitud",
  "El trabajo de cada día", "Mejorar un poco cada vez", "La iniciativa",
  "El que no se rinde", "Quien lo vuelve a intentar",
  "El que corrige sus errores", "Alguien que insiste",
  "El que se esforce", "Quien quiere aprender de verdad",
  "El que se mantiene firme", "Alguien que avanza",
  "El que no para", "Quien sigue intentándolo",
  "El que da lo mejor de sí", "Alguien comprometido",
  "El que empieza sin miedo", "Quien enfrenta los retos",
  "El que se supera", "Alguien que evoluciona",
  "El que crea hábitos", "Quien pasa a la acción",
  "El que persevera", "Alguien enfocado",
  "El que se reta a sí mismo", "Quien busca soluciones",
  "El que mejora poco a poco", "Alguien disciplinado",
  "El que actúa", "Quien decide seguir adelante",
  "El que no se queda quieto", "Alguien que progresa",
  "El que sigue aprendiendo", "Quien no abandona",
  "El que se mantiene constante", "Alguien que no se rinde",
  "El que lo intenta cada día", "Quien construye su propio camino",
  "El que da un paso más", "Alguien que no se conforma",
  "El que quiere lograrlo", "Quien trabaja por lo que quiere",
  "El que sigue creciendo", "Alguien que se enfoca",
  "El que insiste hasta lograrlo", "Quien no pierde el rumbo",
  "El que empieza", "El que sigue",
  "El que lo vuelve a intentar", "El que aprende",
  "El que se equivoca y sigue", "El que mejora",
  "El que avanza", "El que insiste",
  "El que lo intenta otra vez", "El que quiere mejorar",
  "El que se enfoca", "El que hace el esfuerzo",
  "Un buen hábito", "El esfuerzo",
  "La práctica", "El intento", "El trabajo",
  "La mejora", "El hábito", "El tiempo", "La paciencia",
  "Hacerlo hoy", "Intentarlo otra vez", "Seguir adelante",
  "No rendirse", "Empezar ya", "Dar el primer paso",
  "Seguir intentando", "Aprender de los errores",
  "Mejorar poco a poco", "Probar algo nuevo",
  "Volver a empezar", "Hacer el esfuerzo",
  "Mantenerse firme", "No detenerse"
];

const verbos = [
  "avanza poquito a poco", "marca la diferencia",
  "trae buenos resultados", "abre oportunidades",
  "siempre vale la pena", "te acerca a lo que quieres",
  "mejora con el tiempo", "deja una buena lección",
  "abre caminos", "genera cambios reales",
  "te ayuda a crecer", "requiere paciencia",
  "toma tiempo, pero funciona", "suma más de lo que crees",
  "te prepara para lo que viene", "da frutos a largo plazo",
  "te hace más fuerte", "es parte del proceso",
  "te impulsa a seguir", "crea nuevas posibilidades",
  "te enseña algo nuevo", "refuerza tu disciplina",
  "te acerca a tu meta", "depende de tu constancia",
  "requiere esfuerzo, pero vale la pena", "te construye día a día",
  "es clave para avanzar", "hace que todo cobre sentido",
  "te mantiene en movimiento", "te ayuda a mejorar cada día",
  "te lleva más lejos de lo que imaginas"
];

const cierres = [
  "Sigue así.", "No te detengas.", "Vale la pena.",
  "Confía en el proceso.", "Paso a paso.",
  "Todo suma.", "Sigue intentándolo.",
  "No te rindas.", "Vas bien.", "Continúa.",
  "Hazlo sencillo.", "Sigue aprendiendo.",
  "Cada día cuenta.", "Mantente firme.",
  "Disfruta el camino.", "Todo mejora con el tiempo.",
  "Sigue avanzando.", "No pierdas el ritmo.",
  "Vas progresando.", "Sigue con eso.",
  "Haz que valga la pena.", "No pares ahora.",
  "Vas mejorando.", "Sigue creciendo.",
  "Confía en ti.", "No te frenes ahora.",
  "Sigue dando lo mejor de ti.", "Mantén el foco.",
  "Todo esfuerzo suma.", "No lo dejes a medias."
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@!%&░▒▓█▌▐▀▄▂▃▅▆▇";
const SECRET_THRESHOLD = 15;

let animId = null;
let lastCombo = "";
let isAnimating = false;
const audio = new Audio(SOUND_FILE);

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPhrase() {
  let phrase, attempts = 0;
  do {
    phrase = pick(sujetos) + " " + pick(verbos) + ". " + pick(cierres);
    attempts++;
  } while (phrase === lastCombo && attempts < 10);
  lastCombo = phrase;
  return phrase;
}

function scrambleAnimate(target) {
  const container = document.getElementById('p-text');

  if (animId) {
    clearInterval(animId);
    animId = null;
  }

  container.innerHTML = '';
  const spans = [];

  for (let i = 0; i < target.length; i++) {
    const span = document.createElement('span');
    span.className = 'char ' + (target[i] === ' ' ? 'resolved' : 'scrambling');
    span.textContent = target[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
    container.appendChild(span);
    spans.push(span);
  }

  const resolved = target.split('').map(c => c === ' ');
  let resolvedCount = resolved.filter(Boolean).length;
  const total = target.length;
  const DURATION = 1400;
  const generation = ++scrambleAnimate.generation;

  for (let i = 0; i < total; i++) {
    if (target[i] === ' ') continue;
    const delay = (i / total) * DURATION * 0.65 + Math.random() * 200;

    setTimeout(() => {
      if (scrambleAnimate.generation !== generation) return;

      resolved[i] = true;
      spans[i].textContent = target[i];
      spans[i].className = 'char resolved';
      resolvedCount++;

      if (resolvedCount >= total) {
        isAnimating = false;
        document.getElementById('btn').disabled = false;
        if (pendingSpecial) {
          buildHoja();
          if (pendingSpecial.type === 'phrase') {
            renderSpecialPhrase(pendingSpecial.data);
          } else {
            renderWordPhrase(pendingSpecial.data);
          }
          pendingSpecial = null;
        }
      }
    }, delay + DURATION * 0.35);
  }

  animId = setInterval(() => {
    if (scrambleAnimate.generation !== generation) {
      clearInterval(animId);
      animId = null;
      return;
    }
    for (let i = 0; i < total; i++) {
      if (!resolved[i]) {
        spans[i].textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
  }, 50);

  setTimeout(() => {
    if (scrambleAnimate.generation !== generation) return;
    clearInterval(animId);
    animId = null;
  }, DURATION + 400);
}

scrambleAnimate.generation = 0;

function checkSecretButton() {
  const clicks = parseInt(localStorage.getItem('lucky_clicks') || '0');
  const existing = document.getElementById('secret-btn');

  if (clicks >= SECRET_THRESHOLD) {
    if (!existing) {
      const btn = document.createElement('a');
      btn.id = 'secret-btn';
      btn.href = 'https://yuta578.github.io/ai/';
      btn.textContent = '▇';
      btn.style.cssText = `
        position: fixed;
        bottom: 18px;
        right: 20px;
        color: rgba(255,255,255,0.12);
        font-size: 11px;
        letter-spacing: 0.1em;
      `;
      document.body.appendChild(btn);
    }
  }
}

let pendingSpecial = null;

function pickSpecial() {
  const found = getFoundSet();
  const availablePhrases = specialPhrases.filter(p => !found.has('sp:' + p.slice(0, 30)));
  const availableWords   = specialWordPhrases.filter(p => !found.has('wp:' + p[1] + ':' + p[0].slice(0, 20)));

  if (availablePhrases.length + availableWords.length === 0) return null;

  if (availablePhrases.length === 0) {
    return { type: 'word', data: availableWords[Math.floor(Math.random() * availableWords.length)] };
  }
  if (availableWords.length === 0) {
    return { type: 'phrase', data: availablePhrases[Math.floor(Math.random() * availablePhrases.length)] };
  }
  if (Math.random() < 0.5) {
    return { type: 'phrase', data: availablePhrases[Math.floor(Math.random() * availablePhrases.length)] };
  } else {
    return { type: 'word', data: availableWords[Math.floor(Math.random() * availableWords.length)] };
  }
}

function generate() {
  if (isAnimating) return;
  if (document.getElementById("btn").disabled) return;
  if (localStorage.getItem(MISION2_KEY) === '1' && parseFloat(localStorage.getItem('mision2_progress') || '0') <= 0) return;

  isAnimating = true;
  pendingSpecial = null;
  document.getElementById('btn').disabled = true;

  audio.currentTime = 0;
  audio.play().catch(() => {});

  const clicks = parseInt(localStorage.getItem('lucky_clicks') || '0') + 1;
  localStorage.setItem('lucky_clicks', clicks);

  const missionActive = localStorage.getItem(AI_CHAT_DONE) === '1';
  const alreadyDone   = localStorage.getItem(MINI_DONE) === '1';
  let displayText;

  if (missionActive && !alreadyDone && Math.random() < SPECIAL_PROB) {
    const special = pickSpecial();
    if (special) {
      pendingSpecial = special;
      displayText = special.type === 'phrase'
        ? special.data
        : special.data[0] + special.data[1] + special.data[2];
    } else {
      displayText = buildPhrase();
    }
  } else {
    displayText = buildPhrase();
  }

  scrambleAnimate(displayText);
  checkSecretButton();
  checkMision2();
}

document.getElementById('btn').addEventListener('click', generate);

// ── MISIÓN 2: MANIVELA ──────────────────────────────────────
const MISION2_KEY    = 'mision2_started';
const MISION2_INTRO  = 'mision2_intro_done';
const MISION2_DONE   = 'mision2_done';
const MISION2_CLICKS = 30;

const mision2Lines = [
  "Veo que te gusta hacer esto.",
  "lamentablemente esto gasta mucha energia.",
  "Y No eres el unico generando frases.",
  "Para generar frases, necesitas energía.",
  "Y procesarlas aun mas.",
  "Y aveces esto puede corromperlas.",
  "te propongo un trato.",
  "Desde ahora apareceran frases en su estado original.",
  "sin procesar.",
  "Tu trabajo sera reportarlas.",
  "SOLO en caso de ver anormalidades.",
  "Tambien Tendras que generar tu propia energia.",
  "Solo gira el mecanismo.",
  "Te recomendaria no dejar que llege a 0%.",
  "Cuando estés listo, gira la manivela."
];

function buildManivela() {
  if (document.getElementById('manivela-trigger')) return;

  // Flecha arriba (parte superior izquierda)
  const trigger = document.createElement('div');
  trigger.id = 'manivela-trigger';
  trigger.innerHTML = '&#8681 &#8681 &#8681;';
  trigger.style.cssText = `position:fixed;left:28px;top:28px;font-size:18px;color:rgba(200,190,160,0.35);cursor:default;user-select:none;transition:color 0.3s;z-index:100;`;

  // Panel (baja desde arriba)
  const panel = document.createElement('div');
  panel.id = 'manivela-panel';
  panel.style.cssText = `position:fixed;left:0;top:0;width:260px;height:55vh;background:#0d0d0d;border-bottom:1px solid #1e1e1e;border-right:1px solid #1e1e1e;transform:translateY(-100%);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);z-index:99;display:flex;flex-direction:column;align-items:center;padding:24px 28px 20px;box-sizing:border-box;`;

  // Botón cerrar (flecha arriba dentro del panel, en la parte de abajo)
  const closeBtn = document.createElement('div');
  closeBtn.innerHTML = '&#8679 &#8679 &#8679;';
  closeBtn.style.cssText = `font-size:16px;color:rgba(200,190,160,0.3);cursor:default;user-select:none;text-align:center;margin-top:auto;transition:color 0.2s;flex-shrink:0;`;
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = 'rgba(200,190,160,0.7)'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = 'rgba(200,190,160,0.3)'; });

  // Título
  const title = document.createElement('div');
  title.style.cssText = `font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:#333;margin-bottom:20px;font-family:'Georgia',serif;flex-shrink:0;width:100%;`;
  title.textContent = '';

  // ── Manivela ──
  const manivelWrap = document.createElement('div');
  manivelWrap.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;flex:1;justify-content:center;`;

  // Círculo
  const circle = document.createElement('div');
  circle.style.cssText = `width:120px;height:120px;border:1px solid #2a2a2a;border-radius:50%;position:relative;flex-shrink:0;`;

  const center = document.createElement('div');
  center.style.cssText = `width:6px;height:6px;background:#444;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);`;

  const handle = document.createElement('div');
  handle.style.cssText = `width:14px;height:14px;background:#6a8a5a;border-radius:50%;position:absolute;cursor:grab;transition:background 0.2s;`;

  circle.appendChild(center);
  circle.appendChild(handle);

  // Barra
  const barWrap = document.createElement('div');
  barWrap.style.cssText = `width:100%;height:6px;background:#1a1a1a;border:1px solid #2a2a2a;box-sizing:border-box;`;
  const barFill = document.createElement('div');
  barFill.style.cssText = `height:100%;width:0%;background:#6a8a5a;transition:width 0.08s linear;`;
  barWrap.appendChild(barFill);

  // Label barra
  const barLabel = document.createElement('div');
  barLabel.style.cssText = `font-size:8px;letter-spacing:0.2em;color:#333;font-family:'Georgia',serif;text-transform:uppercase;`;
  barLabel.textContent = '0%';

  manivelWrap.appendChild(circle);
  const warning = document.createElement('div');
  warning.id = 'manivela-warning';
  warning.textContent = '⚠';
  warning.style.cssText = `font-size:18px;color:#cc3333;opacity:0;transition:opacity 0.4s ease;margin-top:4px;`;
  manivelWrap.appendChild(barWrap);
  manivelWrap.appendChild(barLabel);
  manivelWrap.appendChild(warning);

  panel.appendChild(title);
  panel.appendChild(manivelWrap);
  panel.appendChild(closeBtn);
  document.body.appendChild(panel);
  document.body.appendChild(trigger);

  // ── Lógica manivela ──
  const radius = 42;
  let grabbing = false;
  let lastAngle = null;
  let progress = parseFloat(localStorage.getItem('mision2_progress') || '0');

  function updateHandle(angle) {
    const x = 60 + Math.cos(angle) * radius;
    const y = 60 + Math.sin(angle) * radius;
    handle.style.left = (x - 7) + 'px';
    handle.style.top  = (y - 7) + 'px';
  }
  updateHandle(0);

  const alarmSound = new Audio('media/alert3.mp3');
  alarmSound.loop = true;
  alarmSound.volume = 0.4;

  const cutSound = new Audio('media/alert2.mp3');

  function setProgress(val) {
    const prev = progress;
    progress = Math.max(0, Math.min(100, val));
    barFill.style.width = progress + '%';
    barLabel.textContent = Math.round(progress) + '%';
    localStorage.setItem('mision2_progress', progress);

    // Warning visual
    const warningEl = document.getElementById('manivela-warning');
    if (warningEl) warningEl.style.opacity = progress <= 0 ? '1' : '0';

    if (progress >= 100 && localStorage.getItem(MISION2_DONE) !== '1') {
      localStorage.setItem(MISION2_DONE, '1');
      onManivelaDone();
    }
    // Si se vacía: cortar scramble, sonar alarma y cut
    if (progress <= 0 && prev > 0) {
      if (isAnimating) {
        scrambleAnimate.generation++;
        if (animId) { clearInterval(animId); animId = null; }
        isAnimating = false;
        audio.pause();
        cutSound.play().catch(()=>{});
        audio.currentTime = 0;
        cutSound.currentTime = 0;
        document.getElementById('btn').disabled = true;
      }
      alarmSound.currentTime = 0;
      alarmSound.play().catch(()=>{});
    }
    // Silenciar alarma al recargar
    if (progress > 0 && prev <= 0) {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }
    // Reactivar botón cuando vuelve a tener carga
    if (progress > 0 && !isAnimating && localStorage.getItem(MISION2_INTRO) === '1') {
      document.getElementById('btn').disabled = false;
    }
  }
  setProgress(progress);

  handle.addEventListener('mousedown', (e) => { grabbing=true; handle.style.cursor='grabbing'; handle.style.background='#8aaa7a'; e.preventDefault(); });
  document.addEventListener('mouseup', () => { grabbing=false; handle.style.cursor='grab'; handle.style.background='#6a8a5a'; lastAngle=null; });
  document.addEventListener('mousemove', (e) => {
    if (!grabbing) return;
    const rect = circle.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if (Math.abs(dist - radius) > 40) { grabbing=false; lastAngle=null; return; }
    const angle = Math.atan2(dy, dx);
    if (lastAngle !== null) {
      let diff = angle - lastAngle;
      if (diff > Math.PI) diff -= 2*Math.PI;
      if (diff < -Math.PI) diff += 2*Math.PI;
      if (diff < 0) { lastAngle = angle; return; }
      setProgress(progress + diff * 1.5);
    }
    updateHandle(angle);
    lastAngle = angle;
  });

  // Baja sola
  setInterval(() => { setProgress(progress - 0.1); }, 30);

  // Abrir/cerrar panel
  let open = false;
  function openPanel() { open=true; panel.style.transform='translateY(0)'; trigger.style.color='rgba(200,190,160,0)'; hojaSound.currentTime=0; hojaSound.play().catch(()=>{}); }
  function closePanel() { open=false; panel.style.transform='translateY(-100%)'; trigger.style.color='rgba(200,190,160,0.35)'; hojaSound.currentTime=0; hojaSound.play().catch(()=>{}); }

  trigger.addEventListener('mouseenter', () => { if (!open) { trigger.style.color='rgba(200,190,160,0.7)'; openPanel(); } });
  trigger.addEventListener('mouseleave', () => { if (!open) trigger.style.color='rgba(200,190,160,0.35)'; });
  trigger.addEventListener('click', () => { if (!open) openPanel(); });
  closeBtn.addEventListener('click', () => { if (open) closePanel(); });
}

function onManivelaDone() {
  // Placeholder — aquí va lo que pasa al llegar al 100%
}

const reportSound = new Audio('media/report.mp3');
reportSound.volume = 0.3;

// Función para construir el botón "Reportar" y añadir la animación de entrada
function buildReportButton(isReload = false) {
  if (document.getElementById('report-btn')) return;

  const reportBtn = document.createElement('button');
  reportBtn.id = 'report-btn';
  reportBtn.className = 'report-btn';
  reportBtn.textContent = 'Reportar';

  reportBtn.addEventListener('click', () => {
    reportSound.currentTime = 0;
    reportSound.play().catch(() => {});
  });

  const btnWrap = document.getElementById('btn-wrap');
  if (btnWrap) {
    btnWrap.parentElement.appendChild(reportBtn);
    
    if (isReload) {
      // Si es una recarga, quitamos la transición temporalmente y lo mostramos ya
      reportBtn.style.transition = 'none'; 
      reportBtn.classList.add('visible');
      // Forzamos un reflow y devolvemos la transición para futuros hovers
      setTimeout(() => { reportBtn.style.transition = ''; }, 50);
    } else {
      // Si es la primera vez (Misión 2 activándose), hacemos la animación
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reportBtn.classList.add('visible');
        });
      });
    }
  }
}

function showMision2Intro() {
  if (localStorage.getItem(MISION2_INTRO) === '1') {
    buildManivela();
    buildReportButton();
    return;
  }

  const luckyBtn = document.getElementById('btn');
  luckyBtn.disabled = true;

  const flor = document.querySelector('.prescrip-image');
  let lineIndex = 0;

  function showNextLine() {
    if (lineIndex >= mision2Lines.length) {
      localStorage.setItem(MISION2_INTRO, '1');
      luckyBtn.disabled = false;
      
      buildReportButton();
      buildManivela();
      return;
    }

    const el = document.createElement('div');
    el.style.cssText = `position:fixed;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a09880;font-family:'Georgia',serif;opacity:0;transition:opacity 0.6s ease;pointer-events:none;white-space:nowrap;`;
    el.textContent = mision2Lines[lineIndex];
    document.body.appendChild(el);

    if (flor) {
      const rect = flor.getBoundingClientRect();
      el.style.top = (rect.top - 24) + 'px';
    } else {
      el.style.top = '60px';
    }

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => {
          el.remove();
          lineIndex++;
          showNextLine();
        }, 700);
      }, 2500);
    });
  }

  showNextLine();
}

function checkMision2() {
  const clicks = parseInt(localStorage.getItem('lucky_clicks') || '0');
  if (clicks >= MISION2_CLICKS && localStorage.getItem(MISION2_KEY) !== '1') {
    localStorage.setItem(MISION2_KEY, '1');
    showMision2Intro();
  }
}

// ── FIN MISIÓN 2 ─────────────────────────────────────────────

checkSecretButton();
if (localStorage.getItem('prescript_intro_seen') === '1') showWelcome();

if (localStorage.getItem(AI_CHAT_DONE) === '1') {
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', buildHoja) : buildHoja();
}

// Si la Misión 2 ya comenzó, construimos tanto la manivela como el botón de reportar
if (localStorage.getItem(MISION2_KEY) === '1') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildManivela();
      buildReportButton(true);
    });
  } else {
    buildManivela();
    buildReportButton(true);
  }
}

window.addEventListener('storage', function(e) {
  if (e.key === AI_CHAT_DONE && e.newValue === '1') buildHoja();
});


(function initIntro() {
  const INTRO_KEY = 'prescript_intro_seen';

  const startScreen  = document.getElementById('start-screen');
  const startBtn     = document.getElementById('start-btn');
  const dialogScreen = document.getElementById('dialog-screen');
  const dialogBox    = document.getElementById('dialog-box');
  const dialogText   = document.getElementById('dialog-text');
  const dialogNext   = document.getElementById('dialog-next');
  const prescripWrap = document.getElementById('prescrip-wrap');
  const btnWrap      = document.getElementById('btn-wrap');
  const luckyBtn     = document.getElementById('btn');

  const lines = [
    "...",
    "Hace mucho no veo a alguien por aquí.",
    "No tengas miedo.",
    "Solo soy una observadora.",
    "Te voy a mostrar algo que puede ayudarte.",
    "Aqui te mostrara mensajes para ti.",
    "Cada frase te puede resonar.",
    "No hay respuesta correcta.",
    "La pantalla te mostrara lo que tengas que ver",
    "o saber...",
    "Cuando quieras, pulsa el botón.",
    "Buena suerte."
  ];

  const SHOW_BOX_AFTER  = 4;

  let currentLine = 0;

  if (localStorage.getItem(INTRO_KEY)) {
    startScreen.style.display  = 'none';
    dialogScreen.style.display = 'none';
    prescripWrap.classList.add('no-intro');
    btnWrap.classList.add('no-intro');
    return;
  }

  luckyBtn.disabled = true;

  function showLine(idx) {
    dialogBox.classList.remove('visible');

    setTimeout(function () {
      dialogText.textContent = lines[idx];
      dialogBox.classList.add('visible');
    }, 240);
  }

  startBtn.addEventListener('click', function () {
    startScreen.style.transition    = 'opacity 0.35s ease';
    startScreen.style.opacity       = '0';
    startScreen.style.pointerEvents = 'none';

    setTimeout(function () {
      startScreen.style.display = 'none';
      dialogScreen.classList.add('active');
      dialogText.textContent = lines[0];

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          dialogBox.classList.add('visible');
        });
      });
    }, 350);
  });

  dialogNext.addEventListener('click', function () {
    if (currentLine === SHOW_BOX_AFTER) {
      prescripWrap.classList.add('visible');
    }

    currentLine++;

    if (currentLine < lines.length) {
      showLine(currentLine);
    } else {
      localStorage.setItem(INTRO_KEY, '1');

      dialogBox.classList.remove('visible');

      setTimeout(function () {
        dialogScreen.classList.remove('active');

        btnWrap.classList.add('visible');

        // Estado inicial
        btnWrap.style.opacity = '0';
        btnWrap.style.transform = 'translate(-50%, -80px)';
        btnWrap.style.transition =
          'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease';

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            // Baja desde el centro y termina pegado al borde
            btnWrap.style.opacity = '1';
            btnWrap.style.transform = 'translateX(-50%) translateY(100%)';
          });
        });

        setTimeout(function () {
          luckyBtn.disabled = false;
        }, 520);
      }, 350);
    }
  });
})();


