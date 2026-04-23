document.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline();

    // 1. Появление навигации (убедимся, что анимируются все ссылки)
    tl.from(".nav-link", {
        y: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });

    // 2. Появление логотипа
    tl.from(".hero-logo", {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.4");

    // 3. Появление текстов и кнопок
    tl.from(".hero-title, .hero-description", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.6");

    tl.fromTo(".contact-card_tg", 
    { 
        y: 20, 
        opacity: 0 
    }, 
    { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power3.out" 
    }, 
    "-=0.6"
);

    // 4. МИКРО-пульсация логотипа (теперь едва заметная)
    gsap.to(".hero-logo", {
        scale: 1.02, // Было 1.05, стало 1.02 — очень легкое движение
        filter: "drop-shadow(0 0 15px rgba(230, 213, 184, 0.2))",
        duration: 3, // Увеличили время, чтобы движение было медленнее
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Логика кликов для видео (оставляем как была, она рабочая)
    const items = document.querySelectorAll('.work-item');
    const overlay = document.getElementById('videoOverlay');
    const header = document.querySelector('header'); // Находим хедер

    items.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            
            const videoId = this.getAttribute('data-video');
            const container = this.querySelector('.video-container');
            
            this.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            header.classList.add('header-hidden');

            container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        });
    });

    overlay.addEventListener('click', () => {
        const activeItem = document.querySelector('.work-item.active');
        if (activeItem) {
            activeItem.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';

            // 3. ВОЗВРАЩАЕМ ВЕРХНЮЮ ПЛАШКУ
            header.classList.remove('header-hidden');

            const videoId = activeItem.getAttribute('data-video');
            activeItem.querySelector('.video-container').innerHTML = `<div class="video-placeholder" style="background-image: url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg');"></div>`;
        }
    });

    gsap.from(".about-visual", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    gsap.from(".about-content > *", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Анимация левого блока (Заголовок и кнопки по очереди)
    gsap.from(".footer-left > *", {
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top 85%", // Срабатывает, когда футер появляется на 15% снизу экрана
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Анимация правого блока (Логотип)
    gsap.from(".footer-right", {
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top 85%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
})
});

function openItem(item) {
    const videoId = item.getAttribute('data-video');
    const container = item.querySelector('.video-container');
    const overlay = document.getElementById('videoOverlay');

    item.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Вставляем ТОЛЬКО видео. Описание игнорируем.
    container.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen 
            style="width: 100%; height: 100%; border-radius: 16px;">
        </iframe>`;
    
    // Анимацию появления информации (gsap.fromTo) для активного режима удаляем, 
    // так как инфо теперь скрыто через CSS (display: none).
}

const btn = document.querySelector(".contact-card_tg");

// 1. Находим все кнопки
const buttons = document.querySelectorAll(".contact-card_tg");

// 2. Сразу задаем им базовое состояние, чтобы убрать "none" или "NaN"
gsap.set(buttons, { scale: 1, y: 0, force3D: true });

buttons.forEach((btn) => {
    // Анимация при наведении
    btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
            scale: 0.97,
            y: -1.5,
            duration: 0.3,
            overwrite: "auto", // Важно: останавливает другие анимации на этой кнопке
            ease: "power2.out"
        });
    });

    // Анимация при отведении
    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
            scale: 1,
            y: -4,
            duration: 0.3,
            ease: "back.out(2)",
            overwrite: "auto",
            onComplete: () => {
                gsap.to(btn, { y: 0, duration: 0.2 });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Клик по бургеру открывает/закрывает меню
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // Закрываем меню при клике на любую ссылку
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });
});