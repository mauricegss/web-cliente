/**
 * app.js
 * Logic for the main page (index.html).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on index.html
    if (!document.getElementById('movieGrid')) return;

    // --- DOM Elements ---
    const movieGrid = document.getElementById('movieGrid');
    const searchInput = document.getElementById('searchInput');
    const filterContainer = document.getElementById('filterContainer');

    // Modal Elements
    const addMovieBtn = document.getElementById('addMovieBtn');
    const movieModal = document.getElementById('movieModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const movieForm = document.getElementById('movieForm');

    // --- State ---
    let currentFilter = 'all';
    let searchQuery = '';

    // --- Render Functions ---
    function renderMovies() {
        const movies = getMovies();

        // Apply filters and search
        const filtered = movies.filter(movie => {
            const matchesFilter = currentFilter === 'all' || movie.status === currentFilter;
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery) ||
                movie.genre.toLowerCase().includes(searchQuery);
            return matchesFilter && matchesSearch;
        });

        movieGrid.innerHTML = '';

        if (filtered.length === 0) {
            movieGrid.innerHTML = `
                <div class="empty-state" role="alert">
                    <i class="fa-solid fa-film" aria-hidden="true"></i>
                    <h3>Nenhum filme encontrado</h3>
                    <p>Tente ajustar sua busca ou adicione um novo filme ao seu cofre.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(movie => {
            const badgeClass = movie.status === 'watched' ? 'badge-watched' : 'badge-plan';
            const statusText = movie.status === 'watched' ? 'Assistido' : 'Quero Assistir';

            // Fallback for broken images
            const imgHtml = `<img src="${movie.posterUrl}" alt="Pôster de ${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=Sem+Poster'">`;

            const card = document.createElement('div');
            card.className = 'movie-card';
            card.onclick = () => {
                window.location.href = `details.html?id=${movie.id}`;
            };

            card.innerHTML = `
                ${imgHtml}
                <div class="movie-overlay">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-info-row">
                        <span>${movie.year} &bull; ${movie.genre}</span>
                        <span class="badge ${badgeClass}">${statusText}</span>
                    </div>
                </div>
            `;
            movieGrid.appendChild(card);
        });
    }

    // --- Event Listeners ---

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderMovies();
    });

    // Filters
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active class
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = e.target.getAttribute('data-filter');
            renderMovies();
        }
    });

    // Carousel Logic
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    function updateCarouselButtons() {
        if (prevBtn && nextBtn) {
            // Check if there are enough items to actually overflow the flex container
            if (movieGrid.scrollWidth > movieGrid.clientWidth) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                carouselWrapper.style.justifyContent = 'flex-start';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                carouselWrapper.style.justifyContent = 'center'; // Center the items if they don't overflow
            }
        }
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (movieGrid.scrollWidth > movieGrid.clientWidth) {
                const firstChild = movieGrid.firstElementChild;
                movieGrid.appendChild(firstChild);
            }
        });

        prevBtn.addEventListener('click', () => {
            if (movieGrid.scrollWidth > movieGrid.clientWidth) {
                const lastChild = movieGrid.lastElementChild;
                movieGrid.insertBefore(lastChild, movieGrid.firstElementChild);
            }
        });

        window.addEventListener('resize', updateCarouselButtons);
    }

    // Modal Logic
    function openModal() {
        movieForm.reset();
        document.getElementById('movieId').value = ''; // Ensure it's a new entry
        movieModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        movieModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    addMovieBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) closeModal();
    });

    // Form Submission
    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const movie = {
            id: document.getElementById('movieId').value || undefined,
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            year: document.getElementById('year').value,
            posterUrl: document.getElementById('posterUrl').value,
            status: document.getElementById('status').value,
        };

        saveMovie(movie);
        closeModal();
        renderMovies();
    });

    // Initial Render
    renderMovies();
    updateCarouselButtons(); // check buttons on load
});
