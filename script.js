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
        document.querySelector('.matrix-bg').appendChild(this.canvas);

        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.fontSize = 14;
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.985) {
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
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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