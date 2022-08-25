const mobileMenuButtonEl =
    document.getElementById('mobile-menu-btn');
const mobileMenuEl =
    document.getElementById('mobile-menu');

mobileMenuButtonEl.addEventListener('click', (ev) => {
    mobileMenuEl.classList.toggle('hidden');
})


