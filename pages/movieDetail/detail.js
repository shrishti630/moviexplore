import { fetchFromAPI, endpoints, IMG_BASE } from "../../js/api.js";
import { createPosterCard, playTrailer } from "../../js/utils.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const type = params.get("type");

const castEl = document.getElementById("cast");
const crewEl = document.getElementById("crew");

async function loadDetails() {
  const d = await fetchFromAPI(endpoints.details(type, id));

  hero.style.backgroundImage = `url(${IMG_BASE}/original${d.backdrop_path})`;
  poster.src = `${IMG_BASE}/w500${d.poster_path}`;
  title.textContent = d.title || d.name;

  meta.textContent = `${(d.release_date || d.first_air_date || "").slice(
    0,
    4,
  )} • ${d.genres.map((g) => g.name).join(", ")}`;

  rating.textContent = `Rating ${d.vote_average.toFixed(1)}`;
  overview.textContent = d.overview;

  // ✅ AUTO TRAILER (now matches HTML)
  playTrailer({
    item: d,
    frameEl: trailerFrame,
    modalEl: trailerModal,
    closeBtn: closeTrailer,
  });
}

loadDetails();

async function loadSide(el, endpoint) {
  const d = await fetchFromAPI(endpoint);
  d.results.slice(0, 20).forEach((item) => {
    const card = createPosterCard(item, { compact: true });
    if (card) el.appendChild(card);
  });
}

loadSide(trendDay, endpoints.trendingDay());
loadSide(trendWeek, endpoints.trendingWeek());
loadSide(topMovies, endpoints.topRatedMovies());
loadSide(topTV, endpoints.topRatedTV());

// CREDITS
async function loadCredits() {
  const d = await fetchFromAPI(endpoints.credits(type, id));

  // CAST
  cast.innerHTML = d.cast
    .slice(0, 20)
    .map(
      (c) => `
      <div class="w-[90px] shrink-0 text-center">
        <img
          src="${c.profile_path ? IMG_BASE + "/w185" + c.profile_path : ""}"
          class="w-[90px] h-[135px] object-cover rounded-lg mb-2"
        />
        <p class="text-xs leading-tight">${c.name}</p>
        <p class="text-[11px] text-gray-400 truncate">
          ${c.character || ""}
        </p>
      </div>
    `,
    )
    .join("");

  // CREW (director / writers)
  crew.innerHTML = d.crew
    .filter((c) => ["Director", "Writer", "Screenplay"].includes(c.job))
    .slice(0, 4)
    .map(
      (c) => `
      <div class="flex items-center gap-3">
        <img
          src="${c.profile_path ? IMG_BASE + "/w92" + c.profile_path : ""}"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p class="text-sm">${c.name}</p>
          <p class="text-xs text-gray-400">${c.job}</p>
        </div>
      </div>
    `,
    )
    .join("");
}

loadCredits();
