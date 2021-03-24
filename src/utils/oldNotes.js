import axios from "axios";
import fs from "fs";
import {binanceFetch, binanceURL} from "./fetcher";
import cheerio from "cheerio";
import notifier from "node-notifier";
import open from "open";
import {sendEmail} from "./email";

const temp4 = async function() {
    const result = []
    for (let i = 1; i < 100; i++) {
        let resultAxios = await axios.get("https://medium.com/_/api/collections/the-coinbase-blog/search?q=&page="+i, {headers: header}).then(response => {
            // const temp = response.data.results[0].hits;
            // const result = temp.sort(sortFunction)
            const string = response.data.substring(16)
            const objectArray = JSON.parse(string);
            return objectArray.payload.posts
        });

        if (resultAxios.length > 0) {
            // resultAxios = resultAxios.map(item => { return {title: item.title, firstPublishedAt: item.firstPublishedAt }})
            result.push(...resultAxios);
        } else {
            break;
        }
    }

    const sorted = result.sort(sortFunction);
    // const changed = sorted.map(item => { return {title: item.title, firstPublishedAt: new Date(item.firstPublishedAt).toLocaleDateString("pl-PL") }});
    // console.log(changed)

    const storeData = (data, path) => {
        try {
            fs.writeFileSync(path, JSON.stringify(data))
        } catch (err) {
            console.error(err)
        }
    }

    storeData(sorted, "./test.json" )
}


// --------------------------------------------------------------------------------------------

const oldDetermineFirstArticle = async function() {
    return await binanceFetch('en/support/announcement/c-48?navId=48').then(response => {
        let $ = cheerio.load(response.data);
        return $('a')
            .map((i, e) => ({text: $(e).text(), url: $(e).attr('href')}))
            .filter((i, e) => /.*\/en\/support\/announcement\/[\w][^\W]*$/g.test(e.url))
            .toArray().shift();
    });
};

// let latestNews = await determineFirstArticle();
// latestNews = {url : 'en/support/announcement/1d7f2144fce04615aa78eeb93331adc01', text: 'Binance Will List Perpetual Protocol (PERP) in the Innovation Zone'}

const oldCreateAlert = function(currentNews) {
    if (process.env.NODE_ENV === 'development') {
        notifier.notify({
            title: "BINANCE ALERT",
            message: currentNews.text,
            sound: "SMS",
            timeout: 60000,
            open: binanceURL + currentNews.url,
        });
    }

    if (/Binance Will List/.test(currentNews.text)) {
        const tokenArray = currentNews.text.match(new RegExp(/Binance Will List(.*)\(/ ));
        const tokenName = tokenArray[1].trim()
            .replace(/ /g, '-')
            .replace(/\./, '-')
            .toLowerCase();
        if (process.env.NODE_ENV === 'development') {
            open(binanceURL + currentNews.url);
            open('https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        }
        sendEmail('BINANCE', currentNews.text, binanceURL + currentNews.url, 'https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        // clearInterval(intervalRef);
    }
    // latestNews = currentNews;
}

const oldDetermineAlert = async function() {
    const currentNews = await determineFirstArticle();
    console.log(new Date().toLocaleString() + ' | Binance -> ' + currentNews.text);
    if (currentNews.url !== latestNews.url) {
        createAlert(currentNews);
    }
}

// --------------------------------------------------------------------------------------------


// async function determineFirstArticle() {
//      await page.goto(coinbaseURL + 'latest', { waitUntil: 'networkidle0' });
//      return await page.evaluate(() => document.body.innerHTML)
//          .then(bodyHTML => bodyHTML.match(/\{"references"(.*)]}\)/))
//          .then(bodyHTML => bodyHTML[0].slice(0, -1))
//          .then(bodyHTML => JSON.parse(bodyHTML))
//          .then(bodyJSON => {return { createdAt: bodyJSON.posts[0].createdAt, text: bodyJSON.posts[0].title, url: bodyJSON.posts[0].uniqueSlug, }})
// }