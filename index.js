import { fetchMarketNews } from './api.js';
import { fetchStockData } from './stockApi.js';

document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM content loaded');
  const newsData = await fetchMarketNews();
  console.log('News data fetched:', newsData);
  const filteredData = filterMarketWatchPosts(newsData);
  console.log('Filtered news:', filteredData);
  displayNewsPosts(filteredData);
  displaySlideshow(filteredData.slice(0, 3));

  document.getElementById('searchBtn').addEventListener('click', async () => {
    const ticker = document
      .getElementById('tickerInput')
      .value.trim()
      .toUpperCase();
    if (ticker) {
      clearStockData();
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
      link.classList.add('read-more');

      const favoriteBtn = document.createElement('button');
      favoriteBtn.innerHTML = '&#10084;';
      favoriteBtn.classList.add('favorite-btn');
      favoriteBtn.addEventListener('click', function () {
        toggleFavorite(news, favoriteBtn);
      });

      const shareBtn = document.createElement('button');
      shareBtn.innerHTML = '<img src="./images/share.svg" alt="Share">';
      shareBtn.classList.add('share-btn');
      shareBtn.addEventListener('click', function () {
        shareArticle(news);
      });

      newsDiv.appendChild(headline);
      newsDiv.appendChild(image);
      newsDiv.appendChild(summary);
      newsDiv.appendChild(source);
      newsDiv.appendChild(relatedList);
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

function clearStockData() {
  const stockContainer = document.getElementById('stockContainer');
  const stockDataContainer = document.getElementById('stockDataContainer');
  if (stockDataContainer) {
    stockContainer.removeChild(stockDataContainer);
  }
}

function toggleFavorite(news, button) {
  console.log('Toggling favorite:', news);
  news.isFavorite = !news.isFavorite;
  button.classList.toggle('favorited');
}

function shareArticle(news) {
  console.log('Sharing article:', news);
  alert(`Sharing ${news.headline}`);
}

function displaySlideshow(data) {
  console.log('Displaying slideshow');
  const slideshowContainer = document.querySelector('.slideshow-container');
  const slides = [];
  let slideIndex = 0;
  let intervalId;

  function showSlide(index) {
    console.log('Showing slide:', index);
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });
  }

  function changeSlide(direction) {
    slideIndex += direction;
    if (slideIndex >= slides.length) {
      slideIndex = 0;
    } else if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    }
    showSlide(slideIndex);
  }

  data.forEach((news, index) => {
    console.log('Displaying slideshow item:', news);
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style.display = 'none';
    const image = document.createElement('img');
    image.src = news.image;
    image.alt = news.headline;
    slide.appendChild(image);
    slideshowContainer.appendChild(slide);
    slides.push(slide);
  });

  function startInterval() {
    intervalId = setInterval(() => {
      changeSlide(1);
    }, 5000);
  }

  function stopInterval() {
    clearInterval(intervalId);
  }

  document.querySelector('.arrow.left').addEventListener('click', () => {
    stopInterval();
    changeSlide(-1);
    startInterval();
  });

  document.querySelector('.arrow.right').addEventListener('click', () => {
    stopInterval();
    changeSlide(1);
    startInterval();
  });

  showSlide(slideIndex);
  startInterval();
}
