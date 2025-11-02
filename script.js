// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Smooth Scrolling with Accessibility
    const handleSmoothScroll = (e) => {
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL without adding to browser history
            history.replaceState(null, null, targetId);
            // Focus the target element for keyboard users
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
        }
    };

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
        // Add keyboard event for accessibility
        anchor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleSmoothScroll(e);
            }
        });
    });

    // Enhanced Dark/Light Mode Toggle with System Preference and Local Storage
    const toggleBtn = document.getElementById('toggleBtn');
    if (toggleBtn) {
        // System preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Check for saved user preference, if any
        const currentTheme = localStorage.getItem('theme');
        
        // Apply theme based on preference or system setting
        const applyTheme = (isDark) => {
            document.body.classList.toggle('dark', isDark);
            toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            toggleBtn.innerHTML = isDark 
                ? '<i class="fas fa-sun" aria-hidden="true"></i> Light Mode' 
                : '<i class="fas fa-moon" aria-hidden="true"></i> Dark Mode';
            updateStarColors(isDark);
            
            // Update meta theme color for mobile browsers
            const themeColor = isDark ? '#1a1a2e' : '#f8f9fa';
            document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
        };
        
        // Initialize theme
        if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

        // Toggle theme on button click
        toggleBtn.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme(isDark);
        });
        
        // Listen for system theme changes
        prefersDarkScheme.addListener((e) => {
            if (!localStorage.getItem('theme')) { // Only if user hasn't set a preference
                applyTheme(e.matches);
            }
        });
    }

    // Update star colors based on theme
    function updateStarColors(isDark) {
        document.querySelectorAll('.star').forEach(star => {
            star.style.backgroundColor = isDark ? '#ff6fff' : '#fffc70';
        });
    }

    // Enhanced Contact Form with Validation and Local Storage
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const FORM_DATA_KEY = 'contactFormData';
    
    if (contactForm) {
        // Load saved form data if exists
        const savedFormData = localStorage.getItem(FORM_DATA_KEY);
        if (savedFormData) {
            try {
                const formData = JSON.parse(savedFormData);
                Object.keys(formData).forEach(key => {
                    const input = contactForm.elements[key];
                    if (input) input.value = formData[key];
                });
            } catch (e) {
                console.error('Failed to load form data:', e);
            }
        }
        
        // Save form data on input
        contactForm.addEventListener('input', debounce(() => {
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formValues));
        }, 300));
        
        // Form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable form during submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';
            
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Clear any previous status
            showFormStatus('', '');
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'message'];
            const missingFields = requiredFields.filter(field => !formValues[field].trim());
            
            if (missingFields.length > 0) {
                showFormStatus(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                return;
            }
            
            if (!isValidEmail(formValues.email)) {
                showFormStatus('Please enter a valid email address', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                return;
            }
            
            // Show loading state
            showFormStatus('Sending message...', 'loading');
            
            try {
                // Simulate API call with error handling
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // Simulate 90% success rate for demo purposes
                        if (Math.random() < 0.9) {
                            resolve();
                        } else {
                            reject(new Error('Network error'));
                        }
                    }, 1500);
                });
                
                // Clear form and local storage on success
                contactForm.reset();
                localStorage.removeItem(FORM_DATA_KEY);
                
                // Show success message
                showFormStatus('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('❌ Something went wrong. Please try again or contact us via email.', 'error');
                // Auto-retry after 5 seconds
                setTimeout(() => {
                    if (confirm('Message sending failed. Would you like to try again?')) {
                        contactForm.dispatchEvent(new Event('submit'));
                    }
                }, 5000);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    function showFormStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = 'form-status';
        formStatus.classList.add(type);
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Enhanced Animate on Scroll with Intersection Observer
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Unobserve after animation starts for performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animations after a short delay to allow for page load
    setTimeout(animateOnScroll, 500);
});

// Enhanced Floating Stars with Performance Optimizations
const starsContainer = document.createElement('div');
starsContainer.id = 'stars';
starsContainer.setAttribute('aria-hidden', 'true'); // Hide from screen readers
document.body.prepend(starsContainer);

// Cache DOM elements and styles
let starElements = [];
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const createStars = () => {
    if (isReducedMotion) {
        starsContainer.style.display = 'none';
        return;
    }
    
    // Calculate responsive star count based on screen size
    const starCount = Math.min(
        Math.max(50, Math.floor(window.innerWidth * window.innerHeight / 5000)),
        200 // Max stars for performance
    );
    
    // Reuse existing stars if possible
    const existingStars = starsContainer.children;
    const starsToKeep = Math.min(existingStars.length, starCount);
    const starsToCreate = Math.max(0, starCount - starsToKeep);
    
    // Update existing stars
    for (let i = 0; i < starsToKeep; i++) {
        const star = existingStars[i];
        updateStarPosition(star);
    }
    
    // Remove extra stars
    while (existingStars.length > starCount) {
        starsContainer.removeChild(existingStars[existingStars.length - 1]);
    }
    
    // Create new stars
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < starsToCreate; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        updateStarPosition(star);
        fragment.appendChild(star);
    }
    
    starsContainer.appendChild(fragment);
    
    // Update star colors based on current theme
    updateStarColors(document.body.classList.contains('dark'));
};

const updateStarPosition = (star) => {
    // Random position with reduced probability near edges
    const getRandomEdgeAwarePosition = () => {
        const pos = Math.random();
        // Create a bell curve distribution to avoid stars clustering at edges
        return 5 + (pos * pos * 90);
    };
    
    const posX = getRandomEdgeAwarePosition();
    const posY = getRandomEdgeAwarePosition();
    
    // Random size with weighted distribution (more small stars than large ones)
    const size = Math.pow(Math.random(), 2) * 3 + 0.5; // 0.5px to 3.5px
    
    // Random animation with varied timing
    const duration = 5 + Math.random() * 15; // 5s to 20s
    const delay = Math.random() * 10; // 0s to 10s
    const opacity = 0.1 + Math.random() * 0.9; // 0.1 to 1.0
    
    // Apply styles with transforms for better performance
    Object.assign(star.style, {
        position: 'absolute',
        transform: `translate(${posX}vw, ${posY}vh)`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        animation: `twinkle ${duration}s infinite ${delay}s ease-in-out`,
        opacity: opacity.toString()
    });
};

// Handle window resize with debouncing
const handleResize = debounce(() => {
    createStars();
}, 250);

// Listen for reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    createStars();
});

// Initialize stars after page load
window.addEventListener('load', () => {
    createStars();
    // Recreate stars after a short delay to ensure all styles are loaded
    setTimeout(createStars, 500);
});

// Use passive event listener for better scrolling performance
window.addEventListener('resize', handleResize, { passive: true });

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        starsContainer.style.animationPlayState = 'paused';
    } else {
        starsContainer.style.animationPlayState = 'running';
    }
});

