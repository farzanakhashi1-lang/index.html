// --- CONSTANTS ---
const MAX_LIVES = 3;
const MIN_VALUE = 10;
const MAX_VALUE = 100;

// --- STATE VARIABLES ---
let lives = MAX_LIVES;
let streak = 0;
let bestStreak = 0;
let currentValue = 0;
let nextValue = 0;

// --- DOM ELEMENTS ---
const livesDisplay = document.getElementById('lives-display');
const streakDisplay = document.getElementById('streak-display');
const bestStreakDisplay = document.getElementById('best-streak-display');
const currentValueDisplay = document.getElementById('current-value-display');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const messageDisplay = document.getElementById('message-display');
const restartBtn = document.getElementById('restart-btn');

// Helper function for fair random numbers (smallest and largest included)
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// --- INITIALIZE & RESTART GAME ---
function initGame() {
    lives = MAX_LIVES;
    streak = 0;
    
    // Generate the starting value and the first "next" value to guess
    currentValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    do {
        nextValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    } while (nextValue === currentValue); // Ensure they aren't identical to start

    messageDisplay.textContent = "Make your guess: Is the next value higher or lower?";
    restartBtn.classList.add('hidden');
    higherBtn.disabled = false;
    lowerBtn.disabled = false;

    updateUI();
}

// --- UPDATE UI FUNCTION ---
function updateUI() {
    livesDisplay.textContent = lives;
    streakDisplay.textContent = streak;
    bestStreakDisplay.textContent = bestStreak;
    currentValueDisplay.textContent = currentValue;
}
// --- HANDLE GUESS LOGIC ---
function makeGuess(playerChoice) {
    let isCorrect = false;

    // Check conditions: equal values count as a right guess per requirements
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

    // Shift nextValue to currentValue, and generate a brand new nextValue
    currentValue = nextValue;
    do {
        nextValue = getRandomValue(MIN_VALUE, MAX_VALUE);
    } while (nextValue === currentValue);

    updateUI();

    // Check if game over (0 lives left)
    if (lives <= 0) {
        endGame();
    }
}

// --- END GAME FUNCTION ---
function endGame() {
    messageDisplay.textContent = `Game Over! Final Streak: ${streak}. Click 'Play Again' to restart.`;
    higherBtn.disabled = true;
    lowerBtn.disabled = true;
    restartBtn.classList.remove('hidden'); // Show restart button without reloading page
}
// --- EVENT LISTENERS ---
higherBtn.addEventListener('click', () => makeGuess('higher'));
lowerBtn.addEventListener('click', () => makeGuess('lower'));
restartBtn.addEventListener('click', initGame);

// --- INITIAL START ---
// Run the game for the first time when the script loads
initGame();
// --- TASK 2: CONFIGURATOR DATA & STATE ---
const budgetLimit = 20;
let currentBudget = budgetLimit;

// Array of 10 objects with unique IDs and multiple property types (string, number, boolean, array)
const menuItems = [
    { id: 1, name: "Cheeseburger", category: "main", price: 8, available: true, tags: ["popular", "meat"] },
    { id: 2, name: "Veggie Burger", category: "main", price: 7, available: true, tags: ["vegetarian"] },
    { id: 3, name: "Chicken Wrap", category: "main", price: 9, available: false, tags: ["meat"] },
    { id: 4, name: "French Fries", category: "side", price: 3, available: true, tags: ["vegan"] },
    { id: 5, name: "Onion Rings", category: "side", price: 4, available: true, tags: ["vegetarian"] },
    { id: 6, name: "Side Salad", category: "side", price: 3, available: true, tags: ["vegan", "healthy"] },
    { id: 7, name: "Cola", category: "drink", price: 2, available: true, tags: ["cold"] },
    { id: 8, name: "Lemonade", category: "drink", price: 3, available: true, tags: ["cold", "sweet"] },
    { id: 9, name: "Green Tea", category: "drink", price: 2, available: true, tags: ["hot"] },
    { id: 10, name: "Ice Cream", category: "dessert", price: 4, available: true, tags: ["sweet"] }
];

// Track selected item IDs
let selectedIds = [];

