const IMG_PROXY = '';
function pimg(url) { return url; }
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 9%27%3E%3Crect fill=%27%231c1c1c%27 width=%2716%27 height=%279%27/%3E%3Ctext x=%2750%25%27 y=%2755%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%271.5%27 fill=%27%23666%27 font-family=%27sans-serif%27%3E%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%86%EC%9D%8C%3C/text%3E%3C/svg%3E';

// Manual mapping: film ID -> manifest directory key (for mismatched IDs)
const FILM_ID_TO_MANIFEST = {
  'le-havre-2011': 'lei-a-fu-er-2011',
  'a-tale-of-winter-1992': 'dong-tian-de-gu-shi-1992',
  'a-brighter-summer-day-1991': 'gu-ling-jie-shao-nian-1991',
  'a-tale-of-springtime-1990': 'conte-de-printemps1990',
  'a-tale-of-summer-1996': 'xia-tian-de-gu-shi-1996',
  'ashes-of-time-1994': 'dong-xie-xi-du-1994',
  'chungking-express-1994': 'chong-qing-sen-lin-1994',
  'days-of-heaven-1978': 'tian-tang-zhi-ri-1978',
  'drive-my-car-2021': 'jia-shi-wo-de-che-2021',
  'faces-places-2017': 'lian-pang-cun-zhuang-2017',
  'happy-together-1997': 'chun-guang-zha-xie-1997',
  'hero-2002': 'ying-xiong-2002',
  'la-collectionneuse-1967': 'nv-shou-cang-jia-1967',
  'love-in-the-afternoon-1972': 'wu-hou-zhi-ai-1972',
  'malcolm-and-marie-2021': 'ma-er-ke-mu-yu-ma-li-2021',
  'moonrise-kingdom-2012': 'yue-sheng-wang-guo-2012',
  'never-look-away-2018': 'wu-zhu-zhi-zuo-2018',
  'one-fine-morning-2022': 'chen-guang-zheng-hao-2022',
  'one-sings-the-other-doesn-t-1977': 'yi-ge-chang-yi-ge-bu-chang-1977',
  'out-of-africa-1985': 'zou-chu-fei-zhou-1985',
  'paris-texas-1984': 'de-zhou-ba-li-1984',
  'pauline-at-the-beach-1983': 'sha-tan-shang-de-bao-lian-1983',
  'playtime-1967': 'play-time-1967',
  'sentimental-value-2025': 'qing-gan-jia-zhi-2025',
  'still-walking-2008': 'bu-lv-bu-ting-2008',
  'the-banishment-2007': 'jiang-ai-fang-zhu-2007',
  'the-beaches-of-agn-s-2008': 'a-nie-si-de-hai-tan-2008',
  'the-hand-of-god-2021': 'shang-di-zhi-shou-2021',
  'the-hedgehog-2009': 'the-hedgehog',
  'the-hours-2002': 'the-hours',
  'the-parent-trap-1998': 'tian-sheng-yi-dui-1998',
  'the-royal-tenenbaums-2001': 'tian-cai-yi-zu-2001',
  'the-time-to-live-and-the-time-to-die-1985': 'tong-nian-wang-shi-1985',
  'the-turin-horse-2011': 'dou-ling-zhi-ma-2011',
  'the-vertical-ray-of-the-sun-2000': 'xia-tian-de-zi-wei-2000',
  'the-worst-person-in-the-world-2021': 'shi-jie-shang-zui-zao-gao-de-ren-2021',
  'things-to-come-2016': 'things-to-come',
  'three-colours-blue-1993': 'lan-bai-hong-san-bu-qu-zhi-lan-1993',
};

