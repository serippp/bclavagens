const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const mobile = matchMedia('(max-width: 740px)');

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
}

navigation.classList.add('is-enhanced');
menuToggle.hidden = false;
menuToggle.addEventListener('click', () => setMenuOpen(!navigation.classList.contains('is-open')));
navigation.addEventListener('click', event => {
  if (mobile.matches && event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
mobile.addEventListener('change', () => setMenuOpen(false));

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero-video');
const heroControl = document.querySelector('.hero-control');
const heroError = document.querySelector('.hero-error');

function syncHeroControl() {
  const playing = !hero.paused && !hero.ended;
  heroControl.dataset.playing = String(playing);
  heroControl.setAttribute('aria-label', playing ? 'Pausar vídeo de apresentação' : 'Reproduzir vídeo de apresentação');
}

function showHeroError() {
  heroError.hidden = false;
  heroControl.hidden = true;
}

function respectMotionPreference() {
  if (motion.matches) {
    hero.autoplay = false;
    hero.pause();
  }
}

hero.muted = true;
respectMotionPreference();
hero.controls = false;
heroControl.hidden = false;
syncHeroControl();

hero.addEventListener('play', syncHeroControl);
hero.addEventListener('pause', syncHeroControl);
hero.addEventListener('ended', syncHeroControl);
hero.addEventListener('error', showHeroError);
hero.querySelector('source').addEventListener('error', showHeroError);
motion.addEventListener('change', respectMotionPreference);

heroControl.addEventListener('click', async () => {
  if (!hero.paused) {
    hero.pause();
    return;
  }
  try {
    await hero.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      hero.controls = true;
      heroControl.hidden = true;
    }
  }
});

if ('IntersectionObserver' in window && !motion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });

  for (const section of document.querySelectorAll('.reveal')) {
    if (section.getBoundingClientRect().top >= window.innerHeight) revealObserver.observe(section);
  }
}
