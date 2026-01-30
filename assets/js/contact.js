// Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', function() {
    const navList = document.querySelector('nav .nav-links');
    if (navList) navList.classList.toggle('open');
    this.classList.toggle('open');
    // update aria-expanded for accessibility
    const expanded = this.classList.contains('open');
    this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('nav .nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const navList = document.querySelector('nav .nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navList && navList.classList.contains('open')) navList.classList.remove('open');
        if (hamburger && hamburger.classList.contains('open')) {
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
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