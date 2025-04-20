const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const add5Btn = document.getElementById('add5Btn');
const minutesInput = document.getElementById('minutesInput');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isPaused = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId === null) {
        if (!isPaused) {
            timeLeft = parseInt(minutesInput.value) * 60;
        }
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        minutesInput.disabled = true;
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                resetControls();
                alert('Time is up! Take a break!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    timeLeft = parseInt(minutesInput.value) * 60;
    updateDisplay();
    resetControls();
}

function add5Minutes() {
    timeLeft += 5 * 60;
    updateDisplay();
}

function resetControls() {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
}

function handleMinutesInput() {
    const value = parseInt(minutesInput.value);
    if (value < 1) minutesInput.value = 1;
    if (value > 60) minutesInput.value = 60;
    if (timerId === null && !isPaused) {
        timeLeft = parseInt(minutesInput.value) * 60;
        updateDisplay();
    }
}

// Initial setup
pauseBtn.disabled = true;
updateDisplay();

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
add5Btn.addEventListener('click', add5Minutes);
minutesInput.addEventListener('change', handleMinutesInput); 