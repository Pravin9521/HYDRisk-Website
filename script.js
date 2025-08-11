// Placeholder script.js file for blog.html

document.addEventListener("DOMContentLoaded", () => {
  // Example: Toggle read more content on blog posts
  document.querySelectorAll(".read-more").forEach(button => {
    button.addEventListener("click", () => {
      const blogFullContent = button.nextElementSibling;
      if (blogFullContent.style.display === "block") {
        blogFullContent.style.display = "none";
        button.textContent = "Read More";
      } else {
        blogFullContent.style.display = "block";
        button.textContent = "Read Less";
      }
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});
