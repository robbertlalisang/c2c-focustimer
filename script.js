const timerDisplay = document.querySelector('.timer-display');

const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const add5Btn = document.getElementById('add5Btn');
const minutesInput = document.getElementById('minutesInput');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    if (!isRunning) {
        // Start timer
        if (timerId === null) {
            timeLeft = parseInt(minutesInput.value) * 60;
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
                resetControls();
                alert('Time is up! Take a break!');
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
    timeLeft = parseInt(minutesInput.value) * 60;
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
    
    // Update the timer immediately with the new value
    timeLeft = parseInt(minutesInput.value) * 60;
    updateDisplay();
}

// Initial setup
updateDisplay();

// Event listeners
toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
add5Btn.addEventListener('click', add5Minutes);
minutesInput.addEventListener('change', handleMinutesInput); 