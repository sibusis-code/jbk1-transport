// Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', function() {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('open');
    this.classList.toggle('open');
    // update aria-expanded for accessibility
    const expanded = this.classList.contains('open');
    this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('nav .nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        const hamburger = document.querySelector('.hamburger');
        if (nav && nav.classList.contains('open')) nav.classList.remove('open');
        if (hamburger && hamburger.classList.contains('open')) {
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    if (nav && nav.classList.contains('open')) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
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

// ===============================================
// BOOKING SYSTEM - Service Selection & Calculator
// ===============================================

// Department of Transport Standard Rates (South Africa)
const RATES = {
    scholar: 4.50,  // R4.50 per km for scholar transport
    shuttle: 5.00   // R5.00 per km for shuttle/private hire
};

// Centurion area coordinates (approximate centers)
const LOCATIONS = {
    // Schools in Centurion
    'Hennopspark Primary School, Centurion': { lat: -25.8617, lng: 28.1947 },
    'Wierdapark Primary School, Centurion': { lat: -25.8503, lng: 28.1722 },
    'Eldoraigne Primary School, Centurion': { lat: -25.8789, lng: 28.1489 },
    'Lyttelton Primary School, Centurion': { lat: -25.8356, lng: 28.2058 },
    'Pierre van Ryneveld Primary, Centurion': { lat: -25.8889, lng: 28.2272 },
    'Centurion High School, Centurion': { lat: -25.8628, lng: 28.1878 },
    'Eldoraigne High School, Centurion': { lat: -25.8811, lng: 28.1456 },
    'Wierdapark High School, Centurion': { lat: -25.8478, lng: 28.1689 },
    'Cornwall Hill College, Centurion': { lat: -25.8944, lng: 28.2167 },
    'Southdowns College, Centurion': { lat: -25.8756, lng: 28.2311 },
    'Tyger Valley College, Centurion': { lat: -25.8634, lng: 28.1956 },
    // Common areas/suburbs
    'Hennopspark': { lat: -25.8617, lng: 28.1947 },
    'Wierdapark': { lat: -25.8503, lng: 28.1722 },
    'Eldoraigne': { lat: -25.8789, lng: 28.1489 },
    'Lyttelton': { lat: -25.8356, lng: 28.2058 },
    'Pierre van Ryneveld': { lat: -25.8889, lng: 28.2272 },
    'Irene': { lat: -25.8783, lng: 28.2189 },
    'Centurion CBD': { lat: -25.8603, lng: 28.1894 },
    'Olievenhoutbosch': { lat: -25.9128, lng: 28.1081 },
    'Midstream': { lat: -25.9256, lng: 28.1856 },
    'Rooihuiskraal': { lat: -25.8983, lng: 28.1372 },
    // Major destinations for shuttle
    'OR Tambo International Airport': { lat: -26.1367, lng: 28.2411 },
    'Pretoria CBD': { lat: -25.7479, lng: 28.2293 },
    'Johannesburg CBD': { lat: -26.2041, lng: 28.0473 },
    'Sandton': { lat: -26.1076, lng: 28.0567 },
    'Midrand': { lat: -25.9891, lng: 28.1269 }
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Estimate coordinates from address string
function estimateCoordinates(address) {
    const addressLower = address.toLowerCase();
    
    // Check for known locations
    for (const [location, coords] of Object.entries(LOCATIONS)) {
        if (addressLower.includes(location.toLowerCase())) {
            return coords;
        }
    }
    
    // Check for suburb names
    const suburbs = [
        { name: 'hennopspark', lat: -25.8617, lng: 28.1947 },
        { name: 'wierdapark', lat: -25.8503, lng: 28.1722 },
        { name: 'eldoraigne', lat: -25.8789, lng: 28.1489 },
        { name: 'lyttelton', lat: -25.8356, lng: 28.2058 },
        { name: 'pierre van ryneveld', lat: -25.8889, lng: 28.2272 },
        { name: 'irene', lat: -25.8783, lng: 28.2189 },
        { name: 'centurion', lat: -25.8603, lng: 28.1894 },
        { name: 'olievenhoutbosch', lat: -25.9128, lng: 28.1081 },
        { name: 'midstream', lat: -25.9256, lng: 28.1856 },
        { name: 'rooihuiskraal', lat: -25.8983, lng: 28.1372 },
        { name: 'zwartkop', lat: -25.8219, lng: 28.1592 },
        { name: 'clubview', lat: -25.8467, lng: 28.1989 },
        { name: 'wierda park', lat: -25.8503, lng: 28.1722 },
        { name: 'highveld', lat: -25.8881, lng: 28.1678 },
        { name: 'pretoria', lat: -25.7479, lng: 28.2293 },
        { name: 'johannesburg', lat: -26.2041, lng: 28.0473 },
        { name: 'sandton', lat: -26.1076, lng: 28.0567 },
        { name: 'midrand', lat: -25.9891, lng: 28.1269 },
        { name: 'or tambo', lat: -26.1367, lng: 28.2411 },
        { name: 'airport', lat: -26.1367, lng: 28.2411 }
    ];
    
    for (const suburb of suburbs) {
        if (addressLower.includes(suburb.name)) {
            return { lat: suburb.lat, lng: suburb.lng };
        }
    }
    
    // Default to Centurion CBD if no match found
    return { lat: -25.8603, lng: 28.1894 };
}

// Toggle between Scholar and Shuttle fields
function toggleServiceFields() {
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    const scholarFields = document.getElementById('scholar-fields');
    const shuttleFields = document.getElementById('shuttle-fields');
    
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'scholar') {
                scholarFields.style.display = 'block';
                shuttleFields.style.display = 'none';
            } else {
                scholarFields.style.display = 'none';
                shuttleFields.style.display = 'block';
            }
            // Hide quote result when switching services
            document.getElementById('quote-result').style.display = 'none';
        });
    });
}

