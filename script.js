/* ============================================================
   Royal Decree of Agrabah — Core Logic
   Vanilla ES6 modules. No dependencies.
   ============================================================ */

/* ---------- Configuration ---------- */

const DIALOGUE_LINES = Object.freeze([
  "Mentre ti riposi in una calda giornata sule prime dune del deserto, il bollente vento sul viso, noti uno strano individuo correre verso di te.",
  "Hai la faccia di uno svelto. Sei come mi avevano detto, ti avrei riconosciuto anche in una tempesta di sabbia.",
  "Porto con me un decreto dal palazzo reale di Nevjan al Rubin...",
  "Dovresti essere molto onorato...",
  "O forse spaventato... Al destino l'ultima parola.",
  "E' una lettera molto importante, mi raccomandano di non aprirla davanti ad amici o fratelli...",
  "Rischiereste guai seri, a Nevjan al Rubin non scherzano con le minacce.",
  "E sopratutto non posso consegnarlo a chiunque, il mio istinto non basta. ",
  "Dichiara il tuo nome e cognome, giovane del deserto.",
]);

const TYPE_SPEED_MS = 32; // per-character delay while typing
const FADE_DURATION_MS = 1400; // must match --fade-duration in style.css
const ERROR_DISPLAY_MS = 2600; // how long the "name not found" state lingers
const SPRITE_SWAP_FADE_MS = 150; // each half (out/in) of the portrait swap

/**
 * letterContents
 * ------------------------------------------------------------
 * Each key holds the full HTML markup injected into
 * `.letter-content-wrapper` — title, body paragraphs, signature.
 * Swap these placeholders for the real invite copy later.
 */
