const timerDisplay = document.querySelector('.timer-display');

const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const add5Btn = document.getElementById('add5Btn');
const minutesInput = document.getElementById('minutesInput');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;

const modeDisplay = document.createElement('div');
modeDisplay.className = 'mode-display';
modeDisplay.textContent = 'Focusing';
const hintText = document.createElement('div');
hintText.className = 'hint-text';
hintText.textContent = 'Start break now';
const timerContent = document.querySelector('.timer-content');
timerContent.insertBefore(modeDisplay, timerContent.children[1]);
timerContent.insertBefore(hintText, timerContent.children[2]);

const triangle = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7c8e.mp3'); // New triangle sound

let isWorkMode = true;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

// Hide switchModeBtn and time-input (handled in CSS)

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    modeDisplay.textContent = isWorkMode ? 'Focusing' : 'Break';
    hintText.textContent = isWorkMode ? 'Start break now' : 'Start focusing now';
}

function switchMode() {
    isWorkMode = !isWorkMode;
    timeLeft = isWorkMode ? workDuration : breakDuration;
    updateDisplay();
    isRunning = false;
    toggleTimer(); // Always auto-start next session
}

function toggleTimer(auto = false) {
    if (!isRunning) {
        if (timerId === null) {
            if (isWorkMode) {
                timeLeft = workDuration;
            } else {
                timeLeft = breakDuration;
            }
        }
        isRunning = true;
        toggleBtn.textContent = 'Pause';
        toggleBtn.classList.add('active');
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                triangle.play();
                // Notification
                if (window.Notification && Notification.permission === 'granted') {
                    new Notification(isWorkMode ? 'Focus session over! Time for a break.' : 'Break over! Time to get back to work.');
                } else if (window.Notification && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(isWorkMode ? 'Focus session over! Time for a break.' : 'Break over! Time to get back to work.');
                        } else {
                            alert(isWorkMode ? 'Focus session over! Time for a break.' : 'Break over! Time to get back to work.');
                        }
                    });
                } else {
                    alert(isWorkMode ? 'Focus session over! Time for a break.' : 'Break over! Time to get back to work.');
                }
                setTimeout(() => {
                    switchMode();
                }, 500);
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        toggleBtn.textContent = 'Start';
        toggleBtn.classList.remove('active');
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    isWorkMode = true;
    timeLeft = workDuration;
    updateDisplay();
    resetControls();
}

function add5Minutes() {
    timeLeft += 5 * 60;
    updateDisplay();
}

function resetControls() {
    toggleBtn.textContent = 'Start';
    toggleBtn.classList.remove('active');
    isRunning = false;
}

function handleMinutesInput() {
    const value = parseInt(minutesInput.value);
    if (value < 1) minutesInput.value = 1;
    if (value > 60) minutesInput.value = 60;
    if (isWorkMode) {
        workDuration = parseInt(minutesInput.value) * 60;
        timeLeft = workDuration;
    } else {
        breakDuration = parseInt(minutesInput.value) * 60;
        timeLeft = breakDuration;
    }
    updateDisplay();
}

// Initial setup
updateDisplay();

// Event listeners
toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
add5Btn.addEventListener('click', add5Minutes);
minutesInput.addEventListener('change', handleMinutesInput);

hintText.addEventListener('click', () => {
    isWorkMode = !isWorkMode;
    timeLeft = isWorkMode ? workDuration : breakDuration;
    updateDisplay();
    if (timerId) clearInterval(timerId);
    timerId = null;
    isRunning = false;
    toggleTimer();
});

// Settings menu logic
const gearIcon = document.querySelector('.gear-icon');
const settingsMenu = document.querySelector('.settings-menu');
const workInput = document.getElementById('workInput');
const breakInput = document.getElementById('breakInput');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

gearIcon.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

saveSettingsBtn.addEventListener('click', () => {
    let newWork = parseInt(workInput.value);
    let newBreak = parseInt(breakInput.value);
    if (newWork < 1) newWork = 1;
    if (newWork > 60) newWork = 60;
    if (newBreak < 1) newBreak = 1;
    if (newBreak > 60) newBreak = 60;
    workInput.value = newWork;
    breakInput.value = newBreak;
    workDuration = newWork * 60;
    breakDuration = newBreak * 60;
    if (isWorkMode) {
        timeLeft = workDuration;
    } else {
        timeLeft = breakDuration;
    }
    updateDisplay();
    settingsMenu.style.display = 'none';
});

// Hide settings menu when clicking outside
document.addEventListener('mousedown', (e) => {
    if (settingsMenu.style.display === 'block' && !settingsMenu.contains(e.target) && !gearIcon.contains(e.target)) {
        settingsMenu.style.display = 'none';
    }
}); 