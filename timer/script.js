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
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.2;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => ctx.close();
  } catch (e) {
    // Ignore errors (e.g., autoplay restrictions)
  }
}

updateTimer();
