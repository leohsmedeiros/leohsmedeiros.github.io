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

    // ---------- Animated background: flowing light ribbons + streaks ----------
    function initBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || !canvas.getContext) return;
        const host = canvas.closest('.hero') || canvas.parentElement; // the animation lives only in the Home section
        const ctx = canvas.getContext('2d');

        const toRgb = (hex) => {
            const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
            return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [61, 220, 151];
        };
        const accent = toRgb(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3DDC97');
        const teal = [40, 196, 186];
        const deep = [22, 140, 160];

        let w = 0, h = 0, dpr = 1, mobile = false, step = 16;
        let ribbons = [], streaks = [], phones = [];
        let scrollPhase = 0, targetScroll = 0;
        let running = false, last = 0;

        function setup() {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = host.clientWidth;
            h = host.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            mobile = w < 720;
            step = mobile ? 14 : 18;

            // Each ribbon is a bundle of lines that twist around a wavy center line.
            // `through` = indexes of the phones this ribbon bends to pass through.
            ribbons = mobile ? [
                { y: .22, amp: .07, freq: 1.5, tilt: -.18, spread: 46, lines: 11, speed: .22, phase: 0.0, color: accent, through: [0] },
                { y: .58, amp: .08, freq: 1.2, tilt: .22, spread: 54, lines: 12, speed: -.17, phase: 2.1, color: teal, through: [1] },
                { y: .88, amp: .06, freq: 1.8, tilt: -.10, spread: 36, lines: 9, speed: .14, phase: 4.2, color: deep, through: [] }
            ] : [
                { y: .30, amp: .12, freq: 1.25, tilt: -.14, spread: 80, lines: 18, speed: .16, phase: 0.0, color: accent, through: [0, 2] },
                { y: .70, amp: .10, freq: 0.95, tilt: .10, spread: 64, lines: 15, speed: -.12, phase: 2.4, color: teal, through: [1, 2] },
                { y: .52, amp: .16, freq: 0.70, tilt: .04, spread: 40, lines: 8, speed: .09, phase: 4.6, color: deep, through: [1] }
            ];

            // Phones with skeleton screens + shimmer (a nod to ShimmerFX). Positions are fractions of the Home section.
            const base = mobile ? Math.min(w * .5, 220) : Math.min(h * .42, 340);
            phones = (mobile ? [
                { x: .95, y: .24, s: .85, rot: .08, ph: 0.0, L: 0 },
                { x: .95, y: .93, s: .7, rot: -.07, ph: 2.0, L: 1 }
            ] : [
                { x: .60, y: .26, s: .6, rot: .09, ph: 1.2, L: 2 },
                { x: .73, y: .70, s: .8, rot: -.08, ph: 2.6, L: 1 },
                { x: .90, y: .38, s: 1, rot: -.05, ph: 0.0, L: 0 }
            ]).map((p) => Object.assign(p, { h: base * p.s, w: base * p.s * .49, cx: 0, cy: 0, glow: 0 }));

            const count = mobile ? 6 : 10;
            streaks = [];
            for (let i = 0; i < count; i++) streaks.push(newStreak(true));
        }

        function newStreak(randomStart) {
            const r = Math.floor(Math.random() * ribbons.length);
            return {
                r,
                k: (Math.random() - .5) * .9,                 // which line of the ribbon it rides on
                u: randomStart ? Math.random() * 1.2 - .1 : -.15 - Math.random() * .4,
                v: (mobile ? .09 : .06) + Math.random() * .08, // screen widths per second
                len: .08 + Math.random() * .14,                // tail length (fraction of width)
                a: .55 + Math.random() * .45
            };
        }

        // y position of line k (-.5..+.5) of ribbon r at horizontal fraction u, time t (s)
        function yAt(r, k, u, t) {
            const x = u * w;
            const ph = r.phase + t * r.speed + scrollPhase * (r.speed > 0 ? 1 : -1);
            let center = h * r.y + r.tilt * (x - w / 2) + h * r.amp * Math.sin(u * r.freq * Math.PI * 2 + ph);
            let twist = Math.cos(u * Math.PI * 1.6 + ph * 1.3) * r.spread;
            let curl = k * k * 18 * Math.sin(ph + u * 4);
            // Pull the ribbon into each linked phone and squeeze the bundle so it fits through the screen.
            for (const i of r.through) {
                const p = phones[i];
                if (!p) continue;
                const d = (x - p.cx) / (p.w * 1.7);
                const g = Math.exp(-d * d);
                center += (p.cy - center) * g;
                twist *= 1 - .75 * g;
                curl *= 1 - g;
            }
            return center + k * twist + curl;
        }

        function placePhones(t) {
            for (const p of phones) {
                p.cx = p.x * w;
                p.cy = p.y * h + Math.sin(t * .8 + p.ph) * h * (mobile ? .006 : .012);
                p.r = p.rot + Math.sin(t * .5 + p.ph) * .02;
            }
        }

        // Skeleton screen layouts: [kind, x, y, w, h] as fractions of the screen (circle: [kind, x, y, diameter])
        const LAYOUTS = [
            [['bar', .08, .06, .55, .035], ['circle', .12, .17, .07], ['line', .26, .155, .5, .025], ['line', .26, .19, .34, .02], ['block', .08, .26, .84, .26], ['line', .08, .57, .7, .028], ['line', .08, .62, .5, .022], ['block', .08, .69, .4, .16], ['block', .52, .69, .4, .16]],
            [['bar', .08, .06, .4, .035], ['block', .08, .13, .84, .1], ['circle', .14, .32, .06], ['line', .26, .305, .5, .025], ['circle', .14, .44, .06], ['line', .26, .425, .45, .025], ['circle', .14, .56, .06], ['line', .26, .545, .55, .025], ['block', .08, .7, .84, .07], ['block', .08, .8, .84, .07]],
            [['block', .08, .07, .84, .36], ['line', .08, .48, .6, .03], ['line', .08, .53, .8, .022], ['line', .08, .57, .7, .022], ['block', .08, .65, .26, .12], ['block', .37, .65, .26, .12], ['block', .66, .65, .26, .12], ['bar', .2, .86, .6, .05]]
        ];

        function rr(x, y, ww, hh, r) {
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, ww, hh, r); else ctx.rect(x, y, ww, hh);
        }

        function drawPhone(p, t) {
            const [ar, ag, ab] = accent;
            const glow = p.glow;
            ctx.save();
            ctx.translate(p.cx, p.cy);
            ctx.rotate(p.r);
            const x = -p.w / 2, y = -p.h / 2, R = p.w * .14;

            // outer glow when lit
            if (glow > .02) {
                rr(x - 3, y - 3, p.w + 6, p.h + 6, R + 3);
                ctx.lineWidth = 8;
                ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(glow * .18).toFixed(3)})`;
                ctx.stroke();
            }
            // body
            rr(x, y, p.w, p.h, R);
            ctx.fillStyle = 'rgba(21,24,30,.94)';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(.3 + glow * .55).toFixed(3)})`;
            ctx.stroke();
            // dynamic-island notch
            rr(-p.w * .14, y + p.h * .02, p.w * .28, p.h * .022, 6);
            ctx.fillStyle = 'rgba(42,48,58,.9)';
            ctx.fill();

            // screen
            const sx = x + 6, sy = y + 6, sw = p.w - 12, sh = p.h - 12;
            ctx.save();
            rr(sx, sy, sw, sh, R * .8);
            ctx.clip();
            if (glow > .02) {
                ctx.fillStyle = `rgba(${ar},${ag},${ab},${(glow * .07).toFixed(3)})`;
                ctx.fillRect(sx, sy, sw, sh);
            }
            ctx.fillStyle = 'rgba(42,48,58,.75)';
            for (const el of LAYOUTS[p.L]) {
                const [k, a, b, c, d] = el;
                if (k === 'circle') {
                    ctx.beginPath();
                    ctx.arc(sx + a * sw + c * sw / 2, sy + b * sh + c * sw / 2, c * sw / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    rr(sx + a * sw, sy + b * sh, c * sw, d * sh, k === 'block' ? 8 : 4);
                    ctx.fill();
                }
            }
            // shimmer sweep across the skeleton
            const cycle = ((t * .45 + p.ph * .3) % 1.6) / 1.6;
            const band = sx - sw + cycle * sw * 3;
            const sg = ctx.createLinearGradient(band, sy, band + sw * .6, sy + sh * .25);
            sg.addColorStop(0, 'rgba(255,255,255,0)');
            sg.addColorStop(.5, `rgba(${ar},${ag},${ab},${(.2 + glow * .25).toFixed(3)})`);
            sg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = sg;
            ctx.fillRect(sx, sy, sw, sh);
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
            ctx.restore();
        }

        function draw(t) {
            placePhones(t);
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineWidth = 1;

            // Ribbons
            for (const r of ribbons) {
                const [cr, cg, cb] = r.color;
                // soft halo along the ribbon's center
                ctx.lineCap = 'round';
                ctx.lineWidth = r.spread * .9;
                ctx.strokeStyle = `rgba(${cr},${cg},${cb},.035)`;
                ctx.beginPath();
                for (let x = -step; x <= w + step; x += step * 2) {
                    const y = yAt(r, 0, x / w, t);
                    if (x === -step) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.lineWidth = 1;

                for (let i = 0; i < r.lines; i++) {
                    const k = r.lines === 1 ? 0 : i / (r.lines - 1) - .5;
                    const alpha = .05 + .16 * (1 - Math.abs(k) * 2);
                    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
                    ctx.beginPath();
                    for (let x = -step; x <= w + step; x += step) {
                        const y = yAt(r, k, x / w, t);
                        if (x === -step) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
            }

            ctx.globalCompositeOperation = 'source-over';
            for (const p of phones) drawPhone(p, t);
            ctx.globalCompositeOperation = 'lighter';

            // Streaks of light riding the ribbons (drawn over the phones, so they cross them and exit on the other side)
            for (const s of streaks) {
                const r = ribbons[s.r];
                const [cr, cg, cb] = r.color;
                const u0 = s.u - s.len, u1 = s.u;
                const x0 = u0 * w, y0 = yAt(r, s.k, u0, t);
                const x1 = u1 * w, y1 = yAt(r, s.k, u1, t);
                const grad = ctx.createLinearGradient(x0, y0, x1, y1);
                grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
                grad.addColorStop(1, `rgba(${Math.min(cr + 80, 255)},${Math.min(cg + 40, 255)},${Math.min(cb + 60, 255)},${s.a})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                const segs = 14;
                for (let j = 0; j <= segs; j++) {
                    const u = u0 + (u1 - u0) * (j / segs);
                    const x = u * w, y = yAt(r, s.k, u, t);
                    if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
                // soft glowing head
                const glow = ctx.createRadialGradient(x1, y1, 0, x1, y1, 10);
                glow.addColorStop(0, `rgba(220,255,240,${(s.a * .9).toFixed(2)})`);
                glow.addColorStop(1, 'rgba(220,255,240,0)');
                ctx.fillStyle = glow;
                ctx.fillRect(x1 - 10, y1 - 10, 20, 20);
                // light up a phone while a streak passes through it
                for (const p of phones) {
                    if (Math.abs(x1 - p.cx) < p.w / 2 && Math.abs(y1 - p.cy) < p.h / 2) p.glow = 1;
                }
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        function frame(now) {
            if (!running) return;
            const dt = Math.min((now - (last || now)) / 1000, .05);
            last = now;
            scrollPhase += (targetScroll - scrollPhase) * .08; // eased parallax from scrolling
            const fade = Math.pow(.18, dt);
            for (const p of phones) p.glow *= fade;
            for (let i = 0; i < streaks.length; i++) {
                const s = streaks[i];
                s.u += s.v * dt;
                if (s.u - s.len > 1.1) streaks[i] = newStreak(false);
            }
            draw(now / 1000);
            requestAnimationFrame(frame);
        }

        function start() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } }
        function stop() { running = false; }

        setup();

        window.addEventListener('scroll', () => { targetScroll = window.scrollY * .0012; }, { passive: true });

        // Rebuild when the Home section changes size (rotation, window resize, fonts loading).
        let lastW = w, lastH = h, resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const nw = host.clientWidth, nh = host.clientHeight;
                if (nw !== lastW || nh !== lastH) {
                    lastW = nw; lastH = nh; setup();
                    if (!running) draw(0);
                }
            }, 150);
        };
        if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(host);
        else window.addEventListener('resize', onResize);

        if (prefersReducedMotion) { draw(0); return; } // static frame only

        // Only animate while the Home section is on screen and the tab is visible.
        let inView = true;
        const update = () => { (inView && !document.hidden) ? start() : stop(); };
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; update(); }).observe(host);
        }
        document.addEventListener('visibilitychange', update);
        update();
    }

    // ---------- Boot ----------
    function init() {
        initBackground();
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