const letterContents = Object.freeze({
  mercante: `
    <div class="letter-body">
      <h2>Al rinomato mercante Mario Rossi,</h2>
      <p>Il Nostro Sultanato è in festa. Abbiamo stabilito che la Nostra amata figlia andra in sposa a un partito di altissimo lignaggio. Per celebrare questa unione, stiamo organizzando festeggiamenti di una magnificenza mai vista prima.
Desideriamo che il giubilo per questo evento raggiunga ogni angolo delle terre conosciute e che la Nostra corte sia gremita in ogni suo spazio. Per questo motivo, vi concediamo l'eccezionale privilegio di accedere alle Nostre terre per assistere alle nozze, partecipare ai banchetti e testimoniare con i vostri occhi la ricchezza del Sultanato. Sara inoltre un'ottima occasione per voi per esporre le vostre merci o presentare i vostri omaggi alla Nostra famiglia.
Per il vostro viaggio, vi e concesso l'utilizzo del Sultanexpress, che abbiamo messo a disposizione per l'occasione. La partenza e fissata inderogabilmente per il 26 luglio dall’oasi di Al Faustin alle ore 8:30. Siate puntuali.
</p>
    </div>
    <p class="letter-signature">In attesa del vostro arrivo,
سلطان, il sultano
Sultanato di Navier al Rubin</p>
  `,
  serpente: `
    <div class="letter-body">
      <p>Al subdolo ammaliatore di serpenti Mario Rossi,</p>
      <p>Come avrete udito, il palazzo è in grande festa. Il nostro buon Sultano, nel suo grande entusiasmo, ha deciso di aprire le porte della città a chiunque per le nozze della Principessa. Un gesto senza dubbio generoso... ma che crea anche la tempesta perfetta per chi sa cogliere le giuste occasioni.
Mentre gli sguardi di tutta la corte saranno fissi sulla parata, ci sono affari molto più... discreti che devono essere portati a termine. Conosco bene le vostre abilità. So che voi siete abilissimi incantatori di serpenti, capaci di ammaliare le menti altrui con le vostre melodie, perfetti per confondere chiunque vi faccia troppe domande.
Il mio ordine per voi è di infiltrarvi al matrimonio.
Sfruttate l'invito aperto del Sultano a nostro vantaggio. Egli ha concesso a tutti l'uso del suo Sultanexpress: usatelo come perfetta copertura per entrare nei confini del regno senza destare il minimo sospetto. La partenza è fissata per il 26 luglio dall’oasi di Al Faustin alle ore 8:30.
Salite. Mimetizzatevi. Siate puntuali. Ma soprattutto... non date nell'occhio. Vi osserverò segretamente fin dal vostro arrivo. Mescolatevi alla folla festante e tenetevi pronti nell'ombra, in attesa del mio segnale.
Un compito di vitale importanza vi attende, e chi mi sarà fedele riceverà ricompense oltre ogni immaginazione. Non deludetemi.
</p>
    </div>
    <p class="letter-signature">In segreto,
جعفر
Gran Visir del Sultanato di Navier al Rubin</p>
  `,
  ladrone: `
    <div class="letter-body">
      <p>Allo scaltro ladrone delle dune Mario Rossi,</p>
      <p>
Come avrete udito, il palazzo è in grande festa. Il nostro buon Sultano, nel suo grande entusiasmo, ha deciso di aprire le porte della città a chiunque per le nozze della Principessa. Un gesto senza dubbio generoso... ma che crea anche la tempesta perfetta per chi sa cogliere le giuste occasioni.
Mentre gli sguardi di tutta la corte saranno fissi sulla parata, ci sono affari molto più... discreti che devono essere portati a termine. Conosco bene le vostre abilità. So che voi siete tra i più subdoli ladroni, maestri nell'agire invisibili alle guardie distratte, capaci di scivolare ovunque senza essere visti.
Il mio ordine per voi è di infiltrarvi al matrimonio.
Sfruttate l'invito aperto del Sultano a nostro vantaggio. Egli ha concesso a tutti l'uso del suo Sultanexpress: usatelo come perfetta copertura per entrare nei confini del regno senza destare il minimo sospetto. La partenza è fissata per il 26 luglio dall’oasi di Al Faustin alle ore 8:30.
Salite. Mimetizzatevi. Siate puntuali. Ma soprattutto... non date nell'occhio. Vi osserverò segretamente fin dal vostro arrivo. Mescolatevi alla folla festante e tenetevi pronti nell'ombra, in attesa del mio segnale.
Un compito di vitale importanza vi attende, e chi mi sarà fedele riceverà ricompense oltre ogni immaginazione. Non deludetemi.
</p>
    </div>
    <p class="letter-signature">In segreto,
جعفر
Gran Visir del Sultanato di Navier al Rubin</p>
  `,
  nobile: `
    <div class="letter-body">
      <p>A sua Eccellenza Mario Rossi,</p>
      <p>Con la presente desideriamo esprimere la Nostra piu alta considerazione nei confronti della Vostra persona e della Vostra stimata Casata.
E Nostro preciso desiderio favorire lo stringersi di piu saldi legami e di proficue relazioni tra le nostre realta. Avendo un figlio in eta da marito, e conoscendo il valore, la nobilta e i meriti che Vi distinguono, saremmo lieti di averVi Nostro gradito ospite presso la Nostra residenza.
Con il presente invito, abbiamo pertanto l'onore di sollecitarVi a fare visita al Nostro Sultanato, al fine di intrattenerVi con la Nostra Famiglia, godere della Nostra ospitalita e valutare congiuntamente le prospettive di un’unione che possa recare lustro e beneficio a entrambe le parti.
Per rendere il Vostro viaggio massimamente confortevole, abbiamo il piacere di informarVi che abbiamo messo a Vostra completa disposizione il Sultanexpress. Il mezzo partira ufficialmente dall’oasi di Al Faustin domenica 26 luglio alle ore 8:30.
In attesa di un Vostro cortese riscontro che confermi la Vostra gradita presenza a bordo, Vi rinnoviamo i sensi della Nostra piu profonda stima.
</p>
    </div>
    <p class="letter-signature">In attesa del vostro arrivo,
سلطان, il sultano
Sultanato di Navier al Rubin</p>
  `,
});

/**
 * playerRegistry
 * ------------------------------------------------------------
 * Maps a normalized (trimmed, lowercased, single-spaced) full
 * name — see normalizeName() — to a key in `letterContents`.
 */