// Chinese dir name → film ID (for mapping curated thumbs to local images)
const FILM_THUMB_MAP = {
  "布达佩斯大饭店(2014)": "the-grand-budapest-hotel-2014",
  "英雄(2002)": "hero-2002",
  "大红灯笼高高挂(1991)": "raise-the-red-lantern-1991",
  "爱乐之城(2016)": "la-la-land-2016",
  "闪灵(1980)": "the-shining-1980",
  "刺猬的优雅（2009）": "the-hedgehog-2009",
  "一个好人(2023)": "a-good-person-2023",
  "勒阿弗尔 (2011)": "le-havre-2011",
  "美国精神病人(2000)": "american-psycho-2000",
  "恋爱假期(2006)": "the-holiday-2006",
  "夏天的故事(1996)": "a-tale-of-summer-1996",
  "月升王国（2012）": "moonrise-kingdom-2012",
  "青木瓜之味（1993）": "the-scent-of-green-papaya-1993",
  "乡愁(1983)": "nostalghia-1983",
  "镜子(1975)": "mirror-1975",
  "迷魂记(1958)": "vertigo-1958",
  "牺牲(1986)": "the-sacrifice-1986",
  "爱 Amour(2012)": "amour-2012",
};
// Auto-build from FILM_DATA using zh title + year
(function buildThumbMap() {
  try {
    if (typeof FILM_DATA !== 'undefined' && Array.isArray(FILM_DATA)) {
      FILM_DATA.forEach(f => {
        const zh = f.title?.zh || '';
        if (zh && f.year) {
          FILM_THUMB_MAP[zh.trim() + '(' + f.year + ')'] = f.id;
          FILM_THUMB_MAP[zh.trim() + ' (' + f.year + ')'] = f.id;
          FILM_THUMB_MAP[zh.trim() + '（' + f.year + '）'] = f.id;
        }
      });
    }
  } catch (e) {
    console.warn('buildThumbMap error:', e);
  }
})();
function findFilmByLocalDir(dir) {
  const film = FILM_DATA.find(f => {
    const key = FILM_ID_TO_MANIFEST[f.id] || f.id;
    return key === dir;
  });
  return film || null;
}
function filmFromUrl(url) {
  if (!url) return null;
  const m = url.match(/^images\/([^\/]+)\//);
  if (m) return findFilmByLocalDir(m[1]);
  const mt = url.match(/thumbs\/([^\/]+)\//);
  if (mt) {
    const dir = decodeURIComponent(mt[1]).trim();
    const id = FILM_THUMB_MAP[dir];
    return id ? (FILM_DATA.find(f => f.id === id) || null) : null;
  }
  return null;
}
function filmTitleFromThumb(url) {
  const f = filmFromUrl(url);
  return f ? (f.title[CURRENT_LANG] || f.title.en || '') : '';
}

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
  const escaped = (alt || '').replace(/['"]/g, '');
  const errMsg = escaped ? escaped + '<br><span style=font-size:11px;opacity:.6>이미지 없음</span>' : '';
  return `src="${src}" alt="${escaped}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER_SVG}';this.classList.remove('loaded');" onload="this.classList.add('loaded')"`;
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
(function mergeDetails() {
  try {
    const DETAILS_SRC = typeof FILM_DETAILS_FULL !== 'undefined' ? FILM_DETAILS_FULL : (typeof filmDetails !== 'undefined' ? filmDetails : []);
    if (typeof FILM_DATA !== 'undefined' && Array.isArray(FILM_DATA)) {
      DETAILS_SRC.forEach(d => {
        const f = FILM_DATA.find(x => x.id === d.id);
        if (!f) return;
        if (d.description?.en && !f.description?.en) f.description = d.description;
        if (d.colors?.length >= 3) f.colors = d.colors;
        if (d.letterboxd) f.letterboxd = d.letterboxd;
        if (d.screenshots?.length >= 5) f.screenshots = d.screenshots;
      });
    }
  } catch (e) {
    console.warn('mergeDetails error:', e);
  }
})();

// Convert CDN URLs to local images from manifest (runs after mergeDetails)
(function fixFilmData() {
  try {
    if (typeof FILM_DATA !== 'undefined' && Array.isArray(FILM_DATA) && typeof IMAGES_MANIFEST !== 'undefined') {
      FILM_DATA.forEach(f => {
        const manifestKey = FILM_ID_TO_MANIFEST[f.id] || f.id;
        const entry = IMAGES_MANIFEST[manifestKey];
        if (entry && entry.count > 0) {
          const files = entry.files || Array.from({length: entry.count}, (_, i) => `${String(i+1).padStart(4,'0')}.webp`);
          f.poster = `images/${entry.dir}/${files[0]}`;
          f.screenshots = files.map(fn => `images/${entry.dir}/${fn}`);
        } else if ((f.screenshots && f.screenshots.some(s => s && (s.includes('yeguozi') || s.includes('wikimedia')))) || (f.poster && (f.poster.includes('yeguozi') || f.poster.includes('wikimedia')))) {
          f.poster = PLACEHOLDER_SVG;
          f.screenshots = [];
        }
      });
      FILM_DATA = FILM_DATA.filter(f => f.poster || (f.screenshots && f.screenshots.length > 0));
    }
  } catch (e) {
    console.warn('fixFilmData error:', e);
  }
})();

// Convert CDN URLs in COLORS_DATA thumbs to local film images
(function fixColorData() {
  try {
    if (typeof COLORS_DATA !== 'undefined' && Array.isArray(COLORS_DATA)) {
      COLORS_DATA.forEach(c => {
        if (c.thumbs && Array.isArray(c.thumbs)) {
          c.thumbs = c.thumbs.map(url => {
            if (!url || !url.includes('yeguozi')) return url;
            const m = url.match(/thumbs\/([^\/]+)\/(.+?)\.webp/);
            if (!m) return url;
            const chDir = decodeURIComponent(m[1]).trim();
            const fileName = m[2] + '.webp';
            // Get film ID from Chinese dir name
            const id = typeof FILM_THUMB_MAP !== 'undefined' ? FILM_THUMB_MAP[chDir] : null;
            if (!id) return PLACEHOLDER_SVG;
            // Get manifest directory key
            const mKey = (typeof FILM_ID_TO_MANIFEST !== 'undefined' ? FILM_ID_TO_MANIFEST[id] : null) || id;
            const entry = typeof IMAGES_MANIFEST !== 'undefined' ? IMAGES_MANIFEST[mKey] : null;
            if (!entry || !entry.count || !entry.files) {
              // Fallback: try film poster if film exists in FILM_DATA
              if (typeof FILM_DATA !== 'undefined') {
                const film = FILM_DATA.find(f => f.id === id);
                if (film) {
                  if (film.poster && film.poster.startsWith('images/')) return film.poster;
                  if (film.poster && film.poster.startsWith('data:')) return film.poster;
                }
              }
              return PLACEHOLDER_SVG;
            }
            if (entry.files.includes(fileName)) {
              return 'images/' + entry.dir + '/' + fileName;
            }
            return 'images/' + entry.dir + '/' + entry.files[0];
          });
        }
      });
    }
  } catch (e) {
    console.warn('fixColorData error:', e);
  }
})();

// Strip external image URLs from person data
(function fixPersonData() {
  try {
    [DIRECTOR_DATA, CINEMATOGRAPHER_DATA].forEach(arr => {
      if (!Array.isArray(arr)) return;
      arr.forEach(p => { if (p.img && (p.img.includes('wikimedia') || p.img.includes('yeguozi'))) p.img = null; });
    });
  } catch (e) {
    console.warn('fixPersonData error:', e);
  }
})();

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
      <div class="hero-stats">${FILM_DATA.length} ${lang('filmCount', { count: 3432 })}</div>
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
  let html = `
    <div class="page-header">
      <h1>${lang('films')}</h1>
      <p>64 ${lang('filmsCount', { count: FILM_DATA.length })}</p>
    </div>
    <section class="section">
      <div class="filter-bar" id="filmFilters">
        <button class="filter-btn active" data-filter="all">${lang('allRegions')}</button>
        ${regions.map(r => `<button class="filter-btn" data-filter="${r}">${r}</button>`).join('')}
      </div>
      <div class="film-grid" id="filmGrid">${FILM_DATA.map(f => filmCardHTML(f)).join('')}</div>
    </section>
  `;
  main.innerHTML = html;
  qs('#filmFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    qsa('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    qsa('.film-card').forEach(c => {
      c.style.display = filter === 'all' || c.dataset.region === filter ? '' : 'none';
    });
  });
}

function filmCardHTML(f) {
  const title = f.title[CURRENT_LANG] || f.title.en;
  return `
    <div class="film-card" data-region="${f.region[CURRENT_LANG] || f.region.en}" onclick="navigate('#/film/${f.id}')">
      <div class="film-card-img">
        <img ${imgAttr(f.screenshots?.[0] || f.poster, title)}>
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
          const thumbs = c.thumbs.slice(0, 6);
          const colorNames = c.colorNames || [];
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
                ${thumbs.map(url => `
                  <div class="color-thumb-wrap">
                    <img ${imgAttr(url, filmTitleFromThumb(url))}>
                    <span class="color-thumb-title">${filmTitleFromThumb(url)}</span>
                  </div>
                `).join('')}
              </div>
              ${colorNames.length ? `
                <div class="color-card-names">
                  ${colorNames.slice(0, 6).map(n => `<span>${n}</span>`).join('')}
                </div>
              ` : ''}
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
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substring(0,2), 16), g: parseInt(h.substring(2,4), 16), b: parseInt(h.substring(4,6), 16) };
}
function classifyHue(hex) {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const s = max === 0 ? 0 : (max - min) / max;
  if (s < 0.1 || l < 0.08) return 'mono';
  let h;
  if (max === r) h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / (max - min) + 2) * 60;
  else h = ((r - g) / (max - min) + 4) * 60;
  // Earth filter: only for low saturation warm hues (not purple)
  if (s < 0.3 && l > 0.12 && l < 0.6) {
    if (!(h >= 255 && h < 345)) return 'earth';
  }
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 75) return 'yellow';
  if (h < 165) return 'green';
  if (h < 195) return 'teal';
  if (h < 255) return 'blue';
  if (h < 345) return 'purple';
  return 'red';
}
function renderColorDetail(main, slug) {
  const color = COLORS_DATA.find(c => c.id === slug);
  if (!color) { main.innerHTML = `<div class="loading" style="padding:80px 24px"><p>Color not found</p><a href="#/colors" class="btn btn-secondary" style="margin-top:16px">← ${lang('colors')}</a></div>`; return; }
  const nameKey = color.id;
  const descKey = color.id + 'Desc';
  const name = lang(nameKey);
  const desc = lang(descKey);
  const colorNames = color.colorNames || [];
  // Build cards from curated thumbs + all screenshots from matched films
  const cards = [];
  const added = new Set();
  (color.thumbs || []).forEach(url => {
    if (added.has(url)) return;
    added.add(url);
    const film = filmFromUrl(url);
    cards.push({ url, film });
  });
  // Add all screenshots from films matching this color
  const matchedFilms = FILM_DATA.filter(f => f.colors && f.colors.some(c => classifyHue(c) === slug));
  matchedFilms.forEach(f => {
    (f.screenshots || []).forEach(url => {
      if (!url || added.has(url)) return;
      added.add(url);
      cards.push({ url, film: f });
    });
  });
  main.innerHTML = `
    <div class="page-header">
      <h1>${name}</h1>
      <p>${desc} · ${cards.length} ${lang('screenshotsCount')}</p>
    </div>
    <section class="section">
      <a href="#/colors" style="color:var(--text3);font-size:14px;display:inline-block;margin-bottom:24px">← ${lang('colors')}</a>
      ${colorNames.length ? `<div class="color-card-names" style="margin-bottom:24px">${colorNames.slice(0, 16).map(n => `<span>${n}</span>`).join('')}</div>` : ''}
      <div class="color-grid-detail">
        ${cards.map(card => {
          const colors = card.film ? (card.film.colors || []) : [];
          const title = card.film ? (card.film.title[CURRENT_LANG] || card.film.title.en) : '';
          const filmId = card.film ? card.film.id : '';
          return `
            <div class="color-detail-card">
              <div class="color-detail-img" onclick="openLightbox('${card.url}')">
                <img ${imgAttr(card.url, title)}>
              </div>
              <div class="color-detail-palette">${colors.map(c => `<a href="#/colors/${c.replace('#','')}" class="color-detail-swatch" style="background:${c}" title="${c}"></a>`).join('')}</div>
              ${title ? `<div class="color-detail-title"><a href="#/film/${filmId}">${title}</a></div>` : ''}
            </div>
          `;
        }).join('')}
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
        ${shots.map(s => `<img ${imgAttr(s, title)} style="cursor:zoom-in" onclick="openLightbox('${s}')">`).join('')}
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
