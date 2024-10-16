window.onload = function () {
    displayShippingAddressAsBilling();
    togglePreviousButton();
};

// Search functionality for addresses
document.getElementById('search-button').addEventListener('click', function () {
    const searchQuery = document.getElementById('search-address').value;
    console.log("Searching for: " + searchQuery);
});

// Edit and add new address functionality (placeholders)
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        alert('Edit Address Feature Coming Soon!');
    });
});

document.getElementById('add-new-address').addEventListener('click', function () {
    alert('Add New Address Feature Coming Soon!');
});

let step = 1; // Track the user's step

// Function to toggle the display of shipping forms based on the selected shipping type
function toggleShippingOptions() {
    const shippingType = document.querySelector('input[name="shipping-type"]:checked').value;
    ['prepay', 'collect', 'ltl'].forEach(type => {
        document.getElementById(`${type}-options`).style.display = (shippingType === type) ? 'flex' : 'none';
    });
}

// Event listeners for shipping type radio buttons
document.querySelectorAll('input[name="shipping-type"]').forEach(radio => {
    radio.addEventListener('change', toggleShippingOptions);
});

// Initialize the correct form when the page loads
toggleShippingOptions();

// Automatically populate shipping address with billing address on page load
document.addEventListener("DOMContentLoaded", displayShippingAddressAsBilling);

// Function to display the billing address as the shipping address
function displayShippingAddressAsBilling() {
    const billingContent = document.querySelector('.billing-content')?.innerHTML.trim();
    if (billingContent) {
        const shippingContent = document.querySelector('.shipping-content');
        shippingContent.innerHTML = billingContent;
        document.querySelector('.shipping-address').style.display = 'block';
    } else {
        console.error("No billing address found to copy to shipping.");
    }
}

// Handle the 'Continue' button click
document.getElementById('single-continue-btn').addEventListener('click', function () {
    if (step === 1) {
        const shippingMethod = document.getElementById('shipping-method').value;
        if (shippingMethod === 'ship-to-me') {
            document.getElementById('address-confirmation-modal').style.display = 'flex';
        } else if (!shippingMethod) {
            alert('Please select a shipping method to continue.');
        } else {
            alert('This option does not require shipping details. Proceeding to the next step.');
            step++;
            document.getElementById('initial-shipping-section').style.display = 'none';
            document.getElementById('shipping-options').style.display = 'block';
            updateStepIndicator(2);  // Set step 2 active
        }
    } else if (step === 2) {
        processShippingOptions();
        updateStepIndicator(3);  // Set step 3 active
    }
    togglePreviousButton();
});

// Function to handle the address confirmation modal logic
document.getElementById('confirm-yes').addEventListener('click', function () {
    document.getElementById('address-confirmation-modal').style.display = 'none';
    displayShippingAddressAsBilling();
    document.getElementById('initial-shipping-section').style.display = 'none';
    document.getElementById('shipping-options').style.display = 'block';
    step++;
});

// Handle the address confirmation modal logic (No selected)
document.getElementById('confirm-no').addEventListener('click', function () {
    document.getElementById('address-confirmation-modal').style.display = 'none';
    document.getElementById('new-address-modal').style.display = 'flex';
});

// Handle the new address submission
document.getElementById('submit-new-address-btn').addEventListener('click', function () {
    const newAddress = {
        line1: document.getElementById('new-address-line1').value,
        line2: document.getElementById('new-address-line2').value,
        city: document.getElementById('new-city').value,
        state: document.getElementById('new-state').value,
        zipcode: document.getElementById('new-zipcode').value,
        phone: document.getElementById('new-phone').value
    };

    displayShippingAddress(newAddress);
    document.getElementById('new-address-modal').style.display = 'none';
    document.getElementById('initial-shipping-section').style.display = 'none';
    document.getElementById('shipping-options').style.display = 'block';
    step++;
    togglePreviousButton();
});

