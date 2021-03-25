import notifier from "node-notifier";
import open from "open";
import { sendEmail } from "./email.js";
import {binanceURL} from "./fetcher.js";
import axios from "axios";

export const sendNotification = function (currentArticle) {
    notifier.notify({
        title: `${currentArticle.market.toUpperCase()} ALERT`,
        message: `${new Date(currentArticle.publishedAt).toLocaleTimeString("pl-PL")}: ${currentArticle.title}`,
        sound: "SMS",
        timeout: 60000,
        open: currentArticle.url,
    });
}

export const createAlert = function(currentArticle, readCoinFromString) {
    if (process.env.NODE_ENV === 'development') {
        sendNotification(currentArticle);
    }
    const { tokenName, tokenCode } = readCoinFromString(currentArticle.title)

    if (process.env.NODE_ENV === 'development') {
        open(currentArticle.url);
        open('https://www.coingecko.com/en/coins/' + tokenName + '#markets');
        openTradingPages(tokenCode)
    }
    sendEmail(currentArticle.market, currentArticle.title, currentArticle.url, 'https://www.coingecko.com/en/coins/' + tokenName + '#markets', currentArticle.publishedAt);
}

const openTradingPages = async function (tokenCode){
    axios.get(`https://www.mxc.com/open/api/v2/market/ticker?symbol=${tokenCode.toUpperCase()}_USDT`)
        .then(response => {
            if (Boolean(response.data)) {
                open(`https://www.mxc.com/trade/easy#${tokenCode.toUpperCase()}_USDT`);
        }});

    // axios.get(`https://data.gateapi.io/api2/1/ticker/${tokenCode.toLowerCase()}_usdt`)
    //     .then(response => { if (Boolean(response.data && response.data.result)) {
    //         open(`https://www.gate.io/trade/${tokenCode.toUpperCase()}_USDT`) ;
    //     }});

    axios.get(`https://api.huobi.pro/market/detail/merged?symbol=${tokenCode.toLowerCase()}usdt`)
        .then(response =>{
            if (Boolean(response.data && response.data.status === 'ok')) {
                open(`https://www.huobi.com/en-us/exchange/?s=${tokenCode.toLowerCase()}_usdt`);
        }});
}
