/**
 * KHRUSTALEV PRODUCTION // CORE SCRIPT
 * Preserving original luxury motion with modern tabs & lead routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTabs();
  initVideoPlayers();
  initChips();
});

// 1. NAV SCROLL & BURGER
function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
}

function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  if (navLinks && burger) {
    navLinks.classList.toggle('open');
    burger.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }
}

function closeNav() {
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  if (navLinks && burger) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 2. PORTFOLIO TABS
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.works-grid-wrap .card');

  function setFilter(filter) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    cards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease';
          card.style.opacity = '1';
        }, 20);
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setFilter(btn.dataset.filter);
    });
  });

  // Links from direction cards to tabs
  document.querySelectorAll('[data-switch-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.dataset.switchTab;
      if (target) {
        setFilter(target);
      }
    });
  });
}

// 3. VIDEO PLAYERS (VIMEO, VK, YOUTUBE)
function initVideoPlayers() {
  // Vimeo embedded play
  document.querySelectorAll('.card[data-id], .case-media[data-id], .card.reel[data-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on links inside card footer
      if (e.target.closest('a')) return;

      if (card.classList.contains('playing')) return;

      // Stop previous playing videos
      document.querySelectorAll('.playing').forEach(c => {
        c.classList.remove('playing');
        const p = c.querySelector('.card-player, .case-player');
        if (p) p.innerHTML = '';
      });

      const id = card.dataset.id;
      const player = card.querySelector('.card-player, .case-player');
      if (player && id) {
        player.innerHTML = `<iframe src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        card.classList.add('playing');
      }
    });
  });

  // VK and YouTube links
  document.querySelectorAll('.card-vk, .card-yt').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const href = card.dataset.href;
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

// 4. CHIPS PROJECT TYPE SELECTOR
let selectedProjectType = 'Документальный фильм';

function initChips() {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedProjectType = chip.dataset.type || chip.textContent.trim();
    });
  });
}

// 5. SEND FORM TO TELEGRAM
function sendForm() {
  const nameInput = document.getElementById('clientName');
  const contactInput = document.getElementById('clientContact');
  const projectInput = document.getElementById('clientProject');

  const name = nameInput ? nameInput.value.trim() : '';
  const contact = contactInput ? contactInput.value.trim() : '';
  const project = projectInput ? projectInput.value.trim() : '';

  if (!name && !contact) {
    alert('Пожалуйста, укажите имя или контакт (телефон/Telegram)');
    if (nameInput) nameInput.focus();
    return;
  }

  const messageText = 
    `🎬 Новая заявка с сайта KhrustalevProd:\n\n` +
    `• Направление: ${selectedProjectType}\n` +
    `• Имя / Компания: ${name || 'Не указано'}\n` +
    `• Контакт: ${contact}\n` +
    (project ? `• О проекте: ${project}` : '');

  const tgUrl = `https://t.me/ygscors?text=${encodeURIComponent(messageText)}`;
  window.open(tgUrl, '_blank');
}
