document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.getElementById('topNav');

  function closeMenu() {
    burger.classList.remove('is-active');
    menu.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    const expanded = burger.getAttribute('aria-expanded') !== 'true';
    burger.classList.toggle('is-active', expanded);
    menu.classList.toggle('is-active', expanded);
    burger.setAttribute('aria-expanded', String(expanded));
  });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-active')) {
      closeMenu();
      burger.focus();
    }
  });

  // Retain a usable video grid if the external carousel dependency is unavailable.
  if (window.jQuery && window.jQuery.fn.slick) {
    window.jQuery('.carousel').slick({
      slidesToScroll: 2,
      slidesToShow: 2,
      infinite: false,
      autoplay: false,
      dots: true,
      accessibility: true,
      draggable: false,
      touchMove: true,
      responsive: [{ breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }]
    });
  }

  // Keep off-screen and hidden-slide demonstrations from playing simultaneously.
  if ('IntersectionObserver' in window) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const video = entry.target;
        if (entry.isIntersecting && !document.hidden && video.autoplay && !reducedMotion) {
          video.play().catch(function () { /* Native controls remain available. */ });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('video').forEach(function (video) {
      if (reducedMotion) video.autoplay = false;
      observer.observe(video);
    });
    document.addEventListener('visibilitychange', function () {
      document.querySelectorAll('video').forEach(function (video) {
        if (document.hidden) video.pause();
        else {
          observer.unobserve(video);
          observer.observe(video);
        }
      });
    });
  }
});
