import { fetchMarketNews } from './api.js';
import { fetchStockData } from './stockApi.js'; // Assuming you have a separate module for stock API

document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM content loaded');
  const newsData = await fetchMarketNews();
  console.log('News data fetched:', newsData);
  const filteredData = filterMarketWatchPosts(newsData); // Remove MarketWatch posts
  console.log('Filtered news:', filteredData);
  displayNewsPosts(filteredData);
  displaySlideshow(filteredData.slice(0, 3)); // Display slideshow with 3 newest posts

  // Add event listener for search button
  document.getElementById('searchBtn').addEventListener('click', async () => {
    const ticker = document
      .getElementById('tickerInput')
      .value.trim()
      .toUpperCase();
    if (ticker) {
      const stockData = await fetchStockData(ticker);
      console.log('Stock data:', stockData);
      displayStockData(stockData);
    } else {
      alert('Please enter a stock ticker.');
    }
  });
});

function filterMarketWatchPosts(data) {
  console.log('Filtering out MarketWatch posts');
  return data.filter((news) => news.source !== 'MarketWatch');
}

function displayNewsPosts(data) {
  console.log('Displaying news');
  const newsContainer = document.getElementById('newsContainer');
  if (data && data.length > 0) {
    data.forEach((news) => {
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
        news.related.forEach((related) => {
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

function displayStockData(data) {
  const stockDataContainer = document.createElement('div');
  stockDataContainer.id = 'stockDataContainer';

  if (data) {
    const price = document.createElement('p');
    price.textContent = `Current Price: ${data.c}`;

    const change = document.createElement('p');
    change.textContent = `Change: ${data.d}`;

    const percentChange = document.createElement('p');
    percentChange.textContent = `Percent Change: ${data.dp}`;

    const highPrice = document.createElement('p');
    highPrice.textContent = `High Price of the Day: ${data.h}`;

    const lowPrice = document.createElement('p');
    lowPrice.textContent = `Low Price of the Day: ${data.l}`;

    const openPrice = document.createElement('p');
    openPrice.textContent = `Open Price of the Day: ${data.o}`;

    const previousClose = document.createElement('p');
    previousClose.textContent = `Previous Close Price: ${data.pc}`;

    stockDataContainer.appendChild(price);
    stockDataContainer.appendChild(change);
    stockDataContainer.appendChild(percentChange);
    stockDataContainer.appendChild(highPrice);
    stockDataContainer.appendChild(lowPrice);
    stockDataContainer.appendChild(openPrice);
    stockDataContainer.appendChild(previousClose);

    const stockContainer = document.getElementById('stockContainer');
    stockContainer.appendChild(stockDataContainer);
  } else {
    const stockContainer = document.getElementById('stockContainer');
    stockContainer.innerHTML =
      '<p>No data available for this stock ticker.</p>';
  }
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
  let slideIndex = 0;
  setInterval(() => {
    slideIndex++;
    if (slideIndex >= data.length) {
      slideIndex = 0; // Reset if exceeds slides
    }
    console.log('Switching slideshow item:', data[slideIndex]);
    showSlide(slideIndex);
  }, 5000); // Change slide every 5 seconds
}

function showSlide(index) {
  console.log('Showing slide:', index);
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}
