// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            formMessage.textContent = 'Thank you! Your message has been sent successfully.';
            formMessage.className = 'form-message success';
            contactForm.reset();
        } else {
            formMessage.textContent = data.error || 'Something went wrong. Please try again.';
            formMessage.className = 'form-message error';
        }
    } catch (error) {
        formMessage.textContent = 'Network error. Please try again later.';
        formMessage.className = 'form-message error';
    }
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
});

// Placeholder image handling - replace with actual project images
const projectImages = {
    'project1-img': '/images/Thrift_Shift.png',
    'project2-img': '/images/alumni_pic.PNG',
    'project3-img': '/images/shift_scheduler.png',
    'profile-img': '/images/headshot.JPG'
};

// Set placeholder images
Object.keys(projectImages).forEach(id => {
    const img = document.getElementById(id);
    if (img) {
        img.src = projectImages[id];
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});