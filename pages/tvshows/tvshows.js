import { fetchFromAPI, endpoints } from "../../js/api.js";
import {
  renderList,
  setupInfiniteScroll,
  setupSearch,
} from "../../js/utils.js";

const container = document.getElementById("movies");
let page = 1;
let totalPages = 1;
let query = "";

async function load(reset = false) {
  if (reset) {
    page = 1;
    container.innerHTML = "";
  }

  const d = query
    ? await fetchFromAPI(endpoints.searchTV(query, page))
    : await fetchFromAPI(endpoints.onAirTV(page));

  totalPages = d.total_pages;
  renderList(container, d.results);
}

setupSearch({
  onSearch: (q) => {
    query = q;
    load(true);
  },
});

setupInfiniteScroll(() => {
  if (page < totalPages) {
    page++;
    load();
  }
});

load(true);

async function loadPopularTVSlider() {
  const container = document.getElementById("popularTv");
  if (!container) return;

  const d = await fetchFromAPI(endpoints.popularTV());
  renderList(container, d.results);
}
loadPopularTVSlider();
