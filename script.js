// script.js

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const featuredArticleContainer = document.getElementById('featured-article-container');
    const editorsPicksContainer = document.getElementById('editors-picks-container');
    const deepDiveContainer = document.getElementById('deep-dive-container');
    const dynamicQuoteElement = document.getElementById('dynamic-quote');
    const dynamicQuoteSourceElement = document.getElementById('dynamic-quote-source');

    let currentSlide = 0;
    let slideInterval;

    const quotes = [
        {
            quote: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
            source: "Albert Camus"
        },
        {
            quote: "Freedom is not a gift bestowed upon us, but a right that we must fight for every day.",
            source: "Unknown"
        },
        {
            quote: "To be truly radical is to make hope possible, rather than despair convincing.",
            source: "Raymond Williams"
        },
        {
            quote: "The price of freedom is eternal vigilance.",
            source: "Thomas Jefferson"
        }
    ];
    let currentQuoteIndex = 0;

    /**
     * Fetches the articles data from the 'articles.json' file.
     */
    async function fetchArticles() {
        try {
            const response = await fetch('articles.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articles = await response.json();
            displayArticles(articles);
            startQuoteRotation(); // Start rotating quotes
        } catch (error) {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = '<p class="text-red-600 text-center">Failed to load articles. Please try again later.</p>';
            featuredArticleContainer.innerHTML = '';
            editorsPicksContainer.innerHTML = '';
            deepDiveContainer.innerHTML = '';
            dynamicQuoteElement.textContent = "Error loading quote.";
            dynamicQuoteSourceElement.textContent = "";
        }
    }

    /**
     * Displays the given array of articles on the page.
     */
    function displayArticles(articles) {
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        articlesContainer.innerHTML = '';
        featuredArticleContainer.innerHTML = '';
        editorsPicksContainer.innerHTML = '';
        deepDiveContainer.innerHTML = '';

        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p class="text-gray-600 text-center text-lg">No articles available yet. Check back soon!</p>';
            return;
        }

        // --- Display Featured Articles Carousel ---
        const featuredArticles = articles.slice(0, 3);
        if (featuredArticles.length > 0) {
            const carouselWrapper = document.createElement('div');
            carouselWrapper.className = 'carousel-container relative';
            const slidesContainer = document.createElement('div');
            slidesContainer.className = 'carousel-slides';

            featuredArticles.forEach(article => {
                const imageUrl = article.image || 'https://placehold.co/1200x600/b0c4de/ffffff?text=Featured+Article';
                const slide = document.createElement('a');
                slide.href = article.filename;
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

            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            featuredArticles.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dot.dataset.index = index;
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            carouselWrapper.appendChild(dotsContainer);

            featuredArticleContainer.appendChild(carouselWrapper);

            updateCarousel();
            startSlideShow();

            carouselWrapper.addEventListener('mouseenter', pauseSlideShow);
            carouselWrapper.addEventListener('mouseleave', startSlideShow);
            window.addEventListener('resize', () => {
                updateCarousel(false);
            });
        }

        function updateCarousel(resetSlide = true) {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            const slidesContainer = document.querySelector('.carousel-slides');

            if (!slidesContainer || slides.length === 0) return;

            if (resetSlide) {
                if (currentSlide >= slides.length) currentSlide = 0;
                if (currentSlide < 0) currentSlide = slides.length - 1;
            } else {
                currentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));
            }

            const offset = -currentSlide * slides[0].offsetWidth;
            slidesContainer.style.transform = `translateX(${offset}px)`;

            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function changeSlide(direction) {
            pauseSlideShow();
            currentSlide += direction;
            updateCarousel();
            startSlideShow();
        }

        function goToSlide(index) {
            pauseSlideShow();
            currentSlide = index;
            updateCarousel();
            startSlideShow();
        }

        function startSlideShow() {
            pauseSlideShow();
            slideInterval = setInterval(() => {
                currentSlide++;
                updateCarousel();
            }, 5000);
        }

        function pauseSlideShow() {
            clearInterval(slideInterval);
        }

        // --- Display Editor's Picks ---
        const editorsPicks = articles.slice(3, 5); // Articles at index 3 and 4

        if (editorsPicks.length > 0) {
            editorsPicks.forEach(article => {
                const pickCard = document.createElement('a');
                pickCard.href = article.filename;
                pickCard.className = 'article-card block bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col md:flex-row';

                const imageUrl = article.image || 'https://placehold.co/600x400/cccccc/333333?text=No+Image';

                pickCard.innerHTML = `
                    <img src="${imageUrl}" alt="${article.title}" class="w-full md:w-1/3 h-48 md:h-auto object-cover md:rounded-l-lg md:rounded-r-none"
                                onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/333333?text=Image+Load+Error';">
                    <div class="p-6 flex-1">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">${article.title}</h3>
                        <p class="text-sm text-gray-500 mb-1">
                            Published on ${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            ${article.author ? ` by <strong>${article.author}</strong>` : ''}
                        </p>
                        ${article.category ? `<span class="inline-block bg-primary-medium text-white text-xs font-semibold px-2 py-1 rounded-full mt-2">${article.category}</span>` : ''}
                        <p class="text-gray-600 leading-relaxed mt-4">${article.description}</p>
                    </div>
                `;
                editorsPicksContainer.appendChild(pickCard);
            });
        }

        // --- Display Deep Dive Article (e.g., the 5th article overall, or a specially marked one) ---
        // For demonstration, let's pick the 5th article (index 4) if it exists, or the latest if not enough.
        const deepDiveArticle = articles[4] || articles[0]; // Fallback to the latest article

        if (deepDiveArticle) {
            const imageUrl = deepDiveArticle.image || 'https://placehold.co/1200x800/8c8c8c/ffffff?text=Deep+Dive+Image';
            deepDiveContainer.innerHTML = `
                <img src="${imageUrl}" alt="${deepDiveArticle.title}" class="w-full lg:w-1/2 h-64 lg:h-auto object-cover"
                            onerror="this.onerror=null;this.src='https://placehold.co/1200x800/8c8c8c/ffffff?text=Image+Load+Error';">
                <div class="p-8 flex-1 flex flex-col justify-center">
                    <span class="inline-block bg-accent-light text-white text-sm font-bold px-3 py-1 rounded-full mb-3">Deep Dive</span>
                    <h3 class="text-3xl font-extrabold text-gray-900 mb-4">${deepDiveArticle.title}</h3>
                    <p class="text-gray-700 text-lg mb-6 leading-relaxed">${deepDiveArticle.description}</p>
                    <p class="text-sm text-gray-500 mb-2">
                        Published on ${new Date(deepDiveArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        ${deepDiveArticle.author ? ` by <strong>${deepDiveArticle.author}</strong>` : ''}
                    </p>
                    <a href="${deepDiveArticle.filename}" class="btn-primary inline-block self-start">Read the Full Analysis</a>
                </div>
            `;
        }

        // --- Display Remaining Articles in Grid ---
        const startIndexForGrid = 5; // After 3 featured and 2 editor's picks
        const remainingArticles = articles.slice(startIndexForGrid, startIndexForGrid + 15); // Show up to 15 more articles

        if (remainingArticles.length === 0 && articles.length > 0) {
            articlesContainer.innerHTML = '<p class="text-gray-600 text-center text-lg mt-8">Check back soon for more articles!</p>';
        } else if (remainingArticles.length === 0) {
              articlesContainer.innerHTML = '';
        }

        remainingArticles.forEach(article => {
            const articleCard = document.createElement('a');
            articleCard.href = article.filename;
            articleCard.className = 'article-card block bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out';

            const imageUrl = article.image || 'https://placehold.co/600x400/cccccc/333333?text=No+Image';

            articleCard.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}" class="w-full h-48 object-cover"
                            onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/333333?text=Image+Load+Error';">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${article.title}</h3>
                    <p class="text-sm text-gray-500 mb-1">
                        Published on ${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        ${article.author ? ` by <strong>${article.author}</strong>` : ''}
                    </p>
                    ${article.category ? `<span class="inline-block bg-primary-medium text-white text-xs font-semibold px-2 py-1 rounded-full mt-2">${article.category}</span>` : ''}
                    <p class="text-gray-600 leading-relaxed mt-4">${article.description}</p>
                </div>
            `;
            articlesContainer.appendChild(articleCard);
        });
    }

    // --- Dynamic Quote Rotation ---
    function updateDynamicQuote() {
        if (dynamicQuoteElement && dynamicQuoteSourceElement) {
            const quoteData = quotes[currentQuoteIndex];
            dynamicQuoteElement.textContent = `"${quoteData.quote}"`;
            dynamicQuoteSourceElement.textContent = `- ${quoteData.source}`;
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        }
    }

    let quoteInterval;
    function startQuoteRotation() {
        updateDynamicQuote(); // Display initial quote immediately
        clearInterval(quoteInterval); // Clear any existing interval
        quoteInterval = setInterval(updateDynamicQuote, 8000); // Change quote every 8 seconds
    }

    // Call fetchArticles to load and display articles when the page loads
    fetchArticles();
});


// Cookie banner logic (kept as is)
document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (banner && acceptBtn) {
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            banner.style.display = 'none';
        }

        acceptBtn.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.style.display = 'none';
        });
    }
});