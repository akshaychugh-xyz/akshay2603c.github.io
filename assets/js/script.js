document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const menuItems = document.querySelector('.menu-items');

  if (menuIcon && menuItems) {
    menuIcon.addEventListener('click', function(event) {
      event.preventDefault();
      menuItems.classList.toggle('active');
      menuIcon.classList.toggle('active');
      menuIcon.setAttribute('aria-expanded', menuItems.classList.contains('active'));
    });
  } else {
    console.error('Menu icon or menu items not found');
  }
});