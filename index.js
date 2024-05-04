import { fetchMarketNews } from './api.js';

document.addEventListener('DOMContentLoaded', async function () {
  console.log('Document loaded');
  const newsData = await fetchMarketNews();
  console.log('News data fetched:', newsData);
  const filteredData = filterMarketWatchPosts(newsData); // Filter out MarketWatch posts
  console.log('Filtered data:', filteredData);
  displayMarketNews(filteredData);
});

function filterMarketWatchPosts(data) {
  const filteredData = data.filter(news => news.source !== 'MarketWatch');
  console.log('Filtered MarketWatch posts:', filteredData);
  return filteredData;
}

function displayMarketNews(data) {
  const newsContainer = document.getElementById('newsContainer');
  console.log('Displaying news:', data);
  if (data && data.length > 0) {
    data.forEach((news) => {
      const newsDiv = document.createElement('div');
      newsDiv.classList.add('news');
      console.log('Creating news div for:', news.headline);

      const headline = document.createElement('h2');
      headline.textContent = news.headline;

      const image = document.createElement('img');
      image.src = news.image;
      image.alt = news.headline;

      const summary = document.createElement('p');
      summary.textContent = news.summary;

      const source = document.createElement('p');
      source.textContent = `Source: ${news.source}`;

      const relatedList = document.createElement('ul');
      if (Array.isArray(news.related)) {
        news.related.forEach((related) => {
          const relatedItem = document.createElement('li');
          relatedItem.textContent = related.headline;
          relatedList.appendChild(relatedItem);
        });
      }

      const link = document.createElement('a');
      link.href = news.url;
      link.textContent = 'Read more';
      link.classList.add('read-more'); // Add a class for styling

      // Create favorite button
      const favoriteBtn = document.createElement('button');
      favoriteBtn.innerHTML = '&#10084;'; // Heart symbol
      favoriteBtn.classList.add('favorite-btn');
      favoriteBtn.addEventListener('click', function () {
        toggleFavorite(news, favoriteBtn);
      });

      // Create share button
      const shareBtn = document.createElement('button');
      shareBtn.innerHTML = '<img src="./images/share.svg" alt="Share">';
      shareBtn.classList.add('share-btn');
      shareBtn.addEventListener('click', function () {
        shareArticle(news);
      });

      // Append elements to newsDiv
      newsDiv.appendChild(headline);
      newsDiv.appendChild(image);
      newsDiv.appendChild(summary);
      newsDiv.appendChild(source);
      newsDiv.appendChild(relatedList);
      // Add favorite and share buttons before the "Read more" link
      newsDiv.appendChild(favoriteBtn);
      newsDiv.appendChild(shareBtn);
      newsDiv.appendChild(link);

      newsContainer.appendChild(newsDiv);
    });
  } else {
    newsContainer.textContent = 'No news available.';
  }
}

function toggleFavorite(news, button) {
  // Toggle favorite state
  news.isFavorite = !news.isFavorite;
  console.log(`Toggled favorite for news: ${news.headline}`, news);
  // Update button style based on favorite state
  button.classList.toggle('favorited');
}

function shareArticle(news) {
  // Implement article sharing functionality (e.g., open share dialog)
  console.log(`Sharing article: ${news.headline}`);
  alert(`Sharing ${news.headline}`);
}
