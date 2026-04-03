// ================= TAB SWITCH (FIXED + CLEAN) =================
function showTab(tabId, btn = null) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('nav button');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(button => button.classList.remove('active-btn'));

  document.getElementById(tabId).classList.add('active');

  // Fix: event issue removed
  if (btn) {
    btn.classList.add('active-btn');
  }
}

// Auto bind buttons (better way)
document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", function () {
    const tabId = this.getAttribute("onclick").match(/'(.*?)'/)[1];
    showTab(tabId, this);
  });
});


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
    clock.innerHTML = "Current Time: " + timeString;
  }
}

setInterval(updateClock, 1000);
updateClock();


// ================= DUA TOGGLE (IMPROVED) =================
function toggleDua(id) {
  const sections = document.querySelectorAll('.dua-content');

  sections.forEach(section => {
    if (section.id !== id) {
      section.classList.remove("show");
    }
  });

  const content = document.getElementById(id);
  content.classList.toggle("show");
}


// ================= TASBEEH COUNTER =================
let dhikrCount = 0;
let generalCount = 0;

// DHIKR COUNTER
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


// GENERAL COUNTER
function increaseGeneral() {
  generalCount++;
  document.getElementById("generalCount").textContent = generalCount;
}

function resetGeneral() {
  generalCount = 0;
  document.getElementById("generalCount").textContent = generalCount;
}


// ================= CLICK HANDLER (SMART) =================
document.addEventListener("click", function (e) {
  const dhikr = document.getElementById("dhikrApp");
  const general = document.getElementById("generalApp");

  if (dhikr && dhikr.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseDhikr();
  }

  if (general && general.contains(e.target) && e.target.tagName !== "BUTTON") {
    increaseGeneral();
  }
});

// ================= HIJRI DATE =================
// ================= HIJRI DATE =================
function updateHijriDate() {
  const today = new Date();

  const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(today);

  document.getElementById("hijriDate").textContent = hijri;
}

updateHijriDate();
