// import puppeteer from "puppeteer";
//
// export async function startBrowser() {
//     const browser = await puppeteer.launch({
//         headless: true,
//         args: [
//             '--no-sandbox',
//             '--window-size=1920,1080',
//             '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"'
//         ]
//     });
//     // const context = await browser.createIncognitoBrowserContext();
//     const page = await browser.newPage();
//     await page.setViewport({width: 1680, height: 938});
//     await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
//     // page.on('console', consoleObj => console.log(consoleObj.text()));
//     page.on('response', async (response) => {
//         if (response.url().startsWith('https://blog.coinbase.com/latest')) {}
//     });
//
//     return {browser, page};
// }