const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://dallas.craigslist.org/search/fua'

app.get('/', (req, res) => {
    // Serve your HTML file here
    res.sendFile(__dirname + '/index.html');
});

app.get('/scrape', (req, res) => {
    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const articles = [];

            $('.result-info', html).each(function() {
                const title = $(this).find('.result-heading').text()
                const titleLower = title.toLowerCase()
                const table = titleLower.includes('table')
                const chair = titleLower.includes('chair')
                const dresser = titleLower.includes('dresser')
                const url = $(this).find('.result-heading').find('a').attr('href')
                const location = $(this).find('.result-hood').text()
                const price = $(this).find('.result-price').text()
                const priceClean = price.replace('$', '')
                const priceInt = parseFloat(priceClean)
                if (priceInt <= 150 && (table || chair || dresser)){
                    articles.push({
                        title,
                        url,
                        location,
                        priceInt
                    });
                }
            });

            console.log(articles);
            
            res.json(articles); // Send the scraped data as a JSON response
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Scraping failed' }); // Handle errors
        });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
