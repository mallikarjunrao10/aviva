// ======================================================
// Global Helper Functions (can be accessed anywhere)
// ======================================================

// Get references to the spinner and success modal elements
const spinner = document.getElementById('loading-spinner');
const successModal = document.getElementById('success-modal');

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
function showModal() {
    if (successModal) {
        successModal.style.display = 'flex'; // Use flex to center the modal
    }
}

/**
 * Hides the success modal.
 */
function closeModal() {
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
// Appointment Form Submission Logic (add your form logic here if any)
// ======================================================
// Example:
// const appointmentForm = document.getElementById('appointment-form');
// if (appointmentForm) {
//     appointmentForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         showSpinner();
//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));
//             hideSpinner();
//             showModal();
//             appointmentForm.reset(); // Clear form after success
//         } catch (error) {
//             console.error('Form submission failed:', error);
//             hideSpinner();
//             // Show an error message to the user
//         }
//     });
// }


// ======================================================
// All other DOM-dependent JavaScript goes inside
// a single DOMContentLoaded listener for efficiency
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- START MOBILE MENU LOGIC ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenu = document.querySelector('.close-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    function openMobileMenu() {
        mobileNav.classList.add('open');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('active');
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
                    // Add the 'animate-active' class to trigger animations for specific children
                    const leftContent = entry.target.querySelector('.about-left-content');
                    const imageTop1 = entry.target.querySelector('.about-image-small:nth-child(1)');
                    const imageTop2 = entry.target.querySelector('.about-image-small:nth-child(2)');
                    const imageLarge = entry.target.querySelector('.about-image-large');

                    if (leftContent) leftContent.classList.add('animate-active');
                    if (imageTop1) imageTop1.classList.add('animate-active');
                    if (imageTop2) imageTop2.classList.add('animate-active');
                    if (imageLarge) imageLarge.classList.add('animate-active');

                    // Stop observing once animated to prevent re-triggering
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

            // Remove active class from all buttons and content
            genderTabButtons.forEach(btn => btn.classList.remove('active'));
            genderContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetId + '-content').classList.add('active');

            // Update image highlighting
            highlightableImages.forEach(img => {
                if (img.dataset.gender === targetId) {
                    img.classList.add('highlighted');
                } else {
                    img.classList.remove('highlighted');
                }
            });
        });
    });

    // Initialize the first tab as active and highlight its image on page load
    if (genderTabButtons.length > 0) {
        genderTabButtons[0].click(); // Simulate a click on the first button to set initial state
    }

    // --- TESTIMONIAL SLIDER LOGIC ---
    let currentSlide = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.dot');

    function showTestimonialSlide(index) {
        if (testimonialSlides.length === 0) return; // Prevent errors if no slides are found

        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (testimonialDots[i]) { // Check if dot exists
                testimonialDots[i].classList.remove('active');
            }
        });
        testimonialSlides[index].classList.add('active');
        if (testimonialDots[index]) { // Check if dot exists
            testimonialDots[index].classList.add('active');
        }
        currentSlide = index;
    }

    // Initialize the first slide on page load
    if (testimonialSlides.length > 0) {
        showTestimonialSlide(0);
    }

    // Auto slide every 5s, only if there are slides
    if (testimonialSlides.length > 1) { // Only auto-slide if there's more than one slide
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showTestimonialSlide(currentSlide);
        }, 5000);
    }

    // Attach click listeners to dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonialSlide(index);
        });
    });
    // --- END TESTIMONIAL SLIDER LOGIC ---


    // --- GALLERY FILTERING LOGIC (for index.html) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) { // Ensure gallery elements exist
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add 'active' class to the clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter'); // This gets 'photos' or 'videos'

                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        // FIX: Prepend 'filter-' to filterValue to match the class names in HTML
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
    const galleryFullItems = document.querySelectorAll('.gallery-item-full'); // Selector for items on gallery.html

    if (galleryModal && closeModalBtn && galleryFullItems.length > 0) { // Ensure modal elements and items exist
        function openGalleryModal(type, src, title, description) {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'none';
            modalVideo.src = ''; // Clear previous video src

            if (type === 'image') {
                modalImage.src = src;
                modalImage.style.display = 'block';
            } else if (type === 'video') {
                // For videos, use the embed URL and autoplay
                modalVideo.src = src + '?autoplay=1&mute=0'; // Added mute=0 to ensure sound if autoplay
                modalVideo.style.display = 'block';
            }

            modalTitle.textContent = title;
            modalText.textContent = description;
            galleryModal.style.display = 'flex'; // Show modal
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }

        function closeGalleryModal() {
            galleryModal.style.display = 'none';
            modalVideo.src = ''; // Stop video playback by clearing src
            document.body.style.overflow = ''; // Allow scrolling again
        }

        galleryFullItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent opening modal if clicking directly on an iframe (for Instagram/YouTube embeds)
                if (e.target.tagName === 'IFRAME') {
                    return;
                }

                const type = item.getAttribute('data-type');
                const src = item.getAttribute('data-src');
                const title = item.getAttribute('data-title');
                const description = item.getAttribute('data-description');

                // Only open modal for 'image' or 'video' types.
                // Instagram embeds are best handled by Instagram's own JS.
                if (type === 'image' || type === 'video') {
                    openGalleryModal(type, src, title, description);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeGalleryModal);

        // Close modal if clicking outside the content area
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