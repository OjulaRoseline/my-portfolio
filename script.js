  
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });

    // Dark/Light Mode Toggle
    const toggleBtn = document.querySelector("toggle-btn");
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    // Contact Form (EmailJS ready)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Example with EmailJS (requires setup at emailjs.com)
      // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      //   .then(() => formStatus.textContent = "✅ Message sent successfully!")
      //   .catch(() => formStatus.textContent = "❌ Something went wrong. Try again.");

      // Demo only (fake success message)
      formStatus.textContent = "✅ Message sent successfully!";
      contactForm.reset();
    });

  // Update star colors dynamically
  document.querySelectorAll(".star").forEach(star => {
    star.style.backgroundColor = document.body.classList.contains("dark") ? "#ff6fff" : "#fffc70";
  });

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
// Floating Stars
const starsContainer = document.createElement('div');
starsContainer.id = 'stars';
document.body.appendChild(starsContainer);

const starCount = 100;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  const size = Math.random() * 3 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.backgroundColor = document.body.classList.contains("dark") ? "#ff6fff" : "#fffc70";
  star.style.animationDuration = `${Math.random() * 10 + 5}s`;
  starsContainer.appendChild(star);}

