// API Base URL - will work on both localhost and Render
const API_BASE_URL = window.location.origin;

// State
let currentTab = 'popular';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const modal = document.getElementById('movieModal');
const modalDetails = document.getElementById('movieDetails');
const closeModal = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPopularMovies();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Switch Tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Update active tab button
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Load appropriate content
    if (tab === 'popular') {
        loadPopularMovies();
    } else if (tab === 'trending') {
        loadTrendingMovies();
    }
}

// Search Movies
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a movie name to search');
        return;
    }
    
    switchTab('search');
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayMovies(data.data);
        } else {
            showError(`No movies found for "${query}"`);
        }
    } catch (error) {
        showError('Failed to search movies. Please try again.');
        console.error(error);
    }
}

// Load Popular Movies
async function loadPopularMovies() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/popular`);
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.data);
        }
    } catch (error) {
        showError('Failed to load popular movies.');
        console.error(error);
    }
}

// Load Trending Movies
async function loadTrendingMovies() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/trending`);
        const data = await response.json();
        
        if (data.success) {
            displayMovies(data.data);
        }
    } catch (error) {
        showError('Failed to load trending movies.');
        console.error(error);
    }
}

// Display Movies
function displayMovies(movies) {
    hideLoading();
    hideError();
    
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => showMovieDetails(movie.id);
    
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    
    card.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">
        <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-rating">⭐ ${rating}</div>
            <div class="movie-date">${releaseYear}</div>
        </div>
    `;
    
    return card;
}

// Show Movie Details
async function showMovieDetails(movieId) {
    modal.style.display = 'block';
    modalDetails.innerHTML = '<div class="loading">Loading details...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}`);
        const data = await response.json();
        
        if (data.success) {
            displayMovieDetails(data.data);
        }
    } catch (error) {
        modalDetails.innerHTML = '<div class="error-message">Failed to load movie details.</div>';
        console.error(error);
    }
}

// Display Movie Details in Modal
function displayMovieDetails(movie) {
    const backdropUrl = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
    const releaseDate = movie.release_date || 'N/A';
    
    const genres = movie.genres 
        ? movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('')
        : '<span>No genres available</span>';
    
    modalDetails.innerHTML = `
        <div class="movie-details-header" style="background-image: url('${backdropUrl}')">
            <div class="movie-details-overlay">
                <h2 class="movie-details-title">${movie.title}</h2>
                <div class="movie-details-meta">
                    <span>⭐ ${rating}</span>
                    <span>🕐 ${runtime}</span>
                    <span>📅 ${releaseDate}</span>
                </div>
            </div>
        </div>
        <div class="movie-details-body">
            <div class="movie-details-section">
                <h3>Overview</h3>
                <p>${movie.overview || 'No overview available.'}</p>
            </div>
            <div class="movie-details-section">
                <h3>Genres</h3>
                <div class="genre-tags">${genres}</div>
            </div>
            ${movie.tagline ? `
            <div class="movie-details-section">
                <h3>Tagline</h3>
                <p><em>"${movie.tagline}"</em></p>
            </div>
            ` : ''}
        </div>
    `;
}

// Utility Functions
function showLoading() {
    loadingSpinner.style.display = 'block';
    moviesGrid.style.display = 'none';
    hideError();
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    moviesGrid.style.display = 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    hideLoading();
}

function hideError() {
    errorMessage.style.display = 'none';
}