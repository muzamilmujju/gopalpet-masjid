function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
}

function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const timeString = hours + ":" + minutes + ":" + seconds + " " + ampm;

  document.getElementById("clock").innerHTML =
    "🕒 Current Time: " + timeString;
}

setInterval(updateClock, 1000);
updateClock();