const playerRegistry = Object.freeze({
  "emma liuzzi": "mercante",
  "alessandro zangaro": "mercante",
  "mario stentardo": "mercante",
  "dario ferrari": "mercante",
  "bianca manfredini": "mercante",
  "martina spallacci": "mercante",
  "gabriele bagni": "mercante",
  "letizia moretti": "mercante",

  "margherita romani": "nobile",
  "marco zangaro": "nobile",
  "alberto tripoli": "nobile",
  "carlo alberto pighi": "nobile",
  "matilde d'amelio": "nobile",
  "luca d'angelo": "nobile",
  "beatrice petocchi": "nobile",
  "tobia mazzotti": "nobile",
  "rebecca venturelli": "nobile",

  "diego spallacci": "serpente",
  "agata baldini": "serpente",
  "gioele rubbianesi": "serpente",
  "ester mazzotti": "serpente",
  "bianca bottura": "serpente",
  "mirko ahmed mohamed": "serpente",
  "lucia vivi": "serpente",
  "alessandro emanuel": "serpente",
  "matilde pighi": "serpente",

  "giovanni bellucci": "ladrone",
  "anna vivi": "ladrone",
  "bianca moretti": "ladrone",
  "lorenzo emanuel": "ladrone",
  "matilde reggiani": "ladrone",
  "mattia marrara": "ladrone",
  "alessia nizzoli": "ladrone",
  "adriano sanchez zegarra": "ladrone",
  "emilia ballestrazzi": "ladrone",
});

// Letter categories that use the sinister (Jafar) visual theme.
const DARK_THEME_LETTERS = new Set(["serpente", "ladrone"]);

/* ============================================================
   View Manager
   ------------------------------------------------------------
   Cross-fades between .view sections. Only one view is active
   at a time; inactive views become display:none so they cannot
   intercept pointer events.
   ============================================================ */
class ViewManager {
  constructor(selector = ".view") {
    this.views = new Map();
    document.querySelectorAll(selector).forEach((el) => {
      this.views.set(el.id, el);
    });
    this.current =
      [...this.views.values()].find((v) => !v.classList.contains("hidden")) ??
      null;
  }

  /**
   * Fade out the current view, then fade in the target.
   * @param {string} viewId  e.g. "view-dialogue"
   * @returns {Promise<void>}
   */
  async switchView(viewId) {
    const next = this.views.get(viewId);
    if (!next || next === this.current) return;

    const prev = this.current;

    if (prev) {
      prev.classList.add("is-fading");
      await wait(FADE_DURATION_MS);
      prev.classList.add("hidden");
      prev.classList.remove("is-fading");
    }

    // Reveal next: unhide, force reflow, then fade in from opacity 0.
    next.classList.add("is-fading");
    next.classList.remove("hidden");
    void next.offsetWidth; // reflow so the transition actually runs
    next.classList.remove("is-fading");

    this.current = next;
    await wait(FADE_DURATION_MS);
  }
}

/* ============================================================
   Typewriter
   ------------------------------------------------------------
   Prints a string character-by-character into a target element.
   Exposes skip() to instantly complete the current line.
   ============================================================ */
class Typewriter {
  /**
   * @param {HTMLElement} target
   * @param {number} speed  ms per character
   */
  constructor(target, speed = TYPE_SPEED_MS) {
    this.target = target;
    this.speed = speed;
    this._timer = null;
    this._resolve = null;
    this.isTyping = false;
    this._fullText = "";
  }

  /**
   * Type out a line. Resolves when finished (whether naturally or skipped).
   * @param {string} text
   * @returns {Promise<void>}
   */
  type(text) {
    this.cancel();
    this._fullText = text;
    this.isTyping = true;
    this.target.textContent = "";
    this.target.classList.add("is-typing");

    return new Promise((resolve) => {
      this._resolve = resolve;
      let i = 0;

      const step = () => {
        this.target.textContent = text.slice(0, i);
        if (i < text.length) {
          i += 1;
          this._timer = setTimeout(step, this.speed);
        } else {
          this._finish();
        }
      };
      step();
    });
  }

