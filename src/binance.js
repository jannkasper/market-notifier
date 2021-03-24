import {binanceFetch, handleFetchError} from "./utils/fetcher.js";
import {createAlert, sendNotification} from "./utils/alert.js";

// gateway-api/v1/public/cms/article/latest/query
const determineBinanceLatestArticle = async function() {
    return await binanceFetch('gateway-api/v1/public/cms/article/all/query?type=1&pageNo=1&pageSize=10&queryKeywords=a&sortBy=1').then(response => {
        if (response.data && response.data.data && response.data.data.articles) {
            const item = response.data.data.articles[0];
            return {
                market: "Binance",
                title: item.title,
                createdAt: item.publishDate,
                publishedAt: item.publishDate,
                url: `https://www.binance.com/en/support/announcement/${item.code}`
            }
        } else {
            console.log("Binance: Fetch ERROR 'response.data.data.latestArticles[0] = NULL'")
            return null
        }
    }).catch(handleFetchError);
};

const readCoinFromString = function (title) {
    const searchCode = title.match(new RegExp(/\((.*)\)/ ));
    const searchName = title.match(new RegExp(/Binance Will List(.*)\(/ ));
    const tokenCode = searchCode && searchCode[1]
    const tokenName = searchName && searchName[1].trim()
        .replace(/ /g, '-')
        .replace(/\./, '-')
        .toLowerCase();
    return { tokenName, tokenCode };
}

let latestArticle = await determineBinanceLatestArticle();
// latestArticle = { market:"Coinbase" ,title: "Ankr (ANKR) Curve DAO Token (CRV) and Storj (STORJ) are launching on Coinbase Pro", createdAt:1615913006441, publishedAt:1616518976265, url:"https://medium.com/p/62dbd9208d7c" };


const determineAlert = async function() {
    const currentArticle = await determineBinanceLatestArticle();
    if (!currentArticle) {
        return
    }
    currentArticle.title = 'Binance Will List Perpetual Protocol (PERP) in the Innovation Zone'
    console.log(new Date().toLocaleString() + ' | Binance -> ' + currentArticle.title);
    if (latestArticle.url !== currentArticle.url) {
        if (/Binance Will List/.test(currentArticle.title)) {
            createAlert(currentArticle, readCoinFromString);
        } else if (process.env.NODE_ENV === 'development') {
            sendNotification(currentArticle);
        }
        latestArticle = currentArticle;
    }
}

const run = function () {
    const intervalRef = setInterval(determineAlert, 3000);
}

export default run