require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movieService = require('./movieService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Movie Database API!',
    endpoints: {
      search: '/api/movies/search?q=movie_name',
      details: '/api/movies/:id',
      popular: '/api/movies/popular',
      trending: '/api/movies/trending',
      recommendations: '/api/movies/:id/recommendations'
    }
  });
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ error: 'Please provide a search query (?q=movie_name)' });
    }
    
    const movies = await movieService.searchMovies(query);
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get movie details
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await movieService.getMovieDetails(movieId);
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get popular movies
app.get('/api/movies/popular', async (req, res) => {
  try {
    const movies = await movieService.getPopularMovies();
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get trending movies
app.get('/api/movies/trending', async (req, res) => {
  try {
    const movies = await movieService.getTrendingMovies();
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get movie recommendations
app.get('/api/movies/:id/recommendations', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movies = await movieService.getMovieRecommendations(movieId);
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movie API is running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
});