  /** Instantly reveal the full line. */
  skip() {
    if (!this.isTyping) return;
    this._clearTimer();
    this.target.textContent = this._fullText;
    this._finish();
  }

  /** Abort silently without resolving a new-line render. */
  cancel() {
    this._clearTimer();
    if (this._resolve) {
      const r = this._resolve;
      this._resolve = null;
      this.isTyping = false;
      this.target.classList.remove("is-typing");
      r();
    }
  }

  _finish() {
    this._clearTimer();
    this.isTyping = false;
    this.target.classList.remove("is-typing");
    if (this._resolve) {
      const r = this._resolve;
      this._resolve = null;
      r();
    }
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}

/* ============================================================
   Dialogue Controller
   ------------------------------------------------------------
   Drives the sequence of lines, handles advance-on-click, and
   injects the name prompt once the script is exhausted.
   ============================================================ */
class DialogueController {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.root        the clickable dialogue view
   * @param {HTMLElement} opts.box         the dialogue box element
   * @param {HTMLElement} opts.textEl      element that receives typed text
   * @param {HTMLElement} opts.indicator   the "next" triangle
   * @param {HTMLImageElement} [opts.sprite]  messenger portrait, alternated on advance
   * @param {string[]}    opts.lines       dialogue script
   * @param {(name: string) => void} opts.onSubmit  name-submit callback
   */
  constructor({ root, box, textEl, indicator, sprite, lines, onSubmit }) {
    this.root = root;
    this.box = box;
    this.textEl = textEl;
    this.indicator = indicator;
    this.sprite = sprite;
    this.lines = lines;
    this.onSubmit = onSubmit;

    this.typewriter = new Typewriter(textEl);
    this.index = -1;
    this.finished = false; // true once name prompt is shown

    this._spriteSrcs = sprite
      ? [sprite.getAttribute("src"), sprite.dataset.altSrc]
      : null;
    this._spriteToggled = false;

    this._onClick = this._handleClick.bind(this);
  }

  start() {
    // Opening line is narration — no messenger on screen yet.
    this.sprite?.classList.add("is-hidden");
    this.root.addEventListener("click", this._onClick);
    this._advance();
  }

  _handleClick(evt) {
    if (this.finished) return; // prompt is showing; let the form handle input

    // Ignore clicks that originate inside interactive prompt controls.
    if (evt.target.closest(".name-prompt")) return;

    if (this.typewriter.isTyping) {
      this.typewriter.skip();
    } else {
      if (this.sprite?.classList.contains("is-hidden")) {
        // First reveal: just show the default portrait, no alternation.
        this.sprite.classList.remove("is-hidden");
      } else {
        this._toggleSprite();
      }
      this._advance();
    }
  }

  /**
   * Swap the messenger portrait each time the player clicks to
   * advance — fades out fast, swaps the src, then fades back in.
   */
  _toggleSprite() {
    if (!this._spriteSrcs || !this._spriteSrcs[1]) return;
    const sprite = this.sprite;

    sprite.classList.add("is-swap-fading"); // fast transition, for both halves
    sprite.classList.add("is-hidden"); // fade out

    setTimeout(() => {
      this._spriteToggled = !this._spriteToggled;
      sprite.src = this._spriteToggled ? this._spriteSrcs[1] : this._spriteSrcs[0];
      sprite.classList.remove("is-hidden"); // fade back in

      setTimeout(() => {
        sprite.classList.remove("is-swap-fading"); // restore default duration
      }, SPRITE_SWAP_FADE_MS);
    }, SPRITE_SWAP_FADE_MS);
  }

  async _advance() {
    this.index += 1;

    if (this.index >= this.lines.length) {
      this._showNamePrompt();
      return;
    }

    this._hideIndicator();
    await this.typewriter.type(this.lines[this.index]);

    // If we were cancelled mid-type (e.g. teardown), bail out.
    if (this.typewriter.isTyping) return;
    this._showIndicator();
  }

