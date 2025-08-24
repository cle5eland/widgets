// Get minutes and seconds from URL parameters, default to 10 minutes
function getDurationFromURL() {
  const params = new URLSearchParams(window.location.search);
  const min = parseInt(params.get('minutes'), 10);
  const sec = parseInt(params.get('seconds'), 10);
  let totalSeconds = 0;
  if (!isNaN(min) && min > 0) {
    totalSeconds += min * 60;
  }
  if (!isNaN(sec) && sec > 0) {
    totalSeconds += sec;
  }
  if (totalSeconds === 0) {
    totalSeconds = 10 * 60;
  }
  return totalSeconds;
}

let time = getDurationFromURL();
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
      playDing();
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
  time = getDurationFromURL();
  updateTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Play a simple ding sound when timer ends
function playDing() {
  const audio = new Audio('assets/ding.wav');
  audio.play();
}

updateTimer();
