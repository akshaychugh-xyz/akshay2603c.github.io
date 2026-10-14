document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const menuItems = document.querySelector('.menu-items');
  const siteNav = document.querySelector('.site-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  // Dark mode functionality
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', activeTheme);
    updateThemeIcon(activeTheme);
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  // Initialize theme
  initTheme();

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Make external links open in new tab
  function handleExternalLinks() {
    const links = document.querySelectorAll('a[href]');
    const currentHost = window.location.hostname;

    links.forEach(link => {
      const href = link.getAttribute('href');
      // Check if it's an external link (starts with http/https and different domain)
      if (href && href.match(/^https?:\/\//) && !href.includes(currentHost)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  handleExternalLinks();

  // Menu functionality (existing code)
  if (menuIcon && menuItems) {
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!siteNav.contains(event.target)) {
        menuItems.classList.remove('active');
        menuIcon.classList.remove('active');
        menuIcon.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle menu toggle
    menuIcon.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      const isExpanded = menuItems.classList.contains('active');
      menuItems.classList.toggle('active');
      menuIcon.classList.toggle('active');
      menuIcon.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking a link
    menuItems.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuItems.classList.remove('active');
        menuIcon.classList.remove('active');
        menuIcon.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.error('Menu icon or menu items not found');
  }

  // Newsletter form handling
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    const emailInput = document.getElementById('newsletter-email');
    const submitButton = document.getElementById('newsletter-submit');
    const formMessage = document.getElementById('form-message');
    const submitLabel = submitButton.textContent;
    const honeypotInput = document.getElementById('newsletter-website');
    // When the form became usable. The server drops submissions that arrive
    // too fast (< 3s) or without this, which is what scripted POSTs look like.
    const formRenderedAt = Date.now();

    // TODO: Replace with your Google Apps Script deployment URL
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSCkJCVFlVvAPvVJOJ3OyG4pBnfGsqTXZ6Zgl4Fn5H0rdPZgWMoTzMzL8VuVJBQ7Nftw/exec';

    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) return;

      // UX only, not security: catch the dotted-gmail pattern bots use
      // (a.b.c.d@gmail.com) so a real typo gets a hint. The server re-checks.
      if (looksLikeBotEmail(email)) {
        formMessage.textContent = 'Please double-check your email address.';
        formMessage.className = 'form-message error';
        return;
      }

      // Update UI to loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Subscribing...';
      formMessage.textContent = '';
      formMessage.className = 'form-message';

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps Script requires this
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            website: honeypotInput ? honeypotInput.value : '',
            elapsed_ms: Date.now() - formRenderedAt,
            v: 2
          })
        });

        // With no-cors, we can't read the response, so assume success
        formMessage.textContent = 'Please check your inbox to confirm.';
        formMessage.className = 'form-message success';
        emailInput.value = '';
      } catch (error) {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
        console.error('Newsletter subscription error:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    });
  }

  function looksLikeBotEmail(email) {
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) return false;
    const local = parts[0].split('+')[0];
    const isGmail = parts[1] === 'gmail.com' || parts[1] === 'googlemail.com';
    return isGmail && (local.match(/\./g) || []).length >= 3;
  }

  // Homepage TIL tile: cycle through entries with the "Another one" button
  const tilTile = document.querySelector('[data-til]');
  if (tilTile) {
    const tilItems = tilTile.querySelectorAll('.home-til-item');
    const tilNext = tilTile.querySelector('[data-til-next]');
    const tilCount = tilTile.querySelector('[data-til-count]');
    let tilIndex = 0;

    if (tilNext && tilItems.length > 1) {
      tilNext.hidden = false;
      tilNext.addEventListener('click', function() {
        tilItems[tilIndex].hidden = true;
        tilIndex = (tilIndex + 1) % tilItems.length;
        tilItems[tilIndex].hidden = false;
        if (tilCount) tilCount.textContent = (tilIndex + 1) + ' / ' + tilItems.length;
      });
    }
  }
});