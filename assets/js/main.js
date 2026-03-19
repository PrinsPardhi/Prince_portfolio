// ── Theme ────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const thumbEmoji = document.getElementById('thumb-emoji');

const saved = localStorage.getItem('pp-theme') || 'light';
html.setAttribute('data-theme', saved);
if (thumbEmoji) thumbEmoji.textContent = saved === 'dark' ? '🌙' : '☀️';

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('pp-theme', next);
  if (thumbEmoji) thumbEmoji.textContent = next === 'dark' ? '🌙' : '☀️';
});

// ── Nav scroll ──────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger ───────────────────────────────────
const ham = document.getElementById('hamburger');
const drawer = document.getElementById('nav-drawer');
ham?.addEventListener('click', () => drawer?.classList.toggle('open'));
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// ── Scroll animations ────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger children of grids
      if (e.target.dataset.stagger) {
        e.target.querySelectorAll('[data-item]').forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 100);
        });
      } else {
        setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .exp-block, .proj-card, .skill-group').forEach(el => io.observe(el));

// ── Active nav ──────────────────────────────────
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a, .nav-drawer a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  navAs.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + cur;
    a.style.color = isActive ? 'var(--gold)' : '';
    if (isActive) { a.style.color = 'var(--gold)'; } else { a.style.color = ''; }
  });
}, { passive: true });

// ── Project image upload ─────────────────────────
document.querySelectorAll('.proj-img-zone').forEach(zone => {
  const input = zone.querySelector('input[type="file"]');
  const overlay = zone.querySelector('.proj-overlay');

  zone.addEventListener('mouseenter', () => { if (overlay) overlay.style.display = 'flex'; });
  zone.addEventListener('mouseleave', () => { if (overlay) overlay.style.display = 'none'; });

  input?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      let img = zone.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0';
        zone.insertBefore(img, overlay);
      }
      img.src = ev.target.result;
      if (overlay) overlay.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
});

// ── Typed cursor effect in hero ──────────────────
const roles = ['Full-Stack Engineer', 'Angular Specialist', 'Mobile Developer', 'Backend Architect'];
let ri = 0, ci = 0, del = false;
const el = document.getElementById('typed');
if (el) {
  setInterval(() => {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(() => {}, 1500); }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
  }, 80);
}
