import axios from "axios";
import { algoliaHeader, handleFetchError } from "./utils/fetcher.js";
import { sortByKey } from "./utils/utils.js";
import { createAlert } from "./utils/alert.js";

const determineCoinbaseLatestArticle = async function () {
     // const data = {requests: [{indexName: "medium_post", params: "query=a&hitsPerPage=1000&facetFilters=collectionId%3Ac114225aeaf7&attributesToRetrieve=%2A%2Ctitle%2CpostId%2ClatestPublishedAt&sortFacetValuesBy="}]}
     const data = {requests: [{indexName: "medium_post", params: "query=launching%20on%20Coinbase&hitsPerPage=100&facetFilters=collectionId%3Ac114225aeaf7&attributesToRetrieve=%2A%2Ctitle%2CpostId%2ClatestPublishedAt&sortFacetValuesBy="}]}
     return await axios.post("https://mq57uuuqz2-dsn.algolia.net/1/indexes/*/queries", data, {headers: algoliaHeader}).then(response => {
          if (response.data.results && response.data.results[0].hits) {
               const resultArray = response.data.results[0].hits;
               const sortedArray = resultArray.sort(sortByKey('createdAt'));
               const mappedArray = sortedArray;
               // const mappedArray = sortedArray.map(item => { return {...item, createdAt:new Date(item.createdAt).toLocaleString("pl-PL"), firstPublishedAt: new Date(item.firstPublishedAt).toLocaleString("pl-PL") }});
               const item =  mappedArray[mappedArray.length-1];
               return {
                    market: "Coinbase",
                    title: item.title,
                    createdAt: item.createdAt,
                    publishedAt: item.firstPublishedAt,
                    url: `https://medium.com/p/${item.postId}`
               }
          } else {
               console.log("Coinbase: Fetch ERROR 'response.data.data.latestArticles[0] = NULL'")
               return null;
          }
     }).catch(handleFetchError);
}

const readCoinFromString = function (title) {
     const tokenName = title.substring(0, title.indexOf('('))
         .trim()
         .replace(/ /g, '-')
         .replace(/\./, '-')
         .toLowerCase();

     const matches = title.match(/\((.*?)\)/);
     const tokenCode = matches.length > 0 && matches[1];
     return { tokenName, tokenCode };
}

let latestArticle = await determineCoinbaseLatestArticle();
// latestArticle = { market:"Coinbase" ,title: "Ankr (ANKR) Curve DAO Token (CRV) and Storj (STORJ) are launching on Coinbase Pro", createdAt:1615913006441, publishedAt:1616518976265, url:"https://medium.com/p/62dbd9208d7c1" };

const determineAlert = async function() {
     const currentArticle = await determineCoinbaseLatestArticle();
     if (!currentArticle) {
          return
     }
     console.log(new Date().toLocaleString() + ' | CoinBase -> ' + currentArticle.title);
     if (latestArticle.url !== currentArticle.url) {
          latestArticle = currentArticle;
          createAlert(currentArticle, readCoinFromString);
     }
}

const run = function () {
     const intervalRef = setInterval(determineAlert, 3000);
}

export default run