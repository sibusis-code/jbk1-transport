// Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('open');
    this.classList.toggle('open');
});

// Back to top button
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});
document.getElementById('back-to-top')?.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    this.reset();
});

// Simple contact form handler (static demo)
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for contacting JBK1 Transport! We will get back to you soon.');
    this.reset();
});