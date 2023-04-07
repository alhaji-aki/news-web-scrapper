import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import { OutletCategoryService } from '../../outlet/services/outlet-category.service';
import { OutletCategory } from '../../outlet/entities/outlet-category.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(ScrapperService.name);

  private browser: puppeteer.Browser;

  private readonly gotoOptions: puppeteer.WaitForOptions = {
    timeout: 50000,
    waitUntil: 'domcontentloaded',
  };

  constructor(
    private readonly outletCategoryService: OutletCategoryService,
    private readonly articleService: ArticleService,
  ) {}

  @Cron('1 * * * * *')
  async dispatchScrappingJobs() {
    // Get all oulet categories
    const outletCategories = await this.outletCategoryService.index();

    for (const outletCategory of outletCategories) {
      this.logger.debug(
        `Fetching articles for ${outletCategory.outlet.name} with category ${outletCategory.category.name}`,
      );

      // TODO: 2. Dispatch a job to scrap articles for each outlet category
      await this.startScrapping(outletCategory);

      //   TODO: add last scrape time to avoid scrapping multiple times
    }

    this.logger.debug('Scrapping completed');
  }

  private async startScrapping(outletCategory: OutletCategory) {
    try {
      this.logger.debug('Opening the browser......');
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });

      const page = await this.browser.newPage();

      const url = outletCategory.link;

      this.logger.debug(`Navigating to ${url}...`);

      await page.goto(url, this.gotoOptions);

      // TODO: replace the selector with outlet category specific selector
      await page.waitForSelector('article.jeg_post');

      // Get links to articles
      // TODO: replace the selector with outlet category specific selector
      const links = [
        ...new Set(
          await page.$$eval('article.jeg_post', (articles: Element[]) => {
            return articles.map(
              (article) =>
                article.querySelector('.jeg_post_title').querySelector('a')
                  .href,
            );
          }),
        ),
      ];

      // get the contents of each article in the links extracted
      for (const link of links) {
        if (await this.articleService.findArticleByLink(link)) {
          this.logger.warn(`Article at ${link} already scrapped.`);
          continue;
        }

        const article = await this.getArticleContent(link);

        try {
          await this.articleService.create({
            ...article,
            outlet: outletCategory.outlet,
            category: outletCategory.category,
          });
        } catch (error) {
          let message = error;

          if (error instanceof BadRequestException) {
            message = error.message;
          }

          this.logger.warn(message);
        }
      }

      await this.browser.close();
      this.logger.debug('Closed the browser......');
    } catch (err) {
      if (this.browser) {
        this.browser.close();
      }

      this.logger.error('Error occured getting articles => : ', err);
    }
  }

  private async getArticleContent(link: string): Promise<CreateArticleDto> {
    return new Promise(async (resolve) => {
      this.logger.debug(`Getting article contents at '${link}'`);
      const article = new CreateArticleDto();
      const newPage = await this.browser.newPage();
      await newPage.goto(link, this.gotoOptions);

      // TODO: replace the selector with outlet category specific selector
      article['title'] = await newPage.$eval('h1.jeg_post_title', (text) =>
        text.textContent.trim(),
      );

      // TODO: replace the selector with outlet category specific selector
      article['publishedAt'] = new Date(
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
      article['imageUrl'] = await newPage.$eval(
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
}
