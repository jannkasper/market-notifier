import notifier from "node-notifier";
import open from "open";
import { startBrowser } from "./utils/session.js";
const { browser, page } = await startBrowser();
import { sendEmail } from "./utils/email.js";

const coinbaseURL = 'https://blog.coinbase.com/';

async function determineFirstArticle() {
     await page.goto(coinbaseURL + 'latest', { waitUntil: 'networkidle0' });
     return await page.evaluate(() => document.body.innerHTML)
         .then(bodyHTML => bodyHTML.match(/\{"references"(.*)]}\)/))
         .then(bodyHTML => bodyHTML[0].slice(0, -1))
         .then(bodyHTML => JSON.parse(bodyHTML))
         .then(bodyJSON => {return { createdAt: bodyJSON.posts[0].createdAt, text: bodyJSON.posts[0].title, url: bodyJSON.posts[0].uniqueSlug, }})
}

let latestNews = await determineFirstArticle();
// latestNews = {url : 'polygon-matic-skale-network-skl-and-sushiswap-sushi-are-launching-on-coinbase-pro-460f410b3820', text: 'Polygon (MATIC), SKALE (SKL) and SushiSwap (SUSHI) are launching on Coinbase Pro'}


const createAlert = function(currentNews) {
     if (process.env.NODE_ENV === 'development') {
          notifier.notify({
               title: "COINBASE ALERT",
               message: currentNews.text,
               sound: "SMS",
               timeout: 60000,
               open: coinbaseURL + currentNews.url,
          });
     }

     if (/launching on || now available/.test(currentNews.text)) {
          const tokenName = currentNews.text.substring(0, currentNews.text.indexOf('('))
              .trim()
              .replace(/ /g, '-')
              .replace(/./, '-')
              .toLowerCase();
          if (process.env.NODE_ENV === 'development') {
               open(coinbaseURL + currentNews.url);
               open('https://www.coingecko.com/en/coins/' + tokenName + '#markets');
          }
          sendEmail('COINBASE', currentNews.text, coinbaseURL + currentNews.url, 'https://www.coingecko.com/en/coins/' + tokenName + '#markets');
     }
     latestNews = currentNews;
}

const determineAlert = async function() {
     const currentNews = await determineFirstArticle();
     console.log(new Date().toLocaleString() + ' | CoinBase -> ' + currentNews.text);
     if (currentNews.url !== latestNews.url) {
          createAlert(currentNews);
     }
}

const run = function () {
     const intervalRef = setInterval(determineAlert, 10000);
}

export default run