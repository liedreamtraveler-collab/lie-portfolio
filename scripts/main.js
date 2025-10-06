// Main interactions and data rendering

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu){
  navToggle.addEventListener('click', ()=>{
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle){
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch and render data
async function loadJSON(path){
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load '+path);
  return await res.json();
}

function renderNews(items){
  const root = document.getElementById('newsList');
  root.innerHTML = items.map(it => `
    <li class="card">
      <time datetime="${it.date}">${it.date}</time>
      <h3>${it.title}</h3>
      <p>${it.text}</p>
      ${it.link ? `<a class="btn" href="${it.link}" target="_blank" rel="noopener">詳しく</a>` : ''}
    </li>
  `).join('');
}

function renderTiles(items, rootId){
  const root = document.getElementById(rootId);
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

function renderSchedule(items){
  const tbody = document.querySelector('#scheduleTable tbody');
  tbody.innerHTML = items.map(it => `
    <tr>
      <td><time datetime="${it.date}">${it.date}</time></td>
      <td>${it.title}</td>
      <td>${it.link ? `<a href="${it.link}" target="_blank" rel="noopener">リンク</a>` : '-'}</td>
    </tr>
  `).join('');
}

(async () => {
  try{
    const data = await loadJSON('data/works.json');
    renderNews(data.news);
    renderTiles(data.music, 'musicGrid');
    renderTiles(data.novels, 'novelGrid');
    renderSchedule(data.schedule);
  }catch(e){
    console.error(e);
  }
// ===== Golden Stardust Particles =====
(() => {
  const canvas = document.getElementById('stardust');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w, h, dpr, particles = [];
  const MAX = 120; // 粒子数（PC想定）。重ければ80へ
  const GOLD = '#D0A900';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function rand(min, max){ return Math.random()*(max-min)+min; }

  function spawnParticle(){
    return {
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 1.8),    // 半径
      vx: rand(-0.08, 0.08),
      vy: rand(-0.12, 0.02),
      a: rand(0.25, 0.7),   // 透明度
      tw: rand(1.2, 2.4),   // 点滅速度
      t: Math.random()*Math.PI*2
    };
  }

  function init(){
    particles = [];
    const count = prefersReduced ? Math.floor(MAX*0.35) : MAX;
    for (let i=0;i<count;i++) particles.push(spawnParticle());
  }

  function step(t){
    ctx.clearRect(0,0,w,h);

    // 背景にごく薄い赤のベール（深み）
    const grd = ctx.createLinearGradient(0,0,w,h);
    grd.addColorStop(0,'rgba(134,32,64,0.06)');
    grd.addColorStop(1,'rgba(208,169,0,0.04)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);

    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.t += 0.02 * p.tw;

      // 端に行ったら巻き戻し
      if (p.x < -10) p.x = w+10; else if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10; else if (p.y > h+10) p.y = -10;

      // 点滅（きらめき）
      const flicker = 0.6 + 0.4 * Math.abs(Math.sin(p.t));
      ctx.globalAlpha = p.a * flicker;

      // グローっぽい円
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
      g.addColorStop(0, GOLD);
      g.addColorStop(1, 'rgba(208,169,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
      ctx.fill();

      // 中心に小さなコア
      ctx.globalAlpha = Math.min(1, p.a + 0.15);
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();

      ctx.globalAlpha = 1;
    }
    if (!prefersReduced) requestAnimationFrame(step);
  }

  const onResize = () => { resize(); init(); };
  window.addEventListener('resize', onResize);
  resize(); init();
  if (!prefersReduced) requestAnimationFrame(step);

})();
