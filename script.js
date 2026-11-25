/* =========================================================
   happy hormones · instellingen
   Vul hier je links in. Meer hoef je in dit bestand niet te veranderen.
   ========================================================= */
var LINKS = {
  betaal: '',        // betaallink van je e-book (Plug&Pay, Payhip, ...)
  whatsapp: '',      // je nummer met landcode, zonder + of spaties, bv. '31612345678'
  calendly: ''       // optioneel: je Calendly-link. Ingevuld? Dan stuurt het aanmeldformulier mensen daarna door naar je agenda.
};

/* Formulieren koppelen (optioneel): plak hier het 'action'-adres van je formulierdienst
   (bv. MailerLite of Formspree). Leeg = het formulier toont alleen het bedankje. */
var FORMS = {
  scan: '',          // e-mail uit de hormoonscan
  ebook: '',         // gratis deel e-book
  plan: ''           // aanmelding kennismaking
};

/* ========================================================= */

(function () {
  // links invullen
  document.querySelectorAll('[data-link="betaal"]').forEach(function (a) {
    if (LINKS.betaal) a.href = LINKS.betaal; else a.addEventListener('click', function (e) { e.preventDefault(); alert('De betaallink is nog niet ingesteld.'); });
  });
  document.querySelectorAll('[data-link="whatsapp"]').forEach(function (a) {
    if (LINKS.whatsapp) a.href = 'https://wa.me/' + LINKS.whatsapp; else a.removeAttribute('target');
  });

  // menu: matglas tijdens scrollen
  var topbar = document.getElementById('topbar');
  function onScroll() { topbar.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobiel menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function () {
    var open = menu.hasAttribute('hidden');
    if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.setAttribute('hidden', ''); burger.setAttribute('aria-expanded', 'false'); });
  });

  // formulier versturen naar een dienst (als er een adres is ingevuld)
  function send(url, form) {
    if (!url) return Promise.resolve();
    return fetch(url, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } }).catch(function () {});
  }
  function validMail(m) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m); }

  // ===== hormoonscan =====
  var qs = [
    ['Hoe vaak heb je trek in zoet rond je menstruatie?', 'voeding'],
    ['Hoe vaak voel je je opgeblazen na het eten?', 'voeding'],
    ['Hoe vaak zie je pas daglicht als je de deur uit moet?', 'licht'],
    ["Hoe vaak zit je 's avonds lang op je telefoon?", 'licht'],
    ['Hoe vaak word je moe wakker?', 'slaap'],
    ["Hoe vaak lig je 's nachts te woelen?", 'slaap'],
    ['Hoe vaak voel je je gestrest of opgejaagd?', 'stress'],
    ['Hoe vaak lukt het je niet om echt te ontspannen?', 'stress'],
    ['Hoe vaak zit je het grootste deel van de dag?', 'beweging'],
    ['Hoe vaak kost sporten je meer energie dan het geeft?', 'beweging'],
    ['Hoe vaak brandt er een geurkaars of luchtverfrisser?', 'huis'],
    ['Hoe vaak kook je in een antiaanbakpan?', 'huis']
  ];
  var keys = ['voeding', 'licht', 'slaap', 'stress', 'beweging', 'huis'];
  var labels = { voeding: 'Voeding', licht: 'Licht', slaap: 'Slaap', stress: 'Stress', beweging: 'Beweging', huis: 'Gifvrij huis' };
  var step = 0, score = {};
  var elQ = document.getElementById('scanQ'), elGate = document.getElementById('scanGate'), elRes = document.getElementById('scanResult');

  function showQuestion() {
    document.getElementById('stepLabel').textContent = 'Vraag ' + (step + 1) + ' van ' + qs.length;
    document.getElementById('progressBar').style.width = Math.round(step / qs.length * 100) + '%';
    document.getElementById('question').textContent = qs[step][0];
  }
  document.querySelectorAll('.ans').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = qs[step][1];
      score[k] = (score[k] || 0) + Number(b.dataset.v);
      step++;
      if (step < qs.length) { showQuestion(); }
      else { elQ.hidden = true; elGate.hidden = false; }
    });
  });

  function best() {
    var b = null;
    keys.forEach(function (k) { if ((score[k] || 0) > 0 && (!b || score[k] > score[b])) b = k; });
    return b;
  }
  function showResult() {
    var b = best();
    document.getElementById('resultTitle').textContent = b ? labels[b] : 'je basis';
    var bars = document.getElementById('bars');
    bars.innerHTML = '';
    keys.forEach(function (k) {
      var pct = Math.max(4, Math.round((score[k] || 0) / 4 * 100));
      var row = document.createElement('div'); row.className = 'bar';
      var lab = document.createElement('span'); lab.textContent = labels[k];
      var track = document.createElement('div'); track.className = 'bar-track';
      var fill = document.createElement('div'); fill.className = 'bar-fill' + (k === b ? ' best' : ''); fill.style.width = '0%';
      track.appendChild(fill); row.appendChild(lab); row.appendChild(track); bars.appendChild(row);
      requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = pct + '%'; }); });
    });
    elGate.hidden = true; elRes.hidden = false;
  }
  elGate.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = document.getElementById('scanMail').value.trim();
    if (!validMail(m)) { document.getElementById('scanError').hidden = false; return; }
    document.getElementById('scanError').hidden = true;
    // stuur ook de uitkomst mee, zodat je mailprogramma de juiste tips kan sturen
    var b = best();
    var extra = document.createElement('input'); extra.type = 'hidden'; extra.name = 'uitslag'; extra.value = b ? labels[b] : 'basis';
    elGate.appendChild(extra);
    send(FORMS.scan, elGate);
    showResult();
  });
  document.getElementById('restartBtn').addEventListener('click', function () {
    step = 0; score = {}; elRes.hidden = true; elQ.hidden = false; showQuestion();
  });
  document.getElementById('shareBtn').addEventListener('click', function () {
    var url = location.origin + location.pathname + '#scan';
    var btn = this;
    if (navigator.share) { navigator.share({ title: 'happy hormones · hormoonscan', url: url }).catch(function () {}); return; }
    try { navigator.clipboard.writeText(url); } catch (e) {}
    btn.textContent = 'Link gekopieerd, stuur hem door';
  });
  showQuestion();

  // ===== e-book =====
  var ebookForm = document.getElementById('ebookForm');
  ebookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validMail(document.getElementById('ebookMail').value.trim())) { document.getElementById('ebookMail').focus(); return; }
    send(FORMS.ebook, ebookForm);
    ebookForm.hidden = true; document.getElementById('ebookThanks').hidden = false;
  });

  // ===== aanmelden =====
  var planForm = document.getElementById('planForm');
  planForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validMail(document.getElementById('planMail').value.trim())) { document.getElementById('planMail').focus(); return; }
    send(FORMS.plan, planForm).then(function () {
      if (LINKS.calendly) { window.location.href = LINKS.calendly; return; }
      planForm.hidden = true; document.getElementById('planThanks').hidden = false;
    });
  });
})();
