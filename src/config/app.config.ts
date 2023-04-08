import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  scraper_cache_key: process.env.SCRAPER_CACHE_KEY,
  scrape_minutes: process.env.SCRAPE_MINUTES || 30,
}));
