// src/js/api.js
export const API_KEY = "ebebaa4e1c1f674960765b6b264715d0";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

export async function fetchFromAPI(path) {
  const joiner = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}${path}${joiner}api_key=${API_KEY}`);
  if (!res.ok) throw new Error("TMDB API error");
  return res.json();
}

export const endpoints = {
  trendingDay: () => `/trending/all/day`,
  trendingWeek: () => `/trending/all/week`,

  popularMovies: (page = 1) => `/movie/popular?page=${page}`,
  popularTV: (page = 1) => `/tv/popular?page=${page}`,

  topRatedMovies: () => `/movie/top_rated`,
  topRatedTV: () => `/tv/top_rated`,

  nowPlayingMovies: (page = 1) => `/movie/now_playing?page=${page}`,
  onAirTV: (page = 1) => `/tv/on_the_air?page=${page}`,

  searchMulti: (q, page = 1) =>
    `/search/multi?query=${encodeURIComponent(q)}&page=${page}`,
  searchMovies: (q, page = 1) =>
    `/search/movie?query=${encodeURIComponent(q)}&page=${page}`,
  searchTV: (q, page = 1) =>
    `/search/tv?query=${encodeURIComponent(q)}&page=${page}`,

  details: (type, id) => `/${type}/${id}?append_to_response=videos`,
  credits: (type, id) => `/${type}/${id}/credits`,

  freeMovies: () => `/discover/movie?with_watch_monetization_types=free`,
  freeTV: () => `/discover/tv?with_watch_monetization_types=free`,

  watchProviders: (type, id) => `/${type}/${id}/watch/providers`,
  videos: (type, id) => `/${type}/${id}/videos`,
};
