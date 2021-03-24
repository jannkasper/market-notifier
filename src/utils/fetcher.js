import axios from "axios";
import https from "https";

export const binanceURL = "https://www.binance.com/"

const binanceHeader = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'pl,en-US;q=0.9,en;q=0.8,nl;q=0.7,nb;q=0.6',
    'cache-control': 'max-age=0',
    'cookies': '_ga=GA1.2.584027303.1613494700; bnc-uuid=a2898306-0b5f-4a4d-b7c7-d7046e03c17e; userPreferredCurrency=USD_USD; fiat-prefer-currency=EUR; home-ui-ab=B; fiat-user-save-currency=EUR; source=cmc; campaign=paid_central_cmc-bb-avw-app; defaultMarketTab=spot; /en/futures-activity/tournament=true; logined=y; monitor-uuid=37c40dc8-31c6-42cb-8d7c-3d798230996f; BNC_FV_KEY=317e68c40aeaa5f9869cb4013b6a4b5286372114; BNC_FV_KEY_EXPIRE=1616271732719; lang=en; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2285633287%22%2C%22first_id%22%3A%22177abc74512303-0e84fd7b5fc55a-6c112e7c-1764000-177abc74513715%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22cmc%22%2C%22%24latest_utm_medium%22%3A%22button%22%2C%22%24latest_utm_campaign%22%3A%22paid_central_cmc-bb-avw-app%22%2C%22%24latest_utm_content%22%3A%22%E5%B8%81%E5%AE%89%E8%B5%9A%E5%B8%811%22%2C%22%24latest_utm_term%22%3A%22education%22%7D%2C%22%24device_id%22%3A%22177abc74512303-0e84fd7b5fc55a-6c112e7c-1764000-177abc74513715%22%7D; _gid=GA1.2.1982559971.1616227300',
    'referer': 'https://www.binance.com/en/support/announcement',
    'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="88"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

export const binanceFetch = axios.create({
    baseURL: binanceURL,
    headers: binanceHeader
});


export const coinbaseURL = "https://blog.coinbase.com/"

export const coinbaseHeader = {
    'authority': 'blog.coinbase.com',
    'method': 'GET',
    'path': '/latest',
    'scheme': 'https',
    'Access-Control-Allow-Origin': '*',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'pl,en-US;q=0.9,en;q=0.8,nl;q=0.7,nb;q=0.6',
    'cache-control': 'max-age=0',
    'cookie': '__cfduid=df41ceac275d56e8ebba6c033721719a51614881752; __ssid=fa80863c0db466d34e10bb413f1c69f; coinbase_device_id=e6e34f3b-fb29-4cde-a5ff-815654614988; amplitude_device_id=e6e34f3b-fb29-4cde-a5ff-815654614988; cm_eu_preferences={%22region%22:%22EU%22%2C%22consent%22:[%22necessary%22%2C%22performance%22%2C%22functional%22%2C%22targeting%22]}; optimizelyEndUserId=525c42d4325c; lightstep_guid/medium-web=3cc8835cde2d60af; lightstep_session_id=32463c35998a108; pr=1; tz=-60; lightstep_guid/lite-web=5c6a063f443b3fa1; sz=1665; uid=lo_7f2dd8bd0c10; sid=1:mQ1e1vP9z09vgovxuI+E6ojfrx8H9q/oOnuj4vCwsoQLA2Pp9DicV2URlWU/aaoL; __cf_bm=3383ea70d77efb025c3d481e3972b4602bafc819-1616235826-1800-AZarYxfS1PfkpHrMkFWV0QSM2OoGsPTkAg9abj38mUfUvoMPiDaWphADiya/jCvW2hlWleT+/dlHZYlRS6w1I50=',
    'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36'
}

export const coinbaseFetch = axios.create({
    baseURL: coinbaseURL,
    // headers: coinbaseHeader,
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

export const algoliaHeader = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'pl,en-US;q=0.9,en;q=0.8,nl;q=0.7,nb;q=0.6',
    'cache-control': 'max-age=0',
    'cookies': '_ga=GA1.2.584027303.1613494700; bnc-uuid=a2898306-0b5f-4a4d-b7c7-d7046e03c17e; userPreferredCurrency=USD_USD; fiat-prefer-currency=EUR; home-ui-ab=B; fiat-user-save-currency=EUR; source=cmc; campaign=paid_central_cmc-bb-avw-app; defaultMarketTab=spot; /en/futures-activity/tournament=true; logined=y; monitor-uuid=37c40dc8-31c6-42cb-8d7c-3d798230996f; BNC_FV_KEY=317e68c40aeaa5f9869cb4013b6a4b5286372114; BNC_FV_KEY_EXPIRE=1616271732719; lang=en; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2285633287%22%2C%22first_id%22%3A%22177abc74512303-0e84fd7b5fc55a-6c112e7c-1764000-177abc74513715%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22cmc%22%2C%22%24latest_utm_medium%22%3A%22button%22%2C%22%24latest_utm_campaign%22%3A%22paid_central_cmc-bb-avw-app%22%2C%22%24latest_utm_content%22%3A%22%E5%B8%81%E5%AE%89%E8%B5%9A%E5%B8%811%22%2C%22%24latest_utm_term%22%3A%22education%22%7D%2C%22%24device_id%22%3A%22177abc74512303-0e84fd7b5fc55a-6c112e7c-1764000-177abc74513715%22%7D; _gid=GA1.2.1982559971.1616227300',
    'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="88"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'X-Algolia-API-Key': '394474ced050e3911ae2249ecc774921',
    'X-Algolia-Application-Id': 'MQ57UUUQZ2'
}

export const handleFetchError = function (error) {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    return null;
}