// Function to display the new shipping address next to the billing address
function displayShippingAddress(newAddress) {
    const shippingAddressHTML = `
        <p>${newAddress.line1}</p>
        <p>${newAddress.line2 || ''}</p>
        <p>${newAddress.city}, ${newAddress.state} ${newAddress.zipcode}</p>
        <p>${newAddress.phone}</p>
    `;
    document.querySelector('.shipping-content').innerHTML = shippingAddressHTML;
    document.querySelector('.shipping-address').style.display = 'block';
}

// Function to toggle the visibility of the "Previous" button
function togglePreviousButton() {
    document.getElementById('previous-btn').style.display = (step > 1) ? 'block' : 'none';
}

// Function to process shipping options on step 2
function processShippingOptions() {
    const shippingType = document.querySelector('input[name="shipping-type"]:checked').value;
    const shippingCostElement = document.getElementById('shipping-cost');

    if (shippingType === 'prepay') {
        const shippingMethod = document.getElementById('ups-options').value;
        if (!shippingMethod) {
            alert('Please select a shipping method.');
            return;
        }
        shippingCostElement.innerText = '$17.00';
    } else {
        shippingCostElement.innerText = 'Freight billed to your account';
    }

    document.getElementById('single-continue-btn').style.display = 'none';
    document.getElementById('place-order-btn').style.display = 'block';
    document.getElementById('shipping-options').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
    step++;
}

// Tab switching logic for Payment section
['purchase-order', 'credit-card'].forEach(tab => {
    document.getElementById(`tab-${tab}`).addEventListener('click', function () {
        document.getElementById(`${tab}-form`).style.display = 'flex';
        document.getElementById(tab === 'purchase-order' ? 'credit-card-form' : 'purchase-order-form').style.display = 'none';
        this.classList.add('active');
        document.getElementById(`tab-${tab === 'purchase-order' ? 'credit-card' : 'purchase-order'}`).classList.remove('active');
    });
});

// MM/YY expiration date input
document.getElementById('expiration-date').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length >= 3) {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
    }
    e.target.value = input.slice(0, 5);
});

// Format phone numbers and limit zipcode inputs
['contact-number', 'courier-contact', 'new-phone'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        formatPhoneNumber(this);
    });
});

['zipcode', 'courier-zipcode'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        limitZipcode(this);
    });
});

// Auto-capitalize input fields in the new address form
['new-company-name', 'new-address-line1', 'new-address-line2', 'new-city', 'new-state'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });
});

// Handle "Previous" button click
document.getElementById('previous-btn').addEventListener('click', function () {
    if (step === 2) {
        document.getElementById('shipping-options').style.display = 'none';
        document.getElementById('initial-shipping-section').style.display = 'block';
        updateStepIndicator(1);  // Go back to step 1
    } else if (step === 3) {
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('shipping-options').style.display = 'block';
        updateStepIndicator(2);  // Go back to step 2
    }
    step--;
    togglePreviousButton();
});

// Utility functions
function formatPhoneNumber(input) {
    let phone = input.value.replace(/\D/g, '');
    if (phone.length > 3 && phone.length <= 6) {
        input.value = `${phone.slice(0, 3)}-${phone.slice(3)}`;
    } else if (phone.length > 6) {
        input.value = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    } else {
        input.value = phone;
    }
}

function limitZipcode(input) {
    input.value = input.value.slice(0, 5);
}

// Function to update step circle styles
function updateStepIndicator(step) {
    // Reset all steps to inactive
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-3').classList.remove('active');

    document.getElementById('step-1').classList.add('inactive');
    document.getElementById('step-2').classList.add('inactive');
    document.getElementById('step-3').classList.add('inactive');

    // Activate the current step
    if (step === 1) {
        document.getElementById('step-1').classList.add('active');
        document.getElementById('step-1').classList.remove('inactive');
    } else if (step === 2) {
        document.getElementById('step-2').classList.add('active');
        document.getElementById('step-2').classList.remove('inactive');
    } else if (step === 3) {
        document.getElementById('step-3').classList.add('active');
        document.getElementById('step-3').classList.remove('inactive');
    }
}
