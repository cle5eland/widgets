// Get minutes from URL parameter, default to 10
function getMinutesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const min = parseInt(params.get('minutes'), 10);
  return (isNaN(min) || min <= 0) ? 10 : min;
}

let minutes = getMinutesFromURL();
let time = minutes * 60;
let interval = null;
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function updateTimer() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
}

function stopTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function resetTimer() {
  stopTimer();
  minutes = getMinutesFromURL();
  time = minutes * 60;
  updateTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
updateTimer();
