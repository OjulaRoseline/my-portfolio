  
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
    const toggleBtn = document.querySelector('.toggle-btn');
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
