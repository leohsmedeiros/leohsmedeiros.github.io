// main.js — renders the portfolio from portfolio.js and drives the page's motion.
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const data = typeof jsonDataArray !== 'undefined' ? jsonDataArray : [];

    // Filter group -> tag shown on the card
    const techMap = { ios: 'Swift', android: 'Kotlin', hybrid: 'Flutter', games: 'Unity', personal: 'Personal' };

    const svg = (paths, size) =>
        `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
    const ICON_ARROW = svg('<path d="M7 17 17 7M7 7h10v10"/>', 14);

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    // ---------- Portfolio cards ----------
    function createPortfolioItem(json, index) {
        const groups = (json.dataGroups || []).filter((g) => g !== 'all');

        const li = el('li');
        li.setAttribute('data-groups', groups.join(' '));

        const card = el('article', 'card');

        // Thumbnail
        const thumb = el('div', 'thumb gridbg');
        if (json.imageSrc) {
            const img = el('img');
            img.alt = json.title + ' preview';
            img.loading = 'lazy';
            img.decoding = 'async';
            const setOrientation = () => {
                const portrait = img.naturalHeight >= img.naturalWidth;
                thumb.classList.add(portrait ? 'is-portrait' : 'is-landscape');
                img.classList.add('is-loaded');
            };
            img.addEventListener('load', setOrientation, { once: true });
            img.addEventListener('error', () => { img.remove(); }, { once: true });
            img.src = json.imageSrc;
            if (img.complete && img.naturalWidth) setOrientation();
            thumb.appendChild(img);
        }
        // "Available" badge comes from dataGroups in portfolio.js
        if (groups.includes('available')) thumb.appendChild(el('span', 'thumb-badge', 'Available'));
        card.appendChild(thumb);

        // Body
        const body = el('div', 'card-body');

        const tags = [];
        groups.forEach((g) => { if (techMap[g] && !tags.includes(techMap[g])) tags.push(techMap[g]); });
        if (tags.length) {
            const tagWrap = el('div', 'tags');
            tags.forEach((t) => tagWrap.appendChild(el('span', 'tag', t)));
            body.appendChild(tagWrap);
        }

        body.appendChild(el('h3', 'card-title', json.title));
        if (json.description) body.appendChild(el('p', 'card-desc', json.description));

        if (json.links && json.links.length) {
            const links = el('div', 'card-links');
            json.links.forEach((link) => {
                const isPlaceholder = !link.url || link.url === '#';
                const a = el(isPlaceholder ? 'span' : 'a', 'plink' + (isPlaceholder ? ' is-disabled' : ''));
                a.textContent = link.name;
                if (!isPlaceholder) {
                    a.href = link.url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.insertAdjacentHTML('beforeend', ICON_ARROW);
                }
                links.appendChild(a);
            });
            body.appendChild(links);
        }

        card.appendChild(body);
        li.appendChild(card);
        return li;
    }

    function renderPortfolio() {
        const list = document.getElementById('portfolio-list');
        if (!list) return [];
        // Clear anything another script may have rendered (e.g. an older portfolio.js)
        list.textContent = '';
        const frag = document.createDocumentFragment();
        const items = data.map((json, i) => {
            const li = createPortfolioItem(json, i);
            frag.appendChild(li);
            return li;
        });
        list.appendChild(frag);
        return items;
    }

    function playEnter(items) {
        if (prefersReducedMotion) return;
        let i = 0;
        items.forEach((li) => {
            if (li.hidden) return;
            const card = li.firstElementChild;
            card.classList.remove('is-entering');
            void card.offsetWidth; // restart animation
            card.style.setProperty('--delay', Math.min(i, 8) * 60 + 'ms');
            card.classList.add('is-entering');
            i++;
        });
    }

    function initFilters(items) {
        const buttons = document.querySelectorAll('#filters .pill');

        buttons.forEach((btn) => {
            const group = btn.dataset.group;
            const count = group === 'all'
                ? items.length
                : items.filter((li) => li.dataset.groups.split(' ').includes(group)).length;
            const n = btn.querySelector('.n');
            if (n) n.textContent = count;

            btn.addEventListener('click', () => {
                if (btn.classList.contains('is-active')) return;
                buttons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('is-active');
                btn.setAttribute('aria-pressed', 'true');

                items.forEach((li) => {
                    li.hidden = !(group === 'all' || li.dataset.groups.split(' ').includes(group));
                });
                playEnter(items);
            });
        });
    }

    // ---------- Scroll reveal ----------
    function initReveal() {
        const targets = document.querySelectorAll('.reveal, .skills');
        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            targets.forEach((t) => t.classList.add('is-visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat')) countUp(entry.target.querySelector('.stat-num'));
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        targets.forEach((t) => io.observe(t));
    }

    // Stat counters: 0 -> target
    function countUp(node) {
        if (!node || node.dataset.done) return;
        node.dataset.done = '1';
        const target = parseFloat(node.dataset.count);
        const suffix = node.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            node.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // ---------- Nav ----------
    function initNav() {
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-links');
        const links = Array.from(document.querySelectorAll('.nav-link'));

        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const closeMenu = () => {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
        };
        toggle.addEventListener('click', () => {
            const open = !menu.classList.contains('is-open');
            menu.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        links.forEach((a) => a.addEventListener('click', closeMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

        // Highlight the section in view
        if ('IntersectionObserver' in window) {
            const byId = {};
            links.forEach((a) => { byId[a.getAttribute('href').slice(1)] = a; });
            const spy = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    links.forEach((a) => a.classList.remove('is-active'));
                    const link = byId[entry.target.id];
                    if (link) link.classList.add('is-active');
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            Object.keys(byId).forEach((id) => {
                const section = document.getElementById(id);
                if (section) spy.observe(section);
            });
        }
    }

    // ---------- Hero extras ----------
    function initTyping() {
        const node = document.getElementById('typed');
        if (!node || prefersReducedMotion) return;
        const text = node.dataset.text || node.textContent;
        node.textContent = '';
        let i = 0;
        const tick = () => {
            node.textContent = text.slice(0, ++i);
            if (i < text.length) setTimeout(tick, 38 + Math.random() * 40);
        };
        setTimeout(tick, 500);
    }

    function initTilt() {
        const wrap = document.getElementById('portrait');
        if (!wrap || prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;
        const hero = wrap.closest('.hero');
        hero.addEventListener('mousemove', (e) => {
            const r = wrap.getBoundingClientRect();
            const x = (e.clientX - (r.left + r.width / 2)) / r.width;
            const y = (e.clientY - (r.top + r.height / 2)) / r.height;
            wrap.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
            wrap.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        });
        hero.addEventListener('mouseleave', () => {
            wrap.style.setProperty('--rx', '0deg');
            wrap.style.setProperty('--ry', '0deg');
        });
    }

    function initMarquee() {
        const m = document.getElementById('marquee');
        if (!m) return;
        // Duplicate the list so translateX(-50%) loops seamlessly
        Array.from(m.children).forEach((child) => {
            const clone = child.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            m.appendChild(clone);
        });
    }

    // ---------- Boot ----------
    function init() {
        const items = renderPortfolio();
        initFilters(items);
        playEnter(items);
        initReveal();
        initNav();
        initTyping();
        initTilt();
        initMarquee();
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
