// Initialize Lenis smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);

function initPhotoLazyLoad() {
    const imgs = document.querySelectorAll('#photography img[data-src]');
    if (!imgs.length) return;

    const load = (img) => {
        const realSrc = img.getAttribute('data-src');
        if (!realSrc) return;
        if (img.getAttribute('data-loaded') === 'true') return;

        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        }, { once: true });

        img.src = realSrc;
        img.removeAttribute('data-src');
    };

    if (!('IntersectionObserver' in window)) {
        imgs.forEach(load);
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                load(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '300px 0px' });

    imgs.forEach(img => io.observe(img));
}

}
requestAnimationFrame(raf);

function initPhotoLazyLoad() {
    const imgs = document.querySelectorAll('#photography img[data-src]');
    if (!imgs.length) return;

    const load = (img) => {
        const realSrc = img.getAttribute('data-src');
        if (!realSrc) return;
        if (img.getAttribute('data-loaded') === 'true') return;

        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        }, { once: true });

        img.src = realSrc;
        img.removeAttribute('data-src');
    };

    if (!('IntersectionObserver' in window)) {
        imgs.forEach(load);
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                load(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '300px 0px' });

    imgs.forEach(img => io.observe(img));
}


// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link, .nav-logo');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll to sections using Lenis
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -60, // Account for navbar height
                    duration: 1.2
                });
            }
        });
    });
}

function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Staggered entrance - ensure elements are visible
    tl.fromTo('.hero-title',
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
    )
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 40, letterSpacing: '0.6em' },
            { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 1 },
            '-=0.8'
        )
        .fromTo('.hero-tagline',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.6'
        )
        .fromTo('.scroll-indicator',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.4'
        );

    // Parallax effect on hero content
    gsap.to('.hero-content', {
        y: 100,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // Hide scroll indicator on scroll
    gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 30,
        scrollTrigger: {
            trigger: '#hero',
            start: '10% top',
            end: '30% top',
            scrub: true,
        }
    });
}

function initPortfolioAnimations() {
    // Section title reveal
    gsap.from('#portfolio .section-title', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 80%',
        }
    });

    // Staggered video card reveal
    const cards = gsap.utils.toArray('.video-card');

    cards.forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            delay: (i % 3) * 0.1 // Stagger based on row position
        });
    });

    // Magnetic hover effect
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(card, {
                x: x * 0.1,
                y: y * 0.1,
                rotateX: -y * 0.02,
                rotateY: x * 0.02,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

function initContactAnimations() {
    const socialLinks = gsap.utils.toArray('.social-link');

    gsap.fromTo('#contact .section-title',
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
            }
        }
    );

    gsap.fromTo(socialLinks,
        { opacity: 0, y: 30, scale: 0.8 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.social-links',
                start: 'top 85%',
            }
        }
    );

    gsap.fromTo('.copyright',
        { opacity: 0 },
        {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.copyright',
                start: 'top 95%',
            }
        }
    );
}

function initPhotographyAnimations() {
    // Section title reveal
    gsap.from('#photography .section-title', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#photography',
            start: 'top 80%',
        }
    });

    // Staggered photo card reveal
    const photoCards = gsap.utils.toArray('.photo-card');

    photoCards.forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            delay: (i % 3) * 0.1
        });
    });

    // Magnetic hover effect for photo cards
    photoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(card, {
                x: x * 0.1,
                y: y * 0.1,
                rotateX: -y * 0.02,
                rotateY: x * 0.02,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const photoCards = document.querySelectorAll('.photo-card');

    // Open lightbox on photo click
    photoCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.photo-image');
            if (img && img.src) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPhotoLazyLoad();
    initNavigation();
    initHeroAnimations();
    initPortfolioAnimations();
    initPhotographyAnimations();
    initContactAnimations();
    initLightbox();
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
