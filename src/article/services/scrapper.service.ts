import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import { OutletCategoryService } from '../../outlet/services/outlet-category.service';
import { OutletCategory } from '../../outlet/entities/outlet-category.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { parse } from 'date-fns';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

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
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron('1 * * * * *')
  async dispatchScrapingJobs() {
    // lock the scraper cron job to run one at a time
    const cacheKey = this.configService.get('app.scraper_cache_key');

    const value = await this.cacheManager.get(cacheKey);
    if (value) {
      this.logger.warn('A scraper is already running...');
      return;
    }

    await this.cacheManager.set(cacheKey, true, 0);

    // Get oulet categories which are not being scrapped
    const outletCategories =
      await this.outletCategoryService.getOutletCategoriesForScraping();

    for (const outletCategory of outletCategories) {
      await this.outletCategoryService.markAsCurrentlyScraping(outletCategory);

      this.logger.debug(
        `Fetching articles for ${outletCategory.outlet.name} with category ${outletCategory.category.name}`,
      );

      await this.startScraping(outletCategory);

      await this.outletCategoryService.markAsScrapeCompleted(outletCategory);
    }

    await this.cacheManager.del(cacheKey);

    this.logger.debug('Scraping completed');
  }

  private async startScraping(outletCategory: OutletCategory) {
    try {
      this.logger.debug('Opening the browser......');
      this.browser = await puppeteer.launch({
        headless: this.configService.get('app.environment') !== 'development',
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });

      const page = await this.browser.newPage();

      this.logger.debug(`Navigating to ${outletCategory.link}...`);

      await page.goto(outletCategory.link, this.gotoOptions);

      const { article_card, link } = outletCategory.selectors;

      await page.waitForSelector(article_card);

      // Get links to articles
      const links = [
        ...new Set(
          await page.$$eval(
            article_card,
            (articles: Element[], link) => {
              return articles.map(
                (article) =>
                  article.querySelector<HTMLAnchorElement>(link).href,
              );
            },
            link,
          ),
        ),
      ].filter((item) => item && item != '');

      // get the contents of each article in the links extracted
      for (const link of links) {
        if (await this.articleService.findArticleByLink(link)) {
          this.logger.warn(`Article at ${link} already scrapped.`);
          continue;
        }

        try {
          await this.articleService.create(
            await this.getArticleContent(link, outletCategory),
          );
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

      let message = err;
      let stack = err;

      if (err instanceof Error) {
        message = err.message;
        stack = err.stack;
      }

      this.logger.error(message, stack);
    }
  }

  private async getArticleContent(
    pageUrl: string,
    outletCategory: OutletCategory,
  ): Promise<CreateArticleDto> {
    return new Promise(async (resolve) => {
      const { title, date, date_format, tags, image, content } =
        outletCategory.selectors;

      this.logger.debug(`Getting article contents at '${pageUrl}'`);
      const article = new CreateArticleDto();

      article['outlet'] = outletCategory.outlet;
      article['category'] = outletCategory.category;

      const newPage = await this.browser.newPage();
      await newPage.goto(pageUrl, this.gotoOptions);

      article['title'] = await newPage.$eval(title, (text) =>
        text.textContent.trim(),
      );

      article['publishedAt'] = parse(
        await newPage.$eval(date, (text) => text.textContent.trim()),
        date_format,
        new Date(),
      );

      article['tags'] = await newPage.$$eval(tags, (tags: Element[]) => {
        return tags
          .map((tag) => tag.textContent.trim())
          .filter((text) => text != '');
      });

      article['imageUrl'] = await newPage.$eval(
        image,
        (image: HTMLImageElement) => image.src,
      );

      article['url'] = pageUrl;

      article['content'] = await newPage.$$eval(content, (text: Element[]) => {
        return text
          .map((text) => text.textContent.trim())
          .filter((text) => text != '');
      });

      await newPage.close();

      resolve(article);
    });
  }
}
