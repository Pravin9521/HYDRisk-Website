// Impact Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    // Function to animate counters
    function animateCounters() {
        const counters = document.querySelectorAll('.impact-counter');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    // Initialize counter animation
    animateCounters();

    // Re-animate counters if user scrolls back to top and returns
    let hasAnimated = false;

    const impactSection = document.querySelector('.impact-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            } else if (!entry.isIntersecting) {
                // Reset counters when section is out of view
                const counters = document.querySelectorAll('.impact-counter');
                counters.forEach(counter => {
                    counter.textContent = '0';
                });
                hasAnimated = false;
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });

    if (impactSection) {
        observer.observe(impactSection);
    }
});