// Toggle "Other School" field visibility
function toggleOtherSchool() {
    const schoolSelect = document.getElementById('school-destination');
    const otherSchoolGroup = document.getElementById('other-school-group');
    
    schoolSelect?.addEventListener('change', function() {
        if (this.value === 'other') {
            otherSchoolGroup.style.display = 'block';
        } else {
            otherSchoolGroup.style.display = 'none';
        }
    });
}

// Calculate and display quote
function calculateQuote() {
    const calculateBtn = document.getElementById('calculate-btn');
    
    calculateBtn?.addEventListener('click', function() {
        const serviceType = document.querySelector('input[name="service"]:checked').value;
        let pickup, destination, distance;
        
        if (serviceType === 'scholar') {
            pickup = document.getElementById('pickup-address').value;
            const schoolSelect = document.getElementById('school-destination');
            destination = schoolSelect.value === 'other' 
                ? document.getElementById('other-school').value 
                : schoolSelect.value;
                
            if (!pickup || !destination) {
                alert('Please enter your pickup address and select a school destination.');
                return;
            }
        } else {
            pickup = document.getElementById('shuttle-pickup').value;
            destination = document.getElementById('shuttle-destination').value;
            
            if (!pickup || !destination) {
                alert('Please enter pickup location and destination.');
                return;
            }
        }
        
        // Estimate coordinates
        const pickupCoords = estimateCoordinates(pickup);
        const destCoords = estimateCoordinates(destination);
        
        // Calculate distance
        distance = calculateDistance(
            pickupCoords.lat, pickupCoords.lng,
            destCoords.lat, destCoords.lng
        );
        
        // Add 20% for road distance (roads aren't straight lines)
        distance = distance * 1.2;
        
        // Minimum distance of 2km
        if (distance < 2) distance = 2;
        
        // Calculate price
        const rate = RATES[serviceType];
        let price = distance * rate;
        
        // For scholar transport, show monthly estimate (assuming 2 trips per day, 22 school days)
        const isMonthly = serviceType === 'scholar';
        const monthlyMultiplier = isMonthly ? 44 : 1; // 2 trips x 22 days
        
        // Get return trip for shuttle
        const returnTrip = document.getElementById('return-trip')?.value;
        if (serviceType === 'shuttle' && returnTrip === 'yes') {
            price = price * 2;
            distance = distance * 2;
        }
        
        // Display results
        const quoteResult = document.getElementById('quote-result');
        const distanceResult = document.getElementById('distance-result');
        const serviceResult = document.getElementById('service-result');
        const priceResult = document.getElementById('price-result');
        const quoteNote = document.querySelector('.quote-note');
        
        distanceResult.textContent = distance.toFixed(1) + ' km' + (returnTrip === 'yes' ? ' (return)' : ' (one way)');
        serviceResult.textContent = serviceType === 'scholar' ? 'Scholar Transport' : 'Shuttle Transport';
        
        if (isMonthly) {
            const monthlyPrice = price * monthlyMultiplier;
            priceResult.textContent = `R ${price.toFixed(2)}/trip | R ${monthlyPrice.toFixed(2)}/month`;
            quoteNote.innerHTML = `<strong>Note:</strong> Monthly price based on 2 trips/day × 22 school days. 
                Rates follow Dept. of Transport standards (R${rate.toFixed(2)}/km). 
                <strong>Sibling discounts available!</strong> Final pricing confirmed upon booking.`;
        } else {
            priceResult.textContent = `R ${price.toFixed(2)}`;
            quoteNote.innerHTML = `<strong>Note:</strong> Price based on Dept. of Transport standard rate (R${rate.toFixed(2)}/km). 
                Waiting time charges may apply. Long-distance rates negotiable. Final pricing confirmed upon booking.`;
        }
        
        quoteResult.style.display = 'block';
        
        // Smooth scroll to results
        quoteResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Handle booking form submission
function handleBookingSubmit() {
    const bookingForm = document.getElementById('booking-form');
    
    bookingForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const serviceType = document.querySelector('input[name="service"]:checked').value;
        const name = document.getElementById('booking-name').value;
        const phone = document.getElementById('booking-phone').value;
        const email = document.getElementById('booking-email').value;
        
        // Basic validation
        if (!name || !phone || !email) {
            alert('Please fill in all contact details.');
            return;
        }
        
        // Get distance and price from displayed results
        const distanceResult = document.getElementById('distance-result').textContent;
        const priceResult = document.getElementById('price-result').textContent;
        
        // Prepare booking details for WhatsApp message
        let bookingDetails = `*JBK1 Transport Booking Request*\n\n`;
        bookingDetails += `*Service:* ${serviceType === 'scholar' ? 'Scholar Transport' : 'Shuttle Transport'}\n`;
        
        if (serviceType === 'scholar') {
            const pickup = document.getElementById('pickup-address').value;
            const schoolSelect = document.getElementById('school-destination');
            const school = schoolSelect.value === 'other' 
                ? document.getElementById('other-school').value 
                : schoolSelect.value;
            const children = document.getElementById('children-count').value;
            
            bookingDetails += `*Pickup:* ${pickup}\n`;
            bookingDetails += `*School:* ${school}\n`;
            bookingDetails += `*Children:* ${children}\n`;
        } else {
            const pickup = document.getElementById('shuttle-pickup').value;
            const destination = document.getElementById('shuttle-destination').value;
            const occasion = document.getElementById('occasion-type').value;
            const passengers = document.getElementById('passengers').value;
            const tripDate = document.getElementById('trip-date').value;
            const returnTrip = document.getElementById('return-trip').value;
            
            bookingDetails += `*Pickup:* ${pickup}\n`;
            bookingDetails += `*Destination:* ${destination}\n`;
            bookingDetails += `*Occasion:* ${occasion}\n`;
            bookingDetails += `*Passengers:* ${passengers}\n`;
            bookingDetails += `*Date:* ${tripDate}\n`;
            bookingDetails += `*Return Trip:* ${returnTrip}\n`;
        }
        
        bookingDetails += `\n*Estimated Distance:* ${distanceResult}\n`;
        bookingDetails += `*Estimated Price:* ${priceResult}\n`;
        bookingDetails += `\n*Contact Details:*\n`;
        bookingDetails += `Name: ${name}\n`;
        bookingDetails += `Phone: ${phone}\n`;
        bookingDetails += `Email: ${email}\n`;
        
        const notes = document.getElementById('additional-notes').value;
        if (notes) {
            bookingDetails += `\n*Notes:* ${notes}`;
        }
        
        // Show success message
        alert(`Thank you ${name}! Your booking request has been received.\n\nWe will contact you shortly at ${phone} to confirm your booking.\n\nEstimate: ${priceResult}`);
        
        // Optional: Open WhatsApp with pre-filled message
        const whatsappNumber = '1234567890'; // Replace with actual number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bookingDetails)}`;
        
        // Ask if they want to also send via WhatsApp
        if (confirm('Would you also like to send this booking via WhatsApp for faster response?')) {
            window.open(whatsappUrl, '_blank');
        }
        
        // Reset form
        this.reset();
        document.getElementById('quote-result').style.display = 'none';
    });
}

// Initialize all booking functionality
document.addEventListener('DOMContentLoaded', function() {
    toggleServiceFields();
    toggleOtherSchool();
    calculateQuote();
    handleBookingSubmit();
    
    // Set minimum date for trip date picker to today
    const tripDateInput = document.getElementById('trip-date');
    if (tripDateInput) {
        const today = new Date().toISOString().split('T')[0];
        tripDateInput.setAttribute('min', today);
    }
});