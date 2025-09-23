/* ===================================
   Mobile Navigation JavaScript
   Handles mobile menu functionality
   =================================== */

class MobileNavigation {
  constructor() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.navbar = document.querySelector('.navbar');

    this.init();
  }

  init() {
    if (this.mobileMenuToggle && this.mobileMenu) {
      this.bindEvents();
      this.setupScrollEffect();
      this.setupBackToTop();
    }
  }

  bindEvents() {
    // Mobile menu toggle
    this.mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking on a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu.classList.contains('open') &&
          !this.mobileMenu.contains(e.target) &&
          !this.mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('open')) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.mobileMenu.classList.contains('open')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.add('open');
    this.mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus management for accessibility
    const firstLink = this.mobileMenu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('open');
    this.mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    // Return focus to toggle button
    this.mobileMenuToggle.focus();
  }

  setupScrollEffect() {
    if (!this.navbar) return;

    let lastScrollTop = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add scrolled class for styling
      if (scrollTop > scrollThreshold) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll (optional)
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        // Scrolling down
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        this.navbar.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    }, { passive: true });
  }

  setupBackToTop() {
    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
      const backToTopButton = document.createElement('button');
      backToTopButton.className = 'back-to-top';
      backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
      backToTopButton.setAttribute('aria-label', 'Back to top');
      document.body.appendChild(backToTopButton);

      // Add click event
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    const backToTopButton = document.querySelector('.back-to-top');

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    }, { passive: true });
  }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.service-card, .feature, .stat-item, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Form handling
function setupFormHandling() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic form validation
      const formData = new FormData(contactForm);
      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const message = contactForm.querySelector('textarea').value;

      if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
      }

      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1000);
    });
  }
}

// Newsletter form handling
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput.value;

      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }

      const submitButton = newsletterForm.querySelector('.newsletter-button');
      const originalText = submitButton.textContent;

      submitButton.textContent = 'Subscribing...';
      submitButton.disabled = true;

      setTimeout(() => {
        alert('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1000);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileNavigation();
  setupSmoothScrolling();
  setupScrollAnimations();
  setupFormHandling();
  setupNewsletterForm();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause any animations or operations if needed
  } else {
    // Page is visible again
  }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MobileNavigation };
}
