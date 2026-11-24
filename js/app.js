/**
 * Core Shell Controller: Boot Sequence, Instrument Navigation, Accessibility
 */
export function initShell() {
  // Mobile menu toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'CLOSE [×]' : 'MENU [≡]';
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'MENU [≡]';
      });
    });
  }

  // Restrained scientific instrument boot sequence (once per session)
  const boot = document.getElementById('bootOverlay');
  if (boot) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem('archive_booted') === '1') {
      boot.remove();
    } else {
      const bar = document.getElementById('bootBar');
      requestAnimationFrame(() => {
        if (bar) bar.style.width = '100%';
      });
      const dismiss = () => {
        boot.classList.add('done');
        sessionStorage.setItem('archive_booted', '1');
        setTimeout(() => boot.remove(), 260);
      };
      const timer = setTimeout(dismiss, 720);
      boot.addEventListener('click', () => {
        clearTimeout(timer);
        dismiss();
      });
    }
  }
}
