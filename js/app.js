const IMG_PROXY = 'https://film-mood-proxy.flffkaos.workers.dev/?url=';
function pimg(url) { return url.includes('img.yeguozi.com') ? IMG_PROXY + encodeURIComponent(url) : url; }

let CURRENT_LANG = localStorage.getItem('filmmood-lang') || 'ko';

function switchLang() {
  CURRENT_LANG = CURRENT_LANG === 'ko' ? 'en' : 'ko';
  localStorage.setItem('filmmood-lang', CURRENT_LANG);
  document.querySelector('.lang-toggle').textContent = CURRENT_LANG === 'ko' ? 'English' : '한국어';
  renderPage();
}

function qs(s, p) { return (p || document).querySelector(s); }
function qsa(s, p) { return (p || document).querySelectorAll(s); }
function personAvatar(d) {
  const name = d.name[CURRENT_LANG] || d.name.en || d.name.zh || '?';
  const initial = name.charAt(0) || '?';
  return d.img || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23252525" width="100" height="100"/><text font-size="32" fill="%236b6966" text-anchor="middle" x="50" y="58">' + encodeURIComponent(initial) + '</text></svg>';
}

// ─── Lightbox ───
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = pimg(src);
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── Img helper ───
function imgAttr(src, alt) {
  src = pimg(src);
  return `src="${src}" alt="${alt}" loading="lazy" crossorigin="anonymous" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'img-error\\'>${alt}<br><span style=font-size:11px;opacity:.6>Failed to load</span></div>'" onload="this.classList.add('loaded')"`;
}

// ─── Router ───
function getRoute() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'film') return { page: 'film', slug: parts[1] };
  if (parts[0] === 'color') return { page: 'color', slug: parts[1] };
  return { page: parts[0] || 'home' };
}

// ─── Merge film details from enrichment ───
const DETAILS_SRC = typeof FILM_DETAILS_FULL !== 'undefined' ? FILM_DETAILS_FULL : (typeof filmDetails !== 'undefined' ? filmDetails : []);
DETAILS_SRC.forEach(d => {
  const f = FILM_DATA.find(x => x.id === d.id);
  if (!f) return;
  if (d.description?.en && !f.description?.en) f.description = d.description;
  if (d.colors?.length >= 3) f.colors = d.colors;
  if (d.letterboxd) f.letterboxd = d.letterboxd;
  if (d.screenshots?.length >= 5) f.screenshots = d.screenshots;
});

// ─── Render ───
function renderPage() {
  const route = getRoute();
  const main = qs('main');
  main.innerHTML = '<div class="loading"><div class="spinner"></div>' + lang('loading') + '</div>';
  window.scrollTo(0, 0);
  updateActiveNav(route.page);
  switch (route.page) {
    case 'home': renderHome(main); break;
    case 'films': renderFilms(main); break;
    case 'colors': renderColors(main); break;
    case 'about': renderAbout(main); break;
    case 'academy': renderAcademy(main); break;
    case 'color': renderColorDetail(main, route.slug); break;
    case 'film': renderFilmDetail(main, route.slug); break;
    default: renderHome(main);
  }
}

function updateActiveNav(page) {
  qsa('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + (page === 'home' ? '/' : '/' + page));
  });
}

