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

document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animate on Scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
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

    // Initialize animations after a short delay
    setTimeout(animateOnScroll, 500);

    // Initialize stars after page load
    window.addEventListener('load', () => {
        createStars();
        setTimeout(createStars, 500);
    });

    // Initialize stars
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars';
    starsContainer.setAttribute('aria-hidden', 'true');
    document.body.prepend(starsContainer);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle window resize with debouncing
    const handleResize = debounce(() => {
        createStars();
    }, 250);

    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
        createStars();
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

    function updateStarPosition(star) {
        // Random position with reduced probability near edges
        const getRandomEdgeAwarePosition = () => {
            const pos = Math.random();
            return 5 + (pos * pos * 90);
        };
        
        const posX = getRandomEdgeAwarePosition();
        const posY = getRandomEdgeAwarePosition();
        const size = Math.pow(Math.random(), 2) * 3 + 0.5;
        const duration = 5 + Math.random() * 15;
        const delay = Math.random() * 10;
        const opacity = 0.1 + Math.random() * 0.9;
        
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
    }

    function createStars() {
        if (isReducedMotion) {
            starsContainer.style.display = 'none';
            return;
        }
        
        const starCount = Math.min(
            Math.max(50, Math.floor(window.innerWidth * window.innerHeight / 5000)),
            200
        );
        
        const existingStars = starsContainer.children;
        const starsToKeep = Math.min(existingStars.length, starCount);
        const starsToCreate = Math.max(0, starCount - starsToKeep);
        
        // Update existing stars
        for (let i = 0; i < starsToKeep; i++) {
            updateStarPosition(existingStars[i]);
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
    }
});
