import cheerio from "cheerio";
import axios from "axios";
import { algoliaHeader } from "./utils/fetcher.js";
import fs from "fs";

function convertStringToCoinDetails(title) {
    const code = title.match(new RegExp(/\((.*)\)/ ))[1];
    const name = title.split('(')[0].trim()
    return { name, code };
}

function determineCoins ($, element) {
    if ($('.card__coins > .link-detail', element).attr('data-content')) {
        const text  = $('.card__coins > .link-detail', element).attr('data-content');
        const coinArray =  [...text.matchAll(/\>(.*?)\<\/a\>/g)].map(item => item[1]);
        return coinArray.map(item => convertStringToCoinDetails(item))
    } else {
        return [convertStringToCoinDetails($('.card__coins > .link-detail', element).text())];
    }
}

function determineDate ($, element) {
    let date = $('.card__date', element).text();
    date = Date.parse(date)
    date = new Date(date).toLocaleDateString("pl-PL");
    return date;
}

function determineVotes ($, element) {
    let votes = $('.progress__votes', element).text().match(/\d+/);
    votes = Number(votes[0])
    return votes;
}

function determineAddedDate ($, element) {
    let date = $('.added-date', element).text().slice(6);
    date = Date.parse(date);
    date = new Date(date).toLocaleDateString("pl-PL");
    return date;
}

async function pageResult (pageNumber) {
    const result = [];
    console.log(`Retrieving page number ${pageNumber}`)
    await axios.get(`https://coinmarketcal.com/en/?page=${pageNumber}`, { headers: algoliaHeader}).then(response => {
        let $ = cheerio.load(response.data);

        $('.list-card > article').each((i, element) => {
            const coins = determineCoins($, element);
            const date = determineDate($, element);
            const href = 'https://coinmarketcal.com' + $('.card__body > .link-detail', element).attr('href');
            const title = $('.card__title', element).text();
            const description = $('.card__description', element).text().trim()
            const votes = determineVotes($, element);
            const createdAt = determineAddedDate($, element);
            result.push({coins, votes, date, title, createdAt, description, href})
        })
    });
    return result
};

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const readData = (path) => {
    try {
        const jsonString = fs.readFileSync(path)
        return JSON.parse(jsonString)
    } catch(err) {
        console.log(err)
        return
    }
}

async function retrieveEvents() {
    const events = [];
    for (let i = 1; i < 100; i++) {
        const result = await pageResult(i);

        if (result && result.length === 0) {
            break;
        }
        events.push(...result);
    }

    storeData(events, "./marketEvents.json");
}

// retrieveEvents()


async function groupMarketEvents() {
    const result = await readData("./marketEvents.json");
    let coinEventList = [];
    result.forEach((item) => {
        item.coins.forEach(coin => {
            const object = coinEventList.find(element => element[0] === coin.name);
            if (object) {
                object[1].push(item)
            } else {
                coinEventList.push([coin.name, [item]])
            }
        })
    });
    coinEventList.sort(function(a, b) {
        return b[1].length - a[1].length;
    });
    storeData(coinEventList, "./bestCoin.json");
}

const result = await readData("./bestCoin.json");
console.log(result)

