// 근력학교 이화 — 서비스 워커: 화면은 새 것 먼저(안 되면 저장본), 폰트·이미지는 저장본 먼저
const V = 'gs-preview-f-2026.11.11-5', FILES = ["login.html", "index.html", "challenge.html", "program.html", "change.html", "class-status.html", "journal.html", "journal-write.html", "profile.html", "admin-dashboard.html", "admin-timetable.html", "admin-members.html", "member-detail.html", "admin-revenue.html", "admin-notice.html", "assets/app.css", "assets/icon-any-512.png", "assets/icon-192.png", "assets/icon-maskable-512.png", "assets/icon-180.png", "assets/logo.png", "assets/app.js", "assets/icon-512.png", "assets/icon-any-192.png", "assets/fonts/CarmenSans-Light.woff2", "assets/fonts/TypeGraduation.woff2", "assets/fonts/CarmenSans-Bold.woff2", "assets/fonts/CarmenSans-Regular.woff2", "assets/fonts/CarmenSans-Medium.woff2", "assets/fonts/CarmenSans-SemiBold.woff2"];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const put = r => { if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; };
  if (/\.(woff2|png|jpg|svg)$/.test(u.pathname)) e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(put)));
  else e.respondWith(fetch(e.request).then(put).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
