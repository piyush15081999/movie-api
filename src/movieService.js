const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Search for movies
async function searchMovies(query) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        language: 'en-US',
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to search movies: ' + error.message);
  }
}

// Get movie details by ID
async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get movie details: ' + error.message);
  }
}

// Get popular movies
async function getPopularMovies() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to get popular movies: ' + error.message);
  }
}

// Get trending movies
async function getTrendingMovies() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to get trending movies: ' + error.message);
  }
}

// Get movie recommendations
async function getMovieRecommendations(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/recommendations`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to get recommendations: ' + error.message);
  }
}

module.exports = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTrendingMovies,
  getMovieRecommendations
};