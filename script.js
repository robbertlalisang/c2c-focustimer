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
modeDisplay.textContent = 'Work';
document.querySelector('.timer-content').insertBefore(modeDisplay, timerDisplay);

const chime = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b6fae7b6.mp3'); // Royalty-free chime from Pixabay

let isWorkMode = true;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

// Add after modeDisplay creation
const switchModeBtn = document.createElement('button');
switchModeBtn.className = 'switch-mode-btn';
switchModeBtn.textContent = isWorkMode ? 'Start Break' : 'Start Work';
document.querySelector('.timer-controls').insertAdjacentElement('afterend', switchModeBtn);

switchModeBtn.addEventListener('click', () => {
    if (isWorkMode) {
        isWorkMode = false;
        timeLeft = breakDuration;
    } else {
        isWorkMode = true;
        timeLeft = workDuration;
    }
    updateDisplay();
    if (timerId) clearInterval(timerId);
    timerId = null;
    isRunning = false;
    toggleTimer();
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    modeDisplay.textContent = isWorkMode ? 'Work' : 'Break';
    switchModeBtn.textContent = isWorkMode ? 'Start Break' : 'Start Work';
}

function switchMode() {
    isWorkMode = !isWorkMode;
    timeLeft = isWorkMode ? workDuration : breakDuration;
    updateDisplay();
    toggleTimer(); // Auto-start next session
}

function toggleTimer() {
    if (!isRunning) {
        // Start timer
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
                chime.play();
                setTimeout(() => {
                    switchMode();
                }, 500); // Short delay before switching mode
            }
        }, 1000);
    } else {
        // Pause timer
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