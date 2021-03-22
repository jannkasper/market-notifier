import cheerio from "cheerio";
import open from  'open';
import axios from "axios";
import notifier from 'node-notifier';
import { binanceFetch, binanceURL } from "./utils/fetcher.js";
import {sendEmail} from "./utils/email.js";

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
    latestNews = currentNews;
}

const oldDetermineAlert = async function() {
    const currentNews = await determineFirstArticle();
    console.log(new Date().toLocaleString() + ' | Binance -> ' + currentNews.text);
    if (currentNews.url !== latestNews.url) {
        createAlert(currentNews);
    }
}

// -------------------------------------------------------------------------------------

const determineFirstArticle = async function() {
    return await binanceFetch('gateway-api/v1/public/cms/article/latest/query').then(response => {
        if (response.data && response.data.data && response.data.data.latestArticles) {
            return response.data.data.latestArticles[0]
        } else {
            console.log("Binance: Fetch ERROR 'response.data.data.latestArticles[0] = NULL'")
            return null
        }
        return response.data;
    });
};

let latestNews = await determineFirstArticle();
// latestNews = {code : 'a5da7668d80a407595a18c6b729fa55a', title: 'Binance Will List RAMP (RAMP) in the Innovation Zone', publishDate: 1616416014373 }

const createAlert = async function(currentNews) {
    if (process.env.NODE_ENV === 'development') {
        notifier.notify({
            title: "BINANCE ALERT",
            message:  new Date(currentNews.publishDate).toLocaleTimeString("pl-PL") + ': ' + currentNews.title,
            sound: "SMS",
            timeout: 60000,
            open: binanceURL + 'en/support/announcement/'+ currentNews.code,
        });
    }

    if (/Binance Will List/.test(currentNews.title)) {
        const searchCode = currentNews.title.match(new RegExp(/\((.*)\)/ ));
        const searchName = currentNews.title.match(new RegExp(/Binance Will List(.*)\(/ ));
        const tokenCode = searchCode && searchCode[1]
        const tokenName = searchName && searchName[1].trim()
            .replace(/ /g, '-')
            .replace(/\./, '-')
            .toLowerCase();

        if (process.env.NODE_ENV === 'development') {
            open(binanceURL + 'en/support/announcement/'+ currentNews.code);
            open('https://www.coingecko.com/en/coins/' + tokenName + '#markets');

            const openMxc = await axios.get(`https://www.mxc.com/open/api/v2/market/ticker?symbol=${tokenCode.toUpperCase()}_USDT`)
                .then(response => response.data);
            if (openMxc) {
                open(`https://www.mxc.com/trade/easy#${tokenCode.toUpperCase()}_USDT`);
            }

            const openGate = !openMxc && await axios.get(`https://data.gateapi.io/api2/1/ticker/${tokenCode.toLowerCase()}_usdt`)
                .then(response => response.data && response.data.result);
            if (openGate) {
                open(`https://www.gate.io/trade/${tokenCode.toUpperCase()}_USDT`);
            }

            const openHuobi = !openMxc && !openGate && await axios.get(`https://api.huobi.pro/market/detail/merged?symbol=${tokenCode.toLowerCase()}usdt`)
                .then(response => response.data && response.data.status === 'ok');
            if (openHuobi) {
                open(`https://www.huobi.com/en-us/exchange/?s=${tokenCode.toLowerCase()}_usdt`);
            }
        } else {
            sendEmail('BINANCE', currentNews.title, binanceURL + 'en/support/announcement/'+ currentNews.code, 'https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        }
    }
    latestNews = currentNews;
}


const determineAlert = async function() {
    const currentNews = await determineFirstArticle();
    console.log(new Date().toLocaleString() + ' | Binance -> ' + currentNews.title);
    if (currentNews && currentNews.code !== latestNews.code) {
        createAlert(currentNews);
    }
}



const run = function () {
    const intervalRef = setInterval(determineAlert, 5000);
}

export default run

