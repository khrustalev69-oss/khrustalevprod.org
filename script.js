/**
 * KHRUSTALEV PRODUCTION // ECLECTIC EDITORIAL CINEMA SCRIPTS
 * Interactions: Portfolio Tabs, Inline Vimeo Players, Chip Selector, Telegram Dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initTabs();
  initVideoPlayers();
  initProjectTypeSelector();
  initFormSubmission();
  initMobileNav();
});

/* 1. HEADER SCROLL STATE */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* 2. PORTFOLIO TABS */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const caseCards = document.querySelectorAll('.case-card');

  if (!tabButtons.length || !caseCards.length) return;

  function filterCategory(filter) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    caseCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (filter === 'all' || cardCategory === filter) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 20);
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      filterCategory(button.dataset.filter);
    });
  });

  document.querySelectorAll('[data-switch-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetTab = link.dataset.switchTab;
      if (targetTab) {
        filterCategory(targetTab);
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* 3. VIDEO PLAYERS */
function initVideoPlayers() {
  // Featured Case
  const featuredMedia = document.querySelector('.featured-media[data-vimeo-id]');
  if (featuredMedia) {
    featuredMedia.addEventListener('click', () => {
      const id = featuredMedia.dataset.vimeoId;
      const container = featuredMedia.querySelector('.media-player-container');
      if (container && !featuredMedia.classList.contains('is-playing')) {
        container.innerHTML = `<iframe src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        featuredMedia.classList.add('is-playing');
      }
    });
  }

  // Cards with Vimeo
  document.querySelectorAll('.case-card-media[data-vimeo-id], .reel-card[data-vimeo-id]').forEach(mediaBox => {
    mediaBox.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = mediaBox.dataset.vimeoId;
      const playerContainer = mediaBox.querySelector('.card-player');
      if (playerContainer) {
        document.querySelectorAll('.card-player iframe').forEach(frame => frame.remove());
        document.querySelectorAll('.case-card-media.is-playing').forEach(m => m.classList.remove('is-playing'));

        playerContainer.innerHTML = `<iframe src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;z-index:15;"></iframe>`;
        mediaBox.classList.add('is-playing');
      }
    });
  });

  // External links (VK, YouTube)
  document.querySelectorAll('[data-external-url]').forEach(box => {
    box.addEventListener('click', (e) => {
      e.preventDefault();
      const url = box.dataset.externalUrl;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* 4. CHIPS PROJECT SELECTOR */
let selectedProjectType = 'Документальный фильм';

function initProjectTypeSelector() {
  const chips = document.querySelectorAll('.type-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedProjectType = chip.dataset.type || chip.textContent.trim();
    });
  });
}

/* 5. FORM SUBMISSION */
function initFormSubmission() {
  const form = document.getElementById('projectForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const contactInput = document.getElementById('formContact');
    const descInput = document.getElementById('formDesc');

    const name = nameInput ? nameInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';

    if (!name || !contact) {
      alert('Пожалуйста, укажите имя и телефон или ник в Telegram.');
      if (!name && nameInput) nameInput.focus();
      else if (!contact && contactInput) contactInput.focus();
      return;
    }

    const message = 
      `🎬 Заявка на съемку с сайта:\n\n` +
      `• Направление: ${selectedProjectType}\n` +
      `• Клиент: ${name}\n` +
      `• Контакт: ${contact}\n` +
      (desc ? `• Детали проекта: ${desc}\n` : '') +
      `
Контакты продакшна:
• Продюсер, Режиссер: Денис Хрусталёв (+79990956954, @ygscors)
• Продюсер: Алексей Фёдоров (+79067084167)`;

    const telegramUrl = `https://t.me/ygscors?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  });
}

/* 6. MOBILE NAV (INTUITIVE FULLSCREEN DRAWER WITH SMOOTH TRANSITION) */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.getElementById('mobileDrawer');
  const body = document.body;
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    body.classList.add('mobile-nav-open');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    body.classList.remove('mobile-nav-open');
    body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (body.classList.contains('mobile-nav-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      closeMenu();
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }
      }
    });
  });

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('mobile-nav-open')) {
      closeMenu();
    }
  });
}