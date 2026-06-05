const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cursorGlow = document.getElementById('cursorGlow');

menuToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = 'true';
    const target = Number(entry.target.dataset.target);
    const prefix = entry.target.dataset.prefix || '+';
    let current = 0;
    const duration = 1400;
    const start = performance.now();
    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      current = Math.round(target * eased);
      entry.target.textContent = `${prefix}${current}%`;
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
}, { threshold: 0.7 });

document.querySelectorAll('[data-target]').forEach(el => metricObserver.observe(el));

document.querySelectorAll('.glass-card, .service-card, .case-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: .42 });
sections.forEach(section => navObserver.observe(section));

document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  const data = new FormData(e.currentTarget);
  const nombre = data.get('nombre');
  const empresa = data.get('empresa');
  status.textContent = `Gracias ${nombre}. Recibimos la solicitud de ${empresa} y prepararemos el diagnóstico estratégico.`;
  e.currentTarget.reset();
});
