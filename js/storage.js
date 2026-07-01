/**
 * storage.js
 * Gerencia a persistência no LocalStorage para Filmes e Avaliações (2 entidades).
 */

const MOVIES_KEY = 'cinevault_movies';
const REVIEWS_KEY = 'cinevault_reviews';

// --- CRUD DE FILMES ---

function getMovies() {
    const movies = localStorage.getItem(MOVIES_KEY);
    return movies ? JSON.parse(movies) : [];
}

function saveMovie(movie) {
    const movies = getMovies();
    if (movie.id) {
        // Editar existente
        const index = movies.findIndex(m => m.id === movie.id);
        if (index !== -1) {
            movies[index] = movie;
        }
    } else {
        // Adicionar novo
        movie.id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9); // Gerar ID único
        movies.push(movie);
    }
    localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
    return movie;
}

function getMovieById(id) {
    const movies = getMovies();
    return movies.find(m => m.id === id);
}

function deleteMovie(id) {
    let movies = getMovies();
    movies = movies.filter(m => m.id !== id);
    localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
    
    // Deletar também todas as avaliações associadas (Exclusão em cascata)
    let reviews = getReviews();
    reviews = reviews.filter(r => r.movieId !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}


// --- CRUD DE AVALIAÇÕES (Segunda Entidade) ---

function getReviews() {
    const reviews = localStorage.getItem(REVIEWS_KEY);
    return reviews ? JSON.parse(reviews) : [];
}

function getReviewsByMovieId(movieId) {
    const reviews = getReviews();
    return reviews.filter(r => r.movieId === movieId).sort((a, b) => b.timestamp - a.timestamp);
}

function saveReview(review) {
    const reviews = getReviews();
    if (review.id) {
        const index = reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
            reviews[index] = review;
        }
    } else {
        review.id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
        review.timestamp = Date.now();
        reviews.push(review);
    }
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return review;
}

function deleteReview(id) {
    let reviews = getReviews();
    reviews = reviews.filter(r => r.id !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}


