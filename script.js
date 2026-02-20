// ================= TAB SWITCH =================
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('nav button');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active-btn'));

  document.getElementById(tabId).classList.add('active');

  event.target.classList.add('active-btn');
}


// ================= LIVE CLOCK =================
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

  const clock = document.getElementById("clock");
  if (clock) {
    clock.innerHTML = "🕒 Current Time: " + timeString;
  }
}


// ================= RAMADAN TIMERS =================
function startRamadanTimers() {

  function getCountdown(target, element) {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return "Time Now";

    const secondsTotal = Math.floor(diff / 1000);
    const hours = Math.floor(secondsTotal / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    if (secondsTotal <= 10) {
      element.classList.add("warning");
    } else {
      element.classList.remove("warning");
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function updateTimers() {
    const now = new Date();

    let sehriToday = new Date();
    sehriToday.setHours(5, 19, 0, 0);

    let iftarToday = new Date();
    iftarToday.setHours(18,  25, 0);

    let sehriNext = new Date(sehriToday);
    sehriNext.setDate(sehriNext.getDate() + 1);

    const sehri = document.getElementById("sehriTimer");
    const iftar = document.getElementById("iftarTimer");

    if (!sehri || !iftar) return;

    const BLINK_DURATION = 2 * 60 * 1000; // 2 minutes

    // ===== SEHRI LOGIC =====
    // ===== SEHRI LOGIC =====
if (now < sehriToday) {
  // before sehri ends
  sehri.classList.remove("blink-sehri");
  sehri.innerHTML = getCountdown(sehriToday, sehri);
}
else if (now >= sehriToday && now < iftarToday) {
  // after sehri ends → closed
  sehri.innerHTML = "Sehri Closed";
  sehri.classList.remove("warning");

  if (!sehri.dataset.blinkStart) {
    sehri.dataset.blinkStart = now.getTime();
  }

  if (now.getTime() - sehri.dataset.blinkStart < BLINK_DURATION) {
    sehri.classList.add("blink-sehri");
  } else {
    sehri.classList.remove("blink-sehri");
  }
}
else {
  // after iftar → start next sehri countdown
  sehri.dataset.blinkStart = 0;
  sehri.classList.remove("blink-sehri");
  sehri.innerHTML = getCountdown(sehriNext, sehri);
}


// ===== IFTAR LOGIC =====
if (now < iftarToday) {
  iftar.classList.remove("blink-iftar");
  iftar.innerHTML = getCountdown(iftarToday, iftar);
}
else {
  iftar.innerHTML = "Break Fast Now";
  iftar.classList.remove("warning");

  if (!iftar.dataset.blinkStart) {
    iftar.dataset.blinkStart = now.getTime();
  }

  if (now.getTime() - iftar.dataset.blinkStart < BLINK_DURATION) {
    iftar.classList.add("blink-iftar");
  } else {
    iftar.classList.remove("blink-iftar");
  }
}

  }

  setInterval(updateTimers, 1000);
  updateTimers();
}


// ================= START FUNCTIONS =================
setInterval(updateClock, 1000);
updateClock();
startRamadanTimers();

function toggleDua(id) {
  const sections = document.querySelectorAll('.dua-content');

  sections.forEach(section => {
    if (section.id !== id) {
      section.style.display = "none";
    }
  });

  const content = document.getElementById(id);
  const isVisible = window.getComputedStyle(content).display === "block";

  content.style.display = isVisible ? "none" : "block";
}

// ================= TASBEEH COUNTER =================
// ================= TASBEEH COUNTER =================

/// ================= DHIKR COUNTER =================

let dhikrCount = 0;
let generalCount = 0;

function updateDhikr() {
  const name = document.getElementById("dhikrName");
  const display = document.getElementById("dhikrCount");

  display.textContent = dhikrCount;

  if (dhikrCount <= 33) {
    name.textContent = "SubhanAllah";
  } else if (dhikrCount <= 66) {
    name.textContent = "Alhamdulillah";
  } else {
    name.textContent = "Allahu Akbar";
  }

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
  document.getElementById("generalCount").textContent = generalCount;
}

function resetGeneral() {
  generalCount = 0;
  document.getElementById("generalCount").textContent = generalCount;
}

// tap anywhere inside each counter
document.addEventListener("click", function(e) {

  const dhikr = document.getElementById("dhikrApp");
  const general = document.getElementById("generalApp");

  if (dhikr && dhikr.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseDhikr();
  }

  if (general && general.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseGeneral();
  }

});
