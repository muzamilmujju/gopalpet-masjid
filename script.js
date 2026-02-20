function showTab(tabId, btn) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('nav button');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(button => button.classList.remove('active-btn'));

  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.classList.add('active');
  if (btn) btn.classList.add('active-btn');
}

// ================= LIVE CLOCK =================
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  const clock = document.getElementById("clock");
  if (clock) {
    clock.innerHTML = "🕒 Current Time: " + `${hours}:${minutes}:${seconds} ${ampm}`;
  }
}

// ================= RAMADAN TIMERS =================
function startRamadanTimers() {

  function getCountdown(target, element) {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return "Time Now";

    const total = Math.floor(diff / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    if (total <= 10) element.classList.add("warning");
    else element.classList.remove("warning");

    return `${h}h ${m}m ${s}s`;
  }

  function updateTimers() {
    const now = new Date();

    let sehriToday = new Date();
    sehriToday.setHours(5, 19, 0, 0);

    let iftarToday = new Date();
    iftarToday.setHours(18, 25, 0, 0);

    let sehriNext = new Date(sehriToday);
    sehriNext.setDate(sehriNext.getDate() + 1);

    const sehri = document.getElementById("sehriTimer");
    const iftar = document.getElementById("iftarTimer");
    if (!sehri || !iftar) return;

    const BLINK_DURATION = 2 * 60 * 1000;

    // ===== SEHRI =====
    if (now < sehriToday) {
      sehri.classList.remove("blink-sehri");
      sehri.innerHTML = getCountdown(sehriToday, sehri);
    }
    else if (now >= sehriToday && now < iftarToday) {
      sehri.innerHTML = "Sehri Closed";
      sehri.classList.remove("warning");

      if (!sehri.dataset.blinkStart) {
        sehri.dataset.blinkStart = Date.now();
      }

      if (Date.now() - Number(sehri.dataset.blinkStart) < BLINK_DURATION) {
        sehri.classList.add("blink-sehri");
      } else {
        sehri.classList.remove("blink-sehri");
      }
    }
    else {
      sehri.dataset.blinkStart = "";
      sehri.classList.remove("blink-sehri");
      sehri.innerHTML = getCountdown(sehriNext, sehri);
    }

    // ===== IFTAR =====
    if (now < iftarToday) {
      iftar.classList.remove("blink-iftar");
      iftar.innerHTML = getCountdown(iftarToday, iftar);
    }
    else {
      iftar.innerHTML = "Break Fast Now";
      iftar.classList.remove("warning");

      if (!iftar.dataset.blinkStart) {
        iftar.dataset.blinkStart = Date.now();
      }

      if (Date.now() - Number(iftar.dataset.blinkStart) < BLINK_DURATION) {
        iftar.classList.add("blink-iftar");
      } else {
        iftar.classList.remove("blink-iftar");
      }
    }
  }

  setInterval(updateTimers, 1000);
  updateTimers();
}

// ================= DUA TOGGLE =================
function toggleDua(id) {
  const sections = document.querySelectorAll('.dua-content');

  sections.forEach(section => {
    if (section.id !== id) section.style.display = "none";
  });

  const content = document.getElementById(id);
  if (!content) return;

  const visible = window.getComputedStyle(content).display === "block";
  content.style.display = visible ? "none" : "block";
}

// ================= DHIKR COUNTER =================
let dhikrCount = 0;
let generalCount = 0;

function updateDhikr() {
  const name = document.getElementById("dhikrName");
  const display = document.getElementById("dhikrCount");
  if (!name || !display) return;

  display.textContent = dhikrCount;

  if (dhikrCount <= 33) name.textContent = "SubhanAllah";
  else if (dhikrCount <= 66) name.textContent = "Alhamdulillah";
  else name.textContent = "Allahu Akbar";

  if (dhikrCount >= 99) {
    dhikrCount = 0;
    updateDhikr();
  }
}

function increaseDhikr() {
  dhikrCount++;
  updateDhikr();
}

function resetDhikr() {
  dhikrCount = 0;
  updateDhikr();
}

// ================= GENERAL COUNTER =================
function increaseGeneral() {
  generalCount++;
  const el = document.getElementById("generalCount");
  if (el) el.textContent = generalCount;
}

function resetGeneral() {
  generalCount = 0;
  const el = document.getElementById("generalCount");
  if (el) el.textContent = generalCount;
}

// ===== MOBILE SAFE TAP HANDLER =====
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const tapEvent = isTouchDevice ? "touchend" : "click";

document.addEventListener(tapEvent, function(e) {

  const dhikr = document.getElementById("dhikrApp");
  const general = document.getElementById("generalApp");

  if (!dhikr || !general) return;

  if (isTouchDevice) e.preventDefault();

  if (dhikr.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseDhikr();
  }

  if (general.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseGeneral();
  }

}, { passive: false });

// ================= START =================
setInterval(updateClock, 1000);
updateClock();
startRamadanTimers();