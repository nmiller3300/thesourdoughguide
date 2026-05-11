// ===== MOBILE NAV =====
function toggleNav() {
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('open');
}

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.remove('open');
  });
});

// ===== NEWSLETTER =====
function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed! ✓';
  btn.style.background = '#2D6A4F';
  input.value = '';
  input.placeholder = 'You\'re on the list!';
  input.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
    input.placeholder = 'Your email address';
    input.disabled = false;
  }, 4000);
}

// ===== SCROLL FADE IN =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cat-card, .post-card, .equip-card, .start-step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== STICKY HEADER SHADOW =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 20px rgba(44,26,14,0.12)';
  } else {
    header.style.boxShadow = '0 2px 12px rgba(44,26,14,0.06)';
  }
});
