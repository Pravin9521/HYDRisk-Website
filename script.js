// Modern smooth UI interactions for FAQ, services, and navigation
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for navigation
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const yOffset = -100; // Offset for sticky nav and extra space
                    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });


    // FAQ accordion (only one open at a time, smooth)
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            const list = item.parentElement;
            // Close others
            list.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
            // Toggle this one
            item.classList.toggle('active');
        });
    });

    // Service card accordion (only one open at a time, smooth, hide preview when open)
    document.querySelectorAll('.service-readmore').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.service-card');
            const grid = card.parentElement;
            // Close others
            grid.querySelectorAll('.service-card').forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Toggle this one
            card.classList.toggle('active');
            // Hide preview when open
            const preview = card.querySelector('.service-preview');
            if (card.classList.contains('active')) {
                if (preview) preview.style.display = 'none';
            } else {
                if (preview) preview.style.display = '';
            }
        });
    });

    // Blog post expand/collapse (only one open at a time, smooth, hide preview when open)
    document.querySelectorAll('.blog-post .read-more').forEach(btn => {
        btn.addEventListener('click', function() {
            const post = this.closest('.blog-post');
            const list = post.parentElement;
            // Close others
            list.querySelectorAll('.blog-post').forEach(p => {
                if (p !== post) {
                    p.classList.remove('active');
                    const prev = p.querySelector('.blog-preview');
                    if (prev) prev.style.display = '';
                }
            });
            // Toggle this one
            post.classList.toggle('active');
            // Hide preview when open
            const preview = post.querySelector('.blog-preview');
            if (post.classList.contains('active')) {
                if (preview) preview.style.display = 'none';
                btn.textContent = 'Show Less';
            } else {
                if (preview) preview.style.display = '';
                btn.textContent = 'Read More';
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener("scroll", function () {
        let scrollPosition = window.scrollY;
        const hero = document.querySelector(".hero");
        if (hero) hero.style.backgroundPositionY = scrollPosition * 0.5 + "px";
    });
});

