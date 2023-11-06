document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrapeButton');
    const resultsDiv = document.getElementById('results');

    scrapeButton.addEventListener('click', () => {
        fetch('/scrape') // Make a request to your backend
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = ''; // Clear previous results
                data.forEach(article => {
                    const articleElement = document.createElement('div');
                    articleElement.innerHTML = `
                        <h2>${article.title}</h2>
                        <p>Location: ${article.location}</p>
                        <p>Price: $${article.priceInt.toFixed(2)}</p>
                        <a href="${article.url}" target="_blank">View Details</a>
                    `;
                    resultsDiv.appendChild(articleElement);
                });
            })
            .catch(error => console.error(error));
    });
});
