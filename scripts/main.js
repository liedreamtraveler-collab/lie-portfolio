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
})();