import * as puppeteer from 'puppeteer';

async function scrapper() {
  const gotoOptions: puppeteer.WaitForOptions = {
    timeout: 50000,
    waitUntil: 'domcontentloaded',
  };

  let browser: puppeteer.Browser;
  const articles = [];
  try {
    console.log('Opening the browser......');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // TODO: this link will mostly come from the category link of the outlet
    const url = 'https://citibusinessnews.com';

    console.log(`Navigating to ${url}...`);

    await page.goto(url, gotoOptions);

    // TODO: replace the selector with outlet category specific selector
    await page.waitForSelector('article.jeg_post');

    // Get links to articles
    // TODO: replace the selector with outlet category specific selector
    const links = [
      ...new Set(
        await page.$$eval('article.jeg_post', (articles: Element[]) => {
          return articles.map(
            (article) =>
              article.querySelector('.jeg_post_title').querySelector('a').href,
          );
        }),
      ),
    ];

    // get the contents of each article in the links extracted
    for (const link of links) {
      const article = await getArticleContent(browser, gotoOptions, link);
      articles.push(article);
    }

    console.log(articles);

    await browser.close();
    console.log('Closed the browser......');
  } catch (err) {
    if (browser) {
      browser.close();
    }

    console.log('Error occured getting articles => : ', err);
  }
}

async function getArticleContent(
  browser: puppeteer.Browser,
  gotoOptions: puppeteer.WaitForOptions,
  link: string,
) {
  return new Promise(async (resolve) => {
    const article = {};
    const newPage = await browser.newPage();
    await newPage.goto(link, gotoOptions);

    // TODO: replace the selector with outlet category specific selector
    article['title'] = await newPage.$eval('h1.jeg_post_title', (text) =>
      text.textContent.trim(),
    );

    // TODO: replace the selector with outlet category specific selector
    article['date'] = new Date(
      Date.parse(
        await newPage.$eval('.jeg_meta_date', (text) =>
          text.textContent.trim(),
        ),
      ),
    );

    // TODO: replace the selector with outlet category specific selector
    article['tags'] = await newPage.$$eval(
      '.jeg_meta_category > span > a',
      (tags: Element[]) => {
        return tags
          .map((tag) => tag.textContent.trim())
          .filter((text) => text != '');
      },
    );

    // TODO: replace the selector with outlet category specific selector
    article['image'] = await newPage.$eval(
      '.thumbnail-container > img',
      (image) => image.src,
    );

    article['url'] = link;

    // TODO: replace the selector with outlet category specific selector
    article['content'] = await newPage.$$eval(
      '.content-inner > p',
      (text: Element[]) => {
        return text
          .map((text) => text.textContent.trim())
          .filter((text) => text != '');
      },
    );

    await newPage.close();

    resolve(article);
  });
}

scrapper();
