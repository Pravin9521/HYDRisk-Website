// Impact Counter Animation with Error Handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Function to animate counters
        function animateCounters() {
            const counters = document.querySelectorAll('.impact-counter');
            
            if (!counters || counters.length === 0) {
                return; // No counters found, exit gracefully
            }

            counters.forEach(counter => {
                try {
                    const targetAttr = counter.getAttribute('data-target');
                    if (!targetAttr) {
                        console.warn('Impact counter missing data-target attribute');
                        return;
                    }
                    
                    const target = parseInt(targetAttr, 10);
                    if (isNaN(target) || target < 0) {
                        console.warn('Invalid target value for impact counter:', targetAttr);
                        return;
                    }
                    
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    let animationFrameId = null;

                    const updateCounter = () => {
                        current += increment;

                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            animationFrameId = requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                            if (animationFrameId) {
                                cancelAnimationFrame(animationFrameId);
                            }
                        }
                    };

                    // Start animation when element is visible
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !counter.hasAttribute('data-animated')) {
                                counter.setAttribute('data-animated', 'true');
                                updateCounter();
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.5 });

                    observer.observe(counter);
                } catch (error) {
                    console.error('Error animating counter:', error);
                }
            });
        }

        // Initialize counter animation
        animateCounters();

        // Re-animate counters if user scrolls back to top and returns
        const impactSection = document.querySelector('.impact-section');
        if (impactSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Reset animation state when section comes into view
                        const counters = document.querySelectorAll('.impact-counter');
                        counters.forEach(counter => {
                            if (counter.hasAttribute('data-animated')) {
                                counter.removeAttribute('data-animated');
                            }
                        });
                        animateCounters();
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '50px'
            });

            sectionObserver.observe(impactSection);
        }
    } catch (error) {
        console.error('Error initializing impact counter:', error);
    }
});
