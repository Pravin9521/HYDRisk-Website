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

// Form handling with improved validation and error messages
function setupFormHandling() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  // Helper function to show error
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
      input.classList.add('error');
    }
  }

  // Helper function to clear error
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      input.classList.remove('error');
    }
  }

  // Helper function to show form message
  function showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      form.insertBefore(messageElement, form.querySelector('button[type="submit"]'));
    }
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type} show`;
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Clear errors on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      clearError(input);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      contactForm.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
      });
      
      const formMessage = contactForm.querySelector('.form-message');
      if (formMessage) {
        formMessage.classList.remove('show');
      }

      // Get form fields
      const nameInput = contactForm.querySelector('input[name="name"], input[type="text"]');
      const emailInput = contactForm.querySelector('input[name="email"], input[type="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"], textarea');
      
      let isValid = true;

      // Validate name
      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) showError(nameInput, 'Name is required');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
      }

      // Validate email
      if (!emailInput || !emailInput.value.trim()) {
        if (emailInput) showError(emailInput, 'Email is required');
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, 'Please enter a valid email address');
          isValid = false;
        }
      }

      // Validate message
      if (!messageInput || !messageInput.value.trim()) {
        if (messageInput) showError(messageInput, 'Message is required');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
      }

      if (!isValid) {
        // Focus first error field
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Get submit button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const buttonText = submitButton.querySelector('.button-text');
      const buttonLoader = submitButton.querySelector('.button-loader');
      
      // Show loading state
      if (buttonText) buttonText.style.display = 'none';
      if (buttonLoader) buttonLoader.style.display = 'inline-block';
      submitButton.disabled = true;

      // Submit to API
      const formDataObj = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: contactForm.querySelector('input[name="phone"], input[type="tel"]')?.value.trim() || null,
        subject: contactForm.querySelector('input[name="subject"]')?.value.trim() || null,
        message: messageInput.value.trim(),
        serviceType: contactForm.dataset.serviceType || null
      };

      // Use API handler if available, otherwise fallback
      if (typeof apiHandler !== 'undefined') {
        apiHandler.submitContact(formDataObj).then(result => {
          if (result.success) {
            showFormMessage(contactForm, result.message || 'Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            if (buttonText) buttonText.style.display = 'inline';
            if (buttonLoader) buttonLoader.style.display = 'none';
            submitButton.disabled = false;
            
            // Focus first input after success
            if (nameInput) nameInput.focus();
          } else {
            showFormMessage(contactForm, result.error || 'An error occurred. Please try again later.', 'error');
            if (buttonText) buttonText.style.display = 'inline';
            if (buttonLoader) buttonLoader.style.display = 'none';
            submitButton.disabled = false;
          }
        }).catch(error => {
          console.error('API submission error:', error);
          showFormMessage(contactForm, 'An error occurred. Please try again later.', 'error');
          if (buttonText) buttonText.style.display = 'inline';
          if (buttonLoader) buttonLoader.style.display = 'none';
          submitButton.disabled = false;
        });
      } else {
        // Fallback if API handler not loaded
        setTimeout(() => {
          showFormMessage(contactForm, 'Thank you for your message! We will get back to you soon.', 'success');
          contactForm.reset();
          
          // Reset button
          if (buttonText) buttonText.style.display = 'inline';
          if (buttonLoader) buttonLoader.style.display = 'none';
          submitButton.disabled = false;
          
          // Focus first input after success
          if (nameInput) nameInput.focus();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage(contactForm, 'An error occurred. Please try again later.', 'error');
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const buttonText = submitButton?.querySelector('.button-text');
      const buttonLoader = submitButton?.querySelector('.button-loader');
      if (buttonText) buttonText.style.display = 'inline';
      if (buttonLoader) buttonLoader.style.display = 'none';
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// Newsletter form handling
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
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

      const nameInput = newsletterForm.querySelector('input[name="name"]');

      // Submit to API
      if (typeof apiHandler !== 'undefined') {
        apiHandler.subscribeNewsletter(email.trim(), nameInput?.value.trim() || null, 'website').then(result => {
          if (result.success) {
            alert(result.message || 'Thank you for subscribing to our newsletter!');
            emailInput.value = '';
            if (nameInput) nameInput.value = '';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          } else {
            alert(result.error || 'An error occurred. Please try again later.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }
        }).catch(error => {
          console.error('Newsletter subscription error:', error);
          alert('An error occurred. Please try again later.');
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
      } else {
        // Fallback if API handler not loaded
        setTimeout(() => {
          alert('Thank you for subscribing to our newsletter!');
          emailInput.value = '';
          if (nameInput) nameInput.value = '';
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 1000);
      }
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
