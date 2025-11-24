function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 8;
        const animationDuration = Math.random() * 10 + 8;
        const color = Math.random() > 0.5 ? 'var(--neon-blue)' : 'var(--neon-pink)';

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;

        particlesContainer.appendChild(particle);
    }
}

document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;

        card.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-15px) rotateX(0) rotateY(0)';
    });
});

document.addEventListener('DOMContentLoaded', createParticles);