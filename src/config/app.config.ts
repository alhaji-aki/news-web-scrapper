import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  key: process.env.APP_KEY,
  environment: process.env.NODE_ENV || 'development',
  frontend_password_reset_url:
    process.env.APP_FRONTEND_PASSWORD_RESET_URL || 'http://localhost',
  frontend_register_url:
    process.env.APP_FRONTEND_REGISTER_URL || 'http://localhost',
  scraper_cache_key: process.env.SCRAPER_CACHE_KEY,
  scrape_minutes: process.env.SCRAPE_MINUTES || 30,
}));
