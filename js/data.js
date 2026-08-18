var FILM_DATA = [];

const DIRECTOR_DATA = [
  { name: { en: "Abbas Kiarostami", ko: "압바스 키아로스타미", zh: "阿巴斯·基亚罗斯塔米" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Abbas_Kiarostami-Murcia_%28cropped%29.jpg/330px-Abbas_Kiarostami-Murcia_%28cropped%29.jpg" },
  { name: { en: "Alfred Hitchcock", ko: "알프레드 히치콕", zh: "阿尔弗雷德·希区柯克" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Hitchcock%2C_Alfred_02.jpg/330px-Hitchcock%2C_Alfred_02.jpg" },
  { name: { en: "Alfonso Cuarón", ko: "알폰소 쿠아론", zh: "阿方索·卡隆" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Alfonso_Cuar%C3%B3n_2013_%28cropped%29.jpg/330px-Alfonso_Cuar%C3%B3n_2013_%28cropped%29.jpg" },
  { name: { en: "Aki Kaurismäki", ko: "아키 카우리스마키", zh: "阿基·考里斯马基" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Aki_Kaurism%C3%A4ki_at_Berlinale_2017.jpg/330px-Aki_Kaurism%C3%A4ki_at_Berlinale_2017.jpg" },
  { name: { en: "Éric Rohmer", ko: "에릭 로메르", zh: "埃里克·侯麦" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Eric_Rohmer_cinematheque_2004-04.jpg/330px-Eric_Rohmer_cinematheque_2004-04.jpg" },
  { name: { en: "Andrei Tarkovsky", ko: "안드레이 타르콥스키", zh: "安德烈·塔可夫斯基" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Andrei_tarkovsky_stamp_russia_2007.jpg/330px-Andrei_tarkovsky_stamp_russia_2007.jpg" }
];

const CINEMATOGRAPHER_DATA = [
  { name: { en: "Stephen A. Rotter", ko: "스티븐 A. 로터", zh: "史蒂芬·A·罗特尔" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Stephen_A._Rotter_2024.jpg/330px-Stephen_A._Rotter_2024.jpg" },
  { name: { en: "Abbas Kiarostami", ko: "압바스 키아로스타미", zh: "阿巴斯·基亚罗斯塔米" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Abbas_Kiarostami-Murcia_%28cropped%29.jpg/330px-Abbas_Kiarostami-Murcia_%28cropped%29.jpg" },
  { name: { en: "Alfonso Cuarón", ko: "알폰소 쿠아론", zh: "阿方索·卡隆" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Alfonso_Cuar%C3%B3n_2013_%28cropped%29.jpg/330px-Alfonso_Cuar%C3%B3n_2013_%28cropped%29.jpg" },
  { name: { en: "Affonso Beato", ko: "아폰소 베아토", zh: "Beato" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Affonso_Beato.jpg/330px-Affonso_Beato.jpg" },
  { name: { en: "Eduardo Grau", ko: "에두아르도 그라우", zh: "爱德华·格罗" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Eduardo_Grau.jpg/330px-Eduardo_Grau.jpg" },
  { name: { en: "Andrzej Sekuła", ko: "안제이 세쿠와", zh: "安德列·塞库拉" }, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Andrzej_Seku%C5%82a_2021.jpg/330px-Andrzej_Seku%C5%82a_2021.jpg" }
];

const ACADEMY_DATA = [
  { year: 2025, chineseTitle: "罪人", englishTitle: "Sinners", cinematographer: "Autumn Durald Arkapaw", award: "Winner" },
  { year: 2024, chineseTitle: "粗野派", englishTitle: "The Brutalist", cinematographer: "Lol Crawley", award: "Winner" },
  { year: 2023, chineseTitle: "奥本海默", englishTitle: "Oppenheimer", cinematographer: "Hoyte van Hoytema", award: "Winner" },
  { year: 2022, chineseTitle: "西线无战事", englishTitle: "All Quiet on the Western Front", cinematographer: "James Friend", award: "Winner" },
  { year: 2021, chineseTitle: "沙丘", englishTitle: "Dune", cinematographer: "Greig Fraser", award: "Winner" },
  { year: 2020, chineseTitle: "曼克", englishTitle: "Mank", cinematographer: "Erik Messerschmidt", award: "Winner" },
  { year: 2019, chineseTitle: "一九一七", englishTitle: "1917", cinematographer: "Roger Deakins", award: "Winner" },
  { year: 2018, chineseTitle: "罗马", englishTitle: "Roma", cinematographer: "Alfonso Cuarón", award: "Winner" },
  { year: 2017, chineseTitle: "银翼杀手2049", englishTitle: "Blade Runner 2049", cinematographer: "Roger Deakins", award: "Winner" },
  { year: 2016, chineseTitle: "爱乐之城", englishTitle: "La La Land", cinematographer: "Linus Sandgren", award: "Winner" },
  { year: 2015, chineseTitle: "荒野猎人", englishTitle: "The Revenant", cinematographer: "Emmanuel Lubezki", award: "Winner" },
  { year: 2014, chineseTitle: "鸟人", englishTitle: "Birdman", cinematographer: "Emmanuel Lubezki", award: "Winner" },
  { year: 2013, chineseTitle: "地心引力", englishTitle: "Gravity", cinematographer: "Emmanuel Lubezki", award: "Winner" },
  { year: 2012, chineseTitle: "少年派的奇幻漂流", englishTitle: "Life of Pi", cinematographer: "Claudio Miranda", award: "Winner" },
  { year: 2011, chineseTitle: "雨果", englishTitle: "Hugo", cinematographer: "Robert Richardson", award: "Winner" },
  { year: 2010, chineseTitle: "盗梦空间", englishTitle: "Inception", cinematographer: "Wally Pfister", award: "Winner" },
  { year: 2009, chineseTitle: "阿凡达", englishTitle: "Avatar", cinematographer: "Mauro Fiore", award: "Winner" },
  { year: 2008, chineseTitle: "贫民窟的百万富翁", englishTitle: "Slumdog Millionaire", cinematographer: "Anthony Dod Mantle", award: "Winner" },
  { year: 2007, chineseTitle: "血色将至", englishTitle: "There Will Be Blood", cinematographer: "Robert Elswit", award: "Winner" },
  { year: 2006, chineseTitle: "潘神的迷宫", englishTitle: "Pan's Labyrinth", cinematographer: "Guillermo Navarro", award: "Winner" },
  { year: 2005, chineseTitle: "艺伎回忆录", englishTitle: "Memoirs of a Geisha", cinematographer: "Dion Beebe", award: "Winner" },
  { year: 2004, chineseTitle: "飞行家", englishTitle: "The Aviator", cinematographer: "Robert Richardson", award: "Winner" },
  { year: 2003, chineseTitle: "怒海争锋", englishTitle: "Master and Commander", cinematographer: "Russell Boyd", award: "Winner" },
  { year: 2002, chineseTitle: "毁灭之路", englishTitle: "Road to Perdition", cinematographer: "Conrad Hall", award: "Winner" },
  { year: 2001, chineseTitle: "魔戒首部曲", englishTitle: "The Lord of the Rings", cinematographer: "Andrew Lesnie", award: "Winner" },
  { year: 2000, chineseTitle: "卧虎藏龙", englishTitle: "Crouching Tiger, Hidden Dragon", cinematographer: "Peter Pau", award: "Winner" },
  { year: 1999, chineseTitle: "美国丽人", englishTitle: "American Beauty", cinematographer: "Conrad L. Hall", award: "Winner" },
  { year: 1998, chineseTitle: "拯救大兵瑞恩", englishTitle: "Saving Private Ryan", cinematographer: "Janusz Kamiński", award: "Winner" },
  { year: 1997, chineseTitle: "泰坦尼克号", englishTitle: "Titanic", cinematographer: "Russell Carpenter", award: "Winner" },
  { year: 1996, chineseTitle: "英国病人", englishTitle: "The English Patient", cinematographer: "John Seale", award: "Winner" },
  { year: 1995, chineseTitle: "勇敢的心", englishTitle: "Braveheart", cinematographer: "John Toll", award: "Winner" },
  { year: 1994, chineseTitle: "燃情岁月", englishTitle: "Legends of the Fall", cinematographer: "John Toll", award: "Winner" },
  { year: 1993, chineseTitle: "辛德勒的名单", englishTitle: "Schindler's List", cinematographer: "Janusz Kamiński", award: "Winner" },
  { year: 1992, chineseTitle: "大河恋", englishTitle: "A River Runs Through It", cinematographer: "Philippe Rousselot", award: "Winner" }
];

if (typeof module !== "undefined") {
  module.exports = { FILM_DATA, COLORS_DATA, DIRECTOR_DATA, CINEMATOGRAPHER_DATA, ACADEMY_DATA };
}










