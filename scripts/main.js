// ================================
// lie-portfolio / main.js 完全版
// Now Loading + 基本機能（構文エラー修正版）
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

// ===== JSON loader (news/music/novel/schedule) =====
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return await res.json();
}

// ===== Render helpers =====
function renderNews(items) {
  const root = document.getElementById('newsList');
  if (!root) return;
  root.innerHTML = items
    .map(
      (it) => `
    <li class="card">
      <time datetime="${it.date}">${it.date}</time>
      <h3>${it.title}</h3>
      <p>${it.text}</p>
      ${
        it.link
          ? `<a class="btn" href="${it.link}" target="_blank" rel="noopener">詳しく</a>`
          : ''
      }
    </li>`
    )
    .join('');
}

function renderTiles(items, rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = items
    .map(
      (it) => `
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
    </article>`
    )
    .join('');
}

function renderScheduleTable(items) {
  const tbody = document.querySelector('#scheduleTable tbody');
  if (!tbody) return false;
  tbody.innerHTML = items
    .map(
      (it) => `
    <tr>
      <td><time datetime="${it.date}">${it.date}</time></td>
      <td>${it.title}</td>
      <td>${
        it.link
          ? `<a href="${it.link}" target="_blank" rel="noopener">リンク</a>`
          : '-'
      }</td>
    </tr>`
    )
    .join('');
  return true;
}

// ===== Load local works.json if exists =====
(async () => {
  try {
    const data = await loadJSON('data/works.json');
    renderNews(data.news || []);
    renderTiles(data.music || [], 'musicGrid');
    renderTiles(data.novels || [], 'novelGrid');
    renderScheduleTable(data.schedule || []);
  } catch (e) {
    console.warn(e);
  }
})();

// ===== Now Loading (2秒表示＋フェードアウト) =====
(() => {
  const overlay = document.getElementById('preload');
  if (!overlay) return;

  document.body.classList.add('no-scroll');
  const start = performance.now();
  const MIN = 2000;

  function hide() {
    if (overlay.dataset.closed === '1') return;
    overlay.dataset.closed = '1';
    overlay.classList.add('hide');
    document.body.classList.remove('no-scroll');
    overlay.addEventListener('transitionend', () => overlay.remove(), {
      once: true,
    });
    setTimeout(() => overlay.remove(), 900);
  }

  function onReady() {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN - elapsed);
    setTimeout(hide, wait);
  }

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }

  setTimeout(hide, 4500);
})();
