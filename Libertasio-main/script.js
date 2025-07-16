// script.js

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get the container where the main article grid will be displayed
    const articlesContainer = document.getElementById('articles-container');
    // Get the container for the featured articles carousel
    const featuredArticleContainer = document.getElementById('featured-article-container');

    let currentSlide = 0; // Tracks the current slide index in the carousel
    let slideInterval;    // Variable to hold the interval for automatic sliding

    /**
     * Fetches the articles data from the 'articles.json' file.
     * Handles potential network errors during the fetch operation.
     */
    async function fetchArticles() {
        try {
            // Attempt to fetch the JSON file
            const response = await fetch('articles.json');
            // Check if the response was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON response into a JavaScript object
            const articles = await response.json();
            // Call the function to display the fetched articles
            displayArticles(articles);
        } catch (error) {
            // Log any errors to the console
            console.error('Error fetching articles:', error);
            // Display a user-friendly error message on the page
            articlesContainer.innerHTML = '<p class="text-red-600 text-center">Failed to load articles. Please try again later.</p>';
            featuredArticleContainer.innerHTML = ''; // Clear featured section too
        }
    }

    /**
     * Displays the given array of articles on the page.
     * Sorts articles by date, displays the top 3 as a carousel, and the next 17 in a grid.
     * @param {Array<Object>} articles - An array of article objects, each containing metadata.
     */
    function displayArticles(articles) {
        // Sort articles by date in descending order (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Clear existing content in both containers
        articlesContainer.innerHTML = '';
        featuredArticleContainer.innerHTML = '';

        // If no articles are available, display a message and exit
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p class="text-gray-600 text-center text-lg">No articles available yet. Check back soon!</p>';
            return;
        }

        // --- Display Featured Articles Carousel ---
        // Get the top 3 newest articles for the carousel
        const featuredArticles = articles.slice(0, 3);

        if (featuredArticles.length > 0) {
            // Create the main carousel container
            const carouselWrapper = document.createElement('div');
            carouselWrapper.className = 'carousel-container relative';

            // Create the slides container
            const slidesContainer = document.createElement('div');
            slidesContainer.className = 'carousel-slides';

            featuredArticles.forEach(article => {
                const imageUrl = article.image || 'https://placehold.co/1200x600/b0c4de/ffffff?text=Featured+Article';
                const slide = document.createElement('a');
                slide.href = article.filename;
                // Added 'relative' class for positioning text overlay
                slide.className = 'carousel-slide block relative';
                slide.innerHTML = `
                    <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover rounded-2xl"
                         onerror="this.onerror=null;this.src='https://placehold.co/1200x600/b0c4de/ffffff?text=Image+Load+Error';">
                    <div class="carousel-text-overlay absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white rounded-2xl">
                        <h3 class="text-2xl md:text-4xl font-extrabold mb-2 leading-tight">${article.title}</h3>
                        <p class="text-sm md:text-base mb-2 date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p class="hidden md:block text-base md:text-lg leading-relaxed">${article.description}</p>
                    </div>
                `;
                slidesContainer.appendChild(slide);
            });

            carouselWrapper.appendChild(slidesContainer);

            // Removed navigation buttons (prevBtn, nextBtn) as requested

            // Add pagination dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            featuredArticles.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dot.dataset.index = index; // Store index for direct navigation
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            carouselWrapper.appendChild(dotsContainer);

            featuredArticleContainer.appendChild(carouselWrapper);

            // Initialize carousel
            updateCarousel();
            startSlideShow();

            // Pause slideshow on hover
            carouselWrapper.addEventListener('mouseenter', pauseSlideShow);
            carouselWrapper.addEventListener('mouseleave', startSlideShow);

            // Update carousel on window resize to ensure correct slide positioning
            window.addEventListener('resize', () => {
                updateCarousel(false); // Do not reset slide, just adjust position
            });
        }

        /**
         * Updates the carousel display based on the currentSlide index.
         * @param {boolean} [resetSlide=true] - Whether to reset currentSlide to 0 if out of bounds.
         */
        function updateCarousel(resetSlide = true) {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            const slidesContainer = document.querySelector('.carousel-slides');

            if (!slidesContainer || slides.length === 0) return;

            // Ensure currentSlide is within bounds
            if (resetSlide) {
                if (currentSlide >= slides.length) currentSlide = 0;
                if (currentSlide < 0) currentSlide = slides.length - 1;
            } else {
                // If not resetting, just clamp to bounds
                currentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));
            }


            // Calculate the transform value to show the current slide
            const offset = -currentSlide * slides[0].offsetWidth;
            slidesContainer.style.transform = `translateX(${offset}px)`;

            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        /**
         * Changes the current slide by a given direction (+1 for next, -1 for previous).
         * This function is no longer called by arrows but could be used for swipe gestures.
         * @param {number} direction - The direction to change the slide.
         */
        function changeSlide(direction) {
            pauseSlideShow(); // Pause manual interaction
            currentSlide += direction;
            updateCarousel();
            startSlideShow(); // Restart after manual interaction
        }

        /**
         * Navigates directly to a specific slide.
         * @param {number} index - The index of the slide to go to.
         */
        function goToSlide(index) {
            pauseSlideShow();
            currentSlide = index;
            updateCarousel();
            startSlideShow();
        }

        /**
         * Starts the automatic slideshow interval.
         */
        function startSlideShow() {
            pauseSlideShow(); // Clear any existing interval first
            slideInterval = setInterval(() => {
                currentSlide++;
                updateCarousel();
            }, 5000); // Change slide every 5 seconds
        }

        /**
         * Pauses the automatic slideshow interval.
         */
        function pauseSlideShow() {
            clearInterval(slideInterval);
        }


        // --- Display Remaining Articles in Grid ---
        // Get the next 17 articles (starting from index 3 after the featured articles)
        const remainingArticles = articles.slice(3, 20); // Max 20 articles total (3 featured + 17 in grid)

        if (remainingArticles.length === 0 && articles.length > 0) {
            // If only featured articles exist
            articlesContainer.innerHTML = '<p class="text-gray-600 text-center text-lg mt-8">Check back soon for more articles!</p>';
        } else if (remainingArticles.length === 0) {
             // If no articles at all (already handled above, but for clarity)
             articlesContainer.innerHTML = '';
        }

        remainingArticles.forEach(article => {
            const articleCard = document.createElement('a');
            articleCard.href = article.filename;
            // Apply Tailwind CSS classes for styling and hover effects
            articleCard.className = 'article-card block bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out';

            // Provide a fallback image URL
            const imageUrl = article.image || 'https://placehold.co/600x400/cccccc/333333?text=No+Image';

            articleCard.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}" class="w-full h-48 object-cover"
                     onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/333333?text=Image+Load+Error';">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${article.title}</h3>
                    <p class="text-sm text-gray-500 mb-4">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="text-gray-600 leading-relaxed">${article.description}</p>
                </div>
            `;
            articlesContainer.appendChild(articleCard);
        });
    }

    // Call fetchArticles to load and display articles when the page loads
    fetchArticles();
});


document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (localStorage.getItem('cookiesAccepted') === 'true') {
      banner.style.display = 'none';
    }

    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.style.display = 'none';
    });
  });
