// Объявляем глобальную переменную для плеера
let player;

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. АНИМАЦИИ GSAP ПРИ ЗАГРУЗКЕ ---
    const tl = gsap.timeline();

    tl.from(".nav-link", { y: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    tl.from(".hero-logo", { scale: 0.95, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.4");
    tl.from(".hero-title, .hero-description", { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6");
    tl.fromTo(".contact-card_tg", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

    gsap.to(".hero-logo", {
        scale: 1.02, 
        filter: "drop-shadow(0 0 15px rgba(230, 213, 184, 0.2))",
        duration: 3, 
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // --- 2. ЛОГИКА ВИДЕО С YOUTUBE API (ВОЗВРАТ ОБЛОЖКИ) ---
    const items = document.querySelectorAll('.work-item');
    const overlay = document.getElementById('videoOverlay');
    const header = document.querySelector('header');

    // Единая функция закрытия видео и возврата обложки
    function closeVideoAndRestoreCover(activeItem) {
        activeItem.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (header) header.classList.remove('header-hidden');

        const videoId = activeItem.getAttribute('data-video');
        
        // Возвращаем картинку-заглушку
        activeItem.querySelector('.video-container').innerHTML = 
            `<div class="video-placeholder" style="background-image: url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg');"></div>`;

        // Уничтожаем плеер, чтобы при следующем открытии он создался заново чисто
        if (player) {
            player.destroy();
            player = null;
        }
    }

    items.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            
            const videoId = this.getAttribute('data-video');
            const container = this.querySelector('.video-container');
            
            this.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (header) header.classList.add('header-hidden');

            // Создаем контейнер-мишень для YouTube API
            container.innerHTML = `<div id="youtube-player-target"></div>`;

            // Проверяем, успела ли загрузиться библиотека YouTube API из HTML
            if (typeof YT !== 'undefined' && YT.Player) {
                player = new YT.Player('youtube-player-target', {
                    height: '100%',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 1,
                        'rel': 0, // Убираем чужие рекомендации
                        'playsinline': 1 // Оптимизация для мобильных (iOS)
                    },
                    events: {
                        'onStateChange': function(event) {
                            // Если статус плеера 0 (ENDED - видео закончилось)
                            if (event.data === YT.PlayerState.ENDED) {
                                closeVideoAndRestoreCover(item);
                            }
                        }
                    }
                });
            } else {
                // ПРЕДОХРАНИТЕЛЬ: Если скрипт YT не загрузился, используем старый надежный iframe
                container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }
        });
    });

    // Закрытие по клику на фон оверлея
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { 
            const activeItem = document.querySelector('.work-item.active');
            if (activeItem) closeVideoAndRestoreCover(activeItem);
        }
    });

    // --- 3. СКРОЛЛ АНИМАЦИИ (ABOUT & FOOTER) ---
    gsap.from(".about-visual", { scrollTrigger: { trigger: ".about-section", start: "top 80%" }, x: -50, opacity: 0, duration: 1, ease: "power2.out" });
    gsap.from(".about-content > *", { scrollTrigger: { trigger: ".about-section", start: "top 80%" }, y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" });
    gsap.from(".footer-left > *", { scrollTrigger: { trigger: ".footer-section", start: "top 85%" }, y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" });
    gsap.from(".footer-right", { scrollTrigger: { trigger: ".footer-section", start: "top 85%" }, scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" });

    // --- 4. ЛОГИКА КНОПОК ---
    const buttons = document.querySelectorAll(".contact-card_tg");
    gsap.set(buttons, { scale: 1, y: 0, force3D: true });

    buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 0.97, y: -1.5, duration: 0.3, overwrite: "auto", ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, y: -4, duration: 0.3, ease: "back.out(2)", overwrite: "auto", onComplete: () => { gsap.to(btn, { y: 0, duration: 0.2 }); } });
        });
    });

    // --- 5. БУРГЕР МЕНЮ ---
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            });
        });
    }
});




    // overlay.addEventListener('click', () => {
    //     const activeItem = document.querySelector('.work-item.active');
    //     if (activeItem) {
    //         activeItem.classList.remove('active');
    //         overlay.classList.remove('active');
    //         document.body.style.overflow = '';

    //         // 3. ВОЗВРАЩАЕМ ВЕРХНЮЮ ПЛАШКУ
    //         header.classList.remove('header-hidden');

    //         const videoId = activeItem.getAttribute('data-video');
    //         activeItem.querySelector('.video-container').innerHTML = `<div class="video-placeholder" style="background-image: url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg');"></div>`;
    //     }
    // });
