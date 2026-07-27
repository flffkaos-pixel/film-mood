/* Image manifest - maps film IDs to local image paths */
const IMAGES_MANIFEST = {
  "nostalghia-1983": { count: 54, dir: "nostalghia-1983" },
  "ivans-childhood-1962": { count: 28, dir: "ivans-childhood-1962" },
  "its-complicated-2009": { count: 38, dir: "its-complicated-2009" },
  "the-room-next-door-2024": { count: 28, dir: "the-room-next-door-2024" },
  "le-bonheur-1965": { count: 28, dir: "le-bonheur-1965" },
  "lei-a-fu-er-2011": { count: 38, dir: "lei-a-fu-er-2011" },
  "the-scent-of-green-papaya-1993": { count: 38, dir: "the-scent-of-green-papaya-1993" },
  "american-psycho-2000": { count: 28, dir: "american-psycho-2000" },
  "the-wind-will-carry-us-1999": { count: 38, dir: "the-wind-will-carry-us-1999" },
  "taste-of-cherry-1997": { count: 38, dir: "taste-of-cherry-1997" },
  "dong-tian-de-gu-shi-1992": { count: 28, dir: "dong-tian-de-gu-shi-1992" },
  "autumn-tale-1998": { count: 28, dir: "autumn-tale-1998" },
  "amour-2012": { count: 28, dir: "amour-2012" },
  "marriage-story-2019": { count: 28, dir: "marriage-story-2019" },
  "pierrot-le-fou-1965": { count: 28, dir: "pierrot-le-fou-1965" },
  "aftersun-2022": { count: 28, dir: "aftersun-2022" },
  "an-autumn-afternoon-1962": { count: 28, dir: "an-autumn-afternoon-1962" },
  "yue-sheng-wang-guo-2012": { count: 28, dir: "yue-sheng-wang-guo-2012" },
  "the-ghost-writer-2010": { count: 28, dir: "the-ghost-writer-2010" },
  "the-father-2020": { count: 38, dir: "the-father-2020" },
  "parasite-2019": { count: 28, dir: "parasite-2019" },
  "the-banishment-2007": { count: 38, dir: "jiang-ai-fang-zhu-2007" },
  "days-of-heaven-1978": { count: 38, dir: "tian-tang-zhi-ri-1978" },
  "the-sacrifice-1986": { count: 38, dir: "the-sacrifice-1986" },
  "the-green-ray-1986": { count: 28, dir: "the-green-ray-1986" },
  "the-shining-1980": { count: 28, dir: "the-shining-1980" },
  "the-grand-budapest-hotel-2014": { count: 28, dir: "the-grand-budapest-hotel-2014" },
  "the-french-dispatch-2021": { count: 28, dir: "the-french-dispatch-2021" },
  "call-me-by-your-name-2017": { count: 28, dir: "call-me-by-your-name-2017" },
  "midnight-in-paris-2011": { count: 28, dir: "midnight-in-paris-2011" },
  "her-2013": { count: 28, dir: "her-2013" },
  "i-m-still-here-2024": { count: 28, dir: "i-m-still-here-2024" },
  "fallen-leaves-2023": { count: 28, dir: "fallen-leaves-2023" },
  "parallel-mothers-2021": { count: 28, dir: "parallel-mothers-2021" },
  "paterson-2016": { count: 28, dir: "paterson-2016" },
  "portrait-of-a-lady-on-fire-2019": { count: 28, dir: "portrait-of-a-lady-on-fire-2019" },
  "the-dreamers-2003": { count: 28, dir: "the-dreamers-2003" },
  "happy-together-1997": { count: 28, dir: "chun-guang-zha-xie-1997" },
  "chungking-express-1994": { count: 28, dir: "chong-qing-sen-lin-1994" },
  "in-the-mood-for-love-2000": { count: 28, dir: "hua-yang-nian-hua-2000" },
  "the-vertical-ray-of-the-sun-2000": { count: 28, dir: "xia-tian-de-zi-wei-2000" },
  "the-hand-of-god-2021": { count: 28, dir: "the-hand-of-god-2021" },
  "drive-my-car-2021": { count: 28, dir: "drive-my-car-2021" },
  "the-worst-person-in-the-world-2021": { count: 28, dir: "the-worst-person-in-the-world-2021" },
  "faces-places-2017": { count: 28, dir: "faces-places-2017" },
  "hero-2002": { count: 28, dir: "ying-xiong-2002" },
  "still-walking-2008": { count: 28, dir: "still-walking-2008" },
  "love-in-the-afternoon-1972": { count: 28, dir: "love-in-the-afternoon-1972" },
  "the-turin-horse-2011": { count: 28, dir: "the-turin-horse-2011" },
  "three-colors-blue-1993": { count: 28, dir: "three-colors-blue-1993" },
  "the-beaches-of-agnes-2008": { count: 28, dir: "the-beaches-of-agnes-2008" },
  "ashes-of-time-1994": { count: 28, dir: "ashes-of-time-1994" },
  "red": { count: 0, dir: "red" },
  "orange": { count: 0, dir: "orange" },
  "earth": { count: 0, dir: "earth" },
  "yellow": { count: 0, dir: "yellow" },
  "green": { count: 0, dir: "green" },
  "teal": { count: 0, dir: "teal" },
  "blue": { count: 0, dir: "blue" },
  "purple": { count: 0, dir: "purple" },
  "mono": { count: 0, dir: "mono" }
};

/* Helper to get local image URL for a film */
function getLocalImages(filmId, count) {
  const entry = IMAGES_MANIFEST[filmId];
  if (!entry || entry.count === 0) return null;
  const n = Math.min(count, entry.count);
  const dir = entry.dir;
  return Array.from({length: n}, (_, i) => `images/${dir}/${String(i+1).padStart(4,'0')}.webp`);
}

/* Helper to get first local image (poster) */
function getLocalPoster(filmId) {
  const entry = IMAGES_MANIFEST[filmId];
  if (!entry || entry.count === 0) return null;
  return `images/${entry.dir}/0001.webp`;
}

/* Override pimg to prefer local images */
const _pimg = pimg;
function pimg(url) {
  return url; // No proxy - direct URLs
}