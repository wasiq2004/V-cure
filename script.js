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

document.addEventListener("DOMContentLoaded", function() {
        const track = document.getElementById("splitServicesTrack");
        let autoPlayInterval;
        const speed = 3000; // 3000ms = 3 seconds

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                // Get the exact width of one slide dynamically
                const slideWidth = track.clientWidth;
                const maxScroll = track.scrollWidth - track.clientWidth;

                // Check if we have reached the very last slide
                if (track.scrollLeft >= maxScroll - 10) {
                    // Rewind back to the first slide smoothly
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll exactly one slide to the right
                    track.scrollBy({ left: slideWidth, behavior: 'smooth' });
                }
            }, speed);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Initialize Carousel
        startAutoPlay();

        // Pause automatically when the user is reading or touching the carousel
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay, {passive: true});
        track.addEventListener('touchend', startAutoPlay, {passive: true});
    });

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');
    
    nav.classList.toggle('mobile-active');
    
    // Switch icon between Bars and X
    if (nav.classList.contains('mobile-active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
    } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
    }
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('mobile-active');
        document.querySelector('.hamburger i').classList.add('fa-bars');
    });
});

function handleTimeSelection(element, timeString) {
    const hiddenInput = document.getElementById('hiddenTimeSlot');
    if (element.classList.contains('active-slot')) {
        element.classList.remove('active-slot');
        hiddenInput.value = ""; 
    } else {
        document.querySelectorAll('.time-pill').forEach(pill => pill.classList.remove('active-slot'));
        element.classList.add('active-slot');
        hiddenInput.value = timeString;
    }
}

/**
 * 2. FINALIZED FORM SUBMISSION + WHATSAPP REDIRECT
 */