// ─── Home ───
function renderHome(main) {
  const featured = FILM_DATA.filter(f => f.featured);
  const directors = DIRECTOR_DATA.slice(0, 6);
  const cines = CINEMATOGRAPHER_DATA.slice(0, 6);
  main.innerHTML = `
    <section class="hero">
      <h1>${lang('heroTitle')}</h1>
      <p>${lang('heroSub')}</p>
      <div class="hero-actions">
        <a href="#/films" class="btn btn-primary">${lang('browseFilms')}</a>
        <a href="#/colors" class="btn btn-secondary">${lang('exploreColors')}</a>
      </div>
      <div class="hero-stats">64 ${lang('filmCount', { count: 3432 })}</div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">${lang('featuredFilms')}</h2>
          <p style="color:var(--text3);font-size:14px;margin-top:4px">${lang('featuredSub')}</p>
        </div>
        <a href="#/films" class="section-link">${lang('viewAll')}</a>
      </div>
      <div class="film-grid">${featured.map(f => filmCardHTML(f)).join('')}</div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">${lang('directors')}</h2>
          <p style="color:var(--text3);font-size:14px;margin-top:4px">${lang('directorsSub')}</p>
        </div>
      </div>
      <div class="person-row">
        ${directors.map(d => `
          <div class="person-card">
            <img class="person-avatar" src="${personAvatar(d)}" alt="${d.name[CURRENT_LANG] || d.name.en}">
            <div class="person-name">${d.name[CURRENT_LANG] || d.name.en}</div>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">${lang('cinematographers')}</h2>
          <p style="color:var(--text3);font-size:14px;margin-top:4px">${lang('cinematographersSub')}</p>
        </div>
      </div>
      <div class="person-row">
        ${cines.map(d => `
          <div class="person-card">
            <img class="person-avatar" src="${personAvatar(d)}" alt="${d.name[CURRENT_LANG] || d.name.en}">
            <div class="person-name">${d.name[CURRENT_LANG] || d.name.en}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ─── Films ───
function renderFilms(main) {
  const regions = [...new Set(FILM_DATA.map(f => f.region[CURRENT_LANG]))].sort();
  const genres = [...new Set(FILM_DATA.flatMap(f => f.genre || []))].sort();
  let html = `
    <div class="page-header">
      <h1>${lang('films')}</h1>
      <p>64 ${lang('filmsCount', { count: FILM_DATA.length })}</p>
    </div>
    <section class="section">
      <div class="filter-bar" id="genreFilters">
        <button class="filter-btn active" data-filter="all">${lang('all')}</button>
        ${genres.map(g => `<button class="filter-btn" data-filter="${g}">${g}</button>`).join('')}
      </div>
      <div class="filter-bar" id="filmFilters">
        <button class="filter-btn active" data-filter="all">${lang('allRegions')}</button>
        ${regions.map(r => `<button class="filter-btn" data-filter="${r}">${r}</button>`).join('')}
      </div>
      <div class="film-grid" id="filmGrid">${FILM_DATA.map(f => filmCardHTML(f)).join('')}</div>
    </section>
  `;
  main.innerHTML = html;
  function applyFilters() {
    const genreFilter = qs('#genreFilters .filter-btn.active')?.dataset?.filter || 'all';
    const regionFilter = qs('#filmFilters .filter-btn.active')?.dataset?.filter || 'all';
    qsa('.film-card').forEach(c => {
      const matchGenre = genreFilter === 'all' || (c.dataset.genre || '').split(' ').includes(genreFilter);
      const matchRegion = regionFilter === 'all' || c.dataset.region === regionFilter;
      c.style.display = matchGenre && matchRegion ? '' : 'none';
    });
  }
  qs('#genreFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    qsa('#genreFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
  qs('#filmFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    qsa('#filmFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
}

function filmCardHTML(f) {
  const title = f.title[CURRENT_LANG] || f.title.en;
  const genreStr = (f.genre || []).join(' ');
  return `
    <div class="film-card" data-region="${f.region[CURRENT_LANG] || f.region.en}" data-genre="${genreStr}" onclick="navigate('#/film/${f.id}')">
      <div class="film-card-img">
        <img src="${pimg(f.screenshots?.[0] || f.poster)}" alt="${title}" loading="lazy">
        ${f.new ? '<span class="film-card-badge">' + lang('new') + '</span>' : ''}
      </div>
      <div class="film-card-body">
        <div class="film-card-title">${title}</div>
        <div class="film-card-meta">${f.director[CURRENT_LANG] || f.director.en} · ${f.year}</div>
      </div>
    </div>
  `;
}

// ─── Colors ───
function renderColors(main) {
  main.innerHTML = `
    <div class="page-header">
      <h1>${lang('colors')}</h1>
      <p>${lang('colorsSub')}</p>
    </div>
    <section class="section">
      <div class="color-grid">
        ${COLORS_DATA.map(c => {
          const nameKey = c.id;
          const descKey = c.id + 'Desc';
          const name = lang(nameKey);
          const desc = lang(descKey);
          return `
            <div class="color-card" onclick="navigate('#/color/${c.id}')">
              <div class="color-card-header">
                <div class="color-card-name">${name}</div>
                <div class="color-card-count">${c.count} ${lang('screenshotsCount')}</div>
                <div class="color-card-tags">
                  ${desc.split(', ').map(t => `<span>${t}</span>`).join('')}
                </div>
              </div>
              <div class="color-card-thumbs">
                ${c.thumbs.slice(0, 6).map(url => `<img src="${pimg(url)}" alt="" loading="lazy">`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

// ─── About ───
function renderAbout(main) {
  const notes = lang('notesList');
  main.innerHTML = `
    <div class="page-header">
      <h1>${lang('aboutPageTitle')}</h1>
    </div>
    <section class="section">
      <div class="about-content">
        <h2>${lang('introTitle')}</h2>
        <p>${lang('introP1')}</p>
        <p>${lang('introP2')}</p>
        <p>${lang('introP3')}</p>
        <h2>${lang('notesTitle')}</h2>
        <ul>${Array.isArray(notes) ? notes.map(n => `<li>${n}</li>`).join('') : ''}</ul>
        <h2>${lang('knowTitle')}</h2>
        <p><strong>${lang('q1')}</strong></p>
        <p>${lang('a1')}</p>
        <p><strong>${lang('q2')}</strong></p>
        <p>${lang('a2')}</p>
        <p><strong>${lang('q3')}</strong></p>
        <p>${lang('a3')}</p>
      </div>
    </section>
  `;
}

// ─── Academy ───
function renderAcademy(main) {
  const entries = (typeof ACADEMY_DATA_FULL !== 'undefined' ? ACADEMY_DATA_FULL : ACADEMY_DATA) || [];
  const winnerCount = entries.filter(e => e.award === 'Winner').length;
  const nomineeCount = entries.filter(e => e.award === 'Nominee').length;
  main.innerHTML = `
    <div class="page-header">
      <h1>${lang('academy')}</h1>
      <p>${lang('academySub')}</p>
    </div>
    <section class="section">
      <p style="color:var(--text2);margin-bottom:16px;font-size:14px">${lang('academyAbout')}</p>
      <div class="filter-bar" id="academyFilters">
        <button class="filter-btn active" data-filter="all">${lang('all')} (${entries.length})</button>
        <button class="filter-btn" data-filter="Winner">${lang('winner')} (${winnerCount})</button>
        <button class="filter-btn" data-filter="Nominee">${lang('nominee')} (${nomineeCount})</button>
      </div>
      <div style="overflow-x:auto">
        <table class="academy-table" id="academyTable">
          <thead>
            <tr>
              <th>${lang('year')}</th>
              <th>${lang('englishTitle')}</th>
              <th>${lang('koreanTitle')}</th>
              <th>${lang('cinematographer')}</th>
              <th>${lang('award')}</th>
            </tr>
          </thead>
          <tbody id="academyBody">
          </tbody>
        </table>
      </div>
      <p style="color:var(--text3);text-align:center;margin-top:24px;font-size:13px">${lang('academy')} · ${entries.length} films</p>
    </section>
  `;
  const tbody = document.getElementById('academyBody');
  function renderAcademyTable(filter) {
    const filtered = filter === 'all' ? entries : entries.filter(e => e.award === filter);
    tbody.innerHTML = filtered.map(e => {
      const kt = e.koreanTitle || '';
      return `
      <tr>
        <td>${e.year}</td>
        <td>${e.englishTitle}</td>
        <td>${kt}</td>
        <td>${e.cinematographer}</td>
        <td class="${e.award === 'Winner' ? 'winner' : ''}">${e.award === 'Winner' ? '🏆 ' + lang('winner') : lang('nominee')}</td>
      </tr>`;
    }).join('');
  }
  renderAcademyTable('all');
  document.getElementById('academyFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('#academyFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAcademyTable(btn.dataset.filter);
  });
}

// ─── Color Detail ───
function renderColorDetail(main, slug) {
  const color = COLORS_DATA.find(c => c.id === slug);
  if (!color) { main.innerHTML = `<div class="loading" style="padding:80px 24px"><p>Color not found</p><a href="#/colors" class="btn btn-secondary" style="margin-top:16px">← ${lang('colors')}</a></div>`; return; }
  const nameKey = color.id;
  const descKey = color.id + 'Desc';
  const name = lang(nameKey);
  const desc = lang(descKey);
  main.innerHTML = `
    <div class="page-header">
      <h1>${name}</h1>
      <p>${desc} · ${color.count} ${lang('screenshotsCount')}</p>
    </div>
    <section class="section">
      <a href="#/colors" style="color:var(--text3);font-size:14px;display:inline-block;margin-bottom:24px">← ${lang('colors')}</a>
      <div class="film-screenshots">
        ${color.thumbs.map(url => `<img src="${pimg(url)}" alt="${name}" loading="lazy" style="cursor:zoom-in" onclick="openLightbox('${url}')">`).join('')}
      </div>
    </section>
  `;
}

// ─── Film Detail ───
function renderFilmDetail(main, slug) {
  const film = FILM_DATA.find(f => f.id === slug);
  if (!film) {
    main.innerHTML = `<div class="loading" style="padding:80px 24px"><p>Film not found</p><a href="#/films" class="btn btn-secondary" style="margin-top:16px">← ${lang('films')}</a></div>`;
    return;
  }
  const title = film.title[CURRENT_LANG] || film.title.en;
  const dir = film.director[CURRENT_LANG] || film.director.en;
  const reg = film.region[CURRENT_LANG] || film.region.en;
  const desc = film.description?.[CURRENT_LANG] || film.description?.en || '';
  const colors = film.colors || [];
  const shots = film.screenshots?.length > 1 ? film.screenshots : [film.poster];

  main.innerHTML = `
    <div class="film-detail">
      <a href="#/films" style="color:var(--text3);font-size:14px;display:inline-block;margin-bottom:16px">← ${lang('films')}</a>
      <div class="film-detail-header">
        <div class="film-detail-meta">${reg} · ${film.year}</div>
        <h1 class="film-detail-title">${title}</h1>
        <div class="film-detail-sub">${dir}</div>
        ${film.cinematographer ? `<div class="film-detail-sub" style="color:var(--text3);font-size:13px;margin-top:4px">${lang('cinematography')}: ${film.cinematographer}</div>` : ''}
        ${film.letterboxd ? `<a href="${film.letterboxd}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:13px">${lang('doubanView').replace('Douban','Letterboxd')} →</a>` : ''}
      </div>
      ${colors.length ? `
        <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">${lang('colorPalette')}</h3>
        <div class="film-palette">${colors.map(c => `<div class="film-palette-bar" style="background:${c};flex:1" title="${c}"></div>`).join('')}</div>
        <div class="film-palette-info">${colors.map(c => `<span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${c}"></span>${c}</span>`).join('')}</div>
      ` : ''}
      ${desc ? `
        <div class="film-detail-desc">
          <strong style="color:var(--text)">${lang('whyWeRecommend')}</strong>
          <p style="margin-top:8px">${desc}</p>
        </div>
      ` : ''}
      <h3 style="font-size:16px;font-weight:600;margin-top:32px;margin-bottom:12px">${lang('screenshots')} · ${shots.length}</h3>
      <div class="film-screenshots">
        ${shots.map(s => `<img src="${pimg(s)}" alt="${title}" loading="lazy" style="cursor:zoom-in" onclick="openLightbox('${s}')">`).join('')}
      </div>
    </div>
  `;
}

// ─── Navigation helpers ───
function navigate(hash) {
  location.hash = hash;
}

window.addEventListener('hashchange', renderPage);

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.lang-toggle').addEventListener('click', switchLang);
  // Set initial lang button text
  document.querySelector('.lang-toggle').textContent = CURRENT_LANG === 'ko' ? 'English' : '한국어';
  renderPage();
});
