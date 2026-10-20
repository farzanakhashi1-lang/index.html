// --- TASK 2: CONFIGURATOR DATA & STATE ---
const budgetLimit = 20;
let currentBudget = budgetLimit;

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

let selectedIds = [];

const optionsContainer = document.getElementById('options-container');
const totalPriceDisplay = document.getElementById('total-price');
const budgetLimitDisplay = document.getElementById('budget-limit');
const configMessage = document.getElementById('config-message');

budgetLimitDisplay.textContent = budgetLimit;

function renderConfigurator() {
    optionsContainer.textContent = '';
    let calculatedTotal = 0;

    for (const item of menuItems) {
        const card = document.createElement('div');
        card.classList.add('option-card');
        if (selectedIds.includes(item.id)) {
            card.classList.add('selected');
            calculatedTotal += item.price;
        }

        if (!item.available) {
            card.classList.add('disabled');
        }

        const title = document.createElement('h3');
        title.textContent = item.name;

        const priceTag = document.createElement('p');
        priceTag.textContent = `Price: $${item.price} (${item.category})`;

        const selectBtn = document.createElement('button');
        selectBtn.textContent = selectedIds.includes(item.id) ? 'Selected' : 'Select';
        selectBtn.dataset.id = item.id;

        if (!item.available) {
            selectBtn.disabled = true;
        }

        card.appendChild(title);
        card.appendChild(priceTag);
        card.appendChild(selectBtn);
        optionsContainer.appendChild(card);
    }

    totalPriceDisplay.textContent = calculatedTotal;
}

optionsContainer.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button');
    if (!clickedButton) return;

    const itemId = parseInt(clickedButton.dataset.id);
    const itemToToggle = menuItems.find(item => item.id === itemId);

    if (!itemToToggle || !itemToToggle.available) return;

    let simulatedTotal = 0;
    let tempSelected = [...selectedIds];

    if (tempSelected.includes(itemId)) {
        tempSelected = tempSelected.filter(id => id !== itemId);
    } else {
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

    configMessage.textContent = '';
    selectedIds = tempSelected;
    renderConfigurator();
});

renderConfigurator();