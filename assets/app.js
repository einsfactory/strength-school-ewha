// 근력학교 이화 — 공통 스크립트: 로그인 상태, 설치(서비스 워커), 모션
(() => {
  const PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  const ADMIN = /^admin-|^member-detail/.test(PAGE);
  // ── 로그인 상태(지금은 기기에만 저장. 서버 연결 단계에서 실제 인증으로 교체) ──
  const session = () => { try { return JSON.parse(localStorage.getItem('gs.session')); } catch (_) { return null; } };
  window.GS = { session, login(id) { const role = /코치|트레이너|coach|admin/i.test(id) ? 'trainer' : 'member'; localStorage.setItem('gs.session', JSON.stringify({ id, role, at: Date.now() })); return role; }, logout() { localStorage.removeItem('gs.session'); } };
  if (PAGE === 'login') GS.logout();
  else { const s = session(); if (!s) { location.replace('login.html'); return; } if (ADMIN && s.role !== 'trainer') { location.replace('index.html'); return; } }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  // ── 설치 안내(로그인 화면): 아이폰은 방법을 보여 주고, 안드로이드·PC 크롬은 설치 단추를 띄운다 ──
  if (PAGE === 'login' && !matchMedia('(display-mode: standalone)').matches && !navigator.standalone && !localStorage.getItem('gs.installHint')) {
    const show = (inner, onInstall) => {
      const el = document.createElement('div'); el.className = 'gs-install';
      el.innerHTML = `<button class="gs-install__x" aria-label="닫기">×</button><div class="gs-install__title">홈 화면에 앱으로 설치하기</div>${inner}`;
      document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('on'));
      const close = () => { localStorage.setItem('gs.installHint', '1'); el.classList.remove('on'); setTimeout(() => el.remove(), 300); };
      el.querySelector('.gs-install__x').onclick = close;
      const b = el.querySelector('.gs-install__btn'); if (b) b.onclick = () => { onInstall(); close(); };
    };
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (ios) addEventListener('load', () => setTimeout(() => show('<ol class="gs-install__steps"><li>사파리 아래쪽의 <b>공유</b> 단추를 누릅니다</li><li><b>홈 화면에 추가</b>를 누릅니다</li><li>오른쪽 위 <b>추가</b>를 누릅니다</li></ol>'), 900));
    else addEventListener('beforeinstallprompt', e => { e.preventDefault(); show('<p class="gs-install__desc">주소창 없이 앱처럼 열립니다.</p><button class="gs-install__btn">설치</button>', () => e.prompt()); });
  }

  // ── 모션(3단계 「화려하게」). 색·배치는 건드리지 않는다 ──
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ORDER = ADMIN ? ['admin-dashboard', 'admin-timetable', 'admin-members', 'admin-revenue', 'admin-notice'] : ['index', 'challenge', 'program', 'change', 'class-status'];
  const PREV = sessionStorage.getItem('gs.prev'); sessionStorage.setItem('gs.prev', PAGE);
  const oi = n => ORDER.indexOf(n), dir = (oi(PAGE) >= 0 && oi(PREV) >= 0) ? Math.sign(oi(PAGE) - oi(PREV)) : 0;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PAL = ['#D4829A', '#9E82B0', '#E8A854', '#7B5A93', '#F0C6D4', '#ffffff'];
  const SPRING = 'cubic-bezier(.34,1.56,.64,1)', OUT = 'cubic-bezier(.16,1,.3,1)';
  const main = document.querySelector('.main');

  // 화면 넘김: 나갈 때 밀려나고, 들어올 때 반대쪽에서 들어옴
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || a.target === '_blank') return;
    const m = (a.getAttribute('href') || '').match(/^([\w-]+)\.html(.*)$/); if (!m || m[1] === PAGE) return;
    e.preventDefault(); const d = (oi(m[1]) >= 0 && oi(PAGE) >= 0) ? Math.sign(oi(m[1]) - oi(PAGE)) : 0;
    main && main.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: d ? `${-24 * d}px 0` : '0 -8px' }], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    setTimeout(() => { location.href = a.href; }, 170);
  });
  addEventListener('pageshow', e => { if (e.persisted && main) main.getAnimations().forEach(a => a.cancel()); });

  const css = document.createElement('style');
  css.textContent = `
  .mx-rp{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;z-index:0}
  .mx-rp i{position:absolute;border-radius:50%;background:currentColor;opacity:.16;transform:translate(-50%,-50%) scale(0)}
  .mx-fx{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden}
  .mx-fx i{position:absolute;display:block;will-change:transform,opacity}
  .today-card::after,.membership-card::after,.today-hero::after,.revenue-hero::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.22) 50%,transparent 62%);background-size:260% 100%;animation:mxSheen 3.6s ease-in-out infinite}
  .membership-card,.today-hero,.revenue-hero{position:relative;overflow:hidden}
  @keyframes mxSheen{0%,55%{background-position:130% 0}100%{background-position:-70% 0}}
  .fab-journal::after{content:'';position:absolute;inset:0;border-radius:inherit;border:2px solid var(--purple-400);animation:mxRing 2.4s ease-out infinite;pointer-events:none}
  @keyframes mxRing{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.55);opacity:0}}
  .today-card,.membership-card,.streak-hero{animation:mxFloat 5s ease-in-out 1s infinite}
  @keyframes mxFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}
  .bg-atmosphere{animation:mxDrift 16s ease-in-out infinite alternate}
  @keyframes mxDrift{0%{transform:scale(1.15) translate(-2%,-1%)}100%{transform:scale(1.15) translate(2%,2%)}}`;
  document.head.appendChild(css);
  const fx = document.createElement('div'); fx.className = 'mx-fx'; document.body.appendChild(fx);

  // 누름: 줄었다가 튕겨 돌아옴 + 물결 + 반짝이(+안드로이드 진동)
  const PRESS = 'button,a,.nav-item,.schedule-item,.notice-card,.icon-btn,.fab-journal,.menu-card,.tab-bar__item,.hw-item,.week-dot,.calendar__day,.badge-item,[role=button],.notif-item,.feeling-btn,[onclick]';
  document.addEventListener('pointerdown', e => {
    const t = e.target.closest(PRESS); if (!t || t.disabled) return;
    const hold = t.animate([{ scale: 1 }, { scale: .92 }], { duration: 90, easing: 'ease-out', fill: 'forwards' });
    ripple(t, e); sparkle(e.clientX, e.clientY, 12, 44); navigator.vibrate && navigator.vibrate(10);
    const up = () => { hold.cancel(); t.animate([{ scale: .92 }, { scale: 1.07, offset: .5 }, { scale: 1 }], { duration: 520, easing: SPRING }); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
  }, true);
  function ripple(t, e) {
    const cs = getComputedStyle(t); if (cs.display === 'inline' || t.matches('.calendar__day,.week-dot,td,tr')) return;
    if (cs.position === 'static') t.style.position = 'relative';
    const r = t.getBoundingClientRect(), w = document.createElement('span'), d = document.createElement('i'), size = Math.hypot(r.width, r.height) * 2;
    w.className = 'mx-rp'; d.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size}px`;
    w.appendChild(d); t.appendChild(w);
    d.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: .2 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }], { duration: 560, easing: 'ease-out' }).onfinish = () => w.remove();
  }
  function sparkle(x, y, n, dist) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'), a = Math.PI * 2 * i / n + Math.random() * .6, d = dist * (.5 + Math.random() * .7), s = 9 + Math.random() * 9;
      p.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${PAL[i % PAL.length]};clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)`;
      fx.appendChild(p);
      p.animate([{ transform: 'translate(-50%,-50%) scale(.2) rotate(0)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(1) rotate(${90 + Math.random() * 180}deg)`, opacity: 0 }], { duration: 520 + Math.random() * 260, easing: OUT }).onfinish = () => p.remove();
    }
  }
  function confetti(x, y, n = 44) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'), a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 120 + Math.random() * 220, w = 6 + Math.random() * 6;
      p.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${w * (.4 + Math.random() * .8)}px;background:${PAL[i % 5]};border-radius:${Math.random() > .6 ? '50%' : '2px'}`;
      fx.appendChild(p); const dx = Math.cos(a) * v, dy = Math.sin(a) * v, rot = (Math.random() - .5) * 900;
      p.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 }, { transform: `translate(calc(-50% + ${dx * .7}px),calc(-50% + ${dy}px)) rotate(${rot * .5}deg)`, opacity: 1, offset: .35, easing: 'ease-in' }, { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy + 420}px)) rotate(${rot}deg)`, opacity: 0 }], { duration: 1300 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
  }
  window.GS.confetti = confetti;
  // 축하 조각: 저장·신청·숙제 체크·출결 완료
  document.addEventListener('click', e => {
    const t = e.target.closest('.submit-btn,.btn-submit,.hw-item,.confirm-btn,.journal-save'); if (!t || t.disabled) return;
    const r = t.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (t.matches('.hw-item')) { setTimeout(() => { if (t.querySelector('.checked:not(.disabled)')) confetti(x, y); }, 30); return; }
    confetti(x, y);
  });

  // 화면 등장
  if (main) {
    main.animate([{ opacity: 0, translate: `${36 * dir}px ${dir ? 0 : 18}px` }, { opacity: 1, translate: '0 0' }], { duration: 460, easing: OUT });
    [...main.children].slice(0, 12).forEach((c, i) => c.animate([{ opacity: 0, translate: '0 22px', scale: .96 }, { opacity: 1, translate: '0 0', scale: 1 }], { duration: 620, delay: 60 + i * 80, easing: SPRING, fill: 'backwards' }));
  }
  // 숫자 올라가기·막대 채워지기
  $$('.stat-card__value,.streak-hero__count,.monthly-stat__value,.report-stat__value,.progress-card__count,.hw-progress__stat').forEach(el => {
    const n = [...el.childNodes].find(c => c.nodeType === 3 && /\d/.test(c.nodeValue)); if (!n) return;
    const m = n.nodeValue.match(/^(\D*)(\d+)(.*)$/s); if (!m) return; const end = +m[2], dur = 1300; let t0;
    const step = t => { t0 = t0 || t; const k = Math.min(1, (t - t0) / dur); n.nodeValue = m[1] + Math.round(end * (1 - Math.pow(1 - k, 3))) + m[3]; if (k < 1) requestAnimationFrame(step); else el.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 320, easing: SPRING }); };
    n.nodeValue = m[1] + 0 + m[3]; setTimeout(() => requestAnimationFrame(step), 250);
  });
  $$('.progress-bar__fill').forEach(el => { const w = el.style.width || getComputedStyle(el).width; el.animate([{ width: '0' }, { width: w }], { duration: 1350, delay: 300, easing: OUT, fill: 'backwards' }); });
  $$('svg circle[stroke-dasharray]').forEach(c => { const cs = getComputedStyle(c), arr = parseFloat(cs.strokeDasharray); if (!arr) return; c.animate([{ strokeDashoffset: arr }, { strokeDashoffset: cs.strokeDashoffset }], { duration: 1200, delay: 300, easing: OUT, fill: 'backwards' }); });
  // 하단 메뉴·알림·뱃지
  const act = document.querySelector('.bottom-nav .nav-item.active');
  if (act) {
    const ic = act.querySelector('svg,span:first-child'); ic && ic.animate([{ translate: '0 0', scale: 1 }, { translate: '0 -7px', scale: 1.18, offset: .4 }, { translate: '0 0', scale: 1 }], { duration: 520, delay: 120, easing: SPRING });
    if (dir) try { act.animate([{ translate: `${-dir * act.offsetWidth}px 0` }, { translate: '0 0' }], { duration: 420, easing: OUT, pseudoElement: '::before' }); } catch (_) {}
  }
  const bell = document.querySelector('.icon-btn svg'), badge = document.querySelector('.icon-btn__badge');
  const ring = () => bell && bell.animate([{ rotate: '0deg' }, { rotate: '16deg' }, { rotate: '-13deg' }, { rotate: '9deg' }, { rotate: '-5deg' }, { rotate: '0deg' }], { duration: 700, easing: 'ease-in-out' });
  if (badge) { setTimeout(() => { ring(); badge.animate([{ scale: 0 }, { scale: 1.35 }, { scale: 1 }], { duration: 480, easing: SPRING }); }, 900); setInterval(ring, 6000); }
  $$('.badge-item').forEach((b, i) => { b.animate([{ scale: 0, rotate: '-40deg', opacity: 0 }, { scale: 1, rotate: '0deg', opacity: getComputedStyle(b).opacity }], { duration: 520, delay: 500 + i * 60, easing: SPRING, fill: 'backwards' }); if (i < 2) setTimeout(() => { const r = b.getBoundingClientRect(); if (r.top < innerHeight) sparkle(r.left + r.width / 2, r.top + r.height / 3, 10, 34); }, 1000 + i * 60); });
  $$('.week-dot').forEach((d, i) => d.animate([{ scale: 0 }, { scale: 1 }], { duration: 420, delay: 450 + i * 90, easing: SPRING, fill: 'backwards' }));
  document.addEventListener('click', e => { if (!e.target.closest('.tab-bar__item')) return; setTimeout(() => { const c = document.querySelector('.tab-content.active,.tab-panel.active'); c && c.animate([{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }], { duration: 360, easing: OUT }); }, 0); });
  // 내려가며 나타나기
  if ('IntersectionObserver' in window && main) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.animate([{ opacity: .2, translate: '0 26px', scale: .97 }, { opacity: 1, translate: '0 0', scale: 1 }], { duration: 560, easing: SPRING }); io.unobserve(en.target); } }), { threshold: .15 });
    setTimeout(() => $$('.main > *').filter(el => el.getBoundingClientRect().top > innerHeight).forEach(el => io.observe(el)), 1200);
  }
})();
