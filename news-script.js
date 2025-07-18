// news-script.js (or rename to common-article-script.js if preferred)

document.addEventListener('DOMContentLoaded', () => {
    // --- Cookie Banner Logic ---
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

    // --- News Page Filtering Logic ---
    const newsArticlesContainer = document.getElementById('news-articles-container');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const archiveFilter = document.getElementById('archive-filter');
    const noResultsMessage = document.getElementById('no-results-message');

    let allArticles = [];

    // Function to fetch articles and decide what to render based on the current page
    async function fetchAndRenderArticles() {
        try {
            const response = await fetch('../articles.json'); // Adjust path for article pages if needed
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allArticles = await response.json();
            allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Logic for news.html page
            if (newsArticlesContainer) {
                populateFilters();
                displayFilteredArticles();
                searchInput.addEventListener('input', displayFilteredArticles);
                categoryFilter.addEventListener('change', displayFilteredArticles);
                archiveFilter.addEventListener('change', displayFilteredArticles);
            }

            // Logic for individual article pages (e.g., articles/1.html)
            const articleSourcesContainer = document.getElementById('article-sources');
            if (articleSourcesContainer) {
                renderArticleSources(allArticles);
            }

        } catch (error) {
            console.error('Error fetching articles:', error);
            if (newsArticlesContainer) {
                newsArticlesContainer.innerHTML = '<p class="text-red-600 text-center">Failed to load news. Please try again later.</p>';
            }
            if (articleSourcesContainer) {
                articleSourcesContainer.innerHTML = '<li><p class="text-red-600">Failed to load sources.</p></li>';
            }
        }
    }

    function populateFilters() {
        const categories = new Set(allArticles.map(article => article.category).filter(Boolean));
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        const years = new Set(allArticles.map(article => new Date(article.date).getFullYear()).sort((a, b) => b - a));
        archiveFilter.innerHTML = '<option value="all">All Years</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            archiveFilter.appendChild(option);
        });
    }

    function displayFilteredArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedYear = archiveFilter.value;

        const filteredArticles = allArticles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                                  article.description.toLowerCase().includes(searchTerm) ||
                                  (article.author && article.author.toLowerCase().includes(searchTerm)) ||
                                  (article.category && article.category.toLowerCase().includes(searchTerm));
            
            const matchesCategory = selectedCategory === 'all' || 
                                    (article.category && article.category.toLowerCase() === selectedCategory.toLowerCase());
            
            const matchesYear = selectedYear === 'all' || 
                                (new Date(article.date).getFullYear().toString() === selectedYear);

            return matchesSearch && matchesCategory && matchesYear;
        });

        newsArticlesContainer.innerHTML = '';
        if (filteredArticles.length === 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
            filteredArticles.forEach(article => {
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
                newsArticlesContainer.appendChild(articleCard);
            });
        }
    }

    // --- Render Sources for individual article pages ---
    function renderArticleSources(articles) {
        const currentPath = window.location.pathname;
        const currentArticleFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        const currentArticle = articles.find(article => {
            // Compare the last part of the filename (e.g., "1.html")
            const articleFilePart = article.filename.substring(article.filename.lastIndexOf('/') + 1);
            return articleFilePart === currentArticleFilename;
        });

        const sourcesContainer = document.getElementById('article-sources');
        if (sourcesContainer && currentArticle && currentArticle.sources && currentArticle.sources.length > 0) {
            sourcesContainer.innerHTML = ''; // Clear existing static list if any
            currentArticle.sources.forEach(source => {
                const listItem = document.createElement('li');
                if (source.url && source.url !== '#') { // Check if URL is valid
                    listItem.innerHTML = `<a href="${source.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${source.name}</a>`;
                } else {
                    listItem.textContent = source.name;
                }
                sourcesContainer.appendChild(listItem);
            });
        } else if (sourcesContainer) {
            sourcesContainer.innerHTML = '<li><p class="text-gray-500 italic">No specific sources listed for this article.</p></li>';
        }
    }

    fetchAndRenderArticles();
});