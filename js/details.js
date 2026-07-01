/**
 * details.js
 * Logic for the movie details page and review management (Entity 2).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure we are on the details page
    if (!document.getElementById('detailsPoster')) return;

    // Get Movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    let currentMovie = getMovieById(movieId);

    if (!currentMovie) {
        alert("Filme não encontrado no seu cofre!");
        window.location.href = 'index.html';
        return;
    }

    // --- DOM Elements ---
    // Movie Details Elements
    const detailsPoster = document.getElementById('detailsPoster');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsYear = document.getElementById('detailsYear');
    const detailsGenre = document.getElementById('detailsGenre');
    const detailsStatus = document.getElementById('detailsStatus');

    // Actions
    const editMovieBtn = document.getElementById('editMovieBtn');
    const deleteMovieBtn = document.getElementById('deleteMovieBtn');
    
    // Edit Modal Elements
    const movieModal = document.getElementById('movieModal');
    const closeMovieModalBtn = document.getElementById('closeMovieModalBtn');
    const movieForm = document.getElementById('movieForm');

    // Review Elements
    const reviewContainer = document.getElementById('reviewContainer');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModalBtn = document.getElementById('closeReviewModal');
    const reviewForm = document.getElementById('reviewForm');

    // --- Render Functions ---

    function renderMovieDetails() {
        currentMovie = getMovieById(movieId); // Refresh data
        
        detailsPoster.src = currentMovie.posterUrl;
        detailsPoster.onerror = function() { this.src = 'https://via.placeholder.com/300x450?text=Sem+Poster'; };
        
        detailsTitle.textContent = currentMovie.title;
        detailsYear.innerHTML = `<i class="fa-regular fa-calendar" aria-hidden="true"></i> ${currentMovie.year}`;
        detailsGenre.innerHTML = `<i class="fa-solid fa-tag" aria-hidden="true"></i> ${currentMovie.genre}`;
        
        const badgeClass = currentMovie.status === 'watched' ? 'badge-watched' : 'badge-plan';
        const statusText = currentMovie.status === 'watched' ? 'Assistido' : 'Quero Assistir';
        detailsStatus.className = `badge ${badgeClass}`;
        detailsStatus.textContent = statusText;
    }

    function renderReviews() {
        const reviews = getReviewsByMovieId(movieId);
        reviewContainer.innerHTML = '';

        // If the movie hasn't been watched yet, show a prompt instead of the review
        if (currentMovie.status === 'plan') {
            reviewContainer.innerHTML = `
                <div class="empty-state" role="alert" style="padding: 20px;">
                    <i class="fa-solid fa-eye-slash" aria-hidden="true" style="font-size: 2.5rem;"></i>
                    <h3 style="font-size: 1.2rem; margin-top: 10px;">Você ainda não assistiu</h3>
                    <p style="font-size: 0.95rem; margin-bottom: 20px;">Assista ao filme para poder avaliá-lo!</p>
                    <div style="display: flex; justify-content: center; width: 100%;">
                        <button class="btn btn-primary" id="markWatchedBtn" style="width: auto; padding: 8px 16px;">
                            <i class="fa-solid fa-check" aria-hidden="true"></i> Já Assisti!
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('markWatchedBtn').addEventListener('click', () => {
                currentMovie.status = 'watched';
                saveMovie(currentMovie);
                renderMovieDetails();
                renderReviews();
            });
            return;
        }

        if (reviews.length === 0) {
            reviewContainer.innerHTML = `
                <div class="empty-state" role="alert" style="padding: 20px;">
                    <i class="fa-regular fa-comment-dots" aria-hidden="true" style="font-size: 2.5rem;"></i>
                    <h3 style="font-size: 1.2rem; margin-top: 10px;">Sua avaliação está vazia</h3>
                    <p style="font-size: 0.95rem; margin-bottom: 20px;">O que você achou deste filme?</p>
                    <div style="display: flex; justify-content: center; width: 100%;">
                        <button class="btn btn-primary" id="addReviewBtn" style="width: auto; padding: 8px 16px;">
                            <i class="fa-solid fa-plus" aria-hidden="true"></i> Escrever Avaliação
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('addReviewBtn').addEventListener('click', () => {
                reviewForm.reset();
                document.getElementById('reviewId').value = '';
                reviewModal.classList.add('active');
            });
            return;
        }

        // 1-to-1: Só importa a primeira (e única) avaliação do usuário
        const review = reviews[0];
        const date = new Date(review.timestamp).toLocaleDateString();
        
        let starsHtml = '';
        for(let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                starsHtml += '<i class="fa-solid fa-star star"></i>';
            } else {
                starsHtml += '<i class="fa-solid fa-star star-empty"></i>';
            }
        }

        reviewContainer.innerHTML = `
            <div class="review-card" style="margin-bottom: 0; background: rgba(255,255,255,0.02); border: none;">
                <div class="review-content" style="flex-grow: 1;">
                    <h4 aria-label="Nota: ${review.rating} de 5" style="font-size: 1.5rem; justify-content: center; margin-bottom: 15px;">${starsHtml}</h4>
                    <p style="font-size: 1.1rem; font-style: italic; text-align: center;">"${review.comment.replace(/\n/g, '<br>')}"</p>
                    <span class="review-date" style="text-align: center; margin-top: 15px; display: block;">Adicionado em: ${date}</span>
                </div>
            </div>
            <div class="action-buttons" style="margin-top: 25px;">
                <button class="btn btn-secondary" id="editReviewBtn" aria-label="Editar avaliação">
                    <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteReviewHandler('${review.id}')" aria-label="Excluir avaliação">
                    <i class="fa-solid fa-trash" aria-hidden="true"></i> Excluir
                </button>
            </div>
        `;

        document.getElementById('editReviewBtn').addEventListener('click', () => {
            document.getElementById('reviewId').value = review.id;
            document.getElementById('rating').value = review.rating;
            document.getElementById('comment').value = review.comment;
            reviewModal.classList.add('active');
        });
    }

    window.deleteReviewHandler = (id) => {
        if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
            deleteReview(id);
            renderReviews();
        }
    };

    // --- Movie Actions ---
    
    deleteMovieBtn.addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja remover "${currentMovie.title}" do seu cofre? Todas as avaliações também serão excluídas.`)) {
            deleteMovie(movieId);
            window.location.href = 'index.html';
        }
    });

    // Edit Movie Modal
    editMovieBtn.addEventListener('click', () => {
        document.getElementById('movieId').value = currentMovie.id;
        document.getElementById('title').value = currentMovie.title;
        document.getElementById('genre').value = currentMovie.genre;
        document.getElementById('year').value = currentMovie.year;
        document.getElementById('posterUrl').value = currentMovie.posterUrl;
        document.getElementById('status').value = currentMovie.status;
        
        movieModal.classList.add('active');
    });

    function closeMovieModal() {
        movieModal.classList.remove('active');
    }

    closeMovieModalBtn.addEventListener('click', closeMovieModal);
    movieModal.addEventListener('click', (e) => { if (e.target === movieModal) closeMovieModal(); });

    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedMovie = {
            id: document.getElementById('movieId').value,
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            year: document.getElementById('year').value,
            posterUrl: document.getElementById('posterUrl').value,
            status: document.getElementById('status').value,
        };
        saveMovie(updatedMovie);
        closeMovieModal();
        renderMovieDetails();
        renderReviews();
    });

    // --- Review Actions ---

    function closeReviewModal() {
        reviewModal.classList.remove('active');
    }

    closeReviewModalBtn.addEventListener('click', closeReviewModal);
    reviewModal.addEventListener('click', (e) => { if (e.target === reviewModal) closeReviewModal(); });

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const review = {
            movieId: movieId,
            rating: parseInt(document.getElementById('rating').value),
            comment: document.getElementById('comment').value
        };
        saveReview(review);
        closeReviewModal();
        renderReviews();
    });

    // --- Initialize ---
    renderMovieDetails();
    renderReviews();
});
