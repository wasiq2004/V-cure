/* --- 1. DATA ARRAYS --- */
const services = [
    { name: "Dental Implants", icon: "🦷", desc: "Natural appearance and long-lasting solutions.", img: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=600" },
    { name: "Root Canal", icon: "⚡", desc: "Painless single-visit RCT using high-precision digital X-rays.", img: "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?w=600" },
    { name: "Clear Aligners", icon: "💎", desc: "Invisible and removable braces for faster results.", img: "https://images.unsplash.com/photo-1593054999502-d9b30402094e?w=600" },
    { name: "Smile Makeover", icon: "✨", desc: "Transform your smile with veneers and whitening.", img: "https://images.unsplash.com/photo-1559839734-2b71ef159950?w=600" }
];

const doctors = [
    { name: "Dr. Dany Arulraj (MDS)", specialty: "Dental Implants", img: "https://i.pravatar.cc/400?u=1", qual: "Prosthodontist" },
    { name: "Dr. Arjun Sharma (MDS)", specialty: "Root Canal", img: "https://i.pravatar.cc/400?u=2", qual: "Endodontist" },
    { name: "Dr. Kavita Reddy (MDS)", specialty: "Clear Aligners", img: "https://i.pravatar.cc/400?u=3", qual: "Orthodontist" }
];

/* --- 2. ANIMATION LOGIC (Declared ONLY once) --- */
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // If this is the stats section, start the numbers
            if (entry.target.querySelector('.counter')) {
                startCounters();
            }
        }
    });
}, observerOptions);

// Initialize observer when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

/* --- 3. UTILITY FUNCTIONS --- */
function startCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = target / 100;
        const update = () => {
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count);
                setTimeout(update, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        update();
    });
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
}


/**
 * Finalized Time Selection Logic
 * Allows selecting and deselecting (toggling)
 */
function handleTimeSelection(element, timeString) {
    const hiddenInput = document.getElementById('hiddenTimeSlot');

    // 1. If user clicks an already active slot, deselect it
    if (element.classList.contains('active-slot')) {
        element.classList.remove('active-slot');
        hiddenInput.value = ""; // Clear the data
    }
    // 2. If user clicks a new slot
    else {
        // Clear active state from all other pills
        document.querySelectorAll('.time-pill').forEach(pill => {
            pill.classList.remove('active-slot');
        });

        // Select the current one
        element.classList.add('active-slot');
        hiddenInput.value = timeString; // Set the data
    }
}

/**
 * Final Validation
 */
document.getElementById('appointmentForm').onsubmit = function (event) {
    const timeSelected = document.getElementById('hiddenTimeSlot').value;

    if (!timeSelected || timeSelected === "") {
        alert("Error: Please select a time slot for your visit.");
        return false; // Blocks submission
    }

    // Allow submission
    return true;
};

fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: new FormData(form),
})
    .then(res => res.json())
    .then(data => {
        console.log("Web3Forms response:", data);
    });


/**
 * Handles Selection and UN-SELECTION (Toggle) of time slots
 */
function handleTimeSelection(element, timeString) {
    const hiddenInput = document.getElementById('hiddenTimeSlot');
    
    // Toggle Logic: If it's already selected, unselect it
    if (element.classList.contains('active-slot')) {
        element.classList.remove('active-slot');
        hiddenInput.value = ""; 
    } 
    // Otherwise, select it and deselect others
    else {
        document.querySelectorAll('.time-pill').forEach(pill => {
            pill.classList.remove('active-slot');
        });
        element.classList.add('active-slot');
        hiddenInput.value = timeString;
    }
}

/**
 * PRODUCTION-READY ASYNC SUBMISSION
 * Fixes the "Must use POST" error and handles Cloudflare validation
 */
const appointmentForm = document.getElementById('appointmentForm');
const resultDiv = document.getElementById('form-result');
const submitBtn = document.getElementById('submitBtn');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent standard page reload

    const timeValue = document.getElementById('hiddenTimeSlot').value;
    
    // 1. Validate if time is selected
    if (!timeValue || timeValue === "") {
        resultDiv.style.color = "#e74c3c";
        resultDiv.innerHTML = "❌ Error: Please select a time slot first.";
        return;
    }

    // 2. Prepare for sending
    resultDiv.style.color = "var(--primary)";
    resultDiv.innerHTML = "⏳ Sending your request...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    const formData = new FormData(appointmentForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // 3. Perform the AJAX POST call
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
            // SUCCESS
            resultDiv.style.color = "#27ae60";
            resultDiv.innerHTML = "✅ Appointment request sent! We will call you shortly.";
            appointmentForm.reset();
            document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active-slot'));
        } else {
            // API ERROR
            resultDiv.style.color = "#e74c3c";
            resultDiv.innerHTML = "❌ " + jsonRes.message;
        }
    })
    .catch(error => {
        // NETWORK ERROR
        console.error(error);
        resultDiv.style.color = "#e74c3c";
        resultDiv.innerHTML = "❌ Something went wrong. Please check your connection.";
    })
    .finally(() => {
        // RE-ENABLE BUTTON
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        // Clear message after 6 seconds
        setTimeout(() => { resultDiv.innerHTML = ""; }, 6000);
    });
});


const contactForm = document.getElementById('contactForm');
const contactResult = document.getElementById('contact-result');
const contactBtn = document.getElementById('contactSubmitBtn');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent traditional page reload
    
    // UI state: Loading
    contactResult.style.color = "var(--primary)";
    contactResult.innerHTML = "⏳ Sending your message...";
    contactBtn.disabled = true;
    contactBtn.style.opacity = "0.7";

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Secure POST request to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
            // SUCCESS UI
            contactResult.style.color = "#27ae60";
            contactResult.innerHTML = "✅ Success! We have received your message.";
            contactForm.reset();
        } else {
            // API ERROR UI
            contactResult.style.color = "#e74c3c";
            contactResult.innerHTML = "❌ " + jsonRes.message;
        }
    })
    .catch(error => {
        // NETWORK ERROR UI
        console.error(error);
        contactResult.style.color = "#e74c3c";
        contactResult.innerHTML = "❌ Connection error. Please try again.";
    })
    .finally(() => {
        contactBtn.disabled = false;
        contactBtn.style.opacity = "1";
        // Clear status message after 5 seconds
        setTimeout(() => { contactResult.innerHTML = ""; }, 5000);
    });
});