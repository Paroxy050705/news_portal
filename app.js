const apiKey = "471d7af0015eac10be5813fcf7b8a2b2";
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const themeToggle = document.getElementById('theme-toggle');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumberSpan = document.getElementById('page-number');

let currentPage = 1;
const pageSize = 6;

async function fetchNews() {
  const searchQuery = searchInput.value.trim();
  const category = categorySelect.value;
  const startIndex = (currentPage - 1) * pageSize;

  let url = `https://gnews.io/api/v4/top-headlines?lang=en&max=${pageSize}&apikey=${apiKey}&from=${getPastDate(30)}`;

  if (searchQuery) {
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=${pageSize}&apikey=${apiKey}&from=${getPastDate(30)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = '<p>No articles found.</p>';
      return;
    }

    displayNews(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Error fetching news.</p>';
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'news-card';

    card.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/300x180'}" class="news-image" />
      <div class="news-content">
        <div class="news-title">${article.title}</div>
        <div class="news-description">${article.description || 'No description available.'}</div>
        <a href="${article.url}" target="_blank" class="read-more">Read more</a>
      </div>
    `;

    newsContainer.appendChild(card);
  });

  pageNumberSpan.textContent = currentPage;
}

function getPastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// Event Listeners
searchInput.addEventListener('input', () => {
  currentPage = 1;
  fetchNews();
});

categorySelect.addEventListener('change', () => {
  currentPage = 1;
  fetchNews(); // GNews doesn’t support category directly, but you can include it in search query if needed
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews();
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  fetchNews();
});

// Initial Fetch
fetchNews();