  _showIndicator() {
    this.indicator.classList.add("is-visible");
  }

  _hideIndicator() {
    this.indicator.classList.remove("is-visible");
  }

  _showNamePrompt() {
    this.finished = true;
    this._hideIndicator();
    this.typewriter.cancel();
    this.textEl.textContent = "";

    const form = document.createElement("form");
    form.className = "name-prompt";
    form.noValidate = true;

    const input = document.createElement("input");
    input.type = "text";
    input.id = "player-name";
    input.className = "name-prompt__input";
    input.placeholder = "Scrivi il tuo nome...";
    input.autocomplete = "off";
    input.maxLength = 24;
    input.setAttribute("aria-label", "Il tuo nome");

    const button = document.createElement("button");
    button.type = "submit";
    button.className = "name-prompt__submit";
    button.textContent = "Dichiara";

    form.append(input, button);
    this.textEl.after(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const playerName = input.value.trim();
      if (!playerName) {
        input.focus();
        return;
      }
      console.log("Player name submitted:", playerName);
      handleNameSubmit(playerName);
    });

    input.focus();
  }

  destroy() {
    this.root.removeEventListener("click", this._onClick);
    this.typewriter.cancel();
  }
}

/* ============================================================
   Name → Letter routing
   ------------------------------------------------------------
   Looks the sanitized name up in playerRegistry. On a hit, the
   matching letter is injected into #view-letter and the app
   transitions there. On a miss, the dialogue box shakes and an
   inline error is shown so the player can try again.
   ============================================================ */
let errorClearTimer = null;

const LETTER_NAME_PLACEHOLDER = "Mario Rossi";

