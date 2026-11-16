const header = document.querySelector('header');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = menuBtn.querySelector('i');

// Mobile menu
function setMenu(open) {
    navLinks.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuIcon.classList.toggle('fa-bars', !open);
    menuIcon.classList.toggle('fa-times', open);
}

menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
});

// Header background once the page is scrolled
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal cards on scroll. Skill chips pop in one after another.
// The `js` class (set in <head>) is what hides them, so nothing stays hidden if JS fails.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-category, .automation-card, .project-card, .focus-item').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

const skillItems = document.querySelectorAll('.skill-item');
const skillsSection = document.querySelector('.skills');
skillItems.forEach((item) => item.classList.add('reveal-pop'));

if (skillsSection) {
    const skillsObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        skillItems.forEach((item, i) => {
            setTimeout(() => item.classList.add('is-visible'), i * 60);
        });
        skillsObserver.disconnect();
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
}

// Email popup: copy, Gmail, Outlook or the default mail app.
// Without JS the link is a plain mailto: link, so it still works.
const emailLink = document.getElementById('email-link');
const emailMenu = document.getElementById('email-menu');

if (emailLink && emailMenu) {
    const emailAddress = 'aliya2002mah@gmail.com';
    const copyBtn = emailMenu.querySelector('[data-action="copy"]');
    const copyLabel = copyBtn.querySelector('span');

    const setEmailMenu = (open) => {
        emailMenu.hidden = !open;
        emailLink.setAttribute('aria-expanded', String(open));
    };

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        setEmailMenu(emailMenu.hidden);
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(emailAddress);
        } catch (err) {
            const temp = document.createElement('textarea');
            temp.value = emailAddress;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
        }
        copyLabel.textContent = 'Copied!';
        setTimeout(() => {
            copyLabel.textContent = 'Copy email';
            setEmailMenu(false);
        }, 1200);
    });

    emailMenu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => setEmailMenu(false));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.contact-email')) setEmailMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setEmailMenu(false);
            emailLink.focus();
        }
    });
}
