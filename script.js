/* ================================================================
   GOPALPET MASJID — script.js
   ================================================================ */

/* ── Tab switching ── */
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-btn'));

  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');

  const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active-btn');

  // Close mobile menu
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Bind nav buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// Quick cards via onclick already use showTab()


/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});


/* ── Live clock ── */
function formatTime(d) {
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
}

function updateClocks() {
  const t = formatTime(new Date());
  const c1 = document.getElementById('clock');
  const c2 = document.getElementById('heroClock');
  if (c1) c1.textContent = t;
  if (c2) c2.textContent = t;
}
setInterval(updateClocks, 1000);
updateClocks();


/* ── Hijri date ── */
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhul Qa\'dah', 'Dhul Hijjah'
];

function updateHijriDate() {
  try {
    const today = new Date();

    // Get individual hijri parts using numeric month (reliable cross-browser)
    const dayFmt  = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' }).format(today);
    const monthFmt = new Intl.DateTimeFormat('en-u-ca-islamic', { month: 'numeric' }).format(today);
    const yearFmt  = new Intl.DateTimeFormat('en-u-ca-islamic', { year: 'numeric' }).format(today);

    // yearFmt may look like "1447 AH" — extract the number
    const year  = yearFmt.replace(/\D/g, '');
    // monthFmt is 1-based numeric
    const monthIndex = parseInt(monthFmt, 10) - 1;
    const monthName  = HIJRI_MONTHS[monthIndex] || monthFmt;
    const day = parseInt(dayFmt, 10);

    const el = document.getElementById('hijriDate');
    if (el) el.textContent = `${day} ${monthName} ${year} AH`;
  } catch (e) {
    const el = document.getElementById('hijriDate');
    if (el) el.textContent = 'Hijri date unavailable';
  }
}
updateHijriDate();


/* ── Accordion (Duas) ── */
function toggleDua(id) {
  const body = document.getElementById(id);
  if (!body) return;

  const btn = body.closest('.accordion-item')?.querySelector('.accordion-btn');
  const isShown = body.classList.contains('show');

  // Close all
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('show'));
  document.querySelectorAll('.accordion-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));

  // Toggle current
  if (!isShown) {
    body.classList.add('show');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}


/* ── Dhikr counter ── */
const DHIKR_NAMES = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar'];
let dhikrCount   = 0;
let generalCount = 0;

function updateDhikr() {
  document.getElementById('dhikrCount').textContent = dhikrCount;

  const phase = dhikrCount <= 33 ? 0 : dhikrCount <= 66 ? 1 : 2;
  document.getElementById('dhikrName').textContent = DHIKR_NAMES[phase];

  const bar = document.getElementById('dhikrBar');
  if (bar) bar.style.width = `${(dhikrCount / 99) * 100}%`;

  if (dhikrCount >= 99) {
    setTimeout(() => { dhikrCount = 0; updateDhikr(); }, 600);
  }
}

function increaseDhikr() {
  dhikrCount++;
  updateDhikr();
  pulse('dhikrApp');
}

function resetDhikr() {
  dhikrCount = 0;
  updateDhikr();
}


/* ── General counter ── */
function updateGeneral() {
  document.getElementById('generalCount').textContent = generalCount;
  const bar = document.getElementById('generalBar');
  if (bar) bar.style.width = `${Math.min((generalCount / 99) * 100, 100)}%`;
}

function increaseGeneral() {
  generalCount++;
  updateGeneral();
  pulse('generalApp');
}

function resetGeneral() {
  generalCount = 0;
  updateGeneral();
}


/* ── Pulse animation helper ── */
function pulse(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transform = 'scale(0.96)';
  setTimeout(() => el.style.transform = '', 120);
}


/* ── Smart click handler for counter cards ── */
document.addEventListener('click', e => {
  const dhikr   = document.getElementById('dhikrApp');
  const general = document.getElementById('generalApp');
  if (dhikr   && dhikr.contains(e.target)   && e.target.tagName !== 'BUTTON') increaseDhikr();
  if (general && general.contains(e.target) && e.target.tagName !== 'BUTTON') increaseGeneral();
});

/* ── Keyboard support for counter cards ── */
document.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'Enter') {
    const focused = document.activeElement;
    const dhikr   = document.getElementById('dhikrApp');
    const general = document.getElementById('generalApp');
    if (dhikr   && dhikr.contains(focused)   && focused.tagName !== 'BUTTON') { e.preventDefault(); increaseDhikr(); }
    if (general && general.contains(focused) && focused.tagName !== 'BUTTON') { e.preventDefault(); increaseGeneral(); }
  }
});


/* ── Navbar shadow on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(0,0,0,0.3)'
    : 'none';
}, { passive: true });