// DOM Elements for Task 2
const optionsContainer = document.getElementById('options-container');
const totalPriceDisplay = document.getElementById('total-price');
const budgetLimitDisplay = document.getElementById('budget-limit');
const configMessage = document.getElementById('config-message');

budgetLimitDisplay.textContent = budgetLimit;

// --- SINGLE RENDER FUNCTION ---
function renderConfigurator() {
    // Clear container using DOM methods (no innerHTML for data)
    optionsContainer.textContent = '';

    let calculatedTotal = 0;

    // Use a for...of loop to render each item and calculate total with your own loop
    for (const item of menuItems) {
        const card = document.createElement('div');
        card.classList.add('option-card');
        if (selectedIds.includes(item.id)) {
            card.classList.add('selected');
            calculatedTotal += item.price; // Calculating value with a loop
        }

        if (!item.available) {
            card.classList.add('disabled');
        }

        // Create elements securely without innerHTML
        const title = document.createElement('h3');
        title.textContent = item.name;

        const priceTag = document.createElement('p');
        priceTag.textContent = `Price: $${item.price} (${item.category})`;

        const selectBtn = document.createElement('button');
        selectBtn.textContent = selectedIds.includes(item.id) ? 'Selected' : 'Select';
        selectBtn.dataset.id = item.id; // Store ID in dataset for event delegation

        if (!item.available) {
            selectBtn.disabled = true;
        }

        card.appendChild(title);
        card.appendChild(priceTag);
        card.appendChild(selectBtn);
        optionsContainer.appendChild(card);
    }

    // Update total price display
    totalPriceDisplay.textContent = calculatedTotal;
}

// --- EVENT DELEGATION ON CONTAINER ---
optionsContainer.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button');
    if (!clickedButton) return;

    const itemId = parseInt(clickedButton.dataset.id);
    const itemToToggle = menuItems.find(item => item.id === itemId);

    if (!itemToToggle || !itemToToggle.available) return;

    // Check rules: Budget limit rule
    let simulatedTotal = 0;
    let tempSelected = [...selectedIds];

    if (tempSelected.includes(itemId)) {
        // Deselect item
        tempSelected = tempSelected.filter(id => id !== itemId);
    } else {
        // Calculate simulated total if added
        for (const id of tempSelected) {
            const found = menuItems.find(m => m.id === id);
            if (found) simulatedTotal += found.price;
        }
        simulatedTotal += itemToToggle.price;

        if (simulatedTotal > budgetLimit) {
            configMessage.textContent = `Action blocked: Exceeds your $${budgetLimit} budget limit!`;
            return;
        }
        tempSelected.push(itemId);
    }

    // Clear error message if action succeeds, change array first, then call render()
    configMessage.textContent = '';
    selectedIds = tempSelected;
    renderConfigurator();
});

// Initial render call for Task 2
renderConfigurator();
// --- TASK 3: FORM VALIDATION & TICKET BUILDER ---
const ticketForm = document.getElementById('ticket-form');
ticketForm.noValidate = true; // Turn off default browser popups per requirements[cite: 4]

// Data limits and inventory rules
const seatInventory = {
    VIP: 5,
    Regular: 20
};
const validPromoCodes = { "SAVE10": 0.9 }; // 10% discount

// Form Inputs
const eventSelect = document.getElementById('event-name');
const eventDate = document.getElementById('event-date');
const ticketType = document.getElementById('ticket-type');
const ticketQty = document.getElementById('ticket-qty');
const buyerName = document.getElementById('buyer-name');
const buyerEmail = document.getElementById('buyer-email');
const promoCodeInput = document.getElementById('promo-code');

// Preview Elements
const prevEvent = document.getElementById('prev-event');
const prevDate = document.getElementById('prev-date');
const prevType = document.getElementById('prev-type');
const prevQty = document.getElementById('prev-qty');
const prevName = document.getElementById('prev-name');
const prevPrice = document.getElementById('prev-price');

// Error & Summary Elements
const errorSummary = document.getElementById('error-summary');
const successResult = document.getElementById('success-result');

// Helper to calculate price for live preview
function calculatePrice() {
    let basePrice = ticketType.value === 'VIP' ? 50 : 20;
    let qty = parseInt(ticketQty.value) || 1;
    let total = basePrice * qty;

    let promo = promoCodeInput.value.trim().toUpperCase();
    if (validPromoCodes[promo]) {
        total *= validPromoCodes[promo];
    }
    return total;
}

// --- LIVE PREVIEW UPDATER ---
function updateLivePreview() {
    prevEvent.textContent = eventSelect.value || '---';
    prevDate.textContent = eventDate.value || '---';
    prevType.textContent = ticketType.value || '---';
    prevQty.textContent = ticketQty.value || '1';
    prevName.textContent = buyerName.value || '---';
    prevPrice.textContent = calculatePrice().toFixed(2);
}

// Listen for inputs to update preview live[cite: 4]
ticketForm.addEventListener('input', updateLivePreview);
ticketForm.addEventListener('change', updateLivePreview);

// Validation function for individual fields
function validateField(inputElement, errorElementId, customRuleCheck, errorMessage) {
    const errorEl = document.getElementById(errorElementId);
    let errorText = "";

    if (inputElement.validity.valueMissing) {
        errorText = "This field is required.";
    } else if (customRuleCheck && customRuleCheck()) {
        errorText = errorMessage;
    }

    if (errorText) {
        errorEl.textContent = errorText;
        inputElement.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        errorEl.textContent = "";
        inputElement.setAttribute('aria-invalid', 'false');
        return true;
    }
}

// Attach blur events for real-time validation feedback[cite: 4]
eventSelect.addEventListener('blur', () => validateField(eventSelect, 'err-event'));
eventDate.addEventListener('blur', () => validateField(eventDate, 'err-date'));
ticketType.addEventListener('blur', () => validateField(ticketType, 'err-type'));
buyerName.addEventListener('blur', () => validateField(buyerName, 'err-name'));
buyerEmail.addEventListener('blur', () => validateField(buyerEmail, 'err-email'));

ticketQty.addEventListener('blur', () => {
    let maxSeats = seatInventory[ticketType.value] || 100;
    validateField(ticketQty, 'err-qty', () => parseInt(ticketQty.value) > maxSeats, `Quantity exceeds available seats (${maxSeats}).`);
});

// --- SUBMISSION HANDLING ---
ticketForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default submission[cite: 4]

    // Run validations across all fields
    let maxSeats = seatInventory[ticketType.value] || 100;
    
    let isEventValid = validateField(eventSelect, 'err-event');
    let isDateValid = validateField(eventDate, 'err-date');
    let isTypeValid = validateField(ticketType, 'err-type');
    let isQtyValid = validateField(ticketQty, 'err-qty', () => parseInt(ticketQty.value) > maxSeats, `Quantity exceeds available seats (${maxSeats}).`);
    let isNameValid = validateField(buyerName, 'err-name');
    let isEmailValid = validateField(buyerEmail, 'err-email');

    let allValid = isEventValid && isDateValid && isTypeValid && isQtyValid && isNameValid && isEmailValid;

    if (!allValid) {
        // Count errors and focus on the first invalid field[cite: 4]
        const invalidFields = ticketForm.querySelectorAll('[aria-invalid="true"]');
        errorSummary.textContent = `Submission failed: Please fix the ${invalidFields.length} error(s) highlighted below.`;
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
        }
        return;
    }

    // Success: Clear error summary
    errorSummary.textContent = "";

    // Generate random booking code
    const bookingCode = 'TIX-' + Math.floor(100000 + Math.random() * 900000);
    const finalTotal = calculatePrice().toFixed(2);

    // Build confirmation result using DOM methods (no innerHTML for dynamic output)
    successResult.textContent = "";
    successResult.classList.remove('hidden');

    const successHeader = document.createElement('h2');
    successHeader.textContent = "Ticket Booked Successfully!";
    
    const codeParagraph = document.createElement('p');
    codeParagraph.textContent = `Booking Reference Code: ${bookingCode}`;

    const detailsParagraph = document.createElement('p');
    detailsParagraph.textContent = `${buyerName.value} (${buyerEmail.value}) booked ${ticketQty.value} ${ticketType.value} ticket(s) for ${eventSelect.value} on ${eventDate.value}. Total Paid: $${finalTotal}`;

    successResult.appendChild(successHeader);
    successResult.appendChild(codeParagraph);
    successResult.appendChild(detailsParagraph);

    // Reset form and preview
    ticketForm.reset();
    updateLivePreview();
});
