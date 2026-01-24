//src/pages/home/home.js
import { fetchFromAPI, endpoints, IMG_BASE } from "../../js/api.js";
import { createPosterCard, renderList, getMediaType } from "../../js/utils.js";
import { appendFreeProviders } from "../../js/utils.js";
import { playTrailer } from "../../js/utils.js";
const playTrailerBtn = document.getElementById("playTrailer");

let freeType = "movie";

async function loadFreeToWatch(type = "movie") {
  freeType = type;
  updateFreeToggleUI(type);

  const d = await fetchFromAPI(
    type === "movie" ? endpoints.freeMovies() : endpoints.freeTV(),
  );

  freeToWatch.innerHTML = "";

  d.results.forEach((item) => {
    const card = createPosterCard(item);
    if (!card) return;

    appendFreeProviders(item, type, card);
    freeToWatch.appendChild(card);
  });
}

// default
loadFreeToWatch("movie");

freeMoviesBtn.onclick = () => loadFreeToWatch("movie");
freeTvBtn.onclick = () => loadFreeToWatch("tv");

/* ---------- STATE ---------- */
let heroItems = [];
let activeIndex = 0;
let currentQuery = "";
let currentPage = 1;

/* ---------- HEADER SHADOW ---------- */
const header = document.getElementById("appHeader");
window.addEventListener("scroll", () => {
  header.classList.toggle("bg-[rgba(11,18,32,0.92)]", window.scrollY > 20);
});

/* ---------- HERO ---------- */
async function loadHero() {
  const d = await fetchFromAPI(endpoints.trendingWeek());
  heroItems = d.results.filter((i) => i.backdrop_path && i.overview);

  setHero(heroItems[0]);
  buildHeroDots();
  autoSlideHero();
}
loadHero();

function setHero(item) {
  const type = getMediaType(item);

  heroBackdrop.src = `${IMG_BASE}/original${item.backdrop_path}`;
  heroTitle.textContent = item.title || item.name;
  heroMeta.textContent = `${type.toUpperCase()} • Rating ${item.vote_average.toFixed(1)}`;
  heroOverview.textContent = item.overview;

  moreInfo.onclick = () =>
    (location.href = `../movieDetail/movieDetail.html?id=${item.id}&type=${type}`);

  playTrailerBtn.onclick = () =>
    playTrailer({
      item,
      frameEl: trailerFrame,
      modalEl: trailerModal,
      closeBtn: closeTrailer,
    });
}

function buildHeroDots() {
  heroDots.innerHTML = "";
  heroItems.slice(0, 6).forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "w-2.5 h-2.5 rounded-full bg-white/40";
    dot.onclick = () => {
      activeIndex = idx;
      setHero(heroItems[idx]);
      updateDots();
    };
    heroDots.appendChild(dot);
  });
  updateDots();
}

function updateDots() {
  [...heroDots.children].forEach((d, i) => {
    d.classList.toggle("bg-white", i === activeIndex);
    d.classList.toggle("bg-white/40", i !== activeIndex);
  });
}

function autoSlideHero() {
  setInterval(() => {
    activeIndex = (activeIndex + 1) % heroItems.length;
    setHero(heroItems[activeIndex]);
    updateDots();
  }, 6000);
}

/* ---------- TRENDING TOGGLE ---------- */
async function loadTrending(type = "day") {
  updateTrendingToggleUI(type);

  const d = await fetchFromAPI(
    type === "day" ? endpoints.trendingDay() : endpoints.trendingWeek(),
  );

  trending.innerHTML = "";
  renderList(trending, d.results);
}

trendTodayBtn.onclick = () => loadTrending("day");
trendWeekBtn.onclick = () => loadTrending("week");
loadTrending("day");

/* ---------- SECTIONS ---------- */
fetchFromAPI(endpoints.popularMovies()).then((d) =>
  renderList(popularMovies, d.results),
);
fetchFromAPI(endpoints.popularTV()).then((d) =>
  renderList(popularTv, d.results),
);
fetchFromAPI(endpoints.topRatedMovies()).then((d) =>
  renderList(topRated, d.results),
);
fetchFromAPI(endpoints.topRatedTV()).then((d) =>
  renderList(topRatedTv, d.results),
);

/* ---------- SEARCH (HOME) ---------- */
searchBtn.onclick = async () => {
  currentQuery = searchInput.value.trim();
  if (!currentQuery) return;

  const d = await fetchFromAPI(endpoints.searchMulti(currentQuery));

  searchResults.innerHTML = "";
  renderList(searchResults, d.results);
  searchSection.classList.remove("hidden");
};

function updateTrendingToggleUI(type) {
  const pill = document.getElementById("trendingTogglePill");
  const todayBtn = document.getElementById("trendTodayBtn");
  const weekBtn = document.getElementById("trendWeekBtn");

  todayBtn.classList.remove("text-black");
  weekBtn.classList.remove("text-black");
  todayBtn.classList.add("text-white");
  weekBtn.classList.add("text-white");

  if (type === "day") {
    pill.style.left = "4px";
    todayBtn.classList.replace("text-white", "text-black");
  } else {
    pill.style.left = "calc(50% + 2px)";
    weekBtn.classList.replace("text-white", "text-black");
  }
}

function updateFreeToggleUI(type) {
  const pill = document.getElementById("freeTogglePill");
  const movieBtn = document.getElementById("freeMoviesBtn");
  const tvBtn = document.getElementById("freeTvBtn");

  movieBtn.classList.remove("text-black");
  tvBtn.classList.remove("text-black");
  movieBtn.classList.add("text-white");
  tvBtn.classList.add("text-white");

  if (type === "movie") {
    pill.style.left = "4px";
    movieBtn.classList.replace("text-white", "text-black");
  } else {
    pill.style.left = "calc(50% + 2px)";
    tvBtn.classList.replace("text-white", "text-black");
  }
}

viewAllSearch.onclick = () => openFullSearchView();

function openFullSearchView() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="searchOverlay"
      class="fixed inset-0 z-[3000] bg-[#0b1220] text-gray-200 overflow-y-auto">
      <header class="sticky top-0 bg-[#0b1220] border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h2 class="text-lg font-medium">
          Search Results for "${currentQuery}"
        </h2>
        <button id="closeSearchOverlay"
          class="text-sm text-gray-400 hover:text-white">
          Close ✕
        </button>
      </header>

      <main class="px-6 py-6">
        <div id="fullSearchResults"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        </div>
      </main>
    </div>
  `,
  );

  currentPage = 1;
  loadMoreSearchResults();

  document.getElementById("closeSearchOverlay").onclick = closeFullSearchView;
}

async function loadMoreSearchResults() {
  const d = await fetchFromAPI(
    endpoints.searchMulti(currentQuery, currentPage),
  );

  d.results.forEach((item) => {
    if (item.media_type === "person") return;
    const card = createPosterCard(item);
    if (card) fullSearchResults.appendChild(card);
  });
}

function closeFullSearchView() {
  document.getElementById("searchOverlay")?.remove();
}
