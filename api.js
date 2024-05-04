const API_KEY = 'cor87jpr01qm70u0j1c0cor87jpr01qm70u0j1cg';

async function fetchMarketNews() {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching market news:', error);
        return null;
    }
}

export { fetchMarketNews };
