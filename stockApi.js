const API_KEY = 'cor87jpr01qm70u0j1c0cor87jpr01qm70u0j1cg';

async function fetchStockData(ticker) {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}

export { fetchStockData };
