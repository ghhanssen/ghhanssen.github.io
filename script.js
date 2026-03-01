document.addEventListener('DOMContentLoaded', function () {

    // --- Dark mode toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModePreference = localStorage.getItem('darkMode');

    if (darkModePreference === 'disabled') {
        document.body.classList.remove('dark-mode');
    }

    updateDarkModeIcon();

    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
        updateDarkModeIcon();
    });

    function updateDarkModeIcon() {
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var headerHeight = document.querySelector('.site-header').offsetHeight;
                var targetPosition = targetElement.offsetTop - headerHeight - 24;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-triggered reveal ---
    var revealElements = document.querySelectorAll('[data-reveal]');

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // --- Read more / less ---
    document.querySelectorAll('.read-more-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var description = this.parentElement;
            var fullText = description.getAttribute('data-full-text');
            var shortText = description.querySelector('.short-text');
            var ellipsis = description.querySelector('.ellipsis');

            if (!description.classList.contains('expanded')) {
                if (shortText) shortText.style.display = 'none';
                if (ellipsis) ellipsis.style.display = 'none';

                var fullTextSpan = description.querySelector('.full-text');
                if (!fullTextSpan) {
                    fullTextSpan = document.createElement('span');
                    fullTextSpan.className = 'full-text';
                    fullTextSpan.textContent = fullText + ' ';
                    description.insertBefore(fullTextSpan, this);
                } else {
                    fullTextSpan.style.display = 'inline';
                }

                this.textContent = 'read less';
                description.classList.add('expanded');
            } else {
                if (shortText) shortText.style.display = 'inline';
                if (ellipsis) ellipsis.style.display = 'inline';

                var fullTextSpan = description.querySelector('.full-text');
                if (fullTextSpan) fullTextSpan.style.display = 'none';

                this.textContent = 'read more';
                description.classList.remove('expanded');
            }
        });
    });

});

document.addEventListener('DOMContentLoaded', function () {
    // ...existing code...

    // Load articles dynamically
    loadArticles();

    // ...rest of existing code...
});

async function loadArticles() {
    try {
        const response = await fetch('articles/articles.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }

        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
        displayArticlesError();
    }
}

function displayArticles(articles) {
    const articlesList = document.getElementById('articlesList');
    if (!articlesList) return;

    // Sort by date (newest first) and take only featured or first 3
    const featuredArticles = articles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter(article => article.featured)
        .slice(0, 3);

    if (featuredArticles.length === 0) {
        articlesList.innerHTML = `
            <div class="no-articles">
                <p class="section-sub">No articles published yet.</p>
                <a href="articles/editor/" class="btn-primary">Write your first article</a>
            </div>
        `;
        return;
    }

    const articlesHTML = featuredArticles.map((article, index) => `
        <article class="project-item" data-reveal>
            <div class="project-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="project-content">
                <h3 class="project-title">${article.title}</h3>
                <p class="project-subtitle">${article.subtitle}</p>
                <p class="project-description">
                    <span class="short-text">${truncateText(article.description, 120)}</span>
                </p>
                <div class="project-meta">
                    <span class="project-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(article.date)}
                    </span>
                </div>
                <div class="project-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="project-action">
                <a href="articles/${article.folder}/" class="project-link">
                    Read article <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');

    articlesList.innerHTML = articlesHTML;

    // Re-initialize reveal animations for new content
    initializeRevealAnimations();
}

function displayArticlesError() {
    const articlesList = document.getElementById('articlesList');
    if (!articlesList) return;

    articlesList.innerHTML = `
        <div class="error-placeholder">
            <p class="section-sub">Unable to load articles. Please try again later.</p>
        </div>
    `;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function initializeRevealAnimations() {
    // Re-initialize reveal animations for dynamically loaded content
    var revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });
}