const appointmentForm = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop standard submission

    // Validate time selection
    const timeValue = document.getElementById('hiddenTimeSlot').value;
    if (!timeValue) {
        alert("Please select a preferred Time Slot.");
        return;
    }

    // --- CONFIGURATION ---
    const adminPhone = "919597931410"; // REPLACE WITH YOUR REAL NUMBER (e.g. 91...)
    
    // Change UI to show progress
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Capture all data
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);

    // 1. Send Email via Web3Forms API
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(async (response) => {
        let result = await response.json();
        if (response.status == 200) {
            // Success! Now build the WhatsApp message
            
            const waMessage = `*NEW APPOINTMENT REQUEST* 🦷\n` +
                              `--------------------------\n` +
                              `👤 *Patient:* ${data.Patient_Name}\n` +
                              `📞 *Phone:* ${data.Phone_Number}\n` +
                              `🏥 *Branch:* ${data.Branch}\n` +
                              `🛠 *Service:* ${data.Service}\n` +
                              `👨‍⚕️ *Doctor:* ${data.Doctor}\n` +
                              `📅 *Date:* ${data.Date}\n` +
                              `🕒 *Time:* ${data.Requested_Time_Slot}\n` +
                              `--------------------------\n` +
                              `Sent via V-Cure Website`;

            // Construct the final URL
            const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;

            // FORCE REDIRECT
            window.location.href = whatsappUrl;
            
            // Cleanup
            appointmentForm.reset();
        } else {
            alert("Submission Error: " + result.message);
        }
    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong. Please check your internet connection.");
    })
    .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
});
document.addEventListener("DOMContentLoaded", function() {
        const track = document.getElementById("splitServicesTrack");
        const slides = Array.from(track.querySelectorAll('.split-slide'));
        const indicatorsContainer = document.getElementById("carouselIndicators");
        
        const btnPrev = document.getElementById("slidePrev");
        const btnNext = document.getElementById("slideNext");
        
        let currentIndex = 0;
        let autoPlayInterval;
        const speed = 3000; // 3 seconds

        // 1. Generate the Dots dynamically
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active'); 
            
            // Allow user to click a dot to jump to that slide
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            
            indicatorsContainer.appendChild(dot);
        });

        const dots = Array.from(indicatorsContainer.querySelectorAll('.carousel-dot'));

        // 2. Function to scroll to a specific slide exactly
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1; // Loop to end
            if (index >= slides.length) index = 0; // Loop to start
            
            currentIndex = index;
            
            // Using offsetLeft guarantees pixel-perfect scrolling regardless of screen size
            track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
            updateDots(index);
        }

        // 3. Update active dot UI
        function updateDots(activeIndex) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[activeIndex]) {
                dots[activeIndex].classList.add('active');
            }
        }

        // 4. Arrow Button Clicks
        btnNext.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });

        btnPrev.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });

        // 5. Autoplay Controls
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, speed);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // 6. Intelligent Scroll Syncing (If user swipes with finger on mobile)
        const observerOptions = {
            root: track,
            threshold: 0.5 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleIndex = slides.indexOf(entry.target);
                    currentIndex = visibleIndex;
                    updateDots(visibleIndex);
                }
            });
        }, observerOptions);

        slides.forEach(slide => observer.observe(slide));

        // 7. Initialize Auto Play
        startAutoPlay();

        // Pause the timer when the user hovers over the carousel with their mouse or touches it
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay, {passive: true});
        track.addEventListener('touchend', resetAutoPlay, {passive: true});
    });
        document.addEventListener("DOMContentLoaded", function() {
        const track = document.getElementById("splitServicesTrack");
        const slides = Array.from(track.querySelectorAll('.split-slide'));
        const indicatorsContainer = document.getElementById("carouselIndicators");
        
        const btnPrev = document.getElementById("slidePrev");
        const btnNext = document.getElementById("slideNext");
        
        let currentIndex = 0;
        let autoPlayInterval;
        const speed = 3000; // 3 seconds

        // 1. Generate the Dots dynamically
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active'); 
            
            // Allow user to click a dot to jump to that slide
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            
            indicatorsContainer.appendChild(dot);
        });

        const dots = Array.from(indicatorsContainer.querySelectorAll('.carousel-dot'));

        // 2. MATHEMATICAL SCROLL FUNCTION (100% RELIABLE)
        function goToSlide(index) {
            // Loop functionality
            if (index < 0) index = slides.length - 1; 
            if (index >= slides.length) index = 0; 
            
            currentIndex = index;
            
            // Calculates exact width of 1 slide block, multiples by target index
            const exactScrollPosition = track.clientWidth * currentIndex;
            
            track.scrollTo({ left: exactScrollPosition, behavior: 'smooth' });
            updateDots(currentIndex);
        }

        // 3. Update active dot UI
        function updateDots(activeIndex) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[activeIndex]) {
                dots[activeIndex].classList.add('active');
            }
        }

        // 4. Arrow Button Clicks (Fixed)
        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault(); // Prevents page from jumping
                goToSlide(currentIndex + 1);
                resetAutoPlay();
            });

            btnPrev.addEventListener('click', (e) => {
                e.preventDefault(); // Prevents page from jumping
                goToSlide(currentIndex - 1);
                resetAutoPlay();
            });
        }

        // 5. Autoplay Controls
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, speed);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // 6. Intelligent Scroll Syncing (If user swipes on mobile)
        const observerOptions = {
            root: track,
            threshold: 0.6 // Slide must be 60% visible to trigger
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleIndex = slides.indexOf(entry.target);
                    currentIndex = visibleIndex;
                    updateDots(visibleIndex);
                }
            });
        }, observerOptions);

        slides.forEach(slide => observer.observe(slide));

        // 7. Initialize Auto Play
        startAutoPlay();

        // 8. Pause Events
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay, {passive: true});
        track.addEventListener('touchend', resetAutoPlay, {passive: true});
        
        // Also pause if user hovers over the arrows
        btnNext.addEventListener('mouseenter', stopAutoPlay);
        btnPrev.addEventListener('mouseenter', stopAutoPlay);
    });
    