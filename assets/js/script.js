document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const menuItems = document.querySelector('.menu-items');
  const siteNav = document.querySelector('.site-nav');

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