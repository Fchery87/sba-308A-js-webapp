import { fetchMarketNews } from './api.js';

document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM content loaded');
  const newsData = await fetchMarketNews();
  console.log('News data fetched:', newsData);
  const filteredData = filterMarketWatchPosts(newsData); // Remove MarketWatch posts
  console.log('Filtered news:', filteredData);
  displayNewsPosts(filteredData);
  displaySlideshow(filteredData.slice(0, 3)); // Display slideshow with 3 newest posts
});

function filterMarketWatchPosts(data) {
  console.log('Filtering out MarketWatch posts');
  return data.filter(news => news.source !== 'MarketWatch');
}

function displayNewsPosts(data) {
  console.log('Displaying news');
  const newsContainer = document.getElementById('newsContainer');
  if (data && data.length > 0) {
    data.forEach(news => {
      console.log('Displaying news item:', news);
      const newsDiv = document.createElement('div');
      newsDiv.classList.add('news');

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
        news.related.forEach(related => {
          const relatedItem = document.createElement('li');
          relatedItem.textContent = related.headline;
          relatedList.appendChild(relatedItem);
        });
      }

      const link = document.createElement('a');
      link.href = news.url;
      link.textContent = 'Read more';
      link.classList.add('read-more'); // For styling

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
      // Add favorite and share buttons
      newsDiv.appendChild(favoriteBtn);
      newsDiv.appendChild(shareBtn);
      newsDiv.appendChild(link);

      newsContainer.appendChild(newsDiv);
    });
  } else {
    newsContainer.textContent = 'No news available.';
  }
}

function displaySlideshow(data) {
  console.log('Displaying slideshow');
  const slideshowContainer = document.querySelector('.slideshow-container');
  data.forEach((news, index) => {
    console.log('Displaying slideshow item:', news);
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style.display = index === 0 ? 'block' : 'none'; // Display first, hide others
    const image = document.createElement('img');
    image.src = news.image;
    image.alt = news.headline;
    slide.appendChild(image);
    slideshowContainer.appendChild(slide);
  });
}

let slideIndex = 0;

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  const slides = document.querySelectorAll('.slide');
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  slides.forEach(slide => (slide.style.display = 'none'));
  slides[slideIndex].style.display = 'block';
}

function toggleFavorite(news, button) {
  console.log('Toggling favorite:', news);
  // Toggle favorite state
  news.isFavorite = !news.isFavorite;
  // Update button style based on favorite state
  button.classList.toggle('favorited');
}

function shareArticle(news) {
  console.log('Sharing article:', news);
  // Implement article sharing functionality
  alert(`Sharing ${news.headline}`);
}
