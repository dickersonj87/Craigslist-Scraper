const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://dallas.craigslist.org/search/fua'

axios(url)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)
        const articles = []
        
        $('.result-info', html).each(function() {
            const title = $(this).find('.result-heading').text()
            // if (title contains table, chair, or dresser then return results)
            const titleLower = title.toLowerCase()
            const table = titleLower.includes('table')
            const chair = titleLower.includes('chair')
            const dresser = titleLower.includes('dresser')
            const url = $(this).find('.result-heading').find('a').attr('href')
            const location = $(this).find('.result-hood').text()
            const price = $(this).find('.result-price').text()
            const priceClean = price.replace('$', '')
            const priceInt = parseFloat(priceClean)
            if (priceInt <= 150 && table == true || chair == true || dresser == true){
               articles.push({
                title,
                url,
                location,
                priceInt
            }) 
            }
            
        })
        console.log(articles)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))