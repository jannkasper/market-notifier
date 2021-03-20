import cheerio from "cheerio";
import open from  'open';
import notifier from 'node-notifier';
import { binanceFetch, binanceURL } from "./utils/fetcher.js";
import {sendEmail} from "./utils/email.js";

const determineFirstArticle = async function() {
    return await binanceFetch('en/support/announcement/c-48?navId=48').then(response => {
        let $ = cheerio.load(response.data);
        return $('a')
            .map((i, e) => ({text: $(e).text(), url: $(e).attr('href')}))
            .filter((i, e) => /.*\/en\/support\/announcement\/[\w][^\W]*$/g.test(e.url))
            .toArray().shift();
    });
};



let latestNews = await determineFirstArticle();
// latestNews = {url : 'en/support/announcement/1d7f2144fce04615aa78eeb93331adc01', text: 'Binance Will List Perpetual Protocol (PERP) in the Innovation Zone'}

const createAlert = function(currentNews) {
    notifier.notify({
        title: "BINANCE ALERT",
        message: currentNews.text,
        sound: "SMS",
        timeout: 60000,
        open: binanceURL + currentNews.url,
    });

    if (/Binance Will List/.test(currentNews.text)) {
        const tokenArray = currentNews.text.match(new RegExp(/Binance Will List(.*)\(/ ));
        const tokenName = tokenArray[1].trim()
            .replaceAll(" ", "-")
            .replaceAll(".", "-")
            .toLowerCase();
        open(binanceURL + currentNews.url);
        open('https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        sendEmail('BINANCE', currentNews.text, binanceURL + currentNews.url, 'https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        // clearInterval(intervalRef);
    }
    latestNews = currentNews;
}

const determineAlert = async function() {
    const currentNews = await determineFirstArticle();
    console.log(new Date().toLocaleString() + ' | Binance -> ' + currentNews.text);
    if (currentNews.url !== latestNews.url) {
        createAlert(currentNews);
    }
}
const run = function () {
    const intervalRef = setInterval(determineAlert, 10000);
}

export default run

