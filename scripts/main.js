// ================================
// lie-portfolio main.js 完全版
// ================================

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
  });
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Local JSON loader =====
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return await res.json();
}

// ===== Content rendering =====
function renderNews(items) {
  const root = document.getElementById('newsList');
  if (!root) return;
  root.innerHTML = items.map(it => `
    <li class="card">
      <time datetime="${it.date}">${it.date}</time>
      <h3>${it.title}</h3>
      <p>${it.text}</p>
      ${it.link ? `<a class="btn" href="${it.link}" target="_blank" rel="noopener">詳しく</a>` : ''}
    </li>
  `).join('');
}

function renderTiles(items, rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = items.map(it => `
    <article class="tile">
      <img class="thumb" src="${it.thumb}" alt="${it.title}" onerror="this.style.display='none'">
      <div class="tile-body">
        <h3>${it.title}</h3>
        <p class="meta">${it.meta || ''}</p>
        <p>${it.text || ''}</p>
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
          ${it.audio ? `<audio controls src="${it.audio}"></audio>` : ''}
          ${it.link ? `<a class="btn" href="${it.link}" target="_blank" rel="noopener">開く</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

function renderSchedule(items) {
  const tbody = document.querySelector('#scheduleTable tbody');
  if (!tbody) return;
  tbody.innerHTML = items.map(it => `
    <tr>
      <td><time datetime="${it.date}">${it.date}</time></td>
      <td>${it.title}</td>
      <td>${it.link ? `<a href="${it.link}" target="_blank" rel="noopener">リンク</a>` : '-'}</td>
    </tr>
  `).join('');
}

// ===== Load JSON data (local works.json) =====
(async () => {
  try {
    const data = await loadJSON('data/works.json');
    renderNews(data.news || []);
    renderTiles(data.music || [], 'musicGrid');
    renderTiles(data.novels || [], 'novelGrid');
    renderSchedule(data.schedule || []);
  } catch (e) {
    console.warn(e);
  }
})();

// ===== Golden Stardust Particles =====
(() => {
  const canvas = document.getElementById('stardust');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w, h, dpr, particles = [];
  const MAX = 120;
  const GOLD = '#D0A900';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnParticle() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 1.8),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.12, 0.02),
      a: rand(0.25, 0.7),
      tw: rand(1.2, 2.4),
      t: Math.random() * Math.PI * 2
    };
  }

  function init() {
    particles = [];
    const count = prefersReduced ? Math.floor(MAX * 0.35) : MAX;
    for (let i = 0; i < count; i++) particles.push(spawnParticle());
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, 'rgba(134,32,64,0.06)');
    grd.addColorStop(1, 'rgba(208,169,0,0.04)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.t += 0.02 * p.tw;
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

      const flicker = 0.6 + 0.4 * Math.abs(Math.sin(p.t));
      ctx.globalAlpha = p.a * flicker;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, GOLD);
      g.addColorStop(1, 'rgba(208,169,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = Math.min(1, p.a + 0.15);
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (!prefersReduced) requestAnimationFrame(step);
  }

  function onResize() { resize(); init(); if (prefersReduced) step(); }

  window.addEventListener('resize', onResize);
  resize(); init();
  if (!prefersReduced) requestAnimationFrame(step);
  else step();
})(); // 粒子IIFE終了

// ===== Google Calendar fetch (public calendar + API key) =====
async function fetchGCalEvents({ calendarId, apiKey, maxResults = 15 }) {
  const timeMin = new Date().toISOString();
  const params = new URLSearchParams({
    key: apiKey, timeMin, maxResults: String(maxResults),
    singleEvents: 'true', orderBy: 'startTime'
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Google Calendar: ' + res.status);
  const data = await res.json();

  const fmt = iso => new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  return (data.items || []).map(ev => {
    const startIso = ev.start.dateTime || (ev.start.date + 'T00:00:00Z');
    const when = ev.start.date ? fmt(ev.start.date + 'T00:00:00Z').slice(0, 5) : fmt(startIso);
    return { when, title: ev.summary || '(無題)', link: ev.htmlLink || '' };
  });
}

async function renderGCalToCards({ calendarId, apiKey }) {
  const root = document.getElementById('scheduleList');
  if (!root) return;
  try {
    const items = await fetchGCalEvents({ calendarId, apiKey, maxResults: 20 });
    if (items.length === 0) {
      root.innerHTML = `<li class="card"><p>直近の予定はありません。</p></li>`;
      return;
    }
    root.innerHTML = items.map(it => `
      <li class="card">
        <time style="color:var(--gold);font-weight:600;">${it.when}</time>
        <h3 style="margin:6px 0 8px;">${it.title}</h3>
        ${it.link ? `<a class="btn" href="${it.link}" target="_blank" rel="noopener">Googleカレンダーで開く</a>` : ''}
      </li>
    `).join('');
  } catch (e) {
    console.error(e);
    root.innerHTML = `<li class="card"><p class="muted">スケジュールを読み込めませんでした。</p></li>`;
  }
}

renderGCalToCards({
  calendarId: '20dba90368bbf1e0ab7f0df056f206d6d15e4c8711d9afb1a1b045ba3ed3b9c2@group.calendar.google.com',
  apiKey: 'AIzaSyB1_znRIwBQBfsUE82Eg7Ez1ovLEwm-fxQ'
});

// ===== Portal Entrance (光の扉) =====
(() => {
  const portal = document.getElementById('portal');
  if (!portal) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { portal.remove(); return; }
  portal.classList.add('open');
  setTimeout(() => {
    portal.classList.add('hide');
    setTimeout(() => portal.remove(), 700);
  }, 2200);
})();
