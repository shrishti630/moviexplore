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

  const data = query
    ? await fetchFromAPI(endpoints.searchMovies(query, page))
    : await fetchFromAPI(endpoints.nowPlayingMovies(page));

  totalPages = data.total_pages;
  renderList(container, data.results);
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

async function loadPopularMoviesSlider() {
  const container = document.getElementById("popularMovies");
  if (!container) return; // page safety

  const d = await fetchFromAPI(endpoints.popularMovies());
  renderList(container, d.results);
}
loadPopularMoviesSlider();
