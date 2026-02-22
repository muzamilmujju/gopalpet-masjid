// ================= TAB SWITCH =================
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
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  const clock = document.getElementById("clock");
  if (clock) {
    clock.innerHTML =
      "🕒 Current Time: " +
      `${hours}:${minutes}:${seconds} ${ampm}`;
  }
}

// ================= RAMADAN TIMERS =================
function startRamadanTimers() {

  // 🌙 Ramadan timetable (Feb 19 → Mar 20)
  const ramadanTimes = [
  ["5:19","6:25"],
  ["5:18","6:25"],
  ["5:18","6:26"],
  ["5:18","6:26"],
  ["5:17","6:27"],
  ["5:17","6:27"],
  ["5:15","6:27"],
  ["5:15","6:27"],
  ["5:14","6:27"],
  ["5:14","6:28"],
  ["5:13","6:28"],
  ["5:11","6:28"],
  ["5:11","6:29"],
  ["5:10","6:29"],
  ["5:09","6:29"],
  ["5:09","6:30"],
  ["5:08","6:30"],
  ["5:08","6:30"],
  ["5:07","6:30"],
  ["5:06","6:30"],
  ["5:05","6:31"],
  ["5:05","6:31"],
  ["5:04","6:31"],
  ["5:03","6:31"],
  ["5:02","6:31"],
  ["5:01","6:32"],
  ["5:00","6:32"],
  ["5:00","6:32"],
  ["4:59","6:32"],
  ["4:58","6:33"]
];

  const startDate = new Date("Feb 19, 2026");

  function getTodayTimes() {
    const today = new Date();
    const diffDays = Math.floor((today - startDate) / (1000*60*60*24));
    if (diffDays >= 0 && diffDays < ramadanTimes.length) {
      return ramadanTimes[diffDays];
    }
    return ["5:19","6:25"]; // fallback
  }

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
    const [sehriStr, iftarStr] = getTodayTimes();

    // update table times
    const sehriCell = document.getElementById("sehriTime");
    const iftarCell = document.getElementById("iftarTime");

    if (sehriCell) sehriCell.innerText = sehriStr + " AM";
    if (iftarCell) iftarCell.innerText = iftarStr + " PM";

    const [sehriH, sehriM] = sehriStr.split(":").map(Number);
    const [iftarH, iftarM] = iftarStr.split(":").map(Number);

    let sehriToday = new Date();
    sehriToday.setHours(sehriH, sehriM, 0, 0);

    let iftarToday = new Date();
    iftarToday.setHours(iftarH + 12, iftarM, 0, 0);

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



function toggleDua(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle("show");
  }
}

// ================= TASBEEH COUNTER =================
let dhikrCount = 0;

function incrementDhikr() {
  dhikrCount++;

  // auto reset after 99
  if (dhikrCount > 99) {
    dhikrCount = 0;
  }

  updateDhikrDisplay();
}

function resetDhikr() {
  dhikrCount = 0;
  updateDhikrDisplay();
}

function updateDhikrDisplay() {
  const name = document.getElementById("dhikrName");
  const display = document.getElementById("dhikrCount");

  if (!display || !name) return;

  display.textContent = dhikrCount;

  if (dhikrCount === 0 || dhikrCount <= 33) {
    name.textContent = "SubhanAllah";
  }
  else if (dhikrCount <= 66) {
    name.textContent = "Alhamdulillah";
  }
  else {
    name.textContent = "Allahu Akbar";
  }
}
// ===== GENERAL COUNTER =====
function incrementGeneral() {
  generalCount++;
  document.getElementById("generalCount").textContent = generalCount;
}

function resetGeneral() {
  generalCount = 0;
  document.getElementById("generalCount").textContent = generalCount;
}



// ================= START AFTER LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  startRamadanTimers();
  setInterval(updateClock, 1000);
  updateClock();
});
