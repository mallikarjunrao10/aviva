// ======================================================
// Global Helper Functions (can be accessed anywhere)
// ======================================================

// Get references to the spinner and success modal elements
const spinner = document.getElementById('loading-spinner'); // Ensure you have this HTML for spinner
const successModal = document.getElementById('success-modal'); // Ensure you have this HTML for success modal

/**
 * Displays the loading spinner overlay.
 */
function showSpinner() {
    if (spinner) {
        spinner.style.display = 'flex'; // Use flex to center the spinner
    }
}

/**
 * Hides the loading spinner overlay.
 */
function hideSpinner() {
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Displays the success modal.
 */
function showModal() { // This seems to be for a general success modal, keep if you use it for other purposes
    if (successModal) {
        successModal.style.display = 'flex'; // Use flex to center the modal
    }
}

/**
 * Hides the success modal.
 */
function closeModal() { // This seems to be for a general success modal, keep if you use it for other purposes
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// Ensure close-success-modal button exists before adding listener
const closeSuccessModalBtn = document.getElementById('close-success-modal');
if (closeSuccessModalBtn) {
    closeSuccessModalBtn.addEventListener('click', closeModal);
}

/**
 * Retrieves a cookie by name.
 * This is typically used for fetching CSRF tokens for Django/Flask backends.
 * @param {string} name The name of the cookie to retrieve.
 * @returns {string|null} The cookie value, or null if not found.
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ======================================================
// All other DOM-dependent JavaScript goes inside
// a single DOMContentLoaded listener for efficiency
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- START MOBILE MENU LOGIC ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenu = document.querySelector('.close-menu');
    // Ensure you have this overlay div in your HTML
    // <div class="mobile-nav-overlay"></div> right after <header>
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay'); 

    function openMobileMenu() {
        mobileNav.classList.add('open');
        if (mobileNavOverlay) { // Check if overlay exists
            mobileNavOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        if (mobileNavOverlay) { // Check if overlay exists
            mobileNavOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', openMobileMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown > a');

    mobileDropdownToggles.forEach(toggleLink => {
        toggleLink.addEventListener('click', function(event) {
            event.preventDefault();
            const parentLi = toggleLink.closest('li.mobile-dropdown');
            if (parentLi) {
                parentLi.classList.toggle('active');
                const dropdownContent = parentLi.querySelector('.mobile-dropdown-content');
                if (dropdownContent) {
                    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });

    const allNavLinks = document.querySelectorAll('.mobile-nav-links a:not(.mobile-dropdown > a)');

    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    // --- END MOBILE MENU LOGIC ---

    // --- START APPOINTMENT MODAL LOGIC ---
    const appointmentModal = document.getElementById('appointmentModal');
    const closeAppointmentModalBtn = document.getElementById('closeAppointmentModal');
    const appointmentFormModal = document.getElementById('appointmentFormModal');
    const modalMessageArea = document.getElementById('modalMessageArea');

    // Your Make.com Webhook URL (Make sure this is correct for your setup)
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/8ztjx49ubah3kjwh4os72fjah1eh5isv'; 

    /**
     * Opens the appointment modal.
     */
    function openAppointmentModal() {
        if (appointmentModal) {
            appointmentModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            // Reset form and message area when opening
            if (appointmentFormModal) appointmentFormModal.reset();
            if (modalMessageArea) {
                modalMessageArea.style.display = 'none';
                modalMessageArea.textContent = '';
            }
        }
    }

    /**
     * Closes the appointment modal.
     */
    function closeAppointmentModal() {
        if (appointmentModal) {
            appointmentModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Event listener for opening the modal via "Book Now" / "Appointment" links/buttons
    // This targets any link/button with these specific text contents or classes.
    // Adjust selectors if your "Book Now" elements have different attributes.
    const bookNowButtons = document.querySelectorAll(
        'a[href*="#book"], a[href*="#contact"], button.book-now-btn, .header-button.appointment, .cta-button.book-appointment' // Add more selectors as needed
    );

    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior (e.g., jumping to #book)
            openAppointmentModal();
        });
    });

    // Event listener for closing the modal via the 'x' button
    if (closeAppointmentModalBtn) {
        closeAppointmentModalBtn.addEventListener('click', closeAppointmentModal);
    }

    // Event listener for closing the modal when clicking outside the content
    if (appointmentModal) {
        appointmentModal.addEventListener('click', (e) => {
            if (e.target === appointmentModal) { // Only close if clicking on the overlay, not the content
                closeAppointmentModal();
            }
        });
    }

    // Appointment form submission logic for the MODAL
    if (appointmentFormModal) {
        appointmentFormModal.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            modalMessageArea.style.display = 'none';
            modalMessageArea.textContent = '';
            modalMessageArea.style.backgroundColor = '';
            modalMessageArea.style.color = '';
            
            modalMessageArea.textContent = 'Submitting your appointment...';
            modalMessageArea.style.backgroundColor = '#e0f2fe';
            modalMessageArea.style.color = '#0288d1';
            modalMessageArea.style.display = 'block';

            const formData = new FormData(appointmentFormModal); // Use the modal form ID
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            showSpinner(); // Show global spinner during submission

            try {
                const response = await fetch(MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                hideSpinner(); // Hide global spinner after response

                if (response.ok) {
                    modalMessageArea.textContent = 'Appointment booked successfully! You will receive a confirmation email shortly.';
                    modalMessageArea.style.backgroundColor = '#e8f5e9';
                    modalMessageArea.style.color = '#2e7d32';
                    appointmentFormModal.reset(); // Clear the form
                    // Optionally, you might want to auto-close the modal after a few seconds
                    setTimeout(closeAppointmentModal, 3000); 
                } else {
                    const errorText = await response.text();
                    console.error('Error submitting form to Make.com:', response.status, errorText);
                    modalMessageArea.textContent = `Failed to book appointment. Please try again. (Error: ${response.status} - ${errorText})`;
                    modalMessageArea.style.backgroundColor = '#ffe0b2';
                    modalMessageArea.style.color = '#d32f2f';
                }
            } catch (error) {
                console.error('Network error or unexpected issue during fetch:', error);
                hideSpinner(); // Hide global spinner on network error
                modalMessageArea.textContent = 'An unexpected error occurred. Please check your internet connection and try again.';
                modalMessageArea.style.backgroundColor = '#ffe0b2';
                modalMessageArea.style.color = '#d32f2f';
            }
        });
    }
    // --- END APPOINTMENT MODAL LOGIC ---


    // --- Intersection Observer for "About" section animations ---
    const aboutSectionContainer = document.querySelector('.about-container-new');

    if (aboutSectionContainer) {
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const leftContent = entry.target.querySelector('.about-left-content');
                    const imageTop1 = entry.target.querySelector('.about-image-small:nth-child(1)');
                    const imageTop2 = entry.target.querySelector('.about-image-small:nth-child(2)');
                    const imageLarge = entry.target.querySelector('.about-image-large');

                    if (leftContent) leftContent.classList.add('animate-active');
                    if (imageTop1) imageTop1.classList.add('animate-active');
                    if (imageTop2) imageTop2.classList.add('animate-active');
                    if (imageLarge) imageLarge.classList.add('animate-active');

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(aboutSectionContainer);
    } else {
        console.warn("About section container with class 'about-container-new' not found. Animations may not trigger.");
    }

    // --- Gender-specific Treatments Tab Logic ---
    const genderTabButtons = document.querySelectorAll('.gender-tab-button');
    const genderContents = document.querySelectorAll('.gender-content');
    const highlightableImages = document.querySelectorAll('.highlightable-image');

    genderTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target; // 'for-him' or 'for-her'

            genderTabButtons.forEach(btn => btn.classList.remove('active'));
            genderContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetId + '-content').classList.add('active');

            highlightableImages.forEach(img => {
                if (img.dataset.gender === targetId) {
                    img.classList.add('highlighted');
                } else {
                    img.classList.remove('highlighted');
                }
            });
        });
    });

    if (genderTabButtons.length > 0) {
        genderTabButtons[0].click(); // Simulate a click on the first button to set initial state
    }

    // --- TESTIMONIAL SLIDER LOGIC ---
    let currentSlide = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.dot');

    function showTestimonialSlide(index) {
        if (testimonialSlides.length === 0) return;

        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (testimonialDots[i]) {
                testimonialDots[i].classList.remove('active');
            }
        });
        testimonialSlides[index].classList.add('active');
        if (testimonialDots[index]) {
            testimonialDots[index].classList.add('active');
        }
        currentSlide = index;
    }

    if (testimonialSlides.length > 0) {
        showTestimonialSlide(0);
    }

    if (testimonialSlides.length > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showTestimonialSlide(currentSlide);
        }, 5000);
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonialSlide(index);
        });
    });
    // --- END TESTIMONIAL SLIDER LOGIC ---


    // --- GALLERY FILTERING LOGIC (for index.html) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        if (item.classList.contains('filter-' + filterValue)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
    } else {
        console.warn("Gallery filter buttons or items not found on this page. Gallery filtering will not work.");
    }
    // --- END GALLERY FILTERING LOGIC ---


    // --- GALLERY MODAL LOGIC (for gallery.html) ---
    const galleryModal = document.getElementById('galleryModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const galleryFullItems = document.querySelectorAll('.gallery-item-full');

    if (galleryModal && closeModalBtn && galleryFullItems.length > 0) {
        function openGalleryModal(type, src, title, description) {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'none';
            modalVideo.src = '';

            if (type === 'image') {
                modalImage.src = src;
                modalImage.style.display = 'block';
            } else if (type === 'video') {
                modalVideo.src = src + '?autoplay=1&mute=0';
                modalVideo.style.display = 'block';
            }

            modalTitle.textContent = title;
            modalText.textContent = description;
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeGalleryModal() {
            galleryModal.style.display = 'none';
            modalVideo.src = '';
            document.body.style.overflow = '';
        }

        galleryFullItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.tagName === 'IFRAME') {
                    return;
                }

                const type = item.getAttribute('data-type');
                const src = item.getAttribute('data-src');
                const title = item.getAttribute('data-title');
                const description = item.getAttribute('data-description');

                if (type === 'image' || type === 'video') {
                    openGalleryModal(type, src, title, description);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeGalleryModal);

        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeGalleryModal();
            }
        });
    } else {
        console.warn("Gallery modal or full gallery items not found. Modal functionality for gallery.html will not work.");
    }
    // --- END GALLERY MODAL LOGIC ---

}); // End of the single DOMContentLoaded listener