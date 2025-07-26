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
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
      updateThemeIcon('dark');
    } else {
      updateThemeIcon('light');
    }
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
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let newTheme;
    if (currentTheme === 'dark') {
      newTheme = 'light';
    } else if (currentTheme === 'light') {
      newTheme = 'dark';
    } else {
      // No explicit theme set, use opposite of system preference
      newTheme = systemPrefersDark ? 'light' : 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  // Initialize theme
  initTheme();

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      updateThemeIcon(e.matches ? 'dark' : 'light');
    }
  });

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

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
});