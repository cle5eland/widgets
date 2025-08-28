// Get minutes and seconds from URL parameters, default to 10 minutes
// Get background color from URL parameter and set it
function setBackgroundFromURL() {
  const params = new URLSearchParams(window.location.search);
  let bg = params.get('bg');
  if (bg) {
    // Ensure it starts with # and is a valid hex
    if (!bg.startsWith('#')) bg = '#' + bg;
    if (/^#[0-9a-fA-F]{6}$/.test(bg)) {
      document.body.style.background = bg;
    }
  }
  // If not provided or invalid, use default from CSS
}

setBackgroundFromURL();
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


let initialDuration = getDurationFromURL();
let remainingSeconds = initialDuration;
let interval = null;
let endTimestamp = null;
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function updateTimer() {
  let displaySeconds = remainingSeconds;
  if (endTimestamp) {
    const now = Date.now();
    displaySeconds = Math.max(0, Math.round((endTimestamp - now) / 1000));
    remainingSeconds = displaySeconds;
  }
  const min = Math.floor(displaySeconds / 60);
  const sec = displaySeconds % 60;
  timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function tick() {
  updateTimer();
  if (remainingSeconds <= 0) {
    stopTimer();
    playDing();
  }
}

function startTimer() {
  if (interval) return;
  if (!endTimestamp) {
    endTimestamp = Date.now() + remainingSeconds * 1000;
  }
  interval = setInterval(tick, 250); // 4x/sec for accuracy
  tick();
}

function stopTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    // Update remainingSeconds based on current time
    if (endTimestamp) {
      const now = Date.now();
      remainingSeconds = Math.max(0, Math.round((endTimestamp - now) / 1000));
      endTimestamp = null;
    }
  }
}

function resetTimer() {
  stopTimer();
  initialDuration = getDurationFromURL();
  remainingSeconds = initialDuration;
  endTimestamp = null;
  updateTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

function playDing() {
  const audio = new Audio('assets/ding.wav');
  audio.play();
}

updateTimer();
