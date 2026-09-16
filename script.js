// Fade in
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 1.5s ease';
    document.body.style.opacity = '1';
});

// Stars
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.4 + 0.1
    });
}
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
        star.y -= star.speed;
        if (star.y < 0) { star.y = canvas.height; star.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawStars);
}
drawStars();
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

// Typing effect
const tagline = document.getElementById('hero-tagline');
const text = "Turning raw footage into stories that move people.";
tagline.textContent = '';
let i = 0;
function type() { if (i < text.length) { tagline.textContent += text[i]; i++; setTimeout(type, 50); } }
setTimeout(type, 1500);

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll appear animation
const animateEls = document.querySelectorAll('.feature-card, .skill-card, .stat, #quran-verse p, .work-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        }
    });
}, { threshold: 0.1 });
animateEls.forEach(el => { el.classList.add('hidden'); observer.observe(el); });

// Skill bars
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const pct = bar.style.getPropertyValue('--pct');
            bar.style.width = '0%';
            bar.style.transition = 'width 1.2s ease';
            setTimeout(() => { bar.style.width = pct; }, 200);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.skill-bar').forEach(bar => skillObserver.observe(bar));