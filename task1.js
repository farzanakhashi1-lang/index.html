// --- TASK 1: HIGHER OR LOWER GAME ---
const MAX_LIVES = 3;
const MIN_VALUE = 10;
const MAX_VALUE = 100;

let lives = MAX_LIVES;
let streak = 0;
let bestStreak = 0;
let currentValue = 0;
let nextValue = 0;

const livesDisplay = document.getElementById('lives-display');
const streakDisplay = document.getElementById('streak-display');
const bestStreakDisplay = document.getElementById('best-streak-display');
const currentValueDisplay = document.getElementById('current-value-display');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const messageDisplay = document.getElementById('message-display');
const restartBtn = document.getElementById('restart-btn');

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGame() {
    lives = MAX_LIVES;
    streak = 0;
    
    currentValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    do {
        nextValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    } while (nextValue === currentValue);

    messageDisplay.textContent = "Make your guess: Is the next value higher or lower?";
    restartBtn.classList.add('hidden');
    higherBtn.disabled = false;
    lowerBtn.disabled = false;

    updateUI();
}

function updateUI() {
    livesDisplay.textContent = lives;
    streakDisplay.textContent = streak;
    bestStreakDisplay.textContent = bestStreak;
    currentValueDisplay.textContent = currentValue;
}

function makeGuess(playerChoice) {
    let isCorrect = false;

    if (playerChoice === 'higher' && nextValue >= currentValue) {
        isCorrect = true;
    } else if (playerChoice === 'lower' && nextValue <= currentValue) {
        isCorrect = true;
    }

    if (isCorrect) {
        streak++;
        if (streak > bestStreak) {
            bestStreak = streak;
        }
        messageDisplay.textContent = `Correct! The value was ${nextValue}. Keep going!`;
    } else {
        lives--;
        messageDisplay.textContent = `Wrong! The value was ${nextValue}. You lost a life.`;
    }

    currentValue = nextValue;
    do {
        nextValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    } while (nextValue === currentValue);

    updateUI();

    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    messageDisplay.textContent = `Game Over! Final Streak: ${streak}. Click 'Play Again' to restart.`;
    higherBtn.disabled = true;
    lowerBtn.disabled = true;
    restartBtn.classList.remove('hidden');
}

higherBtn.addEventListener('click', () => makeGuess('higher'));
lowerBtn.addEventListener('click', () => makeGuess('lower'));
restartBtn.addEventListener('click', initGame);

initGame();