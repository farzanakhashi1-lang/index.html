// --- TASK 3: FORM VALIDATION & TICKET BUILDER ---
const ticketForm = document.getElementById('ticket-form');
ticketForm.noValidate = true;

const seatInventory = {
    VIP: 5,
    Regular: 20
};
const validPromoCodes = { "SAVE10": 0.9 };

const eventSelect = document.getElementById('event-name');
const eventDate = document.getElementById('event-date');
const ticketType = document.getElementById('ticket-type');
const ticketQty = document.getElementById('ticket-qty');
const buyerName = document.getElementById('buyer-name');
const buyerEmail = document.getElementById('buyer-email');
const promoCodeInput = document.getElementById('promo-code');

const prevEvent = document.getElementById('prev-event');
const prevDate = document.getElementById('prev-date');
const prevType = document.getElementById('prev-type');
const prevQty = document.getElementById('prev-qty');
const prevName = document.getElementById('prev-name');
const prevPrice = document.getElementById('prev-price');

const errorSummary = document.getElementById('error-summary');
const successResult = document.getElementById('success-result');

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

function updateLivePreview() {
    prevEvent.textContent = eventSelect.value || '---';
    prevDate.textContent = eventDate.value || '---';
    prevType.textContent = ticketType.value || '---';
    prevQty.textContent = ticketQty.value || '1';
    prevName.textContent = buyerName.value || '---';
    prevPrice.textContent = calculatePrice().toFixed(2);
}

ticketForm.addEventListener('input', updateLivePreview);
ticketForm.addEventListener('change', updateLivePreview);

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

eventSelect.addEventListener('blur', () => validateField(eventSelect, 'err-event'));
eventDate.addEventListener('blur', () => validateField(eventDate, 'err-date'));
ticketType.addEventListener('blur', () => validateField(ticketType, 'err-type'));
buyerName.addEventListener('blur', () => validateField(buyerName, 'err-name'));
buyerEmail.addEventListener('blur', () => validateField(buyerEmail, 'err-email'));

ticketQty.addEventListener('blur', () => {
    let maxSeats = seatInventory[ticketType.value] || 100;
    validateField(ticketQty, 'err-qty', () => parseInt(ticketQty.value) > maxSeats, `Quantity exceeds available seats (${maxSeats}).`);
});

ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let maxSeats = seatInventory[ticketType.value] || 100;
    
    let isEventValid = validateField(eventSelect, 'err-event');
    let isDateValid = validateField(eventDate, 'err-date');
    let isTypeValid = validateField(ticketType, 'err-type');
    let isQtyValid = validateField(ticketQty, 'err-qty', () => parseInt(ticketQty.value) > maxSeats, `Quantity exceeds available seats (${maxSeats}).`);
    let isNameValid = validateField(buyerName, 'err-name');
    let isEmailValid = validateField(buyerEmail, 'err-email');

    let allValid = isEventValid && isDateValid && isTypeValid && isQtyValid && isNameValid && isEmailValid;

    if (!allValid) {
        const invalidFields = ticketForm.querySelectorAll('[aria-invalid="true"]');
        errorSummary.textContent = `Submission failed: Please fix the ${invalidFields.length} error(s) highlighted below.`;
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
        }
        return;
    }

    errorSummary.textContent = "";

    const bookingCode = 'TIX-' + Math.floor(100000 + Math.random() * 900000);
    const finalTotal = calculatePrice().toFixed(2);

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

    ticketForm.reset();
    updateLivePreview();
});