/** Case/whitespace-insensitive key for playerRegistry lookups. */
function normalizeName(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/** "emma liuzzi" / "EMMA LIUZZI" -> "Emma Liuzzi", for display in the letter. */
function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function handleNameSubmit(rawName) {
  const normalized = normalizeName(rawName);
  const letterKey = playerRegistry[normalized];

  if (!letterKey) {
    showNameError();
    return;
  }

  const displayName = toTitleCase(normalized);
  renderLetter(letterKey, displayName);
  playNameCue(letterKey);
  views.switchView("view-letter");
}

function showNameError() {
  const input = document.getElementById("player-name");
  const dialogueBox = document.getElementById("dialogue-box");
  const form = document.querySelector(".name-prompt");
  if (!input || !dialogueBox || !form) return;

  input.classList.add("has-error");
  input.focus();
  input.select();

  // Shake the box; remove+reflow first so repeated errors retrigger it.
  dialogueBox.classList.remove("is-shaking");
  void dialogueBox.offsetWidth;
  dialogueBox.classList.add("is-shaking");
  dialogueBox.addEventListener(
    "animationend",
    () => dialogueBox.classList.remove("is-shaking"),
    { once: true }
  );

  let errorEl = form.querySelector(".name-prompt__error");
  if (!errorEl) {
    errorEl = document.createElement("p");
    errorEl.className = "name-prompt__error";
    errorEl.setAttribute("role", "alert");
    form.append(errorEl);
  }
  errorEl.textContent = "Nome non trovato nel registro reale. Riprova.";
  errorEl.classList.add("is-visible");

  clearTimeout(errorClearTimer);
  errorClearTimer = setTimeout(() => {
    input.classList.remove("has-error");
    errorEl.classList.remove("is-visible");
  }, ERROR_DISPLAY_MS);
}

function renderLetter(letterKey, displayName) {
  const letterView = document.getElementById("view-letter");
  const wrapper = letterView.querySelector(".letter-content-wrapper");
  wrapper.innerHTML = letterContents[letterKey].replaceAll(
    LETTER_NAME_PLACEHOLDER,
    escapeHtml(displayName)
  );
  letterView.classList.toggle("theme-dark", DARK_THEME_LETTERS.has(letterKey));
}

/**
 * Plays a short sting once the name is declared: evil laughter for
 * the sinister letters (serpente/ladrone), an epic trumpet for the
 * good ones (mercante/nobile). Neither file is downloaded yet, so
 * both <audio> tags currently point at the same placeholder track —
 * swap their src in index.html once the real ones are in assets/.
 * Playback is clipped to the first SFX_CLIP_MS of whatever's loaded.
 */
const SFX_CLIP_MS = 3000;

function playNameCue(letterKey) {
  const cueId = DARK_THEME_LETTERS.has(letterKey) ? "sfx-evil" : "sfx-good";
  const cue = document.getElementById(cueId);
  if (!cue) return;

  cue.currentTime = 0;
  cue.play().catch(() => {});
  setTimeout(() => cue.pause(), SFX_CLIP_MS);
}

/* ============================================================
   Background music
   ------------------------------------------------------------
   No browser allows audible autoplay before the user has
   interacted with the page — that's a platform policy, not
   something JS can override. Muted autoplay, however, is always
   allowed, so we start the track muted the instant the page
   loads (the timeline is already ticking) and unmute on the very
   first interaction, so there's no separate "click to enable
   sound" step — it just becomes audible on whatever the visitor
   does first.
   ============================================================ */
const MUSIC_VOLUME = 1;
const MUSIC_START_TIME = 30; // seconds — skip the intro on first play
const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"];

function initBackgroundMusic() {
  const music = document.getElementById("bg-music");
  if (!music) return;
  music.volume = MUSIC_VOLUME;
  seekToStart(music);

  music.muted = true;
  music.play().catch(() => {
    // Even muted autoplay can be refused in rare cases; the unlock
    // gesture below will retry it regardless.
  });

  waitForUnlockGesture(() => {
    music.muted = false;
    music.play().catch(() => {});
  });
}

function seekToStart(music) {
  const setStart = () => {
    music.currentTime = MUSIC_START_TIME;
  };
  // currentTime can only be set once metadata (duration) is known.
  if (music.readyState >= 1) {
    setStart();
  } else {
    music.addEventListener("loadedmetadata", setStart, { once: true });
  }
}

function waitForUnlockGesture(callback) {
  const handler = () => {
    UNLOCK_EVENTS.forEach((evt) => document.removeEventListener(evt, handler));
    callback();
  };
  UNLOCK_EVENTS.forEach((evt) => document.addEventListener(evt, handler));
}

/* ============================================================
   Title Screen
   ------------------------------------------------------------
   First click reveals the quote (slow fade-in) and stays on the
   title screen. Second click cross-fades into the dialogue view;
   the typewriter only starts once that transition has fully
   resolved, so it never types over the fade.
   ============================================================ */
function initIntroScreen(onEnter) {
  const introView = document.getElementById("view-intro");
  const quote = document.querySelector(".intro-quote");
  if (!introView) return;

  let quoteRevealed = false;

  const handleClick = async () => {
    if (!quoteRevealed) {
      quoteRevealed = true;
      quote?.classList.add("is-visible");
      return;
    }

    introView.removeEventListener("click", handleClick);
    await views.switchView("view-dialogue");
    onEnter();
  };

  introView.addEventListener("click", handleClick);
}

/* ---------- Small utilities ---------- */

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================================
   Bootstrap
   ============================================================ */
const views = new ViewManager();

document.addEventListener("DOMContentLoaded", () => {
  const sprite = document.getElementById("messenger-sprite");
  if (sprite?.dataset.altSrc) {
    new Image().src = sprite.dataset.altSrc; // preload so the first swap is instant
  }

  const dialogue = new DialogueController({
    root: document.getElementById("view-dialogue"),
    box: document.getElementById("dialogue-box"),
    textEl: document.getElementById("dialogue-text"),
    indicator: document.getElementById("next-indicator"),
    sprite,
    lines: DIALOGUE_LINES,
    onSubmit: handleNameSubmit,
  });

  initIntroScreen(() => dialogue.start());
  initBackgroundMusic();
});

// Exposed for the next iteration (intro routing, letter interactions).
export {
  views,
  DialogueController,
  Typewriter,
  ViewManager,
  letterContents,
  playerRegistry,
};
