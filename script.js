// Matrix Background Animation
class MatrixBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.7';
        
        // Check if Firefox
        this.isFirefox = typeof InstallTrigger !== 'undefined';
        if (this.isFirefox) {
            this.canvas.style.opacity = '0.5'; // Lower opacity for Firefox
            this.fontSize = 12; // Smaller font size for better performance
        } else {
            this.fontSize = 14;
        }
        
        document.querySelector('.matrix-bg').appendChild(this.canvas);

        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.columns = 0;
        this.drops = [];

        window.addEventListener('resize', () => this.initMatrix());
        this.initMatrix();
        this.animate();
    }

    initMatrix() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    animate() {
        // Adjust animation for Firefox
        const alphaValue = this.isFirefox ? 0.05 : 0.03;
        
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alphaValue})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Adjust drop rate for Firefox
            const randomFactor = this.isFirefox ? 0.975 : 0.985;
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > randomFactor) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Glitch Text Effect
const glitchTexts = document.querySelectorAll('.glitch-text');
glitchTexts.forEach(text => {
    text.setAttribute('data-text', text.textContent);
});

// Terminal Animation
class TerminalAnimation {
    constructor() {
        this.lines = document.querySelectorAll('.typing-text .line');
        this.cursor = document.querySelector('.typing-text .cursor');
        this.currentLine = 0;
        this.delay = 50; // Delay between each character
        this.lineDelay = 500; // Delay between lines
        
        this.init();
    }

    init() {
        this.lines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.animation = 'none';
            const text = line.textContent;
            line.textContent = '';
            line.dataset.text = text;
        });

        this.typeNextLine();
    }

    typeNextLine() {
        if (this.currentLine >= this.lines.length) return;

        const line = this.lines[this.currentLine];
        const text = line.dataset.text;
        line.style.opacity = '1';
        
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < text.length) {
                line.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, this.delay);
            } else {
                this.currentLine++;
                setTimeout(() => this.typeNextLine(), this.lineDelay);
            }
        };

        typeChar();
    }
}

// Initialize Terminal Animation
window.addEventListener('load', () => {
    new TerminalAnimation();
    new MatrixBackground();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const hrefAttribute = this.getAttribute('href');
        // Only prevent default if it's a true hash link for the current page
        if (hrefAttribute.startsWith('#') && document.querySelector(hrefAttribute)) {
            e.preventDefault();
            document.querySelector(hrefAttribute).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Section and Card Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '-50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
        } else {
            entry.target.classList.add('hidden');
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe all sections and skill cards
document.querySelectorAll('.section-dark, .skill-card').forEach(element => {
    observer.observe(element);
});

// Mobile Navigation Toggle
const hamburgerMenu = document.querySelector('.hamburger-menu');
// const sidebar = document.querySelector('.sidebar'); // Old sidebar
const topNavLinks = document.querySelector('.top-navbar .nav-links'); // New nav links container

if (hamburgerMenu && topNavLinks) { // Check if both hamburger and new nav links exist
    hamburgerMenu.addEventListener('click', () => {
        // sidebar.classList.toggle('active'); // Old sidebar toggle
        topNavLinks.classList.toggle('active'); // Toggle active on new nav links for mobile
        hamburgerMenu.classList.toggle('active');
    });
}

// Close sidebar when clicking on a link (mobile)
// document.querySelectorAll('.sidebar nav ul li a').forEach(link => { // Old selector
document.querySelectorAll('.top-navbar .nav-links a').forEach(link => { // New selector for top nav links
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992 && topNavLinks && topNavLinks.classList.contains('active')) { // Check new nav links
            // sidebar.classList.remove('active'); // Old sidebar
            topNavLinks.classList.remove('active'); // Hide new nav links
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        }
    });
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && 
        topNavLinks && topNavLinks.classList.contains('active') && // Check new nav links
        !e.target.closest('.top-navbar .nav-links') && // Clicked outside new nav links
        !e.target.closest('.hamburger-menu') ) { // Clicked outside hamburger
        // sidebar.classList.remove('active'); // Old sidebar
        topNavLinks.classList.remove('active'); // Hide new nav links
        if (hamburgerMenu) hamburgerMenu.classList.remove('active');
    }
});

// Highlight active section in navigation based on current page URL
const navLinks = document.querySelectorAll('.top-navbar .nav-links a.nav-button');
const currentPage = window.location.pathname.split('/').pop(); // Gets the current HTML file name

function highlightActivePage() {
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();

        // Handle index.html as the default/home page
        if ((currentPage === '' || currentPage === 'index.html') && linkPage === 'index.html') {
            link.classList.add('active');
        } else if (linkPage === currentPage && currentPage !== 'index.html') {
            link.classList.add('active');
        }
    });
}

// Initialize active page highlighting on page load
window.addEventListener('load', () => {
    // new TerminalAnimation(); // Already initialized earlier
    // new MatrixBackground(); // Already initialized earlier
    highlightActivePage();
    // Add a small delay to ensure all elements are properly loaded if needed for other scripts
    // setTimeout(highlightActivePage, 100); // Usually not needed for this kind of highlighting
});

// Remove old scroll-based highlighting logic
/*
const sections = document.querySelectorAll('section[id]');
// const navLinks = document.querySelectorAll('.sidebar nav ul li a'); // Old nav links
// const navLinks = document.querySelectorAll('.top-navbar .nav-links a.nav-button'); // New nav buttons

function highlightActiveSection() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjusted for fixed navbar height
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check href for section ID. For index.html, hero section is home.
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${sectionId}` || (sectionId === 'hero' && linkHref === 'index.html')) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    link.classList.add('active');
                }
            }
        });
    });
}

// Initialize active section highlighting on page load
window.addEventListener('load', () => {
    // new TerminalAnimation(); // Ensure these are called, or manage initialization order
    // new MatrixBackground();
    highlightActiveSection();
    // Add a small delay to ensure all elements are properly loaded
    setTimeout(highlightActiveSection, 500);
});

window.addEventListener('scroll', highlightActiveSection);
*/