// src/js/utils.js
import { IMG_BASE } from "./api.js";
import { fetchFromAPI, endpoints } from "./api.js";

/* ---------- trailer ---------- */
const playTrailerBtn = document.getElementById("playTrailer");
export async function playTrailer({ item, frameEl, modalEl, closeBtn }) {
  const type = item.title ? "movie" : "tv";

  const d = await fetchFromAPI(endpoints.videos(type, item.id));

  const trailer = d.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );

  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  frameEl.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

  modalEl.classList.remove("hidden");
  modalEl.classList.add("flex");

  closeBtn.onclick = () => {
    frameEl.src = "";
    modalEl.classList.add("hidden");
    modalEl.classList.remove("flex");
  };
}

/* ---------- helpers ---------- */
export function getMediaType(item) {
  return item.title ? "movie" : "tv";
}

export function goToDetail(item) {
  const type = getMediaType(item);
  location.href = `/pages/movieDetail/movieDetail.html?id=${item.id}&type=${type}`;
}

/* ---------- cards ---------- */
export function createPosterCard(item, { compact = false } = {}) {
  if (!item.poster_path) return null;

  const card = document.createElement("div");
  card.className = compact
    ? "w-[90px] shrink-0 cursor-pointer"
    : "min-w-[180px] bg-[#141c2f] border border-[#1f2a44] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105";

  card.innerHTML = `
    <img
      src="${IMG_BASE}/w500${item.poster_path}"
      class="w-full ${compact ? "h-[135px]" : "h-[280px]"} object-cover rounded-lg"
    />
    ${
      compact
        ? ""
        : `<div class="p-3">
            <div class="text-sm font-medium truncate">${item.title || item.name}</div>
            <div class="text-xs text-gray-400">
              Rating ${item.vote_average.toFixed(1)}
            </div>
          </div>`
    }
  `;

  card.onclick = () => goToDetail(item);
  return card;
}

export function renderList(container, items, options) {
  items.forEach((item) => {
    if (item.media_type === "person") return;
    const card = createPosterCard(item, options);
    if (card) container.appendChild(card);
  });
}

/* ---------- search ---------- */
export function setupSearch({ onSearch }) {
  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchBtn");
  if (!input || !button) return;

  const run = () => onSearch(input.value.trim());

  button.onclick = run;
  input.onkeyup = (e) => e.key === "Enter" && run();
}

/* ---------- infinite scroll ---------- */
export function setupInfiniteScroll(callback) {
  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) callback();
  });
}

export async function appendFreeProviders(item, type, card) {
  const data = await fetchFromAPI(`/${type}/${item.id}/watch/providers`);

  const providers =
    data.results?.IN?.flatrate || data.results?.US?.flatrate || [];

  if (!providers.length) return;

  const row = document.createElement("div");
  row.className = "flex gap-2 mt-2 items-center";

  providers.slice(0, 3).forEach((p) => {
    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w45${p.logo_path}`;
    img.className = "w-5 h-5";
    img.title = p.provider_name;
    row.appendChild(img);
  });

  card.querySelector(".p-3, .p-4")?.appendChild(row